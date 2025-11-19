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

  // Variables para formulario modal
  showForm = false;
  editMode = false;
  medicoForm: any = this.resetForm();

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

  resetForm(): any {
    return {
      nombre: '',
      apellido: '',
      matricula: '',
      especialidad_id: null,
      telefono: '',
      email: ''
    };
  }

  openForm(medico?: Medico): void {
    if (medico) {
      this.editMode = true;
      this.medicoForm = { 
        nombre: medico.nombre || '',
        apellido: medico.apellido || '',
        matricula: medico.matricula,
        especialidad_id: medico.especialidad?.id || null,
        telefono: medico.telefono || '',
        email: medico.email || ''
      };
    } else {
      this.editMode = false;
      this.medicoForm = this.resetForm();
    }
    this.showForm = true;
    this.error = null;
    this.success = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.medicoForm = this.resetForm();
    this.error = null;
  }

  saveMedico(): void {
    if (!this.medicoForm.nombre || !this.medicoForm.apellido || !this.medicoForm.matricula || !this.medicoForm.especialidad_id) {
      this.error = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.error = null;

    const medicoData = {
      nombre: this.medicoForm.nombre,
      apellido: this.medicoForm.apellido,
      matricula: this.medicoForm.matricula,
      especialidad_id: this.medicoForm.especialidad_id,
      telefono: this.medicoForm.telefono || null,
      email: this.medicoForm.email || null
    };

    if (this.editMode) {
      // TODO: Implementar edición completa si es necesario
      this.loading = false;
    } else {
      this.medicoService.create(medicoData).subscribe({
        next: (data) => {
          this.success = 'Médico creado exitosamente';
          this.closeForm();
          this.loadMedicos();
          this.loading = false;
          setTimeout(() => this.success = null, 3000);
        },
        error: (err) => {
          this.error = 'Error al crear el médico';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }
}
