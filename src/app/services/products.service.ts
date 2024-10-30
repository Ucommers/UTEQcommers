import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  //☢️ Método para agregar un nuevo producto
  addProduct(productData: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/insert-productos`,
      productData
    );
  }

  // ☢️ Método Trae todos los productos
  getProductos(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/all-productos`);
  }

  // ☢️ 
  getProductoPorId(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get-producto/${id}`);
  }

  // ☢️
  agregarProductoAlCarrito(productoId: number, userId: number): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/insert-carrito/${productoId}/${userId}`,
      null
    );
  }
  // ☢️ Método Trae todos los productos
  getCategorias(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/get-categorias`);
  }

  //☢️
  filtrarProductos(categoriaId: number): Observable<any>{
    return this.http.get(
      `${environment.apiUrl}/get-productos-filtro/${categoriaId}`
    );
  }
}
