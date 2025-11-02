import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UbicacionService } from './ubicacion.service';
import { Ubicacion } from '../models';
import { environment } from '../../environments/environment';

describe('UbicacionService', () => {
  let service: UbicacionService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/ubicaciones`;

  const mockUbicacion: Ubicacion = {
    id: 1,
    nombre: 'Consultorio 1',
    direccion: 'Av. Siempre Viva 123',
    piso: '1',
    numero: '101',
    telefono: '1234567890',
    activo: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UbicacionService]
    });
    service = TestBed.inject(UbicacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all ubicaciones', () => {
    const mockUbicaciones: Ubicacion[] = [mockUbicacion];

    service.getAll().subscribe(ubicaciones => {
      expect(ubicaciones.length).toBe(1);
      expect(ubicaciones).toEqual(mockUbicaciones);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUbicaciones);
  });

  it('should get ubicacion by id', () => {
    service.getById(1).subscribe(ubicacion => {
      expect(ubicacion).toEqual(mockUbicacion);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUbicacion);
  });

  it('should create ubicacion', () => {
    service.create(mockUbicacion).subscribe(ubicacion => {
      expect(ubicacion).toEqual(mockUbicacion);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockUbicacion);
  });

  it('should update ubicacion', () => {
    service.update(1, mockUbicacion).subscribe(ubicacion => {
      expect(ubicacion).toEqual(mockUbicacion);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockUbicacion);
  });

  it('should delete ubicacion', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
