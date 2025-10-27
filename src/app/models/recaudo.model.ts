/**
 * Modelo que representa un recaudo de vehículo
 */
export interface Recaudo {
  id: number;
  estacion: string;
  sentido: string;
  hora: string; 
  categoria: string;
  valorTabulado: number;
  fechaRegistro: string;
}

/**
 * Modelo para los filtros del grid
 */
export interface FiltrosRecaudo {
  estacion?: string;
  sentido?: string;
  categoria?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}