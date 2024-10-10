import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta según la ubicación de tu servicio

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.page.html',
  styleUrls: ['./prueba.page.scss'],
})
export class PruebaPage implements OnInit {
  constructor(private AuthService: AuthService) {}

  ngOnInit() {}
  
  // Método para alternar la visibilidad del menú
  toggleMenu() {
    this.AuthService.toggleMenu(); // Llama al método del servicio
  }
}
