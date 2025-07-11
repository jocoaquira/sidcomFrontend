import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cabecera-fecha',
  templateUrl: './cabecera-fecha.component.html',
  styleUrls: ['./cabecera-fecha.component.scss']
})
export class CabeceraFechaComponent {
  @Input() position: { top?: string; left?: string } = { top: '0px', left: '0px' };
  @Input() height: string = '50px';
  @Input() width: string = '50px';
  @Input() textColor: string = '#000000';
  @Input() backgroundColor: string = '#ffffff';
  @Input() text: string = 'Texto predeterminado';
}
