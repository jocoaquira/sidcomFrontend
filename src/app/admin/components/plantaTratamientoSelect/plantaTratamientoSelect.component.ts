import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IPlantaDeTratamiento } from '@data/planta_tratamiento.metadata';
import { of} from 'rxjs';
import { catchError, retry} from 'rxjs/operators';
import { PlantaDeTratamientoService } from '../../services/planta-tratamientos.service';

@Component({
  selector: 'app-plantaDeTratamientoSelect',
  templateUrl: './plantaTratamientoSelect.component.html',
  styleUrls: ['./plantaTratamientoSelect.component.scss'],
})
export class PlantaTratamientoSelectComponent implements OnInit {
  @Input() nombre: String | null = null; // Permite seleccionar un mineral por defecto
  @Output() plantaTratamiento = new EventEmitter<IPlantaDeTratamiento>();
  plantaTratamientos: IPlantaDeTratamiento[] = [];
  error: any;
  loading: boolean = true;

  constructor(public plantaTratamientoService: PlantaDeTratamientoService) {}

  ngOnInit() {
    this.cargarCompradores();
  }

  cargarCompradores() {
    this.plantaTratamientoService.verPlantaDeTratamientos('gh')
      .pipe(
        retry(3), // Intenta 3 veces si hay un error
        catchError((error) => {
          this.error = this.plantaTratamientoService.handleError(error);
          return of([]); // Retorna un arreglo vacío en caso de error
        })
      )
      .subscribe(
        (data: any) => {
          this.plantaTratamientos = this.plantaTratamientoService.handlePlantaDeTratamiento(data);

          this.loading = false;
        },
        (error: any) => {
          console.error('Error al cargar plantaTratamiento:', error);
          this.loading = false;
        }
      );
  }

  cambioPlantaTratamiento(event: any) {
    const plantaTratamiento = this.plantaTratamientos.find((element) => element.nombre === event.value);
    if (plantaTratamiento) {
      this.plantaTratamiento.emit(plantaTratamiento);
    }
  }
}
