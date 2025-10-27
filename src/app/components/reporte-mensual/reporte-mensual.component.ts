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
  categorias: Categoria[];
}

interface Categoria {
  categoria: string;
  cantidad: number;
  total: number;
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

  get estacionesAgrupadas(): { estacion: string; datos: DetalleReporte[] }[] {
    if (!this.reporte) return [];
    
    const grupos = new Map<string, DetalleReporte[]>();
    
    this.reporte.detalle.forEach(item => {
      if (!grupos.has(item.estacion)) {
        grupos.set(item.estacion, []);
      }
      grupos.get(item.estacion)!.push(item);
    });
    
    return Array.from(grupos.entries()).map(([estacion, datos]) => ({
      estacion,
      datos: datos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    }));
  }

  getTotalPorEstacion(datos: DetalleReporte[]): { vehiculos: number; recaudado: number } {
    return {
      vehiculos: datos.reduce((sum, d) => sum + d.totalVehiculos, 0),
      recaudado: datos.reduce((sum, d) => sum + d.totalRecaudado, 0)
    };
  }
}