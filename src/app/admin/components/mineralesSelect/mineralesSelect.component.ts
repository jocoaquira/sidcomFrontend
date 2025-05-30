import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IMineral } from '@data/mineral.metadata';
import { MineralsService } from '../../services/minerales.service';
import { of, throwError } from 'rxjs';
import { catchError, retry, delay } from 'rxjs/operators';

@Component({
  selector: 'app-mineralesSelect',
  templateUrl: './mineralesSelect.component.html',
  styleUrls: ['./mineralesSelect.component.css'],
})
export class MineralesSelectComponent implements OnInit {
  @Input() tipo: String | null = null; // Permite seleccionar un mineral por defecto
  @Output() sigla = new EventEmitter<string>();
  @Output() nombre = new EventEmitter<string>();
  @Output() mineral_id = new EventEmitter<number>();
  minerales: IMineral[] = [];
  error: any;
  loading: boolean = true;

  constructor(public mineralesService: MineralsService) {}

  ngOnInit() {
    this.cargarMinerales();
  }

  cargarMinerales() {
    this.mineralesService.verminerals('gh')
      .pipe(
        retry(3), // Intenta 3 veces si hay un error
        catchError((error) => {
          this.error = this.mineralesService.handleError(error);
          return of([]); // Retorna un arreglo vacío en caso de error
        })
      )
      .subscribe(
        (data: any) => {
          this.minerales = this.mineralesService.handlemineral(data);
          if(this.tipo!=='COMPUESTO') {
            this.minerales = this.minerales.filter((mineral) => mineral.tipo !== 'COMPUESTO');
          }
          this.loading = false;
        },
        (error: any) => {
          console.error('Error al cargar minerales:', error);
          this.loading = false;
        }
      );
  }

  cambioMineral(event: any) {
    const mineral = this.minerales.find((element) => element.id === event.value);
    if (mineral) {
      this.sigla.emit(mineral.sigla);
      this.nombre.emit(mineral.nombre);
      this.mineral_id.emit(mineral.id);
    }
  }
}
