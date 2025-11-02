import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Turno } from '../../../models';
import { TurnoService } from '../../../services/turno.service';
import { AuthService } from '../../../services/auth.service';
import { formatDateDDMMYYYY } from '../../../utils/date-utils';

@Component({
  selector: 'app-turno-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turno-list.component.html',
  styleUrl: './turno-list.component.css'
})
export class TurnoListComponent implements OnInit {
  turnos: Turno[] = [];
  loading = false;
  error: string | null = null;
  isPaciente = false;
  isMedico = false;
  isAdminOrRecepcionista = false;
  formatDateDDMMYYYY = formatDateDDMMYYYY;

  constructor(
    private turnoService: TurnoService,
    private router: Router,
    private authService: AuthService
  ) {
    this.isPaciente = this.authService.isPaciente();
    this.isMedico = this.authService.isMedico();
    this.isAdminOrRecepcionista = this.authService.isAdmin() || this.authService.isRecepcionista();
  }

  ngOnInit() {
    this.loadTurnos();
  }

  loadTurnos() {
    this.loading = true;
    this.turnoService.getAll().subscribe({
      next: (data) => {
        this.turnos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando turnos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  confirmarTurno(id: number) {
    if (confirm('¿Confirmar este turno?')) {
      this.turnoService.confirmar(id).subscribe({
        next: () => this.loadTurnos(),
        error: (err) => console.error(err)
      });
    }
  }

  cancelarTurno(id: number) {
    if (confirm('¿Está seguro de cancelar este turno?')) {
      this.turnoService.cancelar(id).subscribe({
        next: () => this.loadTurnos(),
        error: (err) => console.error(err)
      });
    }
  }

  completarTurno(id: number) {
    if (confirm('¿Marcar turno como completado?')) {
      this.turnoService.completar(id).subscribe({
        next: () => this.loadTurnos(),
        error: (err) => console.error(err)
      });
    }
  }

  marcarAusente(id: number) {
    if (confirm('¿Marcar paciente como ausente?')) {
      this.turnoService.marcarAusente(id).subscribe({
        next: () => this.loadTurnos(),
        error: (err: any) => console.error(err)
      });
    }
  }

  getEstadoClass(estado: string): string {
    const estadoMap: { [key: string]: string } = {
      'pendiente': 'estado-pendiente',
      'confirmado': 'estado-confirmado',
      'completado': 'estado-completado',
      'cancelado': 'estado-cancelado',
      'ausente': 'estado-ausente'
    };
    return estadoMap[estado] || '';
  }

  // Permisos: Solo médico, admin y recepcionista pueden confirmar turnos
  canConfirmar(): boolean {
    return this.isMedico || this.isAdminOrRecepcionista;
  }

  // Permisos: Solo médico, admin y recepcionista pueden completar o marcar ausente
  canCompletar(): boolean {
    return this.isMedico || this.isAdminOrRecepcionista;
  }

  // Permisos: Pacientes solo pueden cancelar, los demás pueden cancelar cualquiera
  canCancelar(): boolean {
    return true; // Todos pueden cancelar, pero el backend valida que pacientes solo cancelen sus turnos
  }

  // Permisos: Médicos NO pueden crear turnos, solo pacientes, admin y recepcionista
  canCreateTurno(): boolean {
    return !this.isMedico;
  }

  nuevoTurno() {
    this.router.navigate(['/turnos/nuevo']);
  }

  atenderPaciente(id: number) {
    this.router.navigate(['/turnos', id, 'atender']);
  }
}

