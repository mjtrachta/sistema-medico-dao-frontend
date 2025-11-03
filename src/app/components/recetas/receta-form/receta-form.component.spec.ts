import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RecetaFormComponent } from './receta-form.component';
import { RecetaService } from '../../../services/receta.service';
import { TurnoService } from '../../../services/turno.service';

describe('RecetaFormComponent', () => {
  let component: RecetaFormComponent;
  let fixture: ComponentFixture<RecetaFormComponent>;

  beforeEach(async () => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: of({})
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const recetaServiceSpy = jasmine.createSpyObj('RecetaService', ['create']);
    const turnoServiceSpy = jasmine.createSpyObj('TurnoService', ['getById']);

    await TestBed.configureTestingModule({
      imports: [RecetaFormComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: RecetaService, useValue: recetaServiceSpy },
        { provide: TurnoService, useValue: turnoServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
