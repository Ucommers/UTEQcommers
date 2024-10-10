import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Importar el environment

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isMenuVisible = true; // Estado inicial del menú (visible)

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  private isLoggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.isAuthenticated());
  public isLoggedIn$: Observable<boolean> =
    this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/login`, {
        email: username,
        password: password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.isLoggedInSubject.next(true); 
        })
      );
  }
  register(registerForm: any): Observable<any> {
    const userData = {
      nombre: registerForm.nombre,
      apellido_paterno: registerForm.apellido_paterno,
      apellido_materno: registerForm.apellido_materno,
      email: registerForm.email,
      password: registerForm.password,
      checkMedico: true, 
    };

    return this.http.post<any>(`${environment.apiUrl}/registro`, userData).pipe(
      tap((response) => {
        console.log('Registro exitoso:', response);
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false); // Emitir el nuevo estado
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
  
  // ------ -------

  // Método para alternar la visibilidad del menú
  toggleMenu() {
    const menu = document.querySelector('ion-menu'); // Selecciona el menú
    if (menu) {
      // Alterna entre oculto y visible
      if (this.isMenuVisible) {
        (menu as HTMLElement).style.display = 'none'; // Oculta el menú
      } else {
        (menu as HTMLElement).style.display = 'block'; // Muestra el menú
      }
      this.isMenuVisible = !this.isMenuVisible; // Cambia el estado
    }
  }
}
