import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recaudo {
  id: number;
  estacion: string;
  sentido: string;
  hora: string;
  categoria: string;
  valorTabulado: number;
  fechaRegistro: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecaudoService {
  private apiUrl = 'http://localhost:5187/api/Recaudos';

  constructor(private http: HttpClient) { }

  // Obtener todos los recaudos
  getRecaudos(): Observable<Recaudo[]> {
    return this.http.get<Recaudo[]>(this.apiUrl);
  }

  // Obtener recaudos por fecha
  getRecaudosPorFecha(fecha: string): Observable<Recaudo[]> {
    return this.http.get<Recaudo[]>(`${this.apiUrl}/fecha/${fecha}`);
  }

  // Obtener recaudos por estación
  getRecaudosPorEstacion(estacion: string): Observable<Recaudo[]> {
    return this.http.get<Recaudo[]>(`${this.apiUrl}/estacion/${estacion}`);
  }
}