import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Recaudo {
  id: number;
  estacion: string;
  sentido: string;
  hora: string;
  categoria: string;
  valorTabulado: number;
  fechaRegistro: string;
}

interface RespuestaBackend {
  pagina: number;
  registrosPorPagina: number;
  totalRegistros: number;
  totalPaginas: number;
  datos: Recaudo[];
}

@Injectable({
  providedIn: 'root'
})
export class RecaudoService {
  private apiUrl = 'http://localhost:5187/api/Recaudos';

  constructor(private http: HttpClient) { }

  // Obtener recaudos con paginación
  getRecaudos(pagina: number = 1, registrosPorPagina: number = 100): Observable<{ datos: Recaudo[], totalRegistros: number, totalPaginas: number, paginaActual: number }> {
    return this.http.get<RespuestaBackend>(`${this.apiUrl}?pagina=${pagina}&registrosPorPagina=${registrosPorPagina}`)
      .pipe(
        map(response => ({
          datos: response.datos || [],
          totalRegistros: response.totalRegistros,
          totalPaginas: response.totalPaginas,
          paginaActual: response.pagina
        }))
      );
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