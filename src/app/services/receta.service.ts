import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receta } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private apiUrl = `${environment.apiUrl}/recetas`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Receta[]> {
    return this.http.get<Receta[]>(this.apiUrl);
  }

  getById(id: number): Observable<Receta> {
    return this.http.get<Receta>(`${this.apiUrl}/${id}`);
  }

  getByPaciente(pacienteId: number, soloActivas: boolean = false): Observable<Receta[]> {
    const url = `${this.apiUrl}/paciente/${pacienteId}${soloActivas ? '?solo_activas=true' : ''}`;
    return this.http.get<Receta[]>(url);
  }

  create(receta: Receta): Observable<Receta> {
    return this.http.post<Receta>(this.apiUrl, receta);
  }

  cancelar(id: number): Observable<Receta> {
    return this.http.patch<Receta>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  update(id: number, receta: Partial<Receta>): Observable<Receta> {
    return this.http.put<Receta>(`${this.apiUrl}/${id}`, receta);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
