import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
  ValidatorFn,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  loading!: HTMLIonLoadingElement; // Variable para manejar el componente de carga (loading)
  public isLoggedIn: boolean = false;
  wantsToSell: string = 'no';
  showPassword: boolean = false;
  currentStep: number = 1; 

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        nombre: ['', Validators.required],
        apellido_paterno: ['', Validators.required],
        apellido_materno: ['', Validators.required],
        email: [
          '',
          [Validators.required, Validators.email, this.emailValidator],
        ],
        password: ['', [Validators.required, this.passwordValidator]],
        confirm_password: ['', Validators.required],
        wantsToSell: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );

    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }



  // Validador personalizado para el email de UTEQ
  emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@uteq\.edu\.mx$/;
    return emailRegex.test(control.value) ? null : { emailInvalid: true };
  }

  // Validador personalizado para la contraseña
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(control.value) ? null : { passwordInvalid: true };
  }

  // Validador para asegurar que las contraseñas coincidan
  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirm_password')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  // ☢️ Método para manejar el envío del formulario de registro
  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    // Muestra un loading mientras se procesa el registro
    await this.presentLoading();

    this.authService.register(this.registerForm.value).subscribe({
      next: async (response) => {
        await this.dismissLoading();
        console.log('Usuario registrado con éxito', response);
        this.router.navigate(['star/login']);
      },
      error: async (error) => {
        console.error('Error en el registro', error);
        await this.dismissLoading();
        await this.presentErrorAlert(error.error.message);
      },
    });
  }
  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
  }
  // ☢️ Muestra el loading (spinner o animación de carga) mientras se procesa alguna acción
  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Registrando...',
      cssClass: 'my-custom-loading-3',
    });
    await this.loading.present();
  }

  // ☢️ Oculta el loading cuando termina la acción
  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  // ☢️ Muestra una alerta de error en caso de que el registro falle
  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message:
        message ||
        'Hubo un problema con el registro. Por favor, inténtalo de nuevo.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
