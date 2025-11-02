import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoAtencionComponent } from './turno-atencion.component';

describe('TurnoAtencionComponent', () => {
  let component: TurnoAtencionComponent;
  let fixture: ComponentFixture<TurnoAtencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoAtencionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TurnoAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
