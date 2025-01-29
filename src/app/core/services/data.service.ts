import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}


  getAll<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(url, { params });
  }

  getById<T>(url: string, id: string | number): Observable<T> {
    return this.http.get<T>(`${url}/${id}`);
  }

  create<RequestType, ResponseType>(url: string, data: RequestType): Observable<ResponseType> {
    return this.http.post<ResponseType>(url, data);
  }

  update<T>(url: string, id: string | number, data: T): Observable<T> {
    return this.http.put<T>(`${url}/${id}`, data);
  }

  delete(url: string, id: string | number): Observable<void> {
    return this.http.delete<void>(`${url}/${id}`);
  }
}
