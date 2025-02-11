import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';
import { IAduana } from '@data/aduana.metadata';
import { AduanasService } from '../../services/aduanas.service';

@Component({
  selector: 'app-aduanaSelect',
  templateUrl: './aduanaSelect.component.html',
  styleUrls: ['./aduanaSelect.component.css']
})
export class AduanaSelectComponent implements OnChanges {
  @Input() aduana_id: number | null = null;  // Recibe el aduana seleccionado
  @Output() cambioAduana = new EventEmitter<number>();  // Emite el cambio del aduana
  @Output() nombre_aduana=new EventEmitter<string>();
  aduanas: IAduana[] = [];
  error: any;
  loading: boolean = true;

  constructor(public aduanasService: AduanasService) {

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.cargarAduanas();

  }

  cargarAduanas() {
    this.aduanasService
      .veraduanas('gh')
      .pipe(
        retry(3), // Reintenta 3 veces en caso de error
        catchError((error) => {
          this.error = this.aduanasService.handleError(error);
          this.loading = false; // Asegúrate de detener la carga incluso en caso de error
          return of([]); // Devuelve un arreglo vacío si hay error
        })
      )
      .subscribe((data: any) => {
        this.aduanas = this.aduanasService.handleaduana(data);
        this.loading = false;

      });
  }

  cambioAduanas(event: any) {
    console.log(event.value);
    console.log(this.aduanas);
    if (!event.value) {
      console.warn('El valor seleccionado no es válido');
      return;
    }
    this.cambioAduana.emit(this.aduanas.find(i => i.id === event.value).id); // Emite solo el ID
    this.nombre_aduana.emit(this.aduanas.find(i => i.id === event.value).nombre);
  }
}
