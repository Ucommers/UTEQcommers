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
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  loading!: HTMLIonLoadingElement; // Variable para manejar el componente de carga (loading)

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController, 
    private authService: AuthService, // Corregido el nombre a camelCase
    private alertController: AlertController, // Agregamos el AlertController para manejar alertas
    private router: Router, // Para navegar entre páginas de la aplicación
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
      },
      {
        validator: this.passwordMatchValidator, // Para asegurarte que las contraseñas coinciden
      }
    );
  }

  // Validador personalizado para el email
  emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
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

  // ☢️ Método para manejar el envío del formulario de registro
  async onSubmit() {
    if (this.registerForm.invalid) {
      return; // Si el formulario es inválido, no hace nada
    }
  
    // Muestra un loading mientras se procesa el registro
    await this.presentLoading();
  
    this.authService
      .register(this.registerForm.value)
      .subscribe({
        next: async (response) => {
          await this.dismissLoading();
          console.log('Usuario registrado con éxito', response);
          this.router.navigate(['_/login']); 
        },
        error: async (error) => {
          console.error('Error en el registro', error);
          await this.dismissLoading();
          await this.presentErrorAlert(error.error.message);  // Mostrar alerta de error en caso de fallo
        }
      });
  }
  
  // ☢️ Muestra el loading (spinner o animación de carga) mientras se procesa alguna acción  
  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'crescent', // Puedes elegir otro tipo de spinner
      message: 'Registrando...', // Mensaje opcional
      cssClass: 'my-custom-loading-3', // Clase CSS personalizada
    });
    await this.loading.present(); // Muestra el loading
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
      message: message || 'Hubo un problema con el registro. Por favor, inténtalo de nuevo.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
