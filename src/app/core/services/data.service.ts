import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  getAll<ResponseType>(url: string, params?: HttpParams): Observable<ResponseType> {
    return this.http.get<ResponseType>(url, { params });
  }

  getById<ResponseType>(url: string, id: string | number): Observable<ResponseType> {
    return this.http.get<ResponseType>(`${url}/${id}`);
  }

  create<RequestType, ResponseType>(url: string, data: RequestType): Observable<ResponseType> {
    return this.http.post<ResponseType>(url, data);
  }

  put<RequestType, ResponseType>(url: string, id: string | number, data: RequestType): Observable<ResponseType> {
    const fullUrl = `${url}/${id}`;
    return this.http.put<ResponseType>(fullUrl, data);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}
