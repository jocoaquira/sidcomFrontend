import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUsuario } from '@data/usuario.metadata';
import { RolesService } from '../../services/roles.service';
import { OperatorsService } from '../../services/operators.service';
import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioFormulario } from '../../validators/usuario';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {

  @Input() usuario!:IUsuario;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  public error!:any;
  public roles!:IRol[];
  public operadores!:IOperatorSimple[];
  public nombre:string='';
  public sw1:any;
  public sw:any;
  public sw2:any;
  public submitted:boolean=false;
  public estados:any;
  public admin:boolean=false;
  public form=new UsuarioFormulario();

  constructor(
    private rolesServices:RolesService,
    private operadoresService:OperatorsService
  ) {

  }

  ngOnInit(): void {
    this.rolesServices.verRoles('hj').subscribe(
      (data:any)=>{
      this.roles=this.rolesServices.handlerol(data.data);

    },
    (error:any)=> this.error=this.rolesServices.handleError(error));

    this.operadoresService.verOperatorsSimple('hj').subscribe(
      (data:any)=>{
      this.operadores=this.operadoresService.handleOperatorSimple(data.data);
    },
    (error:any)=> this.error=this.operadoresService.handleOperatorSimpleError(error));

    this.estados = [
      { label: 'HABILITADO', value: '1' },
      { label: 'DESHABILITADO', value: '0' }
  ];
  }
  onChangeRol(rol_id:any){
    let name=rol_id.value.name;
    console.log(name);

    if(name.search('Operador')!=-1)
    {
      this.admin=false;
    }
    else{
      this.admin=true;
    }

  }
  onChangeEstado(operator_id:any){

   // this.form.formulario.value.estado=operator_id.value
    console.log(this.form.formulario.value.estado);
  }
  onChangeOperadores(operator_id:any){
    console.log(operator_id);
  }
  ocultarDialogo(){
    this.estadoDialogo.emit(false);
  }
  guardarusuario(){

  }
  onSubmit() {
    console.log('Datos del usuario:', this.form.formulario.value);
    if (this.form.formulario.valid) {
      console.log('Datos del usuario:', this.form.formulario.value);
    } else {
      console.log('Formulario no válido');
    }
  }

}
