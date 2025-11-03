import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HistoriaFormComponent } from './historia-form.component';

describe('HistoriaFormComponent', () => {
  let component: HistoriaFormComponent;
  let fixture: ComponentFixture<HistoriaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaFormComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => null }),
            queryParams: of({})
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
