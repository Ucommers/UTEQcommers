import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'star/home',
    pathMatch: 'full',
  },
  {
    path: 'star',
    loadChildren: () =>
      import('./pages/split-pane/split-pane.module').then(
        (m) => m.SplitPanePageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'productos',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/productos/productos.module').then((m) => m.ProductosPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'grid-page',
    loadChildren: () => import('./pages/grid-page/grid-page.module').then( m => m.GridPagePageModule)
  },
  {
    path: 'trabajos',
    loadChildren: () => import('./pages/trabajos/trabajos.module').then( m => m.TrabajosPageModule)
  },
  {
    path: 'mis-datos',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/mis-datos/mis-datos.module').then( m => m.MisDatosPageModule)
  },
  {
    path: 'product-detalle/:id',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/product-detalle/product-detalle.module').then( m => m.ProductDetallePageModule)
  },
  {
    path: 'carrito',
    canActivate: [AuthGuard], 
    loadChildren: () => import('./pages/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'recuperacion-pass',
    loadChildren: () => import('./pages/recuperacion-pass/recuperacion-pass.module').then( m => m.RecuperacionPassPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
