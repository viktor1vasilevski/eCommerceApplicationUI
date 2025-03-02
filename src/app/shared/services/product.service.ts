import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { environment } from '../../../enviroments/enviroment.dev';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.apiUrl;

  private productAddedOrEditedSource = new BehaviorSubject<boolean>(false);
  productAddedOrEdited$ = this.productAddedOrEditedSource.asObservable();

  constructor(private _dataApiService: DataService) {}


  getProducts(request: any): Observable<any> {
    const params = new HttpParams()
      .set('name', request.name.toString())
      .set('brand', request.brand.toString())
      .set('description', request.description.toString())
      .set('edition', request.edition.toString())
      .set('scent', request.scent.toString())
      .set('categoryId', request.categoryId)
      .set('subcategoryId', request.subcategoryId)
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())
      .set('sortBy', request.sortBy)
      .set('sortDirection', request.sortDirection);

    const url = `${this.baseUrl}/product/get`;
    return this._dataApiService.getAll<any>(url, params);
  }

  createProduct(request: any): Observable<any> {
    return this._dataApiService.create<any, any>(`${this.baseUrl}/product/create`, request);
  }


  notifyProductAddedOrEdited() {
    this.productAddedOrEditedSource.next(true);
  }
}
