import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UbicacionService } from '../../../services/ubicacion.service';
import { Ubicacion } from '../../../models/ubicacion.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ubicacion-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ubicacion-list.component.html',
  styleUrls: ['./ubicacion-list.component.css']
})
export class UbicacionListComponent implements OnInit {
  ubicaciones: Ubicacion[] = [];
  loading = false;
  error: string | null = null;

  // Formulario
  showForm = false;
  editMode = false;
  ubicacionForm: Ubicacion = this.resetForm();

  constructor(
    private ubicacionService: UbicacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUbicaciones();
  }

  loadUbicaciones(): void {
    this.loading = true;
    this.error = null;

    this.ubicacionService.getAll().subscribe({
      next: (data) => {
        this.ubicaciones = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar ubicaciones';
        console.error(err);
        this.loading = false;
      }
    });
  }

  resetForm(): Ubicacion {
    return {
      nombre: '',
      direccion: '',
      ciudad: '',
      telefono: '',
      activo: true
    };
  }

  openForm(ubicacion?: Ubicacion): void {
    if (ubicacion) {
      this.editMode = true;
      this.ubicacionForm = { ...ubicacion };
    } else {
      this.editMode = false;
      this.ubicacionForm = this.resetForm();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.ubicacionForm = this.resetForm();
  }

  saveUbicacion(): void {
    if (!this.ubicacionForm.nombre || !this.ubicacionForm.direccion || !this.ubicacionForm.ciudad) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.loading = true;

    if (this.editMode && this.ubicacionForm.id) {
      // Actualizar
      this.ubicacionService.update(this.ubicacionForm.id, this.ubicacionForm).subscribe({
        next: () => {
          this.loadUbicaciones();
          this.closeForm();
          alert('Ubicación actualizada exitosamente');
        },
        error: (err) => {
          alert(err.error?.error || 'Error al actualizar ubicación');
          this.loading = false;
        }
      });
    } else {
      // Crear
      this.ubicacionService.create(this.ubicacionForm).subscribe({
        next: () => {
          this.loadUbicaciones();
          this.closeForm();
          alert('Ubicación creada exitosamente');
        },
        error: (err) => {
          alert(err.error?.error || 'Error al crear ubicación');
          this.loading = false;
        }
      });
    }
  }

  deleteUbicacion(ubicacion: Ubicacion): void {
    if (!confirm(`¿Está seguro de eliminar la ubicación "${ubicacion.nombre}"?`)) {
      return;
    }

    if (!ubicacion.id) return;

    this.ubicacionService.delete(ubicacion.id).subscribe({
      next: () => {
        this.loadUbicaciones();
        alert('Ubicación eliminada exitosamente');
      },
      error: (err) => {
        alert(err.error?.error || 'Error al eliminar ubicación');
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }
}
