import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  health(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  hello(): Observable<any> {
    return this.http.get(`${this.apiUrl}/hello`);
  }
}
