import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';


import { catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';
import { IPais } from '@data/pais.metadata';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-paisSelect',
  templateUrl: './paisSelect.component.html',
  styleUrls: ['./paisSelect.component.css']
})
export class PaisSelectComponent implements OnChanges {
  @Input() pais_id: number | null = null;  // Recibe el pais seleccionado
  @Output() cambioPais = new EventEmitter<number>();  // Emite el cambio del pais
  @Output() nombre_pais=new EventEmitter<string>();
  paises: IPais[] = [];
  error: any;
  loading: boolean = true;

  constructor(public paisesService: PaisesService) {

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.cargarPaiss();

  }

  cargarPaiss() {
    this.paisesService
      .verpaises('gh')
      .pipe(
        retry(3), // Reintenta 3 veces en caso de error
        catchError((error) => {
          this.error = this.paisesService.handleError(error);
          this.loading = false; // Asegúrate de detener la carga incluso en caso de error
          return of([]); // Devuelve un arreglo vacío si hay error
        })
      )
      .subscribe((data: any) => {
        this.paises = this.paisesService.handlepais(data);
        this.loading = false;

      });
  }

  cambioPaises(event: any) {
    if (!event.value) {
      console.warn('El valor seleccionado no es válido');
      return;
    }
    this.cambioPais.emit(this.paises.find(i => i.id === event.value).id); // Emite solo el ID
    this.nombre_pais.emit(this.paises.find(i => i.id === event.value).nombre);
  }
}
