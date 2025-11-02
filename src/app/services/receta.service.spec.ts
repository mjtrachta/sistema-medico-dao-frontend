import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RecetaService } from './receta.service';
import { Receta } from '../models';
import { environment } from '../../environments/environment';

describe('RecetaService', () => {
  let service: RecetaService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/recetas`;

  const mockReceta: Receta = {
    id: 1,
    codigo_receta: 'REC-001',
    paciente_id: 1,
    medico_id: 1,
    fecha_emision: '2025-01-15',
    diagnostico: 'Hipertensión',
    estado: 'activa'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecetaService]
    });
    service = TestBed.inject(RecetaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all recetas', () => {
    const mockRecetas: Receta[] = [mockReceta];

    service.getAll().subscribe(recetas => {
      expect(recetas.length).toBe(1);
      expect(recetas).toEqual(mockRecetas);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockRecetas);
  });

  it('should get receta by id', () => {
    service.getById(1).subscribe(receta => {
      expect(receta).toEqual(mockReceta);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReceta);
  });

  it('should create receta', () => {
    service.create(mockReceta).subscribe(receta => {
      expect(receta).toEqual(mockReceta);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockReceta);
  });

  it('should update receta', () => {
    service.update(1, mockReceta).subscribe(receta => {
      expect(receta).toEqual(mockReceta);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockReceta);
  });

  it('should delete receta', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should cancelar receta', () => {
    const canceledReceta = { ...mockReceta, estado: 'cancelada' as const };

    service.cancelar(1).subscribe(receta => {
      expect(receta.estado).toBe('cancelada');
    });

    const req = httpMock.expectOne(`${apiUrl}/1/cancelar`);
    expect(req.request.method).toBe('PATCH');
    req.flush(canceledReceta);
  });

  it('should get recetas by paciente', () => {
    const mockRecetas: Receta[] = [mockReceta];

    service.getByPaciente(1).subscribe(recetas => {
      expect(recetas).toEqual(mockRecetas);
    });

    const req = httpMock.expectOne(`${apiUrl}/paciente/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRecetas);
  });
});
