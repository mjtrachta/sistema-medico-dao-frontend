import { Especialidad } from './especialidad.model';

export interface Medico {
  id?: number;
  nombre: string;
  apellido: string;
  matricula: string;
  especialidad_id: number;
  especialidad?: Especialidad;
  email?: string;
  telefono?: string;
  activo?: boolean;
  nombre_completo?: string;
}
