import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { of} from 'rxjs';
import { catchError, retry} from 'rxjs/operators';
import { OperatorsService } from '../../services/operators.service';
import { IOperatorSimple } from '@data/operador_simple.metadata';

@Component({
  selector: 'app-operadoresSelect',
  templateUrl: './operadoresSelect.component.html',
  styleUrls: ['./operadoresSelect.component.scss'],
})
export class OperadoresSelectComponent implements OnInit {
  @Input() nombre: String | null = null; // Permite seleccionar un mineral por defecto
  @Output() operador = new EventEmitter<IOperatorSimple>();
  operadores: IOperatorSimple[] = [];
  error: any;
  loading: boolean = true;

  constructor(public operadoresService: OperatorsService) {}

  ngOnInit() {
    this.cargarOperadores();
  }

  cargarOperadores() {
    this.operadoresService.verOperatorsSimple('gh')
      .pipe(
        retry(3), // Intenta 3 veces si hay un error
        catchError((error) => {
          this.error = this.operadoresService.handleError(error);
          return of([]); // Retorna un arreglo vacío en caso de error
        })
      )
      .subscribe(
        (data: any) => {
          this.operadores = this.operadoresService.handleOperatorSimple(data);

          this.loading = false;
        },
        (error: any) => {
          console.error('Error al cargar operadores:', error);
          this.loading = false;
        }
      );
  }

  cambioOperador(event: any) {
    const operador = this.operadores.find((element) => element.razon_social === event.value);
    if (operador) {
      this.operador.emit(operador);
    }
  }
}
