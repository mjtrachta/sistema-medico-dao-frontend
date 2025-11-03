import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { EspecialidadListComponent } from './especialidad-list.component';
import { EspecialidadService } from '../../../services/especialidad.service';
import { Especialidad } from '../../../models';

describe('EspecialidadListComponent', () => {
  let component: EspecialidadListComponent;
  let fixture: ComponentFixture<EspecialidadListComponent>;
  let especialidadService: jasmine.SpyObj<EspecialidadService>;

  const mockEspecialidades: Especialidad[] = [
    {
      id: 1,
      nombre: 'Cardiología',
      descripcion: 'Especialidad médica del corazón',
      duracion_turno_min: 30
    }
  ];

  beforeEach(async () => {
    const especialidadServiceSpy = jasmine.createSpyObj('EspecialidadService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [EspecialidadListComponent, HttpClientTestingModule],
      providers: [
        { provide: EspecialidadService, useValue: especialidadServiceSpy }
      ]
    }).compileComponents();

    especialidadService = TestBed.inject(EspecialidadService) as jasmine.SpyObj<EspecialidadService>;
    fixture = TestBed.createComponent(EspecialidadListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load especialidades on init', () => {
    especialidadService.getAll.and.returnValue(of(mockEspecialidades));

    component.ngOnInit();

    expect(especialidadService.getAll).toHaveBeenCalled();
    expect(component.especialidades).toEqual(mockEspecialidades);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading especialidades', (done) => {
    especialidadService.getAll.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    setTimeout(() => {
      expect(component.error).toBe('Error cargando especialidades');
      expect(component.loading).toBeFalse();
      done();
    }, 0);
  });

  it('should delete especialidad', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    especialidadService.delete.and.returnValue(of(void 0));
    especialidadService.getAll.and.returnValue(of(mockEspecialidades));

    component.deleteEspecialidad(1);

    expect(especialidadService.delete).toHaveBeenCalledWith(1);
  });
});
