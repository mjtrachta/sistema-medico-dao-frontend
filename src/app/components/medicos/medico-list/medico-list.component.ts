import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Medico, Especialidad } from '../../../models';
import { MedicoService } from '../../../services/medico.service';
import { EspecialidadService } from '../../../services/especialidad.service';

@Component({
  selector: 'app-medico-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medico-list.component.html',
  styleUrl: './medico-list.component.css'
})
export class MedicoListComponent implements OnInit {
  medicos: Medico[] = [];
  especialidades: Especialidad[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Variables para edición inline
  editandoMedico: number | null = null;
  editEmail: string = '';
  editTelefono: string = '';
  editEspecialidadId: number | null = null;

  constructor(
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService
  ) {}

  ngOnInit() {
    this.loadMedicos();
    this.loadEspecialidades();
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

  loadEspecialidades() {
    this.especialidadService.getAll().subscribe({
      next: (data) => {
        this.especialidades = data;
      },
      error: (err) => {
        console.error('Error cargando especialidades:', err);
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

  startEdit(medico: Medico) {
    this.editandoMedico = medico.id!;
    this.editEmail = medico.email || '';
    this.editTelefono = medico.telefono || '';
    this.editEspecialidadId = medico.especialidad?.id || null;
    this.error = null;
    this.success = null;
  }

  saveEdit(medico: Medico) {
    if (!this.editEmail && !this.editTelefono && !this.editEspecialidadId) {
      this.error = 'Debe ingresar al menos un dato para actualizar';
      return;
    }

    const datosActualizados: any = {
      email: this.editEmail,
      telefono: this.editTelefono
    };

    if (this.editEspecialidadId) {
      datosActualizados.especialidad_id = this.editEspecialidadId;
    }

    this.medicoService.update(medico.id!, datosActualizados).subscribe({
      next: (data) => {
        // Actualizar en la lista local
        const index = this.medicos.findIndex(m => m.id === medico.id);
        if (index !== -1) {
          this.medicos[index] = data;
        }
        this.success = 'Datos del médico actualizados exitosamente';
        this.cancelEdit();
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = 'Error actualizando datos del médico';
        console.error(err);
      }
    });
  }

  cancelEdit() {
    this.editandoMedico = null;
    this.editEmail = '';
    this.editTelefono = '';
    this.editEspecialidadId = null;
  }
}
