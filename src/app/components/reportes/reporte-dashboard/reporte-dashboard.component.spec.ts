import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ReporteDashboardComponent } from './reporte-dashboard.component';
import { ReporteService } from '../../../services/reporte.service';
import { MedicoService } from '../../../services/medico.service';
import { EspecialidadService } from '../../../services/especialidad.service';
import {
  ReporteTurnosPorMedico,
  ReporteTurnosPorEspecialidad,
  ReportePacientesAtendidos,
  ReporteEstadisticasAsistencia
} from '../../../models';

describe('ReporteDashboardComponent', () => {
  let component: ReporteDashboardComponent;
  let fixture: ComponentFixture<ReporteDashboardComponent>;
  let reporteService: jasmine.SpyObj<ReporteService>;
  let medicoService: jasmine.SpyObj<MedicoService>;
  let especialidadService: jasmine.SpyObj<EspecialidadService>;

  beforeEach(async () => {
    const reporteServiceSpy = jasmine.createSpyObj('ReporteService', [
      'turnosPorMedico',
      'turnosPorEspecialidad',
      'pacientesAtendidos',
      'estadisticasAsistencia'
    ]);
    const medicoServiceSpy = jasmine.createSpyObj('MedicoService', ['getAll']);
    const especialidadServiceSpy = jasmine.createSpyObj('EspecialidadService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [ReporteDashboardComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: ReporteService, useValue: reporteServiceSpy },
        { provide: MedicoService, useValue: medicoServiceSpy },
        { provide: EspecialidadService, useValue: especialidadServiceSpy }
      ]
    }).compileComponents();

    reporteService = TestBed.inject(ReporteService) as jasmine.SpyObj<ReporteService>;
    medicoService = TestBed.inject(MedicoService) as jasmine.SpyObj<MedicoService>;
    especialidadService = TestBed.inject(EspecialidadService) as jasmine.SpyObj<EspecialidadService>;

    medicoService.getAll.and.returnValue(of([]));
    especialidadService.getAll.and.returnValue(of([]));

    fixture = TestBed.createComponent(ReporteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load medicos and especialidades on init', () => {
    expect(medicoService.getAll).toHaveBeenCalled();
    expect(especialidadService.getAll).toHaveBeenCalled();
  });

  it('should generate reporte turnos por medico', () => {
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

    reporteService.turnosPorMedico.and.returnValue(of(mockReporte));

    component.reporteForm.patchValue({
      tipo: 'turnos_medico',
      medico_id: 1,
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-31'
    });

    component.generarReporte();

    expect(reporteService.turnosPorMedico).toHaveBeenCalledWith(1, '2025-01-01', '2025-01-31');
    expect(component.reporteTurnosMedico).toEqual(mockReporte);
  });

  it('should generate reporte turnos por especialidad', () => {
    const mockReporte: ReporteTurnosPorEspecialidad = {
      especialidad_id: 1,
      especialidad_nombre: 'Cardiología',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-31',
      total_turnos: 100,
      total_medicos: 5,
      medicos_turnos: []
    };

    reporteService.turnosPorEspecialidad.and.returnValue(of(mockReporte));

    component.reporteForm.patchValue({
      tipo: 'turnos_especialidad',
      especialidad_id: 1,
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-31'
    });

    component.generarReporte();

    expect(reporteService.turnosPorEspecialidad).toHaveBeenCalledWith(1, '2025-01-01', '2025-01-31');
    expect(component.reporteTurnosEspecialidad).toEqual(mockReporte);
  });

  it('should generate reporte pacientes atendidos', () => {
    const mockReporte: ReportePacientesAtendidos = {
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-31',
      total_pacientes: 50,
      pacientes: []
    };

    reporteService.pacientesAtendidos.and.returnValue(of(mockReporte));

    component.reporteForm.patchValue({
      tipo: 'pacientes_atendidos',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-31'
    });

    component.generarReporte();

    expect(reporteService.pacientesAtendidos).toHaveBeenCalledWith('2025-01-01', '2025-01-31');
    expect(component.reportePacientes).toEqual(mockReporte);
  });

  it('should generate reporte estadisticas asistencia', () => {
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

    reporteService.estadisticasAsistencia.and.returnValue(of(mockReporte));

    component.reporteForm.patchValue({
      tipo: 'estadisticas_asistencia',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-31'
    });

    component.generarReporte();

    expect(reporteService.estadisticasAsistencia).toHaveBeenCalledWith('2025-01-01', '2025-01-31');
    expect(component.reporteAsistencia).toEqual(mockReporte);
  });

  it('should handle error when generating reporte', () => {
    reporteService.turnosPorMedico.and.returnValue(throwError(() => new Error('Error')));

    component.reporteForm.patchValue({
      tipo: 'turnos_medico',
      medico_id: 1,
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-31'
    });

    component.generarReporte();

    expect(component.error).toBe('Error generando reporte');
    expect(component.loading).toBeFalse();
  });

  it('should clear reports when tipo changes', () => {
    component.reporteTurnosMedico = {} as ReporteTurnosPorMedico;
    component.reporteForm.patchValue({ tipo: 'turnos_especialidad' });

    expect(component.reporteTurnosMedico).toBeNull();
  });
});
