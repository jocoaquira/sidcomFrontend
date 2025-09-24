import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IPlantaDeTratamiento } from '@data/planta_tratamiento.metadata';
import { of} from 'rxjs';
import { catchError, retry} from 'rxjs/operators';
import { PlantaDeTratamientoService } from '../../services/planta-tratamientos.service';
import { co } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-plantaDeTratamientoSelect',
  templateUrl: './plantaTratamientoSelect.component.html',
  styleUrls: ['./plantaTratamientoSelect.component.scss'],
})
export class PlantaTratamientoSelectComponent implements OnInit {
  @Input() nombre: String | null = null;
  @Input() municipioId:number | null = null;
  @Output() plantaTratamiento = new EventEmitter<IPlantaDeTratamiento>();
  plantaTratamientos: IPlantaDeTratamiento[] = [];
  public id:number | null = null;
  error: any;
  loading: boolean = true;

  constructor(public plantaTratamientoService: PlantaDeTratamientoService) {}

  ngOnInit() {
    this.cargarCompradores();
  }

cargarCompradores() {
  this.plantaTratamientoService.verPlantaDeTratamientos('gh')
    .pipe(
      retry(3),
      catchError((error) => {
        this.error = this.plantaTratamientoService.handleError(error);
        return of([]);
      })
    )
    .subscribe(
      (data: any) => {
        this.plantaTratamientos = this.plantaTratamientoService.handlePlantaDeTratamiento(data);
        console.log('Plantas de Tratamiento cargadas:', this.plantaTratamientos);
        console.log('Municipio ID:', this.municipioId);
        console.log('Nombre:', this.nombre);
        this.loading = false;

        // Precargar según municipioId y nombre
        if (this.municipioId && this.nombre) {
          const planta = this.plantaTratamientos.find(
            pt => pt.municipioId === this.municipioId && pt.nombre === this.nombre
          );
          if (planta) {
            this.id = planta.id;

            console.log('Planta de Tratamiento precargada:', this.id);
          }
        }
      },
      (error: any) => {
        console.error('Error al cargar plantaTratamiento:', error);
        this.loading = false;
      }
    );
}
cambioPlantaTratamiento(event: any) {
    console.log(event);
  const plantaTratamiento = this.plantaTratamientos.find(
    (element) => element.nombre === event.value && element.municipioId === this.municipioId
  );
  if (plantaTratamiento) {
    this.plantaTratamiento.emit(plantaTratamiento);
  }
}
}
