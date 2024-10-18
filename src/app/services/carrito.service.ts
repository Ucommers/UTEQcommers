import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  constructor(private http: HttpClient) {}
  
  // ☢️
  getProductos(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get-carrito/${id}`);
  }

  //☢️ 
  EliminarDelCarrito(idProd: number, idUser: number):Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/delete-carrito/${idProd}/${idUser}`);
  }

}
