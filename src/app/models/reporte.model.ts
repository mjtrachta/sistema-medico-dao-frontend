export interface ReporteTurnosPorMedico {
  medico_id?: number;
  medico_nombre?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  total_turnos: number;
  confirmados: number;
  completados: number;
  cancelados: number;
  ausentes: number;
  medico?: {
    id: number;
    nombre_completo: string;
    matricula: string;
  };
  periodo?: {
    inicio: string;
    fin: string;
  };
  turnos?: any[];
  estadisticas?: {
    total: number;
    completados: number;
    cancelados: number;
    pendientes: number;
  };
}

export interface ReporteTurnosPorEspecialidad {
  especialidad_id?: number;
  especialidad_nombre?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  total_turnos: number;
  total_medicos: number;
  medicos_turnos: Array<{
    medico_id: number;
    medico_nombre: string;
    total: number;
  }>;
  especialidad?: {
    id: number;
    nombre: string;
  };
  completados?: number;
  cancelados?: number;
  pendientes?: number;
}

export interface ReportePacientesAtendidos {
  fecha_inicio?: string;
  fecha_fin?: string;
  total_pacientes: number;
  pacientes: Array<{
    paciente_id?: number;
    id?: number;
    paciente_nombre?: string;
    nombre_completo?: string;
    nro_historia_clinica?: string;
    total_consultas?: number;
    consultas?: number;
    ultima_consulta?: string;
  }>;
  periodo?: {
    inicio: string;
    fin: string;
  };
  filtros?: {
    medico_id?: number;
    especialidad_id?: number;
  };
}

export interface ReporteEstadisticasAsistencia {
  fecha_inicio?: string;
  fecha_fin?: string;
  total_turnos: number;
  completados: number;
  cancelados: number;
  ausentes: number;
  porcentaje_completados: number;
  porcentaje_cancelados: number;
  porcentaje_ausentes: number;
  periodo?: {
    inicio?: string;
    fin?: string;
  };
  resumen?: {
    total_turnos: number;
    completados: number;
    cancelados: number;
    pendientes: number;
    tasa_asistencia: number;
    tasa_cancelacion: number;
  };
  por_mes?: Array<{
    mes: string;
    completados: number;
    cancelados: number;
    pendientes: number;
  }>;
}
