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
  @Input() municipioId: number | null = null;
  @Output() comprador = new EventEmitter<IComprador>();
  compradores: IComprador[] = [];
  public id: number | null = null;
  error: any;
  loading: boolean = true;

  constructor(private compradorService: CompradoresService) {}

  ngOnInit() {
    this.cargarCompradores();
  }

  cargarCompradores() {
    this.compradorService.verCompradores('gh')
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
          console.log('Compradores cargados:', this.compradores);
          console.log('Municipio ID:', this.municipioId);
          console.log('Nombre:', this.razon_social);
          this.loading = false;

          // Precargar según municipioId y razon_social (razon_social)
          if (this.municipioId && this.razon_social) {
            const compradorEncontrado = this.compradores.find(
              c => c.municipioId === this.municipioId && c.razon_social === this.razon_social
            );
            if (compradorEncontrado) {
              this.id = compradorEncontrado.id;
              console.log('Comprador precargado:', this.id);
            }
          }
        },
        (error: any) => {
          console.error('Error al cargar comprador:', error);
          this.loading = false;
        }
      );
  }

  public cambioComprador(event: any) {
    console.log('el evento', event);
    const comprador = this.compradores.find((element) => element.id === event.value);
    if (comprador) {
      console.log('Comprador seleccionado:', comprador);
      this.comprador.emit(comprador);
    }
  }
}
