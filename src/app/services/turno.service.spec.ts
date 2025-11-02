import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TurnoService } from './turno.service';
import { Turno, DisponibilidadHorario } from '../models';
import { environment } from '../../environments/environment';

describe('TurnoService', () => {
  let service: TurnoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/turnos`;

  const mockTurno: Turno = {
    id: 1,
    codigo_turno: 'T-001',
    paciente_id: 1,
    medico_id: 1,
    ubicacion_id: 1,
    fecha: '2025-01-15',
    hora: '10:00',
    duracion_min: 30,
    estado: 'pendiente'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TurnoService]
    });
    service = TestBed.inject(TurnoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all turnos', () => {
    const mockTurnos: Turno[] = [mockTurno];

    service.getAll().subscribe(turnos => {
      expect(turnos.length).toBe(1);
      expect(turnos).toEqual(mockTurnos);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTurnos);
  });

  it('should get turno by id', () => {
    service.getById(1).subscribe(turno => {
      expect(turno).toEqual(mockTurno);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTurno);
  });

  it('should create turno', () => {
    service.create(mockTurno).subscribe(turno => {
      expect(turno).toEqual(mockTurno);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockTurno);
  });

  it('should update turno', () => {
    service.update(1, mockTurno).subscribe(turno => {
      expect(turno).toEqual(mockTurno);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockTurno);
  });

  it('should delete turno', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get disponibilidad', () => {
    const mockDisponibilidad: DisponibilidadHorario = {
      fecha: '2025-01-15',
      horarios_disponibles: ['10:00', '11:00', '12:00']
    };

    service.getDisponibilidad(1, '2025-01-15', 30).subscribe(disponibilidad => {
      expect(disponibilidad).toEqual(mockDisponibilidad);
    });

    const req = httpMock.expectOne(
      req => req.url === `${apiUrl}/disponibilidad` &&
             req.params.get('medico_id') === '1' &&
             req.params.get('fecha') === '2025-01-15' &&
             req.params.get('duracion') === '30'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockDisponibilidad);
  });

  it('should cancelar turno', () => {
    const canceledTurno = { ...mockTurno, estado: 'cancelado' as const };

    service.cancelar(1).subscribe(turno => {
      expect(turno.estado).toBe('cancelado');
    });

    const req = httpMock.expectOne(`${apiUrl}/1/cancelar`);
    expect(req.request.method).toBe('PATCH');
    req.flush(canceledTurno);
  });

  it('should confirmar turno', () => {
    const confirmedTurno = { ...mockTurno, estado: 'confirmado' as const };

    service.confirmar(1).subscribe(turno => {
      expect(turno.estado).toBe('confirmado');
    });

    const req = httpMock.expectOne(`${apiUrl}/1/confirmar`);
    expect(req.request.method).toBe('PATCH');
    req.flush(confirmedTurno);
  });

  it('should completar turno', () => {
    const completedTurno = { ...mockTurno, estado: 'completado' as const };

    service.completar(1).subscribe(turno => {
      expect(turno.estado).toBe('completado');
    });

    const req = httpMock.expectOne(`${apiUrl}/1/completar`);
    expect(req.request.method).toBe('PATCH');
    req.flush(completedTurno);
  });

  it('should marcar ausente turno', () => {
    const ausenteTurno = { ...mockTurno, estado: 'ausente' as const };

    service.marcarAusente(1).subscribe(turno => {
      expect(turno.estado).toBe('ausente');
    });

    const req = httpMock.expectOne(`${apiUrl}/1/ausente`);
    expect(req.request.method).toBe('PATCH');
    req.flush(ausenteTurno);
  });
});
