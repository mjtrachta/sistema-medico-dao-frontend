import { Paciente } from './paciente.model';
import { Medico } from './medico.model';

export interface ItemReceta {
  id?: number;
  nombre_medicamento: string;
  dosis: string;
  frecuencia: string;
  cantidad: number;
  duracion_dias?: number;
  instrucciones?: string;
}

export interface Receta {
  id?: number;
  codigo_receta?: string;
  paciente_id: number;
  medico_id: number;
  fecha?: string;
  fecha_emision: string;
  fecha_vencimiento?: string;
  diagnostico?: string;
  estado?: 'activa' | 'cancelada' | 'vencida';
  valida_hasta?: string;
  items?: ItemReceta[];
  paciente?: Paciente;
  medico?: Medico;
}
