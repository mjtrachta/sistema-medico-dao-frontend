import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RecetaListComponent } from './receta-list.component';
import { RecetaService } from '../../../services/receta.service';
import { Receta } from '../../../models';

describe('RecetaListComponent', () => {
  let component: RecetaListComponent;
  let fixture: ComponentFixture<RecetaListComponent>;
  let recetaService: jasmine.SpyObj<RecetaService>;

  const mockRecetas: Receta[] = [
    {
      id: 1,
      codigo_receta: 'REC-001',
      paciente_id: 1,
      medico_id: 1,
      fecha_emision: '2025-01-15',
      diagnostico: 'Hipertensión',
      estado: 'activa'
    }
  ];

  beforeEach(async () => {
    const recetaServiceSpy = jasmine.createSpyObj('RecetaService', ['getAll', 'delete', 'cancelar']);

    await TestBed.configureTestingModule({
      imports: [RecetaListComponent, HttpClientTestingModule],
      providers: [
        { provide: RecetaService, useValue: recetaServiceSpy }
      ]
    }).compileComponents();

    recetaService = TestBed.inject(RecetaService) as jasmine.SpyObj<RecetaService>;
    fixture = TestBed.createComponent(RecetaListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recetas on init', () => {
    recetaService.getAll.and.returnValue(of(mockRecetas));

    component.ngOnInit();

    expect(recetaService.getAll).toHaveBeenCalled();
    expect(component.recetas).toEqual(mockRecetas);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading recetas', () => {
    recetaService.getAll.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(component.error).toBe('Error cargando recetas');
    expect(component.loading).toBeFalse();
  });

  it('should cancelar receta', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const canceledReceta = { ...mockRecetas[0], estado: 'cancelada' as const };
    recetaService.cancelar.and.returnValue(of(canceledReceta));
    recetaService.getAll.and.returnValue(of(mockRecetas));

    component.cancelarReceta(1);

    expect(recetaService.cancelar).toHaveBeenCalledWith(1);
  });

  it('should delete receta', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    recetaService.delete.and.returnValue(of(void 0));
    recetaService.getAll.and.returnValue(of(mockRecetas));

    component.deleteReceta(1);

    expect(recetaService.delete).toHaveBeenCalledWith(1);
  });

  it('should get correct estado class', () => {
    expect(component.getEstadoClass('activa')).toBe('estado-activa');
    expect(component.getEstadoClass('vencida')).toBe('estado-vencida');
    expect(component.getEstadoClass('cancelada')).toBe('estado-cancelada');
  });
});
