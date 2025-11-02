import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno, DisponibilidadHorario } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = `${environment.apiUrl}/turnos`;

  constructor(private http: HttpClient) { }

  getAll(filters?: any): Observable<Turno[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<Turno[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Turno> {
    return this.http.get<Turno>(`${this.apiUrl}/${id}`);
  }

  create(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, turno);
  }

  cancelar(id: number): Observable<Turno> {
    return this.http.patch<Turno>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  confirmar(id: number): Observable<Turno> {
    return this.http.patch<Turno>(`${this.apiUrl}/${id}/confirmar`, {});
  }

  completar(id: number): Observable<Turno> {
    return this.http.patch<Turno>(`${this.apiUrl}/${id}/completar`, {});
  }

  ausente(id: number): Observable<Turno> {
    return this.http.patch<Turno>(`${this.apiUrl}/${id}/ausente`, {});
  }

  marcarAusente(id: number): Observable<Turno> {
    return this.ausente(id);
  }

  update(id: number, turno: Partial<Turno>): Observable<Turno> {
    return this.http.put<Turno>(`${this.apiUrl}/${id}`, turno);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDisponibilidad(medicoId: number, fecha: string, duracion: number): Observable<DisponibilidadHorario> {
    const params = new HttpParams()
      .set('medico_id', medicoId.toString())
      .set('fecha', fecha)
      .set('duracion', duracion.toString());

    return this.http.get<DisponibilidadHorario>(`${this.apiUrl}/disponibilidad`, { params });
  }

  getFechasDisponibles(medicoId: number, dias: number = 30, duracion: number = 30): Observable<any> {
    const params = new HttpParams()
      .set('medico_id', medicoId.toString())
      .set('dias', dias.toString())
      .set('duracion', duracion.toString());

    return this.http.get<any>(`${this.apiUrl}/fechas-disponibles`, { params });
  }
}
