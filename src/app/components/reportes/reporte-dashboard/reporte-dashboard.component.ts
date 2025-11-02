import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReporteService } from '../../../services/reporte.service';
import { MedicoService } from '../../../services/medico.service';
import { EspecialidadService } from '../../../services/especialidad.service';
import {
  ReporteTurnosPorMedico,
  ReporteTurnosPorEspecialidad,
  ReportePacientesAtendidos,
  ReporteEstadisticasAsistencia,
  Medico,
  Especialidad
} from '../../../models';

@Component({
  selector: 'app-reporte-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reporte-dashboard.component.html',
  styleUrl: './reporte-dashboard.component.css'
})
export class ReporteDashboardComponent implements OnInit {
  reporteForm: FormGroup;
  medicos: Medico[] = [];
  especialidades: Especialidad[] = [];

  reporteTurnosMedico: ReporteTurnosPorMedico | null = null;
  reporteTurnosEspecialidad: ReporteTurnosPorEspecialidad | null = null;
  reportePacientes: ReportePacientesAtendidos | null = null;
  reporteAsistencia: ReporteEstadisticasAsistencia | null = null;

  tipoReporte: string = '';
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reporteService: ReporteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService
  ) {
    this.reporteForm = this.fb.group({
      tipo: ['', Validators.required],
      medico_id: [''],
      especialidad_id: [''],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMedicos();
    this.loadEspecialidades();

    this.reporteForm.get('tipo')?.valueChanges.subscribe(tipo => {
      this.tipoReporte = tipo;
      this.limpiarReportes();
    });
  }

  loadMedicos() {
    this.medicoService.getAll().subscribe({
      next: (data) => this.medicos = data,
      error: (err) => console.error(err)
    });
  }

  loadEspecialidades() {
    this.especialidadService.getAll().subscribe({
      next: (data) => this.especialidades = data,
      error: (err) => console.error(err)
    });
  }

  limpiarReportes() {
    this.reporteTurnosMedico = null;
    this.reporteTurnosEspecialidad = null;
    this.reportePacientes = null;
    this.reporteAsistencia = null;
  }

  generarReporte() {
    if (this.reporteForm.valid) {
      this.loading = true;
      this.error = null;
      this.limpiarReportes();

      const fechaInicio = this.reporteForm.value.fecha_inicio;
      const fechaFin = this.reporteForm.value.fecha_fin;

      switch (this.tipoReporte) {
        case 'turnos_medico':
          const medicoId = this.reporteForm.value.medico_id;
          if (!medicoId) {
            this.error = 'Debe seleccionar un médico';
            this.loading = false;
            return;
          }
          this.reporteService.turnosPorMedico(medicoId, fechaInicio, fechaFin).subscribe({
            next: (data) => {
              this.reporteTurnosMedico = data;
              this.loading = false;
            },
            error: (err) => {
              this.error = 'Error generando reporte';
              this.loading = false;
              console.error(err);
            }
          });
          break;

        case 'turnos_especialidad':
          const especialidadId = this.reporteForm.value.especialidad_id;
          if (!especialidadId) {
            this.error = 'Debe seleccionar una especialidad';
            this.loading = false;
            return;
          }
          this.reporteService.turnosPorEspecialidad(especialidadId, fechaInicio, fechaFin).subscribe({
            next: (data) => {
              this.reporteTurnosEspecialidad = data;
              this.loading = false;
            },
            error: (err) => {
              this.error = 'Error generando reporte';
              this.loading = false;
              console.error(err);
            }
          });
          break;

        case 'pacientes_atendidos':
          this.reporteService.pacientesAtendidos(fechaInicio, fechaFin).subscribe({
            next: (data) => {
              this.reportePacientes = data;
              this.loading = false;
            },
            error: (err) => {
              this.error = 'Error generando reporte';
              this.loading = false;
              console.error(err);
            }
          });
          break;

        case 'estadisticas_asistencia':
          this.reporteService.estadisticasAsistencia(fechaInicio, fechaFin).subscribe({
            next: (data) => {
              this.reporteAsistencia = data;
              this.loading = false;
            },
            error: (err) => {
              this.error = 'Error generando reporte';
              this.loading = false;
              console.error(err);
            }
          });
          break;

        default:
          this.error = 'Tipo de reporte no válido';
          this.loading = false;
      }
    }
  }
}
