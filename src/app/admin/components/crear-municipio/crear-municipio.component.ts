import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { RolesService } from '../../services/roles.service';
import { OperatorsService } from '../../services/operators.service';
import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/authentication/services/auth.service';
import { IMunicipio } from '@data/municipio.metadata';
import { MunicipiosService } from '../../services/municipios.service';
import { IDepartamento } from '@data/departamento.metadata';
import { MunicipioFormulario } from '../../validators/municipio';

@Component({
  selector: 'app-crear-municipio',
  templateUrl: './crear-municipio.component.html',
  styleUrls: ['./crear-municipio.component.scss']
})
export class CrearMunicipioComponent implements OnInit {

  @Input() municipio!:IMunicipio;
  @Input() isEditMode: boolean = false;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  public error!:any;
  public errorVerificarContraseña:boolean=true;
  public errorVerificarEmail:boolean=false;
  public roles!:IRol[];
  public departamentos:IDepartamento[];
  public operadores!:IOperatorSimple[];
  public codigo:string='';
  public sw1:any;
  public sw:any;
  public sw2:any;
  public submitted:boolean=false;
  public estados:any;
  public tipos:any;
  public admin:boolean=false;
  public form=new MunicipioFormulario();
  public errorUsuario:any={};
  public operador_id:number=0;

  constructor(
    private rolesServices:RolesService,
    private operadoresService:OperatorsService,
    private municipioService:MunicipiosService,
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

    if (changes && this.municipio && this.isEditMode) {
      this.form.formulario.patchValue({
        id:this.municipio.id,
        codigo: this.municipio.codigo,
        municipio: this.municipio.municipio,
        //operador_id: this.operadores.find((op: any) => op.id === this.usuario.operador_id).id || null, // Buscar el operador en la lista
        departamento_id: this.municipio.departamento_id//this.departamentos.find((e: any) => e.label === this.municipio.departamento_id) || null,
      });
    }

  }

  onChangeEstado(operator_id:any){

   // this.form.formulario.value.estado=operator_id.value
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

        this.municipioService.editarmunicipio(this.form.formulario.value).subscribe(
            (data:any) =>
            {
              this.municipioService.handleCrearmunicipio(data);

              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {

              this.errorUsuario=this.municipioService.handleCrearmunicipioError(error.error.data);
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
        this.municipioService.crearmunicipio(this.form.formulario.value).subscribe(
            (data:any) =>
            {
              this.municipioService.handleCrearmunicipio(data);

              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {

              this.errorUsuario=this.municipioService.handleCrearmunicipioError(error.error.data);
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
