import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TurnoService } from '../../../services/turno.service';
import { MedicoService } from '../../../services/medico.service';
import { PacienteService } from '../../../services/paciente.service';
import { UbicacionService } from '../../../services/ubicacion.service';
import { AuthService } from '../../../services/auth.service';
import { Medico, Paciente, Ubicacion } from '../../../models';
import { formatDateDDMMYYYY } from '../../../utils/date-utils';

@Component({
  selector: 'app-turno-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './turno-form.component.html',
  styleUrl: './turno-form.component.css'
})
export class TurnoFormComponent implements OnInit {
  turnoForm: FormGroup;
  medicos: Medico[] = [];
  pacientes: Paciente[] = [];
  ubicaciones: Ubicacion[] = [];
  fechasDisponibles: any[] = [];
  horariosDisponibles: string[] = [];
  loading = false;
  loadingFechas = false;
  loadingHorarios = false;
  error: string | null = null;
  isPaciente = false;
  isAdminOrRecepcionista = false;
  formatDateDDMMYYYY = formatDateDDMMYYYY;

  constructor(
    private fb: FormBuilder,
    private turnoService: TurnoService,
    private medicoService: MedicoService,
    private pacienteService: PacienteService,
    private ubicacionService: UbicacionService,
    private authService: AuthService,
    public router: Router
  ) {
    // Detectar rol del usuario
    this.isPaciente = this.authService.isPaciente();
    this.isAdminOrRecepcionista = this.authService.isAdmin() || this.authService.isRecepcionista();

    // Construir formulario según rol
    this.turnoForm = this.fb.group({
      paciente_id: [{ value: '', disabled: this.isPaciente }, this.isPaciente ? [] : Validators.required],
      medico_id: ['', Validators.required],
      ubicacion_id: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      // Pacientes y médicos usan duración fija de 30 min, solo admin/recepcionista pueden modificarla
      duracion_min: [
        { value: 30, disabled: !this.isAdminOrRecepcionista },
        [Validators.required, Validators.min(15)]
      ],
      motivo_consulta: ['']
    });
  }

  ngOnInit() {
    this.loadMedicos();
    this.loadPacientes();
    this.loadUbicaciones();

    // Cargar fechas disponibles cuando cambie el médico
    this.turnoForm.get('medico_id')?.valueChanges.subscribe(() => {
      this.loadFechasDisponibles();
      // Resetear fecha y horarios cuando cambia médico
      this.turnoForm.patchValue({ fecha: '', hora: '' });
      this.horariosDisponibles = [];
    });

    // Cargar horarios disponibles cuando cambien fecha o duración
    this.turnoForm.get('fecha')?.valueChanges.subscribe(() => this.checkDisponibilidad());
    this.turnoForm.get('duracion_min')?.valueChanges.subscribe(() => this.checkDisponibilidad());
  }

  loadMedicos() {
    this.medicoService.getAll().subscribe({
      next: (data) => this.medicos = data,
      error: (err) => console.error(err)
    });
  }

  loadPacientes() {
    this.pacienteService.getAll().subscribe({
      next: (data) => this.pacientes = data,
      error: (err) => console.error(err)
    });
  }

  loadUbicaciones() {
    this.ubicacionService.getAll().subscribe({
      next: (data) => this.ubicaciones = data,
      error: (err) => console.error(err)
    });
  }

  loadFechasDisponibles() {
    const medicoId = this.turnoForm.get('medico_id')?.value;
    const duracion = this.turnoForm.get('duracion_min')?.value || 30;

    if (!medicoId) {
      this.fechasDisponibles = [];
      return;
    }

    this.loadingFechas = true;
    this.turnoService.getFechasDisponibles(medicoId, 30, duracion).subscribe({
      next: (data) => {
        this.fechasDisponibles = data.fechas_disponibles || [];
        this.loadingFechas = false;
      },
      error: (err) => {
        console.error(err);
        this.fechasDisponibles = [];
        this.loadingFechas = false;
      }
    });
  }

  selectFecha(fecha: string) {
    this.turnoForm.patchValue({ fecha });
  }

  checkDisponibilidad() {
    const medicoId = this.turnoForm.get('medico_id')?.value;
    const fecha = this.turnoForm.get('fecha')?.value;
    const duracion = this.turnoForm.get('duracion_min')?.value;

    if (medicoId && fecha && duracion) {
      this.loadingHorarios = true;
      this.turnoService.getDisponibilidad(medicoId, fecha, duracion).subscribe({
        next: (data) => {
          this.horariosDisponibles = data.horarios_disponibles;
          this.loadingHorarios = false;
        },
        error: (err) => {
          console.error(err);
          this.horariosDisponibles = [];
          this.loadingHorarios = false;
        }
      });
    } else {
      this.horariosDisponibles = [];
    }
  }

  selectHorario(hora: string) {
    this.turnoForm.patchValue({ hora });
  }

  onSubmit() {
    if (this.turnoForm.valid) {
      this.loading = true;
      this.error = null;

      // Usar getRawValue() para incluir campos deshabilitados (duracion_min para pacientes)
      const formData = this.turnoForm.getRawValue();

      // Remover paciente_id si es paciente (backend lo asigna automáticamente)
      if (this.isPaciente) {
        delete formData.paciente_id;
      }

      this.turnoService.create(formData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/turnos']);
        },
        error: (err) => {
          this.error = err.error?.error || 'Error creando turno';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}
