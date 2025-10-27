import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecaudosGridComponent } from './components/recaudos-grid/recaudos-grid.component';
import { ReporteMensualComponent } from './components/reporte-mensual/reporte-mensual.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RecaudosGridComponent, ReporteMensualComponent],
  templateUrl: './app.component.html',
  styleUrls: []
})
export class App {
  title = 'RETO-ANGULAR';
  vistaActual: 'grid' | 'reporte' = 'grid';
}