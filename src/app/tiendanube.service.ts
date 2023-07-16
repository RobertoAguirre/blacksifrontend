import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TiendanubeService {
  private apiUrl = 'https://api.tiendanube.com/v1';

  constructor(private http: HttpClient) { }

  getClientOrderData() {
    const orderId = '12345'; // Replace with the actual order ID

    // Make the HTTP GET request to fetch the client's order information
    return this.http.get(`${this.apiUrl}/orders/${orderId}`);
  }
}
