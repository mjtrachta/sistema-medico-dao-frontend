/**
 * Utilidades para manejo de fechas en formato DD/MM/AAAA
 */

/**
 * Convierte fecha AAAA-MM-DD a DD/MM/AAAA
 */
export function formatDateDDMMYYYY(dateStr: string | null | undefined): string {
  if (!dateStr) return '';

  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Convierte fecha DD/MM/AAAA a AAAA-MM-DD
 */
export function formatDateYYYYMMDD(dateStr: string | null | undefined): string {
  if (!dateStr) return '';

  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
}

/**
 * Convierte objeto Date a DD/MM/AAAA
 */
export function dateToString(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Convierte objeto Date a AAAA-MM-DD (para backend)
 */
export function dateToBackendFormat(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Convierte DD/MM/AAAA a objeto Date
 */
export function stringToDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  const [day, month, year] = dateStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * Obtiene fecha de hoy en formato DD/MM/AAAA
 */
export function getTodayDDMMYYYY(): string {
  return dateToString(new Date());
}

/**
 * Obtiene fecha de hoy en formato AAAA-MM-DD (para backend)
 */
export function getTodayBackendFormat(): string {
  return dateToBackendFormat(new Date());
}
