import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard'; 
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
        path: 'prueba',
        canActivate: [AuthGuard],
        loadChildren: () => import('../prueba/prueba.module').then( m => m.PruebaPageModule)
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SplitPanePageRoutingModule {}
