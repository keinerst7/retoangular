import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ReporteMensual {
  periodo: string;
  totalEstaciones: number;
  totalDias: number;
  totalVehiculos: number;
  totalRecaudado: number;
  detalle: DetalleReporte[];
}

interface DetalleReporte {
  estacion: string;
  fecha: string;
  totalVehiculos: number;
  totalRecaudado: number;
  categorias?: any[];
}

@Component({
  selector: 'app-reporte-mensual',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-mensual.component.html',
  styleUrls: ['./reporte-mensual.component.css']
})
export class ReporteMensualComponent implements OnInit {
  reporte: ReporteMensual | null = null;
  cargando = false;
  error = '';
  
  anioSeleccionado = 2024;
  mesSeleccionado = 6;

  meses = [
    { valor: 1, nombre: 'Enero' },
    { valor: 2, nombre: 'Febrero' },
    { valor: 3, nombre: 'Marzo' },
    { valor: 4, nombre: 'Abril' },
    { valor: 5, nombre: 'Mayo' },
    { valor: 6, nombre: 'Junio' },
    { valor: 7, nombre: 'Julio' },
    { valor: 8, nombre: 'Agosto' },
    { valor: 9, nombre: 'Septiembre' },
    { valor: 10, nombre: 'Octubre' }
  ];

  anios = [2024];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  cargarReporte(): void {
    this.cargando = true;
    this.error = '';

    const url = `http://localhost:5187/api/Recaudos/reporte-mensual?año=${this.anioSeleccionado}&mes=${this.mesSeleccionado}`;

    this.http.get<ReporteMensual>(url).subscribe({
      next: (data) => {
        this.reporte = data;
        this.cargando = false;
        console.log('Reporte cargado:', data);
      },
      error: (err) => {
        this.error = 'Error al cargar el reporte. Verifica que la API esté corriendo.';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  formatearValor(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Obtener lista única de estaciones
  get estaciones(): string[] {
    if (!this.reporte) return [];
    const estaciones = new Set<string>();
    this.reporte.detalle.forEach(d => estaciones.add(d.estacion));
    return Array.from(estaciones).sort();
  }

  // Obtener lista única de fechas
  get fechas(): string[] {
    if (!this.reporte) return [];
    const fechas = new Set<string>();
    this.reporte.detalle.forEach(d => fechas.add(d.fecha));
    return Array.from(fechas).sort();
  }

  // Obtener dato específico por estación y fecha
  getDatosPorEstacionFecha(estacion: string, fecha: string): { vehiculos: number; recaudado: number } {
    if (!this.reporte) return { vehiculos: 0, recaudado: 0 };
    
    const dato = this.reporte.detalle.find(d => d.estacion === estacion && d.fecha === fecha);
    return {
      vehiculos: dato?.totalVehiculos || 0,
      recaudado: dato?.totalRecaudado || 0
    };
  }

  // Obtener total por estación
  getTotalPorEstacion(estacion: string): { vehiculos: number; recaudado: number } {
    if (!this.reporte) return { vehiculos: 0, recaudado: 0 };
    
    const datosEstacion = this.reporte.detalle.filter(d => d.estacion === estacion);
    return {
      vehiculos: datosEstacion.reduce((sum, d) => sum + d.totalVehiculos, 0),
      recaudado: datosEstacion.reduce((sum, d) => sum + d.totalRecaudado, 0)
    };
  }
}