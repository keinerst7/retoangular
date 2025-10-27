import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecaudoService, Recaudo } from '../../services/recaudo.service';

@Component({
  selector: 'app-recaudos-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recaudos-grid.component.html',
  styleUrls: ['./recaudos-grid.component.css']
})
export class RecaudosGridComponent implements OnInit {
  recaudos: Recaudo[] = [];
  recaudosFiltrados: Recaudo[] = [];
  cargando: boolean = false;
  error: string = '';

  // Filtros
  filtroEstacion: string = '';
  filtroSentido: string = '';
  filtroCategoria: string = '';

  constructor(private recaudoService: RecaudoService) { }

  ngOnInit(): void {
    this.cargarRecaudos();
  }

  cargarRecaudos(): void {
    this.cargando = true;
    this.error = '';

    this.recaudoService.getRecaudos().subscribe({
      next: (data) => {
        this.recaudos = data;
        this.recaudosFiltrados = data;
        this.cargando = false;
        console.log('Recaudos cargados:', data.length);
      },
      error: (err) => {
        this.error = 'Error al cargar los datos. Verifica que la API esté corriendo.';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  aplicarFiltros(): void {
    this.recaudosFiltrados = this.recaudos.filter(recaudo => {
      const cumpleEstacion = !this.filtroEstacion || 
        recaudo.estacion.toLowerCase().includes(this.filtroEstacion.toLowerCase());
      
      const cumpleSentido = !this.filtroSentido || 
        recaudo.sentido.toLowerCase().includes(this.filtroSentido.toLowerCase());
      
      const cumpleCategoria = !this.filtroCategoria || 
        recaudo.categoria.toLowerCase().includes(this.filtroCategoria.toLowerCase());

      return cumpleEstacion && cumpleSentido && cumpleCategoria;
    });
  }

  limpiarFiltros(): void {
    this.filtroEstacion = '';
    this.filtroSentido = '';
    this.filtroCategoria = '';
    this.recaudosFiltrados = this.recaudos;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-CO');
  }

  formatearValor(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  }
}