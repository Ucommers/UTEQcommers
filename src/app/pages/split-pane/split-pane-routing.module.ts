import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard'; 
import { vendedorGuard } from '../../guards/vendedor.guard'; 
import { SplitPanePage } from './split-pane.page';

const routes: Routes = [
  {
    path: '',
    component: SplitPanePage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'productos',
        canActivate: [AuthGuard, vendedorGuard],
        loadChildren: () => import('../productos/productos.module').then( m => m.ProductosPageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then( m => m.LoginPageModule)
      },
      {
        path: 'grid-page',
        loadChildren: () => import('../grid-page/grid-page.module').then( m => m.GridPagePageModule)
      },
      {
        path: 'trabajos',
        loadChildren: () => import('../trabajos/trabajos.module').then( m => m.TrabajosPageModule)
      },
      {
        path: 'mis-datos',
        canActivate: [AuthGuard],
        loadChildren: () => import('../mis-datos/mis-datos.module').then( m => m.MisDatosPageModule)
      },
      {
        path: 'product-detalle/:id',
        canActivate: [AuthGuard],
        loadChildren: () => import('../product-detalle/product-detalle.module').then( m => m.ProductDetallePageModule)
      },
      {
        path: 'carrito',
        canActivate: [AuthGuard],
        loadChildren: () => import('../carrito/carrito.module').then( m => m.CarritoPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SplitPanePageRoutingModule {}
