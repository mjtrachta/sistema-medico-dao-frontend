import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { PacienteListComponent } from './paciente-list.component';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../models';

describe('PacienteListComponent', () => {
  let component: PacienteListComponent;
  let fixture: ComponentFixture<PacienteListComponent>;
  let pacienteService: jasmine.SpyObj<PacienteService>;

  const mockPacientes: Paciente[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      tipo_documento: 'DNI',
      nro_documento: '12345678',
      fecha_nacimiento: '1990-01-01',
      genero: 'M',
      email: 'juan@example.com',
      telefono: '1234567890'
    }
  ];

  beforeEach(async () => {
    const pacienteServiceSpy = jasmine.createSpyObj('PacienteService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [PacienteListComponent, HttpClientTestingModule],
      providers: [
        { provide: PacienteService, useValue: pacienteServiceSpy }
      ]
    }).compileComponents();

    pacienteService = TestBed.inject(PacienteService) as jasmine.SpyObj<PacienteService>;
    pacienteService.getAll.and.returnValue(of([]));

    fixture = TestBed.createComponent(PacienteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pacientes on init', () => {
    pacienteService.getAll.and.returnValue(of(mockPacientes));

    component.ngOnInit();

    expect(pacienteService.getAll).toHaveBeenCalled();
    expect(component.pacientes).toEqual(mockPacientes);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading pacientes', (done) => {
    pacienteService.getAll.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    setTimeout(() => {
      expect(component.error).toBe('Error cargando pacientes');
      expect(component.loading).toBeFalse();
      done();
    }, 0);
  });

  it('should delete paciente', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    pacienteService.delete.and.returnValue(of(void 0));
    pacienteService.getAll.and.returnValue(of(mockPacientes));

    component.deletePaciente(1);

    expect(pacienteService.delete).toHaveBeenCalledWith(1);
  });

  it('should not delete paciente if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deletePaciente(1);

    expect(pacienteService.delete).not.toHaveBeenCalled();
  });
});
