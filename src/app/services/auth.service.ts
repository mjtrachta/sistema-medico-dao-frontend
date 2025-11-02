import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterPacienteRequest,
  RegisterMedicoRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          // Guardar tokens y usuario en localStorage
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));

          // Actualizar BehaviorSubject
          this.currentUserSubject.next(response.usuario);
        })
      );
  }

  registerPaciente(data: RegisterPacienteRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          // Auto-login después del registro
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          this.currentUserSubject.next(response.usuario);
        })
      );
  }

  registerMedico(data: RegisterMedicoRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register-medico`, data)
      .pipe(
        tap(response => {
          // Auto-login después del registro
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          this.currentUserSubject.next(response.usuario);
        })
      );
  }

  logout(): void {
    // Limpiar localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentUser');

    // Limpiar BehaviorSubject
    this.currentUserSubject.next(null);

    // Redirigir a login
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<{ access_token: string }> {
    const refresh_token = localStorage.getItem('refresh_token');
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/refresh`, {}, {
      headers: {
        'Authorization': `Bearer ${refresh_token}`
      }
    }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
      })
    );
  }

  getCurrentUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`)
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  verifyInviteToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify-token/${token}`);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserValue;
  }

  hasRole(...roles: string[]): boolean {
    const user = this.currentUserValue;
    return user ? roles.includes(user.rol) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isMedico(): boolean {
    return this.hasRole('medico');
  }

  isPaciente(): boolean {
    return this.hasRole('paciente');
  }

  isRecepcionista(): boolean {
    return this.hasRole('recepcionista');
  }
}
