import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { MedicoListComponent } from './medico-list.component';
import { MedicoService } from '../../../services/medico.service';
import { EspecialidadService } from '../../../services/especialidad.service';
import { Medico } from '../../../models';

describe('MedicoListComponent', () => {
  let component: MedicoListComponent;
  let fixture: ComponentFixture<MedicoListComponent>;
  let medicoService: jasmine.SpyObj<MedicoService>;

  const mockMedicos: Medico[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      nombre_completo: 'Dr. Juan Pérez',
      matricula: 'MP12345',
      especialidad_id: 1,
      email: 'dr.perez@example.com',
      telefono: '1234567890'
    }
  ];

  beforeEach(async () => {
    const medicoServiceSpy = jasmine.createSpyObj('MedicoService', ['getAll', 'delete']);
    const especialidadServiceSpy = jasmine.createSpyObj('EspecialidadService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [MedicoListComponent, HttpClientTestingModule],
      providers: [
        { provide: MedicoService, useValue: medicoServiceSpy },
        { provide: EspecialidadService, useValue: especialidadServiceSpy }
      ]
    }).compileComponents();

    medicoService = TestBed.inject(MedicoService) as jasmine.SpyObj<MedicoService>;
    fixture = TestBed.createComponent(MedicoListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load medicos on init', () => {
    medicoService.getAll.and.returnValue(of(mockMedicos));

    component.ngOnInit();

    expect(medicoService.getAll).toHaveBeenCalled();
    expect(component.medicos).toEqual(mockMedicos);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading medicos', (done) => {
    medicoService.getAll.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    setTimeout(() => {
      expect(component.error).toBe('Error cargando médicos');
      expect(component.loading).toBeFalse();
      done();
    }, 0);
  });

  it('should delete medico', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    medicoService.delete.and.returnValue(of(void 0));
    medicoService.getAll.and.returnValue(of(mockMedicos));

    component.deleteMedico(1);

    expect(medicoService.delete).toHaveBeenCalledWith(1);
  });
});
