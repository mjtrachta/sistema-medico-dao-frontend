export interface Paciente {
  id?: number;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  nro_documento: string;
  nro_historia_clinica?: string;
  fecha_nacimiento: string;
  genero: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigo_postal?: string;
  obra_social?: string;
  nro_afiliado?: string;
  activo?: boolean;
  fecha_registro?: string;
  nombre_completo?: string;
}
