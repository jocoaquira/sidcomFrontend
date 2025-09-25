import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { of} from 'rxjs';
import { catchError, retry} from 'rxjs/operators';
import { IComprador } from '@data/comprador.metadata';
import { CompradoresService } from '../../services/compradores.service';

@Component({
  selector: 'app-compradorSelect',
  templateUrl: './compradorSelect.component.html',
  styleUrls: ['./compradorSelect.component.scss'],
})
export class CompradorSelectComponent implements OnInit {
  @Input() razon_social: String | null = null;
  @Input() nombre: String | null = null;
  @Output() comprador = new EventEmitter<IComprador>();
  compradores: IComprador[] = [];
  error: any;
  loading: boolean = true;

  constructor(private compradorService: CompradoresService) {}

  ngOnInit() {
    this.cargarCompradores();
  }

  cargarCompradores() {
    this.compradorService.verCompradores('')
      .pipe(
        retry(3), // Intenta 3 veces si hay un error
        catchError((error) => {
          this.error = this.compradorService.handleError(error);
          return of([]); // Retorna un arreglo vacío en caso de error
        })
      )
      .subscribe(
        (data: any) => {
          this.compradores = this.compradorService.handleComprador(data);

          this.loading = false;
        },
        (error: any) => {
          console.error('Error al cargar comprador:', error);
          this.loading = false;
        }
      );
  }

  public cambioComprador(event: any) {
    const comprador = this.compradores.find((element) => element.razon_social === event.value);
    if (comprador) {
      this.comprador.emit(comprador);
    }
  }
}
