import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecetaService } from '../../../services/receta.service';
import { TurnoService } from '../../../services/turno.service';
import { Turno } from '../../../models';

@Component({
  selector: 'app-receta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './receta-form.component.html',
  styleUrl: './receta-form.component.css'
})
export class RecetaFormComponent implements OnInit {
  recetaForm: FormGroup;
  turnoId: number | null = null;
  pacienteId: number | null = null;
  turno: Turno | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recetaService: RecetaService,
    private turnoService: TurnoService
  ) {
    this.recetaForm = this.fb.group({
      dias_validez: [30, [Validators.required, Validators.min(1)]],
      items: this.fb.array([])
    });

    // Agregar un medicamento inicial
    this.agregarMedicamento();
  }

  ngOnInit() {
    // Obtener parámetros de query params
    this.route.queryParams.subscribe(params => {
      if (params['turnoId']) {
        this.turnoId = Number(params['turnoId']);
        this.loadTurno();
      }
      if (params['pacienteId']) {
        this.pacienteId = Number(params['pacienteId']);
      }
    });
  }

  loadTurno() {
    if (!this.turnoId) return;

    this.turnoService.getById(this.turnoId).subscribe({
      next: (turno) => {
        this.turno = turno;
        if (turno.paciente?.id) {
          this.pacienteId = turno.paciente.id;
        }
        // Verificar que el turno tenga historia clínica
        if (!turno.historia_clinica_id) {
          this.error = 'El turno debe tener una historia clínica antes de crear una receta. Por favor, atienda el turno primero.';
        }
      },
      error: (err) => {
        console.error('Error cargando turno:', err);
        this.error = 'Error cargando información del turno';
      }
    });
  }

  get items(): FormArray {
    return this.recetaForm.get('items') as FormArray;
  }

  crearMedicamento(): FormGroup {
    return this.fb.group({
      nombre_medicamento: ['', Validators.required],
      dosis: ['', Validators.required],
      frecuencia: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      duracion_dias: [7, Validators.min(1)],
      instrucciones: ['']
    });
  }

  agregarMedicamento() {
    this.items.push(this.crearMedicamento());
  }

  eliminarMedicamento(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  onSubmit() {
    if (this.recetaForm.valid && this.pacienteId) {
      this.loading = true;
      this.error = null;

      const formValue = this.recetaForm.value;

      const recetaData: any = {
        paciente_id: this.pacienteId,
        dias_validez: formValue.dias_validez,
        items: formValue.items.map((item: any) => ({
          nombre_medicamento: item.nombre_medicamento,
          dosis: item.dosis,
          frecuencia: item.frecuencia,
          cantidad: Number(item.cantidad),
          duracion_dias: item.duracion_dias ? Number(item.duracion_dias) : undefined,
          instrucciones: item.instrucciones || undefined
        }))
      };

      // Agregar historia_clinica_id si viene del turno
      if (this.turno?.historia_clinica_id) {
        recetaData.historia_clinica_id = this.turno.historia_clinica_id;
      }

      this.recetaService.create(recetaData).subscribe({
        next: () => {
          this.loading = false;
          // Volver a la vista de atención si venimos de un turno
          if (this.turnoId) {
            this.router.navigate(['/turnos', this.turnoId, 'atender']);
          } else {
            this.router.navigate(['/recetas']);
          }
        },
        error: (err) => {
          this.error = err.error?.error || 'Error creando receta';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.error = 'Por favor complete todos los campos requeridos';
    }
  }

  cancelar() {
    if (this.turnoId) {
      this.router.navigate(['/turnos', this.turnoId, 'atender']);
    } else {
      this.router.navigate(['/recetas']);
    }
  }
}
