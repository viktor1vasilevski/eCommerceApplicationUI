import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment.dev';
import { HttpClient } from '@angular/common/http';
import { UserRegisterRequest } from '../models/auth/user-register-request';
import { UserLoginRequest } from '../models/auth/user-login-request';
import { ApiResponse } from '../../core/models/responses/api-response';
import { LoginDTO } from '../models/auth/login-dto';
import { RegisterDTO } from '../models/auth/register-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  // Register a new user
  registerUser(request: UserRegisterRequest) {
    return this._http.post<ApiResponse<RegisterDTO>>(`${this.baseUrl}/auth/register`, request);
  }

  // Login an existing user
  loginUser(request: UserLoginRequest) {
    return this._http.post<ApiResponse<LoginDTO>>(`${this.baseUrl}/auth/login`, request);
  }
}
