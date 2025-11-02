import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Paciente } from '../../../models';
import { PacienteService } from '../../../services/paciente.service';
import { formatDateDDMMYYYY } from '../../../utils/date-utils';

@Component({
  selector: 'app-mis-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-pacientes.component.html',
  styleUrl: './mis-pacientes.component.css'
})
export class MisPacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  formatDateDDMMYYYY = formatDateDDMMYYYY;

  constructor(
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPacientes();
  }

  loadPacientes() {
    this.loading = true;
    this.error = null;
    this.pacienteService.getMisPacientes(this.searchTerm || undefined).subscribe({
      next: (data) => {
        this.pacientes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando pacientes';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSearch() {
    this.loadPacientes();
  }

  verDetalle(pacienteId: number) {
    this.router.navigate(['/pacientes', pacienteId, 'detalle']);
  }
}
