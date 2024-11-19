import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';


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
  urlImg: string | undefined;

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
    this.urlImg = environment.urlImg;
    this.currentUser = this.AuthService.currentUserValue;
    this.Id_User = this.currentUser.id;
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
        // this.refreshPage()
        this.ionViewWillEnter();
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
        console.log(response)
        if (response.status === true) {
          // Inicializa la cantidad de cada producto
          this.productos = Object.values(response.productosPorVendedor).map((vendedor: any) => {
            vendedor.productos = vendedor.productos.map((producto: any) => ({
              ...producto,
              cantidad: 1 // Agrega la propiedad cantidad con valor inicial
            }));
            return vendedor;
          });

          let nuevaCantidad = response.ContadorCarrito;
          this.CarritoService.actualizarCantidad(nuevaCantidad);
        } else if (response.status === false) {
          this.productos = [];
          this.CarritoService.actualizarCantidad(0);
          this.mensaje = response.msj;
        }
      },
      (error) => {
        const errorMessage = error;
      }
    );
  }

  async refreshPage() {
    location.reload(); // Esto recarga la página actual
  }

  ionViewWillEnter() {
    this.GetCarrito();
    this.mensaje = null;
  }

  incrementarCantidad(producto: any) {
    // console.log(producto)
    if (producto.cantidad < producto.stock) {
      producto.cantidad++;
    }
  }

  decrementarCantidad(producto: any) {
    // console.log(producto)
    if (producto.cantidad > 1) {
      producto.cantidad--;
    }
  }
}
