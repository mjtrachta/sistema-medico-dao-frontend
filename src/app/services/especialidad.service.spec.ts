import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EspecialidadService } from './especialidad.service';
import { Especialidad } from '../models';
import { environment } from '../../environments/environment';

describe('EspecialidadService', () => {
  let service: EspecialidadService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/especialidades`;

  const mockEspecialidad: Especialidad = {
    id: 1,
    nombre: 'Cardiología',
    descripcion: 'Especialidad médica del corazón',
    duracion_turno_min: 30
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EspecialidadService]
    });
    service = TestBed.inject(EspecialidadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all especialidades', () => {
    const mockEspecialidades: Especialidad[] = [mockEspecialidad];

    service.getAll().subscribe(especialidades => {
      expect(especialidades.length).toBe(1);
      expect(especialidades).toEqual(mockEspecialidades);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockEspecialidades);
  });

  it('should get especialidad by id', () => {
    service.getById(1).subscribe(especialidad => {
      expect(especialidad).toEqual(mockEspecialidad);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEspecialidad);
  });

  it('should create especialidad', () => {
    service.create(mockEspecialidad).subscribe(especialidad => {
      expect(especialidad).toEqual(mockEspecialidad);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockEspecialidad);
  });

  it('should update especialidad', () => {
    service.update(1, mockEspecialidad).subscribe(especialidad => {
      expect(especialidad).toEqual(mockEspecialidad);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockEspecialidad);
  });

  it('should delete especialidad', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
