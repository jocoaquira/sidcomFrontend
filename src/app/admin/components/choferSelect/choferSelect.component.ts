import { Component, Output, Input, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { IChofer } from '@data/chofer.metadata';

import { catchError, of } from 'rxjs';
import { ChoferService } from '../../services/chofer.service';

@Component({
  selector: 'app-choferSelect',
  templateUrl: './choferSelect.component.html',
  styleUrls: ['./choferSelect.component.scss'],
})
export class ChoferSelectComponent implements OnChanges {
  @Input() operador_id: number | null = null;
  @Input() nro_licencia: string | null = null;
  @Output() chofer = new EventEmitter<IChofer>();
  chofers: IChofer[] = [];
  error: any;
  loading: boolean = false;

  constructor(public chofersService: ChoferService) {}

  ngOnChanges(changes: SimpleChanges) {

    if (
      changes['operador_id'] &&
      changes['operador_id'].currentValue != null &&
      changes['operador_id'].currentValue !== changes['operador_id'].previousValue
    ) {
      this.cargarChofers(changes['operador_id'].currentValue);
    }
  }

  cargarChofers(operadorId: number) {
    this.loading = true;
    this.chofersService
      .verChoferOperador(operadorId.toString())
      .pipe(
        catchError((error) => {
          this.error = this.chofersService.handleError(error);
          this.chofers = [];
          this.loading = false;
          return of([]);
        })
      )
      .subscribe((data: any) => {
        this.chofers = this.chofersService.handlechofer(data)
        .filter(chofer => chofer.estado === 'ACTIVO');
        this.loading = false;
      });
  }

  cambioChofer(event: any) {
    const chofer = this.chofers.find((element) => element.nro_licencia === event.value);

    if (chofer) {
      this.chofer.emit(chofer);
    } else {
      console.warn('El chofer seleccionado no existe');
    }
  }
}
