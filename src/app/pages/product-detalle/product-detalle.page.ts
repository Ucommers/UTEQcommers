import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, Platform, MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from '../../services/products.service'; 
import { CarritoService } from '../../services/carrito.service'; 
import { environment } from '../../../environments/environment.prod';


@Component({
  selector: 'app-product-detalle',
  templateUrl: './product-detalle.page.html',
  styleUrls: ['./product-detalle.page.scss'],
})
export class ProductDetallePage implements OnInit {
  producto: any;
  currentUser: any;
  Id_User: any;
  categorias: any[] = [];
  public isLargeScreen: boolean;
  urlImg: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private carritoService: CarritoService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private AuthService: AuthService,
    private platform: Platform,
  ) {


    this.isLargeScreen = this.platform.width() >= 765;

    this.platform.resize.subscribe(() => {
      this.checkScreenSize();
    });
  }


  // ☢️ Funcion q se ejecuta al ingresar a la view
  ngOnInit() {
    this.urlImg = environment.urlImg;
    const productId = this.route.snapshot.paramMap.get('id');
    this.cargarProducto(productId);

    this.currentUser = this.AuthService.currentUserValue;
    this.Id_User = this.currentUser.id;
    // console.log(this.Id_User);

  }

  // ☢️ Trae los dato s del producto
  cargarProducto(id: string | null) {
    if (id) {
      this.productsService.getProductoPorId(id).subscribe(
        (response) => {
          this.producto = response.producto;
        },
        (error) => {
          console.error('Error al obtener el producto:', error);
        }
      );
    }
  }

  // ☢️ alerta de confirmación al agregar al carrito
  async confirmarAgregarCarrito(productoId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas agregar este producto al carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // console.log('El usuario canceló');
          },
        },
        {
          text: 'Agregar',
          handler: () => {
            this.agregarCarrito(productoId, this.Id_User);
          },
        },
      ],
    });

    await alert.present();
  }

  //☢️ agrega al carrito
  agregarCarrito(productoId: number, userId: number) {
    this.productsService.agregarProductoAlCarrito(productoId, userId).subscribe(
      (response: any) => {
        this.showAlert(response.msj, 'success ✅');
        
        const nuevaCantidad = response.contadorCarrito; 
        this.carritoService.actualizarCantidad(nuevaCantidad);
      },
      (error) => {
        const errorMessage = error.error.msj ;
        this.showAlert(errorMessage, 'Error ❌');
        // console.error('Error al agregar producto al carrito:', error);
      }
    );
  }

  // ☢️ Regresar a la view anterior
  goBack() {
    this.navCtrl.back(); // Regresa a la página anterior
  }

  //☢️ 
  checkScreenSize() {
    this.isLargeScreen = this.platform.width() >= 765;
  }

  // ☢️ mostrar alerta
  async showAlert(message: string, aler: string) {
    const alert = await this.alertController.create({
      header: aler,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
