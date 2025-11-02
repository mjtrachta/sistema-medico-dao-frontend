import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { TurnoFormComponent } from './turno-form.component';
import { TurnoService } from '../../../services/turno.service';
import { MedicoService } from '../../../services/medico.service';
import { PacienteService } from '../../../services/paciente.service';
import { UbicacionService } from '../../../services/ubicacion.service';
import { Turno, DisponibilidadHorario } from '../../../models';

describe('TurnoFormComponent', () => {
  let component: TurnoFormComponent;
  let fixture: ComponentFixture<TurnoFormComponent>;
  let turnoService: jasmine.SpyObj<TurnoService>;
  let medicoService: jasmine.SpyObj<MedicoService>;
  let pacienteService: jasmine.SpyObj<PacienteService>;
  let ubicacionService: jasmine.SpyObj<UbicacionService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const turnoServiceSpy = jasmine.createSpyObj('TurnoService', ['create', 'getDisponibilidad']);
    const medicoServiceSpy = jasmine.createSpyObj('MedicoService', ['getAll']);
    const pacienteServiceSpy = jasmine.createSpyObj('PacienteService', ['getAll']);
    const ubicacionServiceSpy = jasmine.createSpyObj('UbicacionService', ['getAll']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TurnoFormComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: TurnoService, useValue: turnoServiceSpy },
        { provide: MedicoService, useValue: medicoServiceSpy },
        { provide: PacienteService, useValue: pacienteServiceSpy },
        { provide: UbicacionService, useValue: ubicacionServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    turnoService = TestBed.inject(TurnoService) as jasmine.SpyObj<TurnoService>;
    medicoService = TestBed.inject(MedicoService) as jasmine.SpyObj<MedicoService>;
    pacienteService = TestBed.inject(PacienteService) as jasmine.SpyObj<PacienteService>;
    ubicacionService = TestBed.inject(UbicacionService) as jasmine.SpyObj<UbicacionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    medicoService.getAll.and.returnValue(of([]));
    pacienteService.getAll.and.returnValue(of([]));
    ubicacionService.getAll.and.returnValue(of([]));

    fixture = TestBed.createComponent(TurnoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.turnoForm.get('duracion_min')?.value).toBe(30);
    expect(component.turnoForm.valid).toBeFalse();
  });

  it('should load medicos, pacientes and ubicaciones on init', () => {
    expect(medicoService.getAll).toHaveBeenCalled();
    expect(pacienteService.getAll).toHaveBeenCalled();
    expect(ubicacionService.getAll).toHaveBeenCalled();
  });

  it('should get disponibilidad when medico, fecha and duracion are set', () => {
    const mockDisponibilidad: DisponibilidadHorario = {
      fecha: '2025-01-15',
      horarios_disponibles: ['10:00', '11:00', '12:00']
    };

    turnoService.getDisponibilidad.and.returnValue(of(mockDisponibilidad));

    component.turnoForm.patchValue({
      medico_id: 1,
      fecha: '2025-01-15',
      duracion_min: 30
    });

    component.checkDisponibilidad();

    expect(turnoService.getDisponibilidad).toHaveBeenCalledWith(1, '2025-01-15', 30);
    expect(component.horariosDisponibles).toEqual(['10:00', '11:00', '12:00']);
  });

  it('should select horario', () => {
    component.selectHorario('10:00');

    expect(component.turnoForm.get('hora')?.value).toBe('10:00');
  });

  it('should create turno on submit', () => {
    const mockTurno: Turno = {
      paciente_id: 1,
      medico_id: 1,
      ubicacion_id: 1,
      fecha: '2025-01-15',
      hora: '10:00',
      duracion_min: 30,
      motivo_consulta: 'Consulta general'
    };

    turnoService.create.and.returnValue(of(mockTurno));

    component.turnoForm.patchValue(mockTurno);
    component.onSubmit();

    expect(turnoService.create).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/turnos']);
  });

  it('should handle error on submit', () => {
    turnoService.create.and.returnValue(throwError(() => new Error('Error')));

    component.turnoForm.patchValue({
      paciente_id: 1,
      medico_id: 1,
      ubicacion_id: 1,
      fecha: '2025-01-15',
      hora: '10:00',
      duracion_min: 30
    });

    component.onSubmit();

    expect(component.error).toBe('Error creando turno');
    expect(component.loading).toBeFalse();
  });
});
