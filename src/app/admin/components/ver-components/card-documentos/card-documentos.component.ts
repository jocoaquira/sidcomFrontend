
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-documentos',
  templateUrl: './card-documentos.component.html',
  styleUrls: ['./card-documentos.component.scss']
})
export class CardDocumentosComponent {
    @Input() fechaExpiracion: Date | null = null;
    @Input() nimLink: string | null = null;
    @Input() title: string = 'Documento';
    public baseUrl = localStorage.getItem('url-backend');
  
    // Cálculo de la vigencia: días restantes hasta la fecha de vencimiento
    get vigencia(): number {
      if (!this.fechaExpiracion) return 0;
      const today = new Date();
      const expDate = new Date(this.fechaExpiracion);
      const diffTime = expDate.getTime() - today.getTime();
      return Math.floor(diffTime / (1000 * 3600 * 24)); // Diferencia en días
    }
  
    // Determinar el estado: "Vigente", "Por Vencer", "Vencido"
    get estado(): string {
      if (this.vigencia > 10) {
        return 'Vigente';
      } else if (this.vigencia >= 0 && this.vigencia <= 10) {
        return 'Por Vencer';
      } else {
        return 'Vencido';
      }
    }
    // Determinar el estado: "Vigente", "Por Vencer", "Vencido"
    get link(): string {
      return this.baseUrl + (this.nimLink ? this.nimLink.replace(/\\/g, '/') : '');
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
  
    // Descargar el archivo
    downloadFile(link: string | null) {
      if (link) {
        const a = document.createElement('a');
        a.href = link;
        a.download = link.substring(link.lastIndexOf('/') + 1); // Obtener el nombre del archivo
        // Abre el archivo en una nueva pestaña
        window.open(link, '_blank');  // '_blank' indica que se abrirá en una nueva pestaña
      }
    }
  }
  