import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Especialidad } from '../../../models';
import { EspecialidadService } from '../../../services/especialidad.service';

@Component({
  selector: 'app-especialidad-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialidad-list.component.html',
  styleUrl: './especialidad-list.component.css'
})
export class EspecialidadListComponent implements OnInit {
  especialidades: Especialidad[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Variables para crear nueva especialidad
  modoCrear = false;
  nuevaEspecialidad: Partial<Especialidad> = {
    nombre: '',
    descripcion: '',
    duracion_turno_min: 30
  };

  // Variables para edición inline
  editandoEspecialidad: number | null = null;
  editNombre: string = '';
  editDescripcion: string = '';
  editDuracion: number = 30;

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

  toggleFormulario() {
    this.modoCrear = !this.modoCrear;
    if (!this.modoCrear) {
      this.resetNuevaEspecialidad();
    }
  }

  resetNuevaEspecialidad() {
    this.nuevaEspecialidad = {
      nombre: '',
      descripcion: '',
      duracion_turno_min: 30
    };
  }

  crearEspecialidad() {
    if (!this.nuevaEspecialidad.nombre) {
      this.error = 'El nombre es requerido';
      return;
    }

    this.especialidadService.create(this.nuevaEspecialidad).subscribe({
      next: (data) => {
        this.success = 'Especialidad creada exitosamente';
        this.loadEspecialidades();
        this.resetNuevaEspecialidad();
        this.modoCrear = false;
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = 'Error creando especialidad';
        console.error(err);
      }
    });
  }

  startEdit(especialidad: Especialidad) {
    this.editandoEspecialidad = especialidad.id!;
    this.editNombre = especialidad.nombre;
    this.editDescripcion = especialidad.descripcion || '';
    this.editDuracion = especialidad.duracion_turno_min || 30;
    this.error = null;
    this.success = null;
  }

  saveEdit(especialidad: Especialidad) {
    if (!this.editNombre) {
      this.error = 'El nombre es requerido';
      return;
    }

    const datosActualizados = {
      nombre: this.editNombre,
      descripcion: this.editDescripcion,
      duracion_turno_min: this.editDuracion
    };

    this.especialidadService.update(especialidad.id!, datosActualizados).subscribe({
      next: (data) => {
        const index = this.especialidades.findIndex(e => e.id === especialidad.id);
        if (index !== -1) {
          this.especialidades[index] = data;
        }
        this.success = 'Especialidad actualizada exitosamente';
        this.cancelEdit();
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = 'Error actualizando especialidad';
        console.error(err);
      }
    });
  }

  cancelEdit() {
    this.editandoEspecialidad = null;
    this.editNombre = '';
    this.editDescripcion = '';
    this.editDuracion = 30;
  }

  deleteEspecialidad(id: number) {
    if (confirm('¿Está seguro de desactivar esta especialidad? No se eliminará físicamente pero dejará de estar disponible.')) {
      this.especialidadService.delete(id).subscribe({
        next: () => {
          this.success = 'Especialidad desactivada exitosamente';
          this.loadEspecialidades();
          setTimeout(() => this.success = null, 3000);
        },
        error: (err) => {
          this.error = 'Error desactivando especialidad';
          console.error(err);
        }
      });
    }
  }
}
