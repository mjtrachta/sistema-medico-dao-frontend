export interface User {
  id: number;
  nombre_usuario: string;
  email: string;
  rol: 'admin' | 'medico' | 'paciente' | 'recepcionista';
  activo: boolean;
  creado_en?: string;
  paciente_id?: number;
  medico_id?: number;
  matricula?: string;
  nro_historia_clinica?: string;
  nombre_completo?: string;
  especialidad?: {
    id: number;
    nombre: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  usuario: User;
  access_token: string;
  refresh_token: string;
  paciente_id?: number;
  medico_id?: number;
}

export interface RegisterPacienteRequest {
  nombre_usuario: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  nro_documento: string;
  fecha_nacimiento: string;
  genero: string;
  telefono?: string;
}

export interface RegisterMedicoRequest {
  token: string;
  nombre_usuario: string;
  password: string;
  nombre: string;
  apellido: string;
  matricula: string;
  especialidad_id: number;
  telefono?: string;
}
