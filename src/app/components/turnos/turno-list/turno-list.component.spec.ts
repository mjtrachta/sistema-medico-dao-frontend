import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TurnoListComponent } from './turno-list.component';
import { TurnoService } from '../../../services/turno.service';
import { Turno } from '../../../models';

describe('TurnoListComponent', () => {
  let component: TurnoListComponent;
  let fixture: ComponentFixture<TurnoListComponent>;
  let turnoService: jasmine.SpyObj<TurnoService>;
  let router: jasmine.SpyObj<Router>;

  const mockTurnos: Turno[] = [
    {
      id: 1,
      codigo_turno: 'T-001',
      paciente_id: 1,
      medico_id: 1,
      ubicacion_id: 1,
      fecha: '2025-01-15',
      hora: '10:00',
      duracion_min: 30,
      estado: 'pendiente'
    }
  ];

  beforeEach(async () => {
    const turnoServiceSpy = jasmine.createSpyObj('TurnoService', [
      'getAll',
      'confirmar',
      'cancelar',
      'completar',
      'marcarAusente'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TurnoListComponent, HttpClientTestingModule],
      providers: [
        { provide: TurnoService, useValue: turnoServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    turnoService = TestBed.inject(TurnoService) as jasmine.SpyObj<TurnoService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    turnoService.getAll.and.returnValue(of([]));

    fixture = TestBed.createComponent(TurnoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load turnos on init', () => {
    turnoService.getAll.and.returnValue(of(mockTurnos));

    component.ngOnInit();

    expect(turnoService.getAll).toHaveBeenCalled();
    expect(component.turnos).toEqual(mockTurnos);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading turnos', (done) => {
    turnoService.getAll.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    setTimeout(() => {
      expect(component.error).toBe('Error cargando turnos');
      expect(component.loading).toBeFalse();
      done();
    }, 0);
  });

  it('should confirmar turno', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const confirmedTurno = { ...mockTurnos[0], estado: 'confirmado' as const };
    turnoService.confirmar.and.returnValue(of(confirmedTurno));
    turnoService.getAll.and.returnValue(of(mockTurnos));

    component.confirmarTurno(1);

    expect(turnoService.confirmar).toHaveBeenCalledWith(1);
  });

  it('should cancelar turno', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const canceledTurno = { ...mockTurnos[0], estado: 'cancelado' as const };
    turnoService.cancelar.and.returnValue(of(canceledTurno));
    turnoService.getAll.and.returnValue(of(mockTurnos));

    component.cancelarTurno(1);

    expect(turnoService.cancelar).toHaveBeenCalledWith(1);
  });

  it('should completar turno', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const completedTurno = { ...mockTurnos[0], estado: 'completado' as const };
    turnoService.completar.and.returnValue(of(completedTurno));
    turnoService.getAll.and.returnValue(of(mockTurnos));

    component.completarTurno(1);

    expect(turnoService.completar).toHaveBeenCalledWith(1);
  });

  it('should marcar ausente turno', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const ausenteTurno = { ...mockTurnos[0], estado: 'ausente' as const };
    turnoService.marcarAusente.and.returnValue(of(ausenteTurno));
    turnoService.getAll.and.returnValue(of(mockTurnos));

    component.marcarAusente(1);

    expect(turnoService.marcarAusente).toHaveBeenCalledWith(1);
  });

  it('should get correct estado class', () => {
    expect(component.getEstadoClass('pendiente')).toBe('estado-pendiente');
    expect(component.getEstadoClass('confirmado')).toBe('estado-confirmado');
    expect(component.getEstadoClass('completado')).toBe('estado-completado');
    expect(component.getEstadoClass('cancelado')).toBe('estado-cancelado');
    expect(component.getEstadoClass('ausente')).toBe('estado-ausente');
  });

  it('should navigate to nuevo turno', () => {
    component.nuevoTurno();

    expect(router.navigate).toHaveBeenCalledWith(['/turnos/nuevo']);
  });
});
