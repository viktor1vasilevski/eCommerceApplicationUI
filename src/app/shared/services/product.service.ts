import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { environment } from '../../../enviroments/enviroment.dev';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.apiUrl;

  constructor(private _dataApiService: DataService) {}


  createProduct(request: any): Observable<any> {
    return this._dataApiService.create<any, any>(`${this.baseUrl}/product/create`, request);
  }
}
