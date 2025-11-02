import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PacienteService } from './paciente.service';
import { Paciente } from '../models';
import { environment } from '../../environments/environment';

describe('PacienteService', () => {
  let service: PacienteService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/pacientes`;

  const mockPaciente: Paciente = {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    tipo_documento: 'DNI',
    nro_documento: '12345678',
    fecha_nacimiento: '1990-01-01',
    genero: 'M',
    email: 'juan@example.com',
    telefono: '1234567890'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PacienteService]
    });
    service = TestBed.inject(PacienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all pacientes', () => {
    const mockPacientes: Paciente[] = [mockPaciente];

    service.getAll().subscribe(pacientes => {
      expect(pacientes.length).toBe(1);
      expect(pacientes).toEqual(mockPacientes);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPacientes);
  });

  it('should get paciente by id', () => {
    service.getById(1).subscribe(paciente => {
      expect(paciente).toEqual(mockPaciente);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPaciente);
  });

  it('should create paciente', () => {
    service.create(mockPaciente).subscribe(paciente => {
      expect(paciente).toEqual(mockPaciente);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPaciente);
    req.flush(mockPaciente);
  });

  it('should update paciente', () => {
    const updatedPaciente = { ...mockPaciente, nombre: 'Carlos' };

    service.update(1, updatedPaciente).subscribe(paciente => {
      expect(paciente.nombre).toBe('Carlos');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPaciente);
    req.flush(updatedPaciente);
  });

  it('should delete paciente', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should search by documento', () => {
    service.searchByDocumento('12345678').subscribe(paciente => {
      expect(paciente).toEqual(mockPaciente);
    });

    const req = httpMock.expectOne(`${apiUrl}/search/12345678`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPaciente);
  });
});
