import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment.dev';
import { DataService } from '../../core/services/data.service';
import { HttpParams } from '@angular/common/http';
import { CategoryRequest } from '../models/category/category-request';
import { ApiResponse } from '../../core/models/responses/api-response';
import { CreateCategoryRequest } from '../../admin/models/category/create-category-request';
import { CreateCategoryDTO } from '../../admin/models/category/create-category-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { EditCategoryRequest } from '../../admin/models/category/edit-category-request';
import { EditCategoryDTO } from '../../admin/models/category/edit-category-dto';
import { CategoryDTO } from '../../admin/models/category/category-dto';
import { NonGenericApiResponse } from '../../core/models/responses/non-generic-api-response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = environment.apiUrl;

  private categoryAddedSource = new BehaviorSubject<boolean>(false);
  categoryAdded$ = this.categoryAddedSource.asObservable();

  private categoryEditedSource = new BehaviorSubject<boolean>(false);
  categoryEdited$ = this.categoryEditedSource.asObservable();

  constructor(private _dataApiService: DataService) {}

  getCategories(request: CategoryRequest): Observable<ApiResponse<CategoryDTO[]>> {
    const params = new HttpParams()
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())
      .set('sort', request.sort)
      .set('name', request.name);

    const url = `${this.baseUrl}/category/get`;
    return this._dataApiService.getAll<ApiResponse<CategoryDTO[]>>(url, params);
  }

  createCategory(request: CreateCategoryRequest): Observable<ApiResponse<CreateCategoryDTO>> {
    return this._dataApiService.create<CreateCategoryRequest, ApiResponse<CreateCategoryDTO>>(`${this.baseUrl}/category/create`, request);
  }

  editCategory(id: string, request: EditCategoryRequest): Observable<ApiResponse<EditCategoryDTO>> {
    return this._dataApiService.put<EditCategoryRequest, ApiResponse<EditCategoryDTO>>(`${this.baseUrl}/category/edit/${id}`, request);
  }

  deleteCategory(id: string): Observable<NonGenericApiResponse> {
    const url = `${this.baseUrl}/category/delete/${id}`;
    return this._dataApiService.delete<NonGenericApiResponse>(url);
  }

  getCategoryById(id: string): Observable<ApiResponse<EditCategoryDTO>> {
    const url = `${this.baseUrl}/category/get/${id}`;
    return this._dataApiService.getById<ApiResponse<EditCategoryDTO>>(url);
  }

  getCategoriesDropdownList(): Observable<any> {
    const url = `${this.baseUrl}/category/getCategoriesDropdownList`;
    return this._dataApiService.getAll<any>(url);
  }




  notifyCategoryAdded() {
    this.categoryAddedSource.next(true);
  }

  notifyCategoryEdited() {
    this.categoryEditedSource.next(true);
  }
}
