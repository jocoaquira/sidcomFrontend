import { Component, Output, Input, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { IVehiculo } from '@data/vehiculo.metadata';

import { catchError, of } from 'rxjs';
import { VehiculoService } from '../../services/vehiculo.service';

@Component({
  selector: 'app-vehiculoSelect',
  templateUrl: './vehiculoSelect.component.html',
  styleUrls: ['./vehiculoSelect.component.scss'],
})
export class VehiculoSelectComponent implements OnChanges {
  @Input() operador_id: number | null = null;
  @Input() vehiculo_id1:number | null = null; ;
  @Output() vehiculo_id = new EventEmitter<number>();
  @Output() placa = new EventEmitter<string>();
  vehiculos: IVehiculo[] = [];
  error: any;
  loading: boolean = false;

  constructor(public vehiculosService: VehiculoService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['operador_id'] &&
      changes['operador_id'].currentValue != null &&
      changes['operador_id'].currentValue !== changes['operador_id'].previousValue
    ) {
      this.cargarVehiculos(changes['operador_id'].currentValue);
    }
  }

  cargarVehiculos(operadorId: number) {
    this.loading = true;
    this.vehiculosService
      .verVehiculoOperador(operadorId.toString())
      .pipe(
        catchError((error) => {
          this.error = this.vehiculosService.handleError(error);
          this.vehiculos = [];
          this.loading = false;
          return of([]);
        })
      )
      .subscribe((data: any) => {
        this.vehiculos = this.vehiculosService.handlevehiculo(data);
        this.loading = false;
      });
  }

  cambioVehiculo(event: any) {
    const vehiculo = this.vehiculos.find((element) => element.id === event.value);
    if (vehiculo) {
      this.vehiculo_id.emit(vehiculo.id);
      this.placa.emit(vehiculo.placa);
    } else {
      console.warn('El vehiculo seleccionado no existe');
    }
  }
}
