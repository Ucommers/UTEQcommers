import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController, Platform, MenuController  } from '@ionic/angular';

@Component({
  selector: 'app-split-pane',
  templateUrl: './split-pane.page.html',
  styleUrls: ['./split-pane.page.scss'],
})
export class SplitPanePage implements OnInit {
  pages = [
    {
      title: 'Home',
      url: './home',
      icon: 'home',
      authRequired: false,
    },
    // {
    //   title: 'Grid page',
    //   url: './grid-page',
    //   icon: 'qr-code-outline',
    //   authRequired: false,
    // },
    {
      title: 'Trabajos',
      url: './trabajos',
      icon: 'code-working',
      authRequired: false,
    },
    {
      title: 'Prueba',
      url: './prueba',
      icon: 'logo-tux',
      authRequired: true,
    },
  ];

  selectedPath = '';
  public isLargeScreen: boolean;
  public isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private platform: Platform,
    private menuCtrl: MenuController
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedPath = event.url;
      }
    });

    this.isLargeScreen = this.platform.width() >= 768;

    this.platform.resize.subscribe(() => {
      this.checkScreenSize();
    });
  }
  
  // Función para abrir el menú lateral
  openMenu() {
    this.menuCtrl.open('main-menu');
  }
  closeMenu() {
    this.menuCtrl.close('main-menu'); // Asegúrate de usar el menuId correcto
  }

  // Observable: isLoggedIn$ emite valores que representan el estado de autenticación del usuario (es decir, si el usuario está o no logueado).
  // Actualización del estado: Cada vez que el observable emite un nuevo valor, la función de callback se ejecuta, actualizando la propiedad isLoggedIn con el valor actual (true o false). Esto permite que el componente responda a cambios en el estado de autenticación.
  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn; // Actualiza el estado de autenticación
    });
  }

  checkScreenSize() {
    this.isLargeScreen = this.platform.width() >= 768;
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['_/home'], { replaceUrl: true }); // Usa replaceUrl para evitar el error
          },
        },
      ],
    });

    await alert.present();
  }
}
/*

import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-split-pane',
  templateUrl: './split-pane.page.html',
  styleUrls: ['./split-pane.page.scss'],
})
export class SplitPanePage implements OnInit {
  pages = [
    {
      title: 'Inicio',
      url: '/',
    },
    {
      title: 'Mis certificados',
      url: './mis-certificados',
    },
  ];
  selectedPath = '';
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd){
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout(); // Llama al método 'logout' del servicio de autenticación
    this.router.navigate(['/login']); // Navega a la página de inicio de sesión
  }

}

*/
