import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HistoriaClinicaService } from './historia-clinica.service';
import { HistoriaClinica } from '../models';
import { environment } from '../../environments/environment';

describe('HistoriaClinicaService', () => {
  let service: HistoriaClinicaService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/historias-clinicas`;

  const mockHistoria: HistoriaClinica = {
    id: 1,
    paciente_id: 1,
    medico_id: 1,
    fecha: '2025-01-15',
    motivo_consulta: 'Dolor de cabeza',
    diagnostico: 'Migraña',
    tratamiento: 'Reposo y medicación'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HistoriaClinicaService]
    });
    service = TestBed.inject(HistoriaClinicaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all historias', () => {
    const mockHistorias: HistoriaClinica[] = [mockHistoria];

    service.getAll().subscribe(historias => {
      expect(historias.length).toBe(1);
      expect(historias).toEqual(mockHistorias);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockHistorias);
  });

  it('should get historia by id', () => {
    service.getById(1).subscribe(historia => {
      expect(historia).toEqual(mockHistoria);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHistoria);
  });

  it('should create historia', () => {
    service.create(mockHistoria).subscribe(historia => {
      expect(historia).toEqual(mockHistoria);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockHistoria);
  });

  it('should update historia', () => {
    service.update(1, mockHistoria).subscribe(historia => {
      expect(historia).toEqual(mockHistoria);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockHistoria);
  });

  it('should delete historia', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get historias by paciente', () => {
    const mockHistorias: HistoriaClinica[] = [mockHistoria];

    service.getByPaciente(1).subscribe(historias => {
      expect(historias).toEqual(mockHistorias);
    });

    const req = httpMock.expectOne(`${apiUrl}/paciente/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHistorias);
  });
});
