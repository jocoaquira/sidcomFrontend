import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { IDepartamento } from '@data/departamento.metadata';
import { IMineral } from '@data/mineral.metadata';
import { IMunicipio } from '@data/municipio.metadata';
import { IPresentacion } from '@data/presentacion.metadata';
import { ITomaDeMuestra } from '@data/toma_de_muestra.metadata';
import { catchError, of, retry } from 'rxjs';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { MineralsService } from 'src/app/admin/services/minerales.service';
import { MunicipiosService } from 'src/app/admin/services/municipios.service';
import { PresentacionService } from 'src/app/admin/services/presentacion.service';
import { TomaDeMuestraService } from 'src/app/admin/services/toma-de-muestra/toma-de-muestra.service';

@Component({
  selector: 'app-ver-toma-de-muestra',
  templateUrl: './ver-toma-de-muestra.component.html',
  styleUrls: ['./ver-toma-de-muestra.component.scss']
})
export class VerTomaDeMuestraComponent implements OnInit {
  @Input() id!: number;
  public tomaDM: any = null;
  public error: any = null;
  public municipios: IMunicipio[] = [];
  public departamentos: IDepartamento[] = [];
  public minerales: IMineral[] = [];
  public municipio:string=null;
  public ley_mineral:string=null;
  public elementos:string='';
  public responsable:string=null;
  public empresa:string=null;

  constructor(
    private tomaDeMuestraService: TomaDeMuestraService,
    private municipiosService: MunicipiosService,
    private departamentosService: DepartamentosService,
    private mineralesService: MineralsService,
    private presentacionService: PresentacionService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.id) {
      this.cargarTomaDeMuestra();
      this.cargarDepartamentos();
      this.cargarMinerales();
    }
  }

  cargarTomaDeMuestra() {
    this.tomaDeMuestraService.verTomaDeMuestra(this.id.toString()).subscribe(
      (data: any) => {
        this.tomaDM = this.tomaDeMuestraService.handleCrearTomaDeMuestra(data);
        this.cargarMunicipios().then(() => {
          this.listarMunicipioOrigen();
        });
        this.listarMinerales();
      },
      (error: any) => {
        this.error = this.tomaDeMuestraService.handleAprobarTomaDeMuestraError(error);
      }
    );
  }

  cargarMunicipios(): Promise<void> {
    return new Promise((resolve) => {
      this.municipiosService.verTodosMunicipios()
        .pipe(
          catchError((error) => {
            this.error = this.municipiosService.handleError(error);
            return of([]);
          })
        )
        .subscribe((data: any) => {
          this.municipios = this.municipiosService.handlemunicipio(data);
          console.log('Municipios cargados:', this.municipios);
          resolve();
        });
    });
  }

  cargarDepartamentos() {
    this.departamentosService.verdepartamentos('gh')
      .pipe(
        retry(3),
        catchError((error) => {
          this.error = this.departamentosService.handleError(error);
          return of([]);
        })
      )
      .subscribe((data: any) => {
        this.departamentos = this.departamentosService.handledepartamento(data);
      });
  }

  cargarMinerales() {
    this.mineralesService.verminerals('gh')
      .pipe(
        retry(3),
        catchError((error) => {
          this.error = this.mineralesService.handleError(error);
          return of([]);
        })
      )
      .subscribe((data: any) => {
        this.minerales = this.mineralesService.handlemineral(data);
      });
  }

  listarMinerales() {
    if (!this.tomaDM || !this.tomaDM.minerales) {
      console.error('No hay datos en tomaDM.minerales');
      return;
    }

    if (!this.minerales || this.minerales.length === 0) {
      console.error('No hay datos en this.minerales');
      return;
    }

    // Inicializar variables vacías
    this.ley_mineral = "";
    this.elementos = "";

    this.tomaDM.minerales.forEach((element, index) => {
      const mineral = this.minerales.find(i => i.id === element.mineralId);
      if (mineral) {
        // Agregar coma solo si no es el primer elemento
        this.elementos += (index > 0 ? ", " : "") + mineral.nombre;
        this.ley_mineral += (index > 0 ? ", " : "") + mineral.sigla + " (" + element.ley + " " + element.unidad + ")";
      } else {
        console.warn(`Mineral con ID ${element.mineralId} no encontrado`);
      }
    });

    console.log('Minerales encontrados: ' + this.elementos);
    console.log('Leyes minerales encontradas: ' + this.ley_mineral);
  }
  listarMunicipioOrigen() {
    if (!this.tomaDM || !this.tomaDM.municipio_origen) {
      console.error('No hay datos en tomaDM.municipio_origen');
      return;
    }

    if (!this.municipios || this.municipios.length === 0) {
      console.error('No hay datos en this.municipios');
      return;
    }

    // Asegurar que la variable municipio esté inicializada
    this.municipio = "";

    this.tomaDM.municipio_origen.forEach((element, index) => {
      const municipio = this.municipios.find(i => i.id === element.municipioId);
      if (municipio) {
        this.municipio += (index > 0 ? ", " : "") + municipio.municipio;
      } else {
        console.warn(`Municipio con ID ${element.municipioId} no encontrado`);
      }
    });

    console.log('Municipios encontrados: ' + this.municipio);
  }

}
