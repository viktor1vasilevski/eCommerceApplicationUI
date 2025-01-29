import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment.dev';
import { DataService } from '../../core/services/data.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = environment.apiUrl;

  constructor(private _dataApiService: DataService) {}

  getCategories(request: any): any {
    const params = new HttpParams()
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())
      .set('sort', request.sort)
      .set('name', request.name);

    const url = `${this.baseUrl}/category/get`;
    return this._dataApiService.getAll<any>(url, params);
  }
}
