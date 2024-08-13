import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RequestTokenResponse,
  CreateSessionIdResponse,
} from '../../models/response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient) {}

  private getOptions() {
    return { params: new HttpParams().set('api_key', environment.apiKey) };
  }

  getRequestToken(): Observable<RequestTokenResponse> {
    return this.httpClient.get<RequestTokenResponse>(
      `${environment.apiBaseUrl}/authentication/token/new`,
      this.getOptions(),
    );
  }

  askForPermission(token: string): Observable<RequestTokenResponse> {
    const body = {
      username: 'Sasha_kh',
      password: 'sasha_kh+',
      request_token: token,
    };
    return this.httpClient.post<RequestTokenResponse>(
      `${environment.apiBaseUrl}/authentication/token/validate_with_login`,
      body,
      this.getOptions(),
    );
  }

  createSessionId(token: string): Observable<CreateSessionIdResponse> {
    const body = {
      request_token: token,
    };
    return this.httpClient.post<CreateSessionIdResponse>(
      `${environment.apiBaseUrl}/authentication/session/new`,
      body,
      this.getOptions(),
    );
  }
}
