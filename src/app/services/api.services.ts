import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photos } from '../models/photos';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private postsUrl = 'https://jsonplaceholder.typicode.com/photos';

  getPhotos(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.colombiaUrl}/Department`);
  }

  sendBooking(data: BookingRequest): Observable<BookingRequest & { id: number }> {
    return this.http.post<BookingRequest & { id: number }>(this.postsUrl, data);
  }
}