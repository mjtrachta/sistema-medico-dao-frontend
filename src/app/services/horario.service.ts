import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HorarioMedico } from '../models/horario.model';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = `${environment.apiUrl}/horarios`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los horarios según el rol del usuario.
   * Médicos: solo sus horarios
   * Admin: todos los horarios o filtrados
   */
  getAll(params?: { medico_id?: number; ubicacion_id?: number; solo_activos?: boolean }): Observable<HorarioMedico[]> {
    let httpParams = new HttpParams();

    if (params?.medico_id) {
      httpParams = httpParams.set('medico_id', params.medico_id.toString());
    }
    if (params?.ubicacion_id) {
      httpParams = httpParams.set('ubicacion_id', params.ubicacion_id.toString());
    }
    if (params?.solo_activos !== undefined) {
      httpParams = httpParams.set('solo_activos', params.solo_activos.toString());
    }

    return this.http.get<HorarioMedico[]>(this.apiUrl, { params: httpParams });
  }

  /**
   * Obtiene un horario por ID
   */
  getById(id: number): Observable<HorarioMedico> {
    return this.http.get<HorarioMedico>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo horario
   * Médicos: crea su propio horario (no necesita medico_id)
   * Admin: debe especificar medico_id
   */
  create(horario: Partial<HorarioMedico>): Observable<any> {
    return this.http.post<any>(this.apiUrl, horario);
  }

  /**
   * Actualiza un horario existente
   */
  update(id: number, horario: Partial<HorarioMedico>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, horario);
  }

  /**
   * Desactiva un horario (soft delete)
   */
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene horarios de un médico en una ubicación específica
   * Útil para mostrar disponibilidad al sacar turnos
   */
  getHorariosMedicoUbicacion(medicoId: number, ubicacionId: number, diaSemana?: string): Observable<HorarioMedico[]> {
    let params = new HttpParams();
    if (diaSemana) {
      params = params.set('dia_semana', diaSemana);
    }

    return this.http.get<HorarioMedico[]>(
      `${this.apiUrl}/medico/${medicoId}/ubicacion/${ubicacionId}`,
      { params }
    );
  }
}
