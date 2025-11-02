import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ReporteTurnosPorMedico,
  ReporteTurnosPorEspecialidad,
  ReportePacientesAtendidos,
  ReporteEstadisticasAsistencia
} from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) { }

  turnosPorMedico(medicoId: number, fechaInicio: string, fechaFin: string): Observable<ReporteTurnosPorMedico> {
    const params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);
    
    return this.http.get<ReporteTurnosPorMedico>(`${this.apiUrl}/turnos-por-medico/${medicoId}`, { params });
  }

  turnosPorEspecialidad(especialidadId: number, fechaInicio: string, fechaFin: string): Observable<ReporteTurnosPorEspecialidad> {
    const params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);

    return this.http.get<ReporteTurnosPorEspecialidad>(`${this.apiUrl}/turnos-por-especialidad/${especialidadId}`, { params });
  }

  pacientesAtendidos(fechaInicio: string, fechaFin: string, medicoId?: number, especialidadId?: number): Observable<ReportePacientesAtendidos> {
    let params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);
    
    if (medicoId) params = params.set('medico_id', medicoId.toString());
    if (especialidadId) params = params.set('especialidad_id', especialidadId.toString());
    
    return this.http.get<ReportePacientesAtendidos>(`${this.apiUrl}/pacientes-atendidos`, { params });
  }

  estadisticasAsistencia(fechaInicio?: string, fechaFin?: string, medicoId?: number): Observable<ReporteEstadisticasAsistencia> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fecha_inicio', fechaInicio);
    if (fechaFin) params = params.set('fecha_fin', fechaFin);
    if (medicoId) params = params.set('medico_id', medicoId.toString());
    
    return this.http.get<ReporteEstadisticasAsistencia>(`${this.apiUrl}/estadisticas-asistencia`, { params });
  }
}
