import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { RolesService } from '../../services/roles.service';
import { OperatorsService } from '../../services/operators.service';
import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/authentication/services/auth.service';
import { IPresentacion } from '@data/presentacion.metadata';
import { PresentacionService } from '../../services/presentacion.service';
import { PresentacionFormulario } from '../../validators/presentacion';

@Component({
  selector: 'app-crear-presentacion',
  templateUrl: './crear-presentacion.component.html',
  styleUrls: ['./crear-presentacion.component.scss']
})
export class CrearPresentacionComponent implements OnInit {

  @Input() presentacion!:IPresentacion;
  @Input() isEditMode: boolean = false;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  public error!:any;
  public errorVerificarContraseña:boolean=true;
  public errorVerificarEmail:boolean=false;
  public roles!:IRol[];
  public operadores!:IOperatorSimple[];
  public nombre:string='';
  public sw1:any;
  public sw:any;
  public sw2:any;
  public submitted:boolean=false;
  public estados:any;
  public tipos:any;
  public admin:boolean=false;
  public form=new PresentacionFormulario();
  public errorUsuario:any={};
  public operador_id:number=0;

  constructor(
    private rolesServices:RolesService,
    private operadoresService:OperatorsService,
    private presentacionService:PresentacionService,
    private notify:ToastrService,
    private authService:AuthService,
        ) {



        }

  ngOnInit(): void {


    this.operadoresService.verOperatorsSimple('hj').subscribe(
      (data:any)=>{
      this.operadores=this.operadoresService.handleOperatorSimple(data);
    },
    (error:any)=> this.error=this.operadoresService.handleOperatorSimpleError(error));

    this.estados = [
      { label: 'ACTIVO', value: '1' },
      { label: 'INACTIVO', value: '0' }
  ];
  this.tipos = [
    { label: 'METALICO', value: '0' },
    { label: 'NO METALICO', value: '1' },
    { label: 'COMPUESTO', value: '2' }
];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.presentacion && this.isEditMode) {
      this.form.formulario.patchValue({
        id:this.presentacion.id,
        nombre: this.presentacion.nombre,

      });
    }

  }
  onChangeRol(rol_id:any){
    let id=rol_id.value;
    let rol:IRol=this.roles.find(element => element.id === id);
    if(rol.nombre.search('Operador')!=-1)
    {
      this.admin=false;
    }
    else{
      this.admin=true;
    }
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
      this.actualizarResponsable();
    } else {
      this.crearResponsable();
    }
  }
  actualizarResponsable() {

    this.form.formulario.value.estado=this.form.formulario.value.estado.label;
    this.form.formulario.value.tipo=this.form.formulario.value.tipo.label;

    if (this.form.formulario.valid) {

        this.presentacionService.editarpresentacion(this.form.formulario.value).subscribe(
            (data:any) =>
            {
              this.presentacionService.handleCrearpresentacion(data);

              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {

              this.errorUsuario=this.presentacionService.handleCrearpresentacionError(error.error.data);
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
  crearResponsable() {

    this.form.formulario.value.estado=this.form.formulario.value.estado.label;
    this.form.formulario.value.tipo=this.form.formulario.value.tipo.label;

    if (this.form.formulario.valid) {
        this.presentacionService.crearpresentacion(this.form.formulario.value).subscribe(
            (data:any) =>
            {
              this.presentacionService.handleCrearpresentacion(data);

              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {

              this.errorUsuario=this.presentacionService.handleCrearpresentacionError(error.error.data);
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
  verificar(event:Event){
    const input = (event.target as HTMLInputElement).value;
    if(this.form.formulario.value.repetir_password==this.form.formulario.value.password){
      this.errorVerificarContraseña=false;
    }
    else{
      this.errorVerificarContraseña=true;
    }
  }

}
