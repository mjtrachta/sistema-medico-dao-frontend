import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente, HistoriaClinica, Receta } from '../../../models';
import { PacienteService } from '../../../services/paciente.service';
import { HistoriaClinicaService } from '../../../services/historia-clinica.service';
import { RecetaService } from '../../../services/receta.service';
import { formatDateDDMMYYYY } from '../../../utils/date-utils';

@Component({
  selector: 'app-paciente-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paciente-detalle.component.html',
  styleUrl: './paciente-detalle.component.css'
})
export class PacienteDetalleComponent implements OnInit {
  pacienteId!: number;
  paciente: Paciente | null = null;
  historias: HistoriaClinica[] = [];
  recetas: Receta[] = [];
  loading = false;
  error: string | null = null;
  formatDateDDMMYYYY = formatDateDDMMYYYY;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private historiaService: HistoriaClinicaService,
    private recetaService: RecetaService
  ) {}

  ngOnInit() {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPacienteData();
  }

  loadPacienteData() {
    this.loading = true;
    this.pacienteService.getById(this.pacienteId).subscribe({
      next: (paciente) => {
        this.paciente = paciente;
        this.loadHistorias();
        this.loadRecetas();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando datos del paciente';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadHistorias() {
    this.historiaService.getByPaciente(this.pacienteId).subscribe({
      next: (historias) => {
        this.historias = historias;
      },
      error: (err) => console.error(err)
    });
  }

  loadRecetas() {
    this.recetaService.getByPaciente(this.pacienteId).subscribe({
      next: (recetas) => {
        this.recetas = recetas;
      },
      error: (err) => console.error(err)
    });
  }

  crearReceta() {
    this.router.navigate(['/recetas/nueva'], {
      queryParams: { pacienteId: this.pacienteId }
    });
  }

  volver() {
    this.router.navigate(['/pacientes/mis-pacientes']);
  }
}
