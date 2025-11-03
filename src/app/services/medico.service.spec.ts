import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MedicoService } from './medico.service';
import { Medico } from '../models';
import { environment } from '../../environments/environment';

describe('MedicoService', () => {
  let service: MedicoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/medicos`;

  const mockMedico: Medico = {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    nombre_completo: 'Dr. Juan Pérez',
    matricula: 'MP12345',
    especialidad_id: 1,
    email: 'dr.perez@example.com',
    telefono: '1234567890'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedicoService]
    });
    service = TestBed.inject(MedicoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all medicos', () => {
    const mockMedicos: Medico[] = [mockMedico];

    service.getAll().subscribe(medicos => {
      expect(medicos.length).toBe(1);
      expect(medicos).toEqual(mockMedicos);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockMedicos);
  });

  it('should get medico by id', () => {
    service.getById(1).subscribe(medico => {
      expect(medico).toEqual(mockMedico);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMedico);
  });

  it('should create medico', () => {
    service.create(mockMedico).subscribe(medico => {
      expect(medico).toEqual(mockMedico);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockMedico);
  });

  it('should update medico', () => {
    service.update(1, mockMedico).subscribe(medico => {
      expect(medico).toEqual(mockMedico);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockMedico);
  });

  it('should delete medico', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get medicos by especialidad', () => {
    const mockMedicos: Medico[] = [mockMedico];

    service.getByEspecialidad(1).subscribe(medicos => {
      expect(medicos).toEqual(mockMedicos);
    });

    const req = httpMock.expectOne(`${apiUrl}?especialidad_id=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMedicos);
  });
});
