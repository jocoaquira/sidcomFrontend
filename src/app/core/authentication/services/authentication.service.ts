import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationService {
  private baseUrl = environment.API_URL;

  constructor(private http: HttpClient) { }
  login(data:any) {
    return this.http.post(`${this.baseUrl}/auth/login`, data)
  }

}
