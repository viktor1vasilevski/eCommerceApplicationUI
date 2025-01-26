import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  getAll<T>(url: string): Observable<T[]> {
    return this.http.get<T[]>(url);
  }

  getById<T>(url: string, id: string | number): Observable<T> {
    return this.http.get<T>(`${url}/${id}`);
  }

  create<T>(url: string, data: T): Observable<T> {
    return this.http.post<T>(url, data);
  }

  update<T>(url: string, id: string | number, data: T): Observable<T> {
    return this.http.put<T>(`${url}/${id}`, data);
  }

  delete(url: string, id: string | number): Observable<void> {
    return this.http.delete<void>(`${url}/${id}`);
  }
}
