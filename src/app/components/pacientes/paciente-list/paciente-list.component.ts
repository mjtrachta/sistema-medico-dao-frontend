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
}
