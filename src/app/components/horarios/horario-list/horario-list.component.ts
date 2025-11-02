import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../../../services/horario.service';
import { UbicacionService } from '../../../services/ubicacion.service';
import { MedicoService } from '../../../services/medico.service';
import { AuthService } from '../../../services/auth.service';
import { HorarioMedico, DIAS_SEMANA } from '../../../models/horario.model';
import { Ubicacion } from '../../../models/ubicacion.model';
import { Medico } from '../../../models/medico.model';

@Component({
  selector: 'app-horario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horario-list.component.html',
  styleUrls: ['./horario-list.component.css']
})
export class HorarioListComponent implements OnInit {
  horarios: HorarioMedico[] = [];
  ubicaciones: Ubicacion[] = [];
  medicos: Medico[] = [];
  diasSemana = DIAS_SEMANA;

  loading = false;
  error: string | null = null;

  // Formulario
  showForm = false;
  editMode = false;
  horarioForm: Partial<HorarioMedico> = this.resetForm();

  // Filtros
  filtroMedicoId: number | null = null;
  filtroUbicacionId: number | null = null;

  constructor(
    private horarioService: HorarioService,
    private ubicacionService: UbicacionService,
    private medicoService: MedicoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadUbicaciones();
    if (this.isAdmin()) {
      this.loadMedicos();
    }
    this.loadHorarios();
  }

  loadUbicaciones(): void {
    this.ubicacionService.getAll().subscribe({
      next: (data) => {
        this.ubicaciones = data.filter(u => u.activo);
      },
      error: (err) => {
        console.error('Error al cargar ubicaciones:', err);
      }
    });
  }

  loadMedicos(): void {
    this.medicoService.getAll().subscribe({
      next: (data) => {
        this.medicos = data.filter(m => m.activo);
      },
      error: (err) => {
        console.error('Error al cargar médicos:', err);
      }
    });
  }

  loadHorarios(): void {
    this.loading = true;
    this.error = null;

    const params: any = {};
    if (this.filtroMedicoId) {
      params.medico_id = this.filtroMedicoId;
    }
    if (this.filtroUbicacionId) {
      params.ubicacion_id = this.filtroUbicacionId;
    }

    this.horarioService.getAll(params).subscribe({
      next: (data) => {
        this.horarios = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar horarios';
        console.error(err);
        this.loading = false;
      }
    });
  }

  resetForm(): Partial<HorarioMedico> {
    return {
      ubicacion_id: 0,
      dia_semana: '',
      hora_inicio: '',
      hora_fin: '',
      medico_id: 0
    };
  }

  openForm(horario?: HorarioMedico): void {
    if (horario) {
      this.editMode = true;
      this.horarioForm = { ...horario };
    } else {
      this.editMode = false;
      this.horarioForm = this.resetForm();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.horarioForm = this.resetForm();
  }

  saveHorario(): void {
    // Validaciones
    if (!this.horarioForm.ubicacion_id || this.horarioForm.ubicacion_id === 0) {
      alert('Por favor seleccione una ubicación');
      return;
    }
    if (!this.horarioForm.dia_semana) {
      alert('Por favor seleccione un día');
      return;
    }
    if (!this.horarioForm.hora_inicio || !this.horarioForm.hora_fin) {
      alert('Por favor complete las horas de inicio y fin');
      return;
    }

    // Admin debe seleccionar médico
    if (this.isAdmin() && (!this.horarioForm.medico_id || this.horarioForm.medico_id === 0)) {
      alert('Por favor seleccione un médico');
      return;
    }

    this.loading = true;

    if (this.editMode && this.horarioForm.id) {
      // Actualizar
      const updateData: any = {
        dia_semana: this.horarioForm.dia_semana,
        hora_inicio: this.horarioForm.hora_inicio,
        hora_fin: this.horarioForm.hora_fin,
        ubicacion_id: this.horarioForm.ubicacion_id
      };

      this.horarioService.update(this.horarioForm.id, updateData).subscribe({
        next: () => {
          this.loadHorarios();
          this.closeForm();
          alert('Horario actualizado exitosamente');
        },
        error: (err) => {
          alert(err.error?.error || 'Error al actualizar horario');
          this.loading = false;
        }
      });
    } else {
      // Crear
      const createData: any = {
        ubicacion_id: this.horarioForm.ubicacion_id,
        dia_semana: this.horarioForm.dia_semana,
        hora_inicio: this.horarioForm.hora_inicio,
        hora_fin: this.horarioForm.hora_fin
      };

      // Si es admin, incluir medico_id
      if (this.isAdmin()) {
        createData.medico_id = this.horarioForm.medico_id;
      }

      this.horarioService.create(createData).subscribe({
        next: () => {
          this.loadHorarios();
          this.closeForm();
          alert('Horario creado exitosamente');
        },
        error: (err) => {
          alert(err.error?.error || 'Error al crear horario');
          this.loading = false;
        }
      });
    }
  }

  deleteHorario(horario: HorarioMedico): void {
    if (!confirm(`¿Está seguro de eliminar este horario?`)) {
      return;
    }

    if (!horario.id) return;

    this.horarioService.delete(horario.id).subscribe({
      next: () => {
        this.loadHorarios();
        alert('Horario eliminado exitosamente');
      },
      error: (err) => {
        alert(err.error?.error || 'Error al eliminar horario');
      }
    });
  }

  getDiaLabel(diaValue: string): string {
    const dia = this.diasSemana.find(d => d.value === diaValue);
    return dia ? dia.label : diaValue;
  }

  getUbicacionNombre(id: number): string {
    const ubicacion = this.ubicaciones.find(u => u.id === id);
    return ubicacion ? ubicacion.nombre : 'N/A';
  }

  getMedicoNombre(id: number): string {
    const medico = this.medicos.find(m => m.id === id);
    return medico ? `${medico.nombre} ${medico.apellido}` : 'N/A';
  }

  aplicarFiltros(): void {
    this.loadHorarios();
  }

  limpiarFiltros(): void {
    this.filtroMedicoId = null;
    this.filtroUbicacionId = null;
    this.loadHorarios();
  }

  isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  isMedico(): boolean {
    return this.authService.getUserRole() === 'medico';
  }
}
