import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service'; // Asegúrate de tener un servicio para obtener el producto
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-detalle',
  templateUrl: './product-detalle.page.html',
  styleUrls: ['./product-detalle.page.scss'],
})
export class ProductDetallePage implements OnInit {
  producto: any;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    this.cargarProducto(productId);
  }

  cargarProducto(id: string | null) {
    if (id) {
      this.productsService.getProductoPorId(id).subscribe(
        (response) => {
          this.producto = response.producto;
          console.log(response)
        },
        (error) => {
          console.error('Error al obtener el producto:', error);
        }
      );
    }
  }

  goBack() {
    this.navCtrl.back(); // Regresa a la página anterior
  }
}
