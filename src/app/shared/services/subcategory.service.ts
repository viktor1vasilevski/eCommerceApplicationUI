import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { environment } from '../../../enviroments/enviroment.dev';
import { SubcategoryRequest } from '../models/subcategory/subcategory-request';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

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

  createSubcategory(request: any): Observable<any> {
    return this._dataApiService.create<any, any>(`${this.baseUrl}/subcategory/create`, request);
  }




  notifySubcategoryAdded() {
    this.subcategoryAddedSource.next(true);
  }

  notifySubcategoryEdited() {
    this.subcategoryEditedSource.next(true);
  }
}
