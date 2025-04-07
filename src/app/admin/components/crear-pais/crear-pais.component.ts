import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { RolesService } from '../../services/roles.service';
import { OperatorsService } from '../../services/operators.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/authentication/services/auth.service';
import { PaisesService } from '../../services/paises.service';
import { IPais } from '@data/pais.metadata';
import { PaisFormulario } from '../../validators/pais';

@Component({
  selector: 'app-crear-pais',
  templateUrl: './crear-pais.component.html',
  styleUrls: ['./crear-pais.component.scss']
})
export class CrearPaisComponent implements OnInit {

  @Input() pais!:IPais;
  @Input() isEditMode: boolean = false;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  public error!:any;
  public nombre:string='';
  public sw1:any;
  public sw:any;
  public sw2:any;
  public submitted:boolean=false;
  public form=new PaisFormulario();
  public errorUsuario:any={};

  constructor(
    private rolesServices:RolesService,
    private operadoresService:OperatorsService,
    private paisService:PaisesService,
    private notify:ToastrService,
    private authService:AuthService,
        ) {


            console.log(this.pais);
        }

  ngOnInit(): void {


  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.pais && this.isEditMode) {
      this.form.formulario.patchValue({
        id:this.pais.id,
        nombre: this.pais.nombre,
        sigla: this.pais.sigla,
        continente:this.pais.continente
      });
    }
    console.log(this.form.formulario.value);
  }

  onChangeEstado(operator_id:any){

   // this.form.formulario.value.estado=operator_id.value
  }
  onChangeOperadores(operator_id:any){
  }
  ocultarDialogo(){
    this.form.formulario.reset();
    this.estadoDialogo.emit(false);
  }
  onSubmit(){
    if (this.isEditMode) {
      this.actualizarPais();
    } else {
      this.crearPais();
    }
  }
  actualizarPais() {


    if (this.form.formulario.valid) {
        console.log(this.form.formulario.value);
        this.paisService.editarpais(this.form.formulario.value).subscribe(
            (data:any) =>
            {
              this.paisService.handleCrearpais(data);
              console.log(data);
              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {
              console.log(error);
              this.errorUsuario=this.paisService.handleCrearpaisError(error.error.data);
              if(error.error.status=='fail')
              {
                this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
              }
            }
          );
      } else {
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
  }
  crearPais() {

    console.log(this.form.formulario.value);
    if (this.form.formulario.valid) {
        let limpio = Object.fromEntries(
            Object.entries(this.form.formulario.value).filter(([_, v]) => v !== null)
          );
        this.paisService.crearpais(limpio).subscribe(
            (data:any) =>
            {
              this.paisService.handleCrearpais(data);
              console.log(data);
              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {
              console.log(error);
              this.errorUsuario=this.paisService.handleCrearpaisError(error.error.data);
              if(error.error.status=='fail')
              {
                this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
              }
            }
          );
      } else {
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
  }


}
