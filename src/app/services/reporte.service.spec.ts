import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReporteService } from './reporte.service';
import {
  ReporteTurnosPorMedico,
  ReporteTurnosPorEspecialidad,
  ReportePacientesAtendidos,
  ReporteEstadisticasAsistencia
} from '../models';
import { environment } from '../../environments/environment';

describe('ReporteService', () => {
  let service: ReporteService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/reportes`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReporteService]
    });
    service = TestBed.inject(ReporteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get turnos por medico', () => {
    const mockReporte: ReporteTurnosPorMedico = {
      medico_id: 1,
      medico_nombre: 'Dr. Juan Pérez',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-31',
      total_turnos: 50,
      confirmados: 30,
      completados: 15,
      cancelados: 3,
      ausentes: 2
    };

    service.turnosPorMedico(1, '2025-01-01', '2025-01-31').subscribe(reporte => {
      expect(reporte).toEqual(mockReporte);
    });

    const req = httpMock.expectOne(
      req => req.url === `${apiUrl}/turnos-por-medico/1` &&
             req.params.get('fecha_inicio') === '2025-01-01' &&
             req.params.get('fecha_fin') === '2025-01-31'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockReporte);
  });

  it('should get turnos por especialidad', () => {
    const mockReporte: ReporteTurnosPorEspecialidad = {
      especialidad_id: 1,
      especialidad_nombre: 'Cardiología',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-31',
      total_turnos: 100,
      total_medicos: 5,
      medicos_turnos: [
        { medico_id: 1, medico_nombre: 'Dr. Juan', total: 30 },
        { medico_id: 2, medico_nombre: 'Dr. Pedro', total: 25 }
      ]
    };

    service.turnosPorEspecialidad(1, '2025-01-01', '2025-01-31').subscribe(reporte => {
      expect(reporte).toEqual(mockReporte);
    });

    const req = httpMock.expectOne(
      req => req.url === `${apiUrl}/turnos-por-especialidad/1` &&
             req.params.get('fecha_inicio') === '2025-01-01' &&
             req.params.get('fecha_fin') === '2025-01-31'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockReporte);
  });

  it('should get pacientes atendidos', () => {
    const mockReporte: ReportePacientesAtendidos = {
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-31',
      total_pacientes: 50,
      pacientes: [
        { paciente_id: 1, paciente_nombre: 'Juan Pérez', total_consultas: 3, ultima_consulta: '2025-01-20' }
      ]
    };

    service.pacientesAtendidos('2025-01-01', '2025-01-31').subscribe(reporte => {
      expect(reporte).toEqual(mockReporte);
    });

    const req = httpMock.expectOne(
      req => req.url === `${apiUrl}/pacientes-atendidos` &&
             req.params.get('fecha_inicio') === '2025-01-01' &&
             req.params.get('fecha_fin') === '2025-01-31'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockReporte);
  });

  it('should get estadisticas asistencia', () => {
    const mockReporte: ReporteEstadisticasAsistencia = {
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-31',
      total_turnos: 100,
      completados: 70,
      cancelados: 20,
      ausentes: 10,
      porcentaje_completados: 70,
      porcentaje_cancelados: 20,
      porcentaje_ausentes: 10
    };

    service.estadisticasAsistencia('2025-01-01', '2025-01-31').subscribe(reporte => {
      expect(reporte).toEqual(mockReporte);
    });

    const req = httpMock.expectOne(
      req => req.url === `${apiUrl}/estadisticas-asistencia` &&
             req.params.get('fecha_inicio') === '2025-01-01' &&
             req.params.get('fecha_fin') === '2025-01-31'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockReporte);
  });
});
