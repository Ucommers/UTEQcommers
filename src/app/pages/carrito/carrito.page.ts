import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  productos: any[] = [];
  currentUser: any; //guasda el usuario
  public isLargeScreen: boolean;
  Id_User: any; //guarda el id user
  mensaje: any;

  constructor(
    private CarritoService: CarritoService,
    private alertController: AlertController,
    private AuthService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {
    this.isLargeScreen = this.platform.width() >= 765;

    this.platform.resize.subscribe(() => {
      this.checkScreenSize();
    });
  }

  ngOnInit() {
    this.currentUser = this.AuthService.currentUserValue;
    this.Id_User = this.currentUser.id;
    // console.log(this.Id_User);

    // Trae todos los productos del carrito
    // this.showAlert(response.msj, 'Success ✅');
    // this.refreshPage()
    this.GetCarrito();
  }

  // ☢️
  async checkScreenSize() {
    this.isLargeScreen = this.platform.width() >= 765;
  }

  // ☢️
  async showAlert(message: string, tex: string) {
    const alert = await this.alertController.create({
      header: tex,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // ☢️ alerta de confirmación al agregar al carrito
  async confirmarEliminarCarrito(productoId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar del carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // console.log('El usuario canceló');
          },
        },
        {
          text: 'Eliminar ❌',
          handler: () => {
            this.eliminarDelCarrito(productoId, this.Id_User);
          },
        },
      ],
    });

    await alert.present();
  }

  async eliminarDelCarrito(ProductoId: number, IdUser: number) {
    this.CarritoService.EliminarDelCarrito(ProductoId, IdUser).subscribe(
      (response) => {
        this.refreshPage()
        // this.GetCarrito();
      },
      (error) => {
        const errorMessage = error.error.msj;
        this.showAlert(errorMessage, 'Error ❌');
      }
    );
  }

  async GetCarrito() {
    this.CarritoService.getProductos(this.Id_User).subscribe(
      (response) => {
        this.productos = response.productosPorVendedor;
      },
      (error) => {
        const errorMessage = error.error.msj;
        // this.showAlert(errorMessage, 'Error ❌');
        this.mensaje = errorMessage;
        // console.error('Error al agregar producto al carrito:', error);
      }
    );
  }

  async refreshPage() {
    location.reload(); // Esto recarga la página actual
  }


}
