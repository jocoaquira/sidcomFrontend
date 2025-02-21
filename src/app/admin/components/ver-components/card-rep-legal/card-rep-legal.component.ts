
import { Component, Input } from '@angular/core';
import { IOperator } from '@data/operator.metadata';

@Component({
  selector: 'app-card-rep-legal',
  templateUrl: './card-rep-legal.component.html',
  styleUrls: ['./card-rep-legal.component.scss']
})
export class CardRepLegalComponent {
    @Input() operador: IOperator | null = null;
    @Input() nimLink: string | null = null;
    @Input() title: string = 'REPRESENTANTE LEGAL';
    public baseUrl = localStorage.getItem('url-backend');
  
    // Determinar el estado: "Vigente", "Por Vencer", "Vencido"
    get link(): string {
      return this.baseUrl + (this.nimLink ? this.nimLink.replace(/\\/g, '/') : '');
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
  