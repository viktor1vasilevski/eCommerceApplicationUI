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

  getById<ResponseType>(url: string): Observable<ResponseType> {
    return this.http.get<ResponseType>(url);
  }

  create<RequestType, ResponseType>(url: string, data: RequestType): Observable<ResponseType> {
    return this.http.post<ResponseType>(url, data);
  }

  put<RequestType, ResponseType>(url: string, data: RequestType): Observable<ResponseType> {
    return this.http.put<ResponseType>(url, data);
  }

  delete<ResponseType>(url: string): Observable<ResponseType> {
    return this.http.delete<ResponseType>(url);
  }
}
