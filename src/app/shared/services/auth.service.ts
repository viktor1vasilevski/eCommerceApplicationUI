import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment.dev';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  registerUser(model: any) {
    return this._http.post<any>(`${this.baseUrl}/auth/register`, 
      {
        firstName: model.firstName,
        lastName: model.lastName,
        username: model.username,
        email: model.email,
        password: model.password,
        cityId: model.cityId,
        jobId: model.jobId,
        yearsInCurrentJob: model.yearsInCurrentJob,
        totalYearsOfExperience: model.totalYearsOfExperience
      })
  }

  loginUser(model: any) {
    return this._http.post<any>(`${this.baseUrl}/auth/login`, 
    {
      username: model.username,
      password: model.password
    })
  }
}
