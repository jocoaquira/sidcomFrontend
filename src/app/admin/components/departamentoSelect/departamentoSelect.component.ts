import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IDepartamento } from '@data/departamento.metadata';
import { DepartamentosService } from '../../services/departamentos.service';
import { catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-departamentoSelect',
  templateUrl: './departamentoSelect.component.html',
  styleUrls: ['./departamentoSelect.component.css']
})
export class DepartamentoSelectComponent implements OnChanges {
  @Input() departamento_id: number | null = null;  // Recibe el departamento seleccionado
  @Output() cambioDepartamento = new EventEmitter<number>();  // Emite el cambio del departamento
  @Output() nombre_departamento=new EventEmitter<string>();
  departamentos: IDepartamento[] = [];
  error: any;
  loading: boolean = true;

  constructor(public departamentosService: DepartamentosService) {

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.cargarDepartamentos();

  }

  cargarDepartamentos() {
    this.departamentosService
      .verdepartamentos('gh')
      .pipe(
        retry(3), // Reintenta 3 veces en caso de error
        catchError((error) => {
          this.error = this.departamentosService.handleError(error);
          this.loading = false; // Asegúrate de detener la carga incluso en caso de error
          return of([]); // Devuelve un arreglo vacío si hay error
        })
      )
      .subscribe((data: any) => {
        this.departamentos = this.departamentosService.handledepartamento(data);
        this.loading = false;

      });
  }

  cambioDepartamentos(event: any) {
    console.log(event.value);
    console.log(this.departamentos);
    if (!event.value) {
      console.warn('El valor seleccionado no es válido');
      return;
    }
    this.cambioDepartamento.emit(this.departamentos.find(i => i.id === event.value).id); // Emite solo el ID
    this.nombre_departamento.emit(this.departamentos.find(i => i.id === event.value).nombre);
  }
}
