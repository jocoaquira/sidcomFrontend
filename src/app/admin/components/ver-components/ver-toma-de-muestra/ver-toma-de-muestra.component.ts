import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
   @Output() estadoDialogo = new EventEmitter<boolean>();
  public tomaDM: any = null;
  public error: any = null;
  public departamentos: IDepartamento[] = [];
  public municipio:string=null;
  public ley_mineral:string=null;
  public elementos:string='';
  public responsable:string=null;
  public empresa:string=null;
  public presentacion:string=null;

  constructor(
    private tomaDeMuestraService: TomaDeMuestraService,
    private municipiosService: MunicipiosService,
    private departamentosService: DepartamentosService,
    private mineralesService: MineralsService,
    private presentacionService: PresentacionService
  ) {}

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.id) {
      this.cargarTomaDeMuestra();
      this.cargarDepartamentos();
    }
  }

  cargarTomaDeMuestra() {
    this.tomaDeMuestraService.verTomaDeMuestraPDF(this.id.toString()).subscribe(
      (data: any) => {
        this.tomaDM = this.tomaDeMuestraService.handleCrearTomaDeMuestra(data);

          this.listarMunicipioOrigen();
        this.listarMinerales();
      },
      (error: any) => {
        this.error = this.tomaDeMuestraService.handleAprobarTomaDeMuestraError(error);
      }
    );
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



  listarMinerales() {
    if (!this.tomaDM || !this.tomaDM.minerales) {
      console.error('No hay datos en tomaDM.minerales');
      return;
    }


    // Inicializar variables vacías
    this.ley_mineral = "";
    this.elementos = "";

    this.tomaDM.minerales.forEach((element, index) => {

        // Agregar coma solo si no es el primer elemento
        this.elementos += (index > 0 ? ", " : "") + element.mineral;
        this.ley_mineral += (index > 0 ? ", " : "") + element.sigla + " (" + element.ley + " " + element.unidad + ")";
      }
    );
  }
  listarMunicipioOrigen() {
    if (!this.tomaDM || !this.tomaDM.municipio_origen) {
      console.error('No hay datos en tomaDM.municipio_origen');
      return;
    }
    // Asegurar que la variable municipio esté inicializada
    this.municipio = "";

    this.tomaDM.municipio_origen.forEach((element, index) => {

        this.municipio += (index > 0 ? ", " : "") + element.municipio_origen;
      }
    );
  }

}
