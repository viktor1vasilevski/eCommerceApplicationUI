import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment.dev';
import { DataService } from '../../core/services/data.service';
import { HttpParams } from '@angular/common/http';
import { CategoryRequest } from '../models/category/category-request';
import { ApiResponse } from '../../core/models/responses/api-response';
import { CreateCategoryRequest } from '../../admin/models/category/create-category-request';
import { CreateCategoryDTO } from '../../admin/models/category/create-category-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = environment.apiUrl;

  constructor(private _dataApiService: DataService) {}

  getCategories(request: CategoryRequest): any {
    const params = new HttpParams()
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())
      .set('sort', request.sort)
      .set('name', request.name);

    const url = `${this.baseUrl}/category/get`;
    return this._dataApiService.getAll<any>(url, params);
  }

  createCategory(request: CreateCategoryRequest): Observable<ApiResponse<CreateCategoryDTO>> {
    return this._dataApiService.create<CreateCategoryRequest, ApiResponse<CreateCategoryDTO>>(
      `${this.baseUrl}/category/create`,
      request
    );
  }


}
