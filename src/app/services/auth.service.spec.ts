import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User, LoginResponse } from '../models';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  const apiUrl = `${environment.apiUrl}/auth`;

  // Mock data
  const mockUser: User = {
    id: 1,
    nombre_usuario: 'testuser',
    email: 'test@example.com',
    rol: 'paciente',
    activo: true
  };

  const mockLoginResponse: LoginResponse = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    usuario: mockUser,
    message: 'Login exitoso'
  };

  beforeEach(() => {
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: router }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with user from localStorage', () => {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      const newService = new AuthService(TestBed.inject(HttpClient), routerSpy);
      expect(newService.currentUserValue).toEqual(mockUser);
    });

    it('should initialize with null if no user in localStorage', () => {
      expect(service.currentUserValue).toBeNull();
    });
  });

  describe('login', () => {
    it('should login and store tokens', (done) => {
      service.login('testuser', 'password123').subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
        expect(localStorage.getItem('access_token')).toBe('mock-access-token');
        expect(localStorage.getItem('refresh_token')).toBe('mock-refresh-token');
        expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockUser));
        expect(service.currentUserValue).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'testuser', password: 'password123' });
      req.flush(mockLoginResponse);
    });
  });

  describe('registerPaciente', () => {
    it('should register paciente and auto-login', (done) => {
      const registerData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        nombre_usuario: 'juan.perez',
        password: 'password123',
        tipo_documento: 'DNI' as const,
        nro_documento: '12345678',
        fecha_nacimiento: '1990-01-01',
        genero: 'masculino' as const,
        telefono: '123456789'
      };

      service.registerPaciente(registerData).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
        expect(localStorage.getItem('access_token')).toBe('mock-access-token');
        expect(service.currentUserValue).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockLoginResponse);
    });
  });

  describe('registerMedico', () => {
    it('should register medico with invite token and auto-login', (done) => {
      const registerData = {
        token: 'invite-token-123',
        nombre: 'Dr. María',
        apellido: 'García',
        nombre_usuario: 'maria.garcia',
        password: 'password123',
        matricula: 'MN12345',
        especialidad_id: 1,
        telefono: '987654321'
      };

      service.registerMedico(registerData).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
        expect(localStorage.getItem('access_token')).toBe('mock-access-token');
        expect(service.currentUserValue).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/register-medico`);
      expect(req.request.method).toBe('POST');
      req.flush(mockLoginResponse);
    });
  });

  describe('logout', () => {
    it('should clear localStorage and navigate to login', () => {
      // Setup: store some data
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('refresh_token', 'refresh');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      service.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.currentUserValue).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token', (done) => {
      localStorage.setItem('refresh_token', 'old-refresh-token');

      service.refreshToken().subscribe(response => {
        expect(response.access_token).toBe('new-access-token');
        expect(localStorage.getItem('access_token')).toBe('new-access-token');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer old-refresh-token');
      req.flush({ access_token: 'new-access-token' });
    });
  });

  describe('getCurrentUserInfo', () => {
    it('should fetch and store current user info', (done) => {
      service.getCurrentUserInfo().subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockUser));
        expect(service.currentUserValue).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('verifyInviteToken', () => {
    it('should verify invite token', (done) => {
      const mockResponse = { valid: true, especialidad: 'Cardiología' };

      service.verifyInviteToken('test-token-123').subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/verify-token/test-token-123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('token management', () => {
    it('should get access token', () => {
      localStorage.setItem('access_token', 'my-token');
      expect(service.getToken()).toBe('my-token');
    });

    it('should return null if no token', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should get refresh token', () => {
      localStorage.setItem('refresh_token', 'my-refresh-token');
      expect(service.getRefreshToken()).toBe('my-refresh-token');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token and user exist', () => {
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      const newService = new AuthService(TestBed.inject(HttpClient), routerSpy);
      expect(newService.isAuthenticated()).toBe(true);
    });

    it('should return false when no token', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false when token but no user', () => {
      localStorage.setItem('access_token', 'token');
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('role checks', () => {
    beforeEach(() => {
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      service = new AuthService(TestBed.inject(HttpClient), routerSpy);
    });

    it('should check if user has role', () => {
      expect(service.hasRole('paciente')).toBe(true);
      expect(service.hasRole('admin')).toBe(false);
      expect(service.hasRole('paciente', 'admin')).toBe(true); // At least one role matches
    });

    it('should return false when no user', () => {
      localStorage.clear();
      const emptyService = new AuthService(TestBed.inject(HttpClient), routerSpy);
      expect(emptyService.hasRole('paciente')).toBe(false);
    });

    it('should check if user is admin', () => {
      expect(service.isAdmin()).toBe(false);

      const adminUser = { ...mockUser, rol: 'admin' };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      const adminService = new AuthService(TestBed.inject(HttpClient), routerSpy);
      expect(adminService.isAdmin()).toBe(true);
    });

    it('should check if user is medico', () => {
      expect(service.isMedico()).toBe(false);

      const medicoUser = { ...mockUser, rol: 'medico' };
      localStorage.setItem('currentUser', JSON.stringify(medicoUser));
      const medicoService = new AuthService(TestBed.inject(HttpClient), routerSpy);
      expect(medicoService.isMedico()).toBe(true);
    });

    it('should check if user is paciente', () => {
      expect(service.isPaciente()).toBe(true);
    });

    it('should check if user is recepcionista', () => {
      expect(service.isRecepcionista()).toBe(false);

      const recepUser = { ...mockUser, rol: 'recepcionista' };
      localStorage.setItem('currentUser', JSON.stringify(recepUser));
      const recepService = new AuthService(TestBed.inject(HttpClient), routerSpy);
      expect(recepService.isRecepcionista()).toBe(true);
    });
  });

  describe('currentUser observable', () => {
    it('should emit user changes', (done) => {
      let emissionCount = 0;

      service.currentUser.subscribe(user => {
        emissionCount++;
        if (emissionCount === 1) {
          expect(user).toBeNull(); // Initial value
        } else if (emissionCount === 2) {
          expect(user).toEqual(mockUser);
          done();
        }
      });

      // Trigger login to emit new user
      service.login('testuser', 'password').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockLoginResponse);
    });
  });
});
