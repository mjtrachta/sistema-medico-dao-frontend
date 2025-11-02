import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Especialidad } from '../../../models';
import { EspecialidadService } from '../../../services/especialidad.service';

@Component({
  selector: 'app-especialidad-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './especialidad-list.component.html',
  styleUrl: './especialidad-list.component.css'
})
export class EspecialidadListComponent implements OnInit {
  especialidades: Especialidad[] = [];
  loading = false;
  error: string | null = null;

  constructor(private especialidadService: EspecialidadService) {}

  ngOnInit() {
    this.loadEspecialidades();
  }

  loadEspecialidades() {
    this.loading = true;
    this.especialidadService.getAll().subscribe({
      next: (data) => {
        this.especialidades = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando especialidades';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteEspecialidad(id: number) {
    if (confirm('¿Está seguro de eliminar esta especialidad?')) {
      this.especialidadService.delete(id).subscribe({
        next: () => this.loadEspecialidades(),
        error: (err) => console.error(err)
      });
    }
  }
}
