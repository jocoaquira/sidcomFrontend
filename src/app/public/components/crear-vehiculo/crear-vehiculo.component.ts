import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/authentication/services/auth.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { IVehiculo } from '@data/vehiculo.metadata';
import { VehiculoFormulario } from 'src/app/admin/validators/vehiculo';
import { VehiculoService } from 'src/app/admin/services/vehiculo.service';

@Component({
  selector: 'app-crear-vehiculo',
  templateUrl: './crear-vehiculo.component.html',
  styleUrls: ['./crear-vehiculo.component.scss']
})
export class CrearVehiculoComponent implements OnInit {

  @Input() usuario!:IVehiculo;
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
  public form=new VehiculoFormulario();
  public errorUsuario:any={};
  public operador_id:number=0;

  constructor(
    private operadoresService:OperatorsService,
    private vehiculoService:VehiculoService,
    private notify:ToastrService,
    private authService:AuthService,
        ) {
          this.operador_id= authService.getUser.operador_id;


        }

  ngOnInit(): void {
    this.estados = [
      { label: 'ACTIVO', value: '1' },
      { label: 'INACTIVO', value: '0' }
  ];
    this.tipos = [
        { nombre: 'TRAILER', id: '1' },
        { nombre: 'CAMION', id: '2' },
        { nombre: 'VOLQUETA', id: '3' },
        { nombre: 'CAMION CON ACOPLE', id: '4' },
        { nombre: 'JEEP', id: '7' },
        { nombre: 'FURGONETA BLINDADA', id: '8' },
        { nombre: 'CAMIONETA', id: '9' },
        { nombre: 'VAGONETA', id: '10' },
        { nombre: 'MINIBUS', id: '11' },
        { nombre: 'TAXI', id: '12' },
        { nombre: 'ALZAPATA', id: '5' },
        { nombre: 'FLOTA', id: '6' },
        { nombre: 'TRAILER FURGON', id: '0' }
    ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.usuario && this.isEditMode) {
      this.form.formulario.patchValue({
        id:this.usuario.id,
        placa: this.usuario.placa,
        modelo: this.usuario.modelo,
        marca: this.usuario.marca,
        tipo: this.tipos.find((e: any) => e.nombre === this.usuario.tipo) || null,
        operador_id: this.usuario.operador_id,
        estado: this.estados.find((e: any) => e.label === this.usuario.estado) || null,
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
  onChangeTipo(tipo:any){

  }
  onChangeOperadores(operator_id:any){
   // this.form.formulario.value.estado=this.form.formulario.value.estado.label;
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

    this.form.formulario.value.tipo=this.form.formulario.value.tipo.nombre;
    this.form.formulario.value.estado=this.form.formulario.value.estado.label;
    console.log(this.form.formulario.value);
    if (this.form.formulario.valid) {
        let limpio:any= Object.fromEntries(
            Object.entries(this.form.formulario.value).filter(([_, v]) => v !== null)
          );
        this.vehiculoService.editarVehiculo(limpio).subscribe(
            (data:any) =>
            {
              this.vehiculoService.handleCrearvehiculo(data);

              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {
              this.errorUsuario=this.vehiculoService.handleCrearvehiculoError(error.error.data);
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

    this.form.formulario.patchValue({
      operador_id: this.operador_id,
      tipo:this.form.formulario.value.tipo.nombre,
      estado:this.form.formulario.value.estado.label
    });
    console.log(this.form.formulario.value);

    if (this.form.formulario.valid) {
        let limpio:any= Object.fromEntries(
            Object.entries(this.form.formulario.value).filter(([_, v]) => v !== null)
          );
        this.vehiculoService.crearVehiculo(limpio).subscribe(
            (data:any) =>
            {
              this.vehiculoService.handleCrearvehiculo(data);
              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {
              this.errorUsuario=this.vehiculoService.handleCrearvehiculoError(error.error.data);
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
