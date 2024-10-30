import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  currentUser: any; // Almacenar los datos del usuario
  insertProductoForm!: FormGroup;
  selectedFile: File | null = null; // Variable para almacenar el archivo seleccionado
  categorias: any;
  constructor(
    private AuthService: AuthService,
    private alertController: AlertController,
    private productsService: ProductsService,
    private formBuilder: FormBuilder, // Inyectar FormBuilder
    private ProductsService: ProductsService
  ) {}
  //☢️ funcion q se ajecuta automaticamente al ingresar a la view
  ngOnInit() {
    // Obtener el usuario actual
    this.currentUser = this.AuthService.currentUserValue;

    // Inicializar el formulario en el constructor
    this.insertProductoForm = this.formBuilder.group({
      nombre_producto: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      stock: ['', Validators.required],
      img: ['', Validators.required],
      categoria: ['', Validators.required] 
    });

    // Trae las categorias de la bd
    this.ProductsService.getCategorias().subscribe(
      (response) => {
        this.categorias = response.categorias;
        // console.log(this.categorias);
      },
      (error) => {
        this.showAlert('Ups! Error al obtener las categorias.', 'Error ❌');
      }
    );
  }

  // ☢️
  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      this.selectedFile = target.files[0]; // Guardar el archivo seleccionado
    } else {
      this.showAlert('No se seleccionó ningún archivo', 'Error ❌');
      this.selectedFile = null;
    }
  }

  // ☢️
  async onSubmit() {
    if (!this.selectedFile) {
      this.showAlert('Please select an image', 'Error ❌');
      return;
    }

    // objeto FormData
    const formData = new FormData();

    // Añadir los datos del formulario
    Object.keys(this.insertProductoForm.value).forEach((key) => {
      formData.append(key, this.insertProductoForm.value[key]);
    });

    // Añadir el archivo imagen
    formData.append('imagen', this.selectedFile);

    // Añadir el id producto
    formData.append('userId', this.currentUser.id);

    // Enviar los datos a través del servicio
    this.productsService.addProduct(formData).subscribe({
      next: async (response) => {
        this.showAlert(response.msj, 'Success ✅');
        this.insertProductoForm.reset(); // Reiniciar el formulario
        this.selectedFile = null; // Resetear el archivo seleccionado
      },
      error: async (response) => {
        let error = response.error;
        let msj = error.msj;
        this.showAlert(msj, 'Error ❌');
      },
    });
  }

  // ☢️
  async showAlert(message: string, aler: string) {
    const alert = await this.alertController.create({
      header: aler,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
