import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Asegúrate de tener el environment importado

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  //☢️ Método para agregar un nuevo producto
  addProduct(productData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/insert-productos`, productData);
  }

  // ☢️ Método Trae todos los productos
  getProductos(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/all-productos`).pipe(
      tap((response) => {
        // console.log('Productos recibidos:', response);
      })
    );
  }

  // ☢️
  getProductoPorId(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/producto/${id}`); 
  }
  

}
