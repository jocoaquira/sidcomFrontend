import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IDepartamento } from '@data/departamento.metadata';
import { DepartamentosService } from '../../services/departamentos.service';
import { catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-departamentoSelect',
  templateUrl: './departamentoSelect.component.html',
  styleUrls: ['./departamentoSelect.component.css']
})
export class DepartamentoSelectComponent implements OnInit {
  @Output() departamento_id = new EventEmitter<number>();
  @Output() nombre_departamento = new EventEmitter<string>();
  departamentos: IDepartamento[] = [];
  error: any;
  loading: boolean = true;

  constructor(public departamentosService: DepartamentosService) {}

  ngOnInit() {
    this.cargarDepartamentos();
  }

  cargarDepartamentos() {
    this.departamentosService
      .verdepartamentos('gh')
      .pipe(
        retry(3), // Reintenta 3 veces en caso de error
        catchError((error) => {
          this.error = this.departamentosService.handleError(error);
          return of([]); // Devuelve un arreglo vacío si hay error
        })
      )
      .subscribe((data: any) => {
        this.departamentos = this.departamentosService.handledepartamento(data);
        this.loading = false;
      });
  }

  cambioDepartamento(event: any) {
    if (!event.value) {
      console.warn('El valor seleccionado no es válido');
      return;
    }

    const departamento = this.departamentos.find((d) => d.id === event.value);

    if (departamento) {
      this.departamento_id.emit(departamento.id);
      this.nombre_departamento.emit(departamento.nombre);
    } else {
      console.warn('El departamento seleccionado no existe');
    }
  }
}
