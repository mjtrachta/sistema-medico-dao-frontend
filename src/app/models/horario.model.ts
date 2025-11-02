import { Medico } from './medico.model';
import { Ubicacion } from './ubicacion.model';

export interface HorarioMedico {
  id?: number;
  medico_id: number;
  medico?: Medico;
  ubicacion_id: number;
  ubicacion?: Ubicacion;
  dia_semana: string;
  hora_inicio: string; // Formato: "HH:MM"
  hora_fin: string; // Formato: "HH:MM"
  activo?: boolean;
}

export const DIAS_SEMANA = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miércoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sábado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' }
];
