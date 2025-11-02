import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { HistoriaListComponent } from './historia-list.component';
import { HistoriaClinicaService } from '../../../services/historia-clinica.service';
import { HistoriaClinica } from '../../../models';

describe('HistoriaListComponent', () => {
  let component: HistoriaListComponent;
  let fixture: ComponentFixture<HistoriaListComponent>;
  let historiaService: jasmine.SpyObj<HistoriaClinicaService>;

  const mockHistorias: HistoriaClinica[] = [
    {
      id: 1,
      paciente_id: 1,
      medico_id: 1,
      fecha: '2025-01-15',
      motivo_consulta: 'Dolor de cabeza',
      diagnostico: 'Migraña',
      tratamiento: 'Reposo y medicación'
    }
  ];

  beforeEach(async () => {
    const historiaServiceSpy = jasmine.createSpyObj('HistoriaClinicaService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [HistoriaListComponent, HttpClientTestingModule],
      providers: [
        { provide: HistoriaClinicaService, useValue: historiaServiceSpy }
      ]
    }).compileComponents();

    historiaService = TestBed.inject(HistoriaClinicaService) as jasmine.SpyObj<HistoriaClinicaService>;
    fixture = TestBed.createComponent(HistoriaListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load historias on init', () => {
    historiaService.getAll.and.returnValue(of(mockHistorias));

    component.ngOnInit();

    expect(historiaService.getAll).toHaveBeenCalled();
    expect(component.historias).toEqual(mockHistorias);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading historias', () => {
    historiaService.getAll.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(component.error).toBe('Error cargando historias clínicas');
    expect(component.loading).toBeFalse();
  });

  it('should delete historia', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    historiaService.delete.and.returnValue(of(void 0));
    historiaService.getAll.and.returnValue(of(mockHistorias));

    component.deleteHistoria(1);

    expect(historiaService.delete).toHaveBeenCalledWith(1);
  });
});
