import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { environment } from '../../../enviroments/enviroment.dev';
import { SubcategoryRequest } from '../models/subcategory/subcategory-request';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { NonGenericApiResponse } from '../../core/models/responses/non-generic-api-response';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  private baseUrl = environment.apiUrl;

  private subcategoryAddedSource = new BehaviorSubject<boolean>(false);
  subcategoryAdded$ = this.subcategoryAddedSource.asObservable();

  private subcategoryEditedSource = new BehaviorSubject<boolean>(false);
  subcategoryEdited$ = this.subcategoryEditedSource.asObservable();

  constructor(private _dataApiService: DataService) {}

  getSubcategories(request: SubcategoryRequest): Observable<any> {
    const params = new HttpParams()
      .set('name', request.name)
      .set('categoryId', request.categoryId)
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())
      .set('sort', request.sort);

    const url = `${this.baseUrl}/subcategory/get`;
    return this._dataApiService.getAll<any>(url, params);
  }

  getSubcategoryById(id: string): Observable<any> {
    const url = `${this.baseUrl}/subcategory/get/${id}`;
    return this._dataApiService.getById<any>(url);
  }

  createSubcategory(request: any): Observable<any> {
    return this._dataApiService.create<any, any>(`${this.baseUrl}/subcategory/create`, request);
  }

  editSubcategory(id: string, request: any): Observable<any> {
    return this._dataApiService.put<any, any>(`${this.baseUrl}/subcategory/edit/${id}`, request);
  }

  deleteSubcategory(id: string): Observable<NonGenericApiResponse> {
    const url = `${this.baseUrl}/subcategory/delete/${id}`;
    return this._dataApiService.delete<NonGenericApiResponse>(url);
  }


  notifySubcategoryAdded() {
    this.subcategoryAddedSource.next(true);
  }

  notifySubcategoryEdited() {
    this.subcategoryEditedSource.next(true);
  }
}
