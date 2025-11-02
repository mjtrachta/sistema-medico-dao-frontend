import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoriaClinicaService } from '../../../services/historia-clinica.service';
import { TurnoService } from '../../../services/turno.service';
import { Turno } from '../../../models';

@Component({
  selector: 'app-historia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historia-form.component.html',
  styleUrl: './historia-form.component.css'
})
export class HistoriaFormComponent implements OnInit {
  historiaForm: FormGroup;
  turnoId: number | null = null;
  turno: Turno | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private historiaService: HistoriaClinicaService,
    private turnoService: TurnoService
  ) {
    this.historiaForm = this.fb.group({
      diagnostico: ['', Validators.required],
      tratamiento: [''],
      observaciones: [''],
      // Signos vitales opcionales
      presion_arterial: [''],
      temperatura: [''],
      frecuencia_cardiaca: [''],
      peso: [''],
      altura: ['']
    });
  }

  ngOnInit() {
    // Obtener turnoId de query params
    this.route.queryParams.subscribe(params => {
      if (params['turnoId']) {
        this.turnoId = Number(params['turnoId']);
        this.loadTurno();
      }
    });
  }

  loadTurno() {
    if (!this.turnoId) return;

    this.turnoService.getById(this.turnoId).subscribe({
      next: (turno) => {
        this.turno = turno;
      },
      error: (err) => {
        console.error('Error cargando turno:', err);
      }
    });
  }

  onSubmit() {
    if (this.historiaForm.valid && this.turnoId) {
      this.loading = true;
      this.error = null;

      const formValue = this.historiaForm.value;

      // Construir el objeto con signos vitales solo si hay al menos uno
      const signosVitales: any = {};
      if (formValue.presion_arterial) signosVitales.presion_arterial = formValue.presion_arterial;
      if (formValue.temperatura) signosVitales.temperatura = Number(formValue.temperatura);
      if (formValue.frecuencia_cardiaca) signosVitales.frecuencia_cardiaca = Number(formValue.frecuencia_cardiaca);
      if (formValue.peso) signosVitales.peso = Number(formValue.peso);
      if (formValue.altura) signosVitales.altura = Number(formValue.altura);

      const historiaData: any = {
        turno_id: this.turnoId,
        diagnostico: formValue.diagnostico,
        tratamiento: formValue.tratamiento || undefined,
        observaciones: formValue.observaciones || undefined
      };

      // Solo agregar signos vitales si hay al menos uno
      if (Object.keys(signosVitales).length > 0) {
        historiaData.signos_vitales = signosVitales;
      }

      this.historiaService.create(historiaData).subscribe({
        next: () => {
          this.loading = false;
          // Volver a la vista de atención
          this.router.navigate(['/turnos', this.turnoId, 'atender']);
        },
        error: (err) => {
          this.error = err.error?.error || 'Error creando historia clínica';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  cancelar() {
    if (this.turnoId) {
      this.router.navigate(['/turnos', this.turnoId, 'atender']);
    } else {
      this.router.navigate(['/historias-clinicas']);
    }
  }
}
