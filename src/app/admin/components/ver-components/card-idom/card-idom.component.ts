import { Component, Input } from '@angular/core';
import { IOperator } from '@data/operator.metadata';

@Component({
  selector: 'app-card-idom',
  templateUrl: './card-idom.component.html',
  styleUrls: ['./card-idom.component.scss']
})
export class CardIDomComponent {
  @Input() empresa: IOperator = null;  // Objeto que contiene toda la información de la empresa
  @Input() title: string = 'Empresa';
  public baseUrl = localStorage.getItem('url-backend');
  
  // Cálculo de la vigencia: días restantes hasta la fecha de vencimiento
  get vigencia(): number {
    if (!this.empresa || !this.empresa.fecha_expiracion) return 0;
    const today = new Date();
    const expDate = new Date(this.empresa.fecha_expiracion);
    const diffTime = expDate.getTime() - today.getTime();
    return Math.floor(diffTime / (1000 * 3600 * 24)); // Diferencia en días
  }

  // Determinar el estado de la empresa: "Vigente", "Por Vencer", "Vencido"
  get estado(): string {
    if (this.vigencia > 10) {
      return 'Vigente';
    } else if (this.vigencia >= 0 && this.vigencia <= 10) {
      return 'Por Vencer';
    } else {
      return 'Vencido';
    }
  }

  // Determinar la clase de color según el estado
  get cardClass(): string {
    switch (this.estado) {
      case 'Vigente':
        return 'bg-green-100';  // Color verde claro
      case 'Por Vencer':
        return 'bg-yellow-100'; // Color amarillo
      case 'Vencido':
        return 'bg-red-200';    // Color rojo oscuro
      default:
        return '';
    }
  }
  getActividades(): string {
    let actividades = [];
  
    if (this.empresa?.act_ben_concentracion === 1) actividades.push('Concentración');
    if (this.empresa?.act_comer_externa === 1) actividades.push('Comercio Externo');
    if (this.empresa?.act_comer_interna === 1) actividades.push('Comercio Interno');
    if (this.empresa?.act_exploracion === 1) actividades.push('Exploración');
    if (this.empresa?.act_explotacion === 1) actividades.push('Explotación');
    if (this.empresa?.act_fundicion === 1) actividades.push('Fundición');
    if (this.empresa?.act_tostacion === 1) actividades.push('Tostación');
    if (this.empresa?.act_calcinacion === 1) actividades.push('Calcinación');
    if (this.empresa?.act_industrializacion === 1) actividades.push('Industrialización');
    if (this.empresa?.act_refinacion === 1) actividades.push('Refinación');
    if (this.empresa?.act_tras_colas === 1) actividades.push('Traslado Colas');
  
    return actividades.length ? actividades.join(', ') : 'No hay actividades seleccionadas';
  }
}
