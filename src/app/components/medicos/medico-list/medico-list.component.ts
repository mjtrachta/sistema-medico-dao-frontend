import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Medico } from '../../../models';
import { MedicoService } from '../../../services/medico.service';
import { EspecialidadService } from '../../../services/especialidad.service';

@Component({
  selector: 'app-medico-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medico-list.component.html',
  styleUrl: './medico-list.component.css'
})
export class MedicoListComponent implements OnInit {
  medicos: Medico[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService
  ) {}

  ngOnInit() {
    this.loadMedicos();
  }

  loadMedicos() {
    this.loading = true;
    this.medicoService.getAll().subscribe({
      next: (data) => {
        this.medicos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando médicos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteMedico(id: number) {
    if (confirm('¿Está seguro de eliminar este médico?')) {
      this.medicoService.delete(id).subscribe({
        next: () => this.loadMedicos(),
        error: (err) => console.error(err)
      });
    }
  }
}
