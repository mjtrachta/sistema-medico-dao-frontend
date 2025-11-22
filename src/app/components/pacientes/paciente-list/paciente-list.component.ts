import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paciente } from '../../../models';
import { PacienteService } from '../../../services/paciente.service';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente-list.component.html',
  styleUrl: './paciente-list.component.css'
})
export class PacienteListComponent implements OnInit {
  pacientes: Paciente[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Variables para edición inline
  editandoPaciente: number | null = null;
  editEmail: string = '';
  editTelefono: string = '';

  // Variables para formulario modal
  showForm = false;
  editMode = false;
  pacienteForm: any = this.resetForm();

  constructor(private pacienteService: PacienteService) {}

  ngOnInit() {
    this.loadPacientes();
  }

  loadPacientes() {
    this.loading = true;
    this.pacienteService.getAll().subscribe({
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

  startEdit(paciente: Paciente) {
    this.editandoPaciente = paciente.id!;
    this.editEmail = paciente.email || '';
    this.editTelefono = paciente.telefono || '';
    this.error = null;
    this.success = null;
  }

  saveEdit(paciente: Paciente) {
    if (!this.editEmail && !this.editTelefono) {
      this.error = 'Debe ingresar al menos un dato de contacto';
      return;
    }

    const datosActualizados = {
      email: this.editEmail,
      telefono: this.editTelefono
    };

    this.pacienteService.update(paciente.id!, datosActualizados).subscribe({
      next: (data) => {
        // Actualizar en la lista local
        const index = this.pacientes.findIndex(p => p.id === paciente.id);
        if (index !== -1) {
          this.pacientes[index] = data;
        }
        this.success = 'Datos de contacto actualizados exitosamente';
        this.cancelEdit();
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = 'Error actualizando datos de contacto';
        console.error(err);
      }
    });
  }

  cancelEdit() {
    this.editandoPaciente = null;
    this.editEmail = '';
    this.editTelefono = '';
  }

  resetForm(): any {
    return {
      nombre: '',
      apellido: '',
      tipo_documento: '',
      nro_documento: '',
      fecha_nacimiento: '',
      genero: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      obra_social: '',
      nro_afiliado: ''
    };
  }

  openForm(paciente?: Paciente): void {
    if (paciente) {
      this.editMode = true;
      this.pacienteForm = { ...paciente };
    } else {
      this.editMode = false;
      this.pacienteForm = this.resetForm();
    }
    this.showForm = true;
    this.error = null;
    this.success = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.pacienteForm = this.resetForm();
    this.error = null;
  }

  savePaciente(): void {
    if (!this.pacienteForm.nombre || !this.pacienteForm.apellido || 
        !this.pacienteForm.tipo_documento || !this.pacienteForm.nro_documento ||
        !this.pacienteForm.fecha_nacimiento || !this.pacienteForm.genero) {
      this.error = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.error = null;

    const pacienteData = {
      nombre: this.pacienteForm.nombre,
      apellido: this.pacienteForm.apellido,
      tipo_documento: this.pacienteForm.tipo_documento,
      nro_documento: this.pacienteForm.nro_documento,
      fecha_nacimiento: this.pacienteForm.fecha_nacimiento,
      genero: this.pacienteForm.genero,
      email: this.pacienteForm.email || null,
      telefono: this.pacienteForm.telefono || null,
      direccion: this.pacienteForm.direccion || null,
      ciudad: this.pacienteForm.ciudad || null,
      obra_social: this.pacienteForm.obra_social || null,
      nro_afiliado: this.pacienteForm.nro_afiliado || null
    };

    if (this.editMode) {
      // TODO: Implementar edición completa si es necesario
      this.loading = false;
    } else {
      this.pacienteService.create(pacienteData).subscribe({
        next: (data) => {
          this.success = 'Paciente creado exitosamente';
          this.closeForm();
          this.loadPacientes();
          this.loading = false;
          setTimeout(() => this.success = null, 3000);
        },
        error: (err) => {
          this.error = 'Error al crear el paciente';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  deletePaciente(id: number) {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
      this.pacienteService.delete(id).subscribe({
        next: () => {
          this.success = 'Paciente eliminado exitosamente';
          this.loadPacientes();
          setTimeout(() => this.success = null, 3000);
        },
        error: (err) => {
          this.error = 'Error al eliminar el paciente';
          console.error(err);
        }
      });
    }
  }
}
