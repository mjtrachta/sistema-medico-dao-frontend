import { Paciente } from './paciente.model';
import { Medico } from './medico.model';

export interface Turno {
  id?: number;
  codigo_turno?: string;
  paciente_id: number;
  paciente?: Paciente;
  medico_id: number;
  medico?: Medico;
  ubicacion_id: number;
  fecha: string;
  hora: string;
  duracion_min: number;
  estado?: 'pendiente' | 'confirmado' | 'completado' | 'cancelado' | 'ausente';
  motivo_consulta?: string;
  observaciones?: string;
  fecha_creacion?: string;
}

export interface DisponibilidadHorario {
  fecha: string;
  horarios_disponibles: string[];
}
