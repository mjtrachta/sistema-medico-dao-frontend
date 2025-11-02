import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TurnoService } from '../../../services/turno.service';
import { HistoriaClinicaService } from '../../../services/historia-clinica.service';
import { RecetaService } from '../../../services/receta.service';
import { Turno, HistoriaClinica, Receta } from '../../../models';
import { formatDateDDMMYYYY } from '../../../utils/date-utils';

@Component({
  selector: 'app-turno-atencion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './turno-atencion.component.html',
  styleUrl: './turno-atencion.component.css'
})
export class TurnoAtencionComponent implements OnInit {
  turnoId!: number;
  turno: Turno | null = null;
  historias: HistoriaClinica[] = [];
  recetas: Receta[] = [];
  loading = false;
  error: string | null = null;
  formatDateDDMMYYYY = formatDateDDMMYYYY;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private turnoService: TurnoService,
    private historiaService: HistoriaClinicaService,
    private recetaService: RecetaService
  ) {}

  ngOnInit() {
    this.turnoId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTurnoData();
  }

  loadTurnoData() {
    this.loading = true;
    this.error = null;

    this.turnoService.getById(this.turnoId).subscribe({
      next: (turno) => {
        this.turno = turno;
        if (turno.paciente?.id) {
          this.loadHistorias(turno.paciente.id);
          this.loadRecetas(turno.paciente.id);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando información del turno';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadHistorias(pacienteId: number) {
    this.historiaService.getByPaciente(pacienteId).subscribe({
      next: (historias) => {
        this.historias = historias;
      },
      error: (err) => {
        console.error('Error cargando historias:', err);
      }
    });
  }

  loadRecetas(pacienteId: number) {
    this.recetaService.getByPaciente(pacienteId).subscribe({
      next: (recetas) => {
        this.recetas = recetas;
      },
      error: (err) => {
        console.error('Error cargando recetas:', err);
      }
    });
  }

  crearHistoriaClinica() {
    // Navigate to historia clinica form
    this.router.navigate(['/historias-clinicas/nueva'], {
      queryParams: { turnoId: this.turnoId }
    });
  }

  crearReceta() {
    // Navigate to receta form
    this.router.navigate(['/recetas/nueva'], {
      queryParams: {
        turnoId: this.turnoId,
        pacienteId: this.turno?.paciente?.id
      }
    });
  }

  volver() {
    this.router.navigate(['/turnos']);
  }
}
