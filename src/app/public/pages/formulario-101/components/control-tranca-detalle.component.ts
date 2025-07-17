// Crea un nuevo componente para el detalle (tranca-detail.component.ts)
import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  template: `
    <div *ngIf="tranca">
      <p><strong>Puesto de Control:</strong> {{ tranca.nombre_tranca }}</p>
      <p><strong>Funcionario:</strong> {{ tranca.nombre_funcionario }}</p>
      <p><strong>Fecha:</strong> {{ tranca.fecha_inspeccion | date:'dd/MM/yyyy' }}</p>
      <p><strong>Hora:</strong> {{ tranca.fecha_inspeccion | date:'HH:mm' }}</p>
      <p><strong>Observaciones:</strong> {{ tranca.observaciones || 'Ninguna' }}</p>
      <!-- Añade más campos según necesites -->
    </div>
  `
})
export class TrancaDetailComponent {
  tranca: any;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    this.tranca = this.config.data.trancaData;
  }
}
