import { Paciente } from './paciente.model';
import { Medico } from './medico.model';

export interface HistoriaClinica {
  id?: number;
  paciente_id: number;
  medico_id: number;
  turno_id?: number;
  fecha: string;
  fecha_consulta?: string;
  motivo_consulta?: string;
  diagnostico: string;
  tratamiento?: string;
  observaciones?: string;
  antecedentes?: string;
  signos_vitales?: {
    presion_arterial?: string;
    temperatura?: number;
    frecuencia_cardiaca?: number;
    peso?: number;
    altura?: number;
  };
  paciente?: Paciente;
  medico?: Medico;
}
