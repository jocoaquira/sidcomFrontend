import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-turno',
  templateUrl: './item-turno.component.html',
  styleUrls: ['./item-turno.component.scss']
})
export class ItemTurnoComponent {
  @Input() position: { top?: string; left?: string } = { top: '0px', left: '0px' };
  @Input() height: string = '50px';
  @Input() width: string = '50px';
  @Input() textColor: string = '#000000';
  @Input() backgroundColor: string = '#ffffff';
  @Input() text: string = 'Texto predeterminado';

  private dragging = false;
  private offsetX = 0;
  private offsetY = 0;

  startDrag(event: MouseEvent): void {
    this.dragging = true;
    this.offsetX = event.clientX - parseInt(this.position.left || '0', 10);
    this.offsetY = event.clientY - parseInt(this.position.top || '0', 10);
    document.addEventListener('mousemove', this.onDrag.bind(this));
    document.addEventListener('mouseup', this.endDrag.bind(this));
    event.preventDefault(); // Previene la selección de texto durante el arrastre
  }

  private onDrag(event: MouseEvent): void {
    if (!this.dragging) return;

    this.position = {
      left: `${event.clientX - this.offsetX}px`,
      top: `${event.clientY - this.offsetY}px`
    };
  }

  private endDrag(): void {
    this.dragging = false;
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.endDrag);
  }
}
