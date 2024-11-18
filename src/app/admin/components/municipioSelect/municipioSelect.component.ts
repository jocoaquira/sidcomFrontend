import { Component, Output, Input, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { IMunicipio } from '@data/municipio.metadata';
import { MunicipiosService } from '../../services/municipios.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-municipioSelect',
  templateUrl: './municipioSelect.component.html',
  styleUrls: ['./municipioSelect.component.css'],
})
export class MunicipioSelectComponent implements OnChanges {
  @Input() departamento_id!: number;
  @Output() municipio_id = new EventEmitter<string>();
  @Output() nombre_municipio = new EventEmitter<string>();
  municipios: IMunicipio[] = [];
  error: any;
  loading: boolean = false;

  constructor(public municipiosService: MunicipiosService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['departamento_id'] &&
      changes['departamento_id'].currentValue != null &&
      changes['departamento_id'].currentValue !== changes['departamento_id'].previousValue
    ) {
      this.cargarMunicipios(changes['departamento_id'].currentValue);
    }
  }

  cargarMunicipios(departamentoId: number) {
    this.loading = true;
    this.municipiosService
      .vermunicipios(departamentoId.toString())
      .pipe(
        catchError((error) => {
          this.error = this.municipiosService.handleError(error);
          this.municipios = [];
          this.loading = false;
          return of([]);
        })
      )
      .subscribe((data: any) => {
        this.municipios = this.municipiosService.handlemunicipio(data);
        this.loading = false;
      });
  }

  cambioMunicipio(event: any) {
    const municipio = this.municipios.find((element) => element.id === event.value);
    if (municipio) {
      this.municipio_id.emit(municipio.codigo);
      this.nombre_municipio.emit(municipio.municipio);
    } else {
      console.warn('El municipio seleccionado no existe');
    }
  }
}
