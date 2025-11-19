import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HistoriaClinica } from '../../../models';
import { HistoriaClinicaService } from '../../../services/historia-clinica.service';

// Interface para agrupar historias por paciente
interface PacienteHistorial {
  paciente_id: number;
  paciente_nombre: string;
  nro_historia_clinica?: string;
  historias: HistoriaClinica[];
  expanded: boolean;
}

@Component({
  selector: 'app-historia-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historia-list.component.html',
  styleUrl: './historia-list.component.css'
})
export class HistoriaListComponent implements OnInit {
  historias: HistoriaClinica[] = [];
  pacientesHistorial: PacienteHistorial[] = [];
  loading = false;
  error: string | null = null;
  selectedHistoria: HistoriaClinica | null = null;
  showModal = false;

  constructor(
    private historiaService: HistoriaClinicaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadHistorias();
  }

  loadHistorias() {
    this.loading = true;
    this.historiaService.getAll().subscribe({
      next: (data) => {
        this.historias = data;
        this.groupByPaciente();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando historias clínicas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  groupByPaciente() {
    // Agrupar historias por paciente
    const grupos = new Map<number, HistoriaClinica[]>();

    this.historias.forEach(historia => {
      if (!historia.paciente_id) return;

      if (!grupos.has(historia.paciente_id)) {
        grupos.set(historia.paciente_id, []);
      }
      grupos.get(historia.paciente_id)!.push(historia);
    });

    // Convertir a array y ordenar historias dentro de cada grupo por fecha (más reciente primero)
    this.pacientesHistorial = Array.from(grupos.entries()).map(([paciente_id, historias]) => {
      // Ordenar historias por fecha descendente
      historias.sort((a, b) => {
        const fechaA = new Date(a.fecha_consulta || a.fecha);
        const fechaB = new Date(b.fecha_consulta || b.fecha);
        return fechaB.getTime() - fechaA.getTime();
      });

      return {
        paciente_id,
        paciente_nombre: historias[0].paciente?.nombre_completo || 'Sin nombre',
        nro_historia_clinica: historias[0].paciente?.nro_historia_clinica,
        historias,
        expanded: false
      };
    });

    // Ordenar pacientes por nombre
    this.pacientesHistorial.sort((a, b) =>
      a.paciente_nombre.localeCompare(b.paciente_nombre)
    );
  }

  toggleExpand(paciente: PacienteHistorial) {
    paciente.expanded = !paciente.expanded;
  }

  viewHistoria(historia: HistoriaClinica) {
    this.selectedHistoria = historia;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedHistoria = null;
  }
}
