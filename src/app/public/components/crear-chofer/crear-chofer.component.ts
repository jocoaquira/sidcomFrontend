import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { IRol } from '@data/rol.metadata';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/authentication/services/auth.service';
import { IChofer } from '@data/chofer.metadata';
import { ChoferFormulario } from '../../../admin/validators/chofer';
import { ChoferService } from 'src/app/admin/services/chofer.service';

@Component({
  selector: 'app-crear-chofer',
  templateUrl: './crear-chofer.component.html',
  styleUrls: ['./crear-chofer.component.scss']
})
export class CrearChoferComponent implements OnInit {

  @Input() usuario!:IChofer;
  @Input() isEditMode: boolean = false;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  public error!:any;
  public errorVerificarContraseña:boolean=true;
  public errorVerificarEmail:boolean=false;
  public roles!:IRol[];
  public nombre:string='';
  public sw1:any;
  public sw:any;
  public sw2:any;
  public submitted:boolean=false;
  public estados:any;
  public admin:boolean=false;
  public form=new ChoferFormulario();
  public errorUsuario:any={};
  public operador_id:number=0;

  constructor(
    private choferService:ChoferService,
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
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.usuario && this.isEditMode) {
      this.form.formulario.patchValue({
        id:this.usuario.id,
        nombre_apellidos: this.usuario.nombre_apellidos,
        nro_licencia: this.usuario.nro_licencia,
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

    if (!this.form.formulario.value.estado) {
        this.notify.error('Seleccione un estado valido', 'Error', { timeOut: 2000 });
        return;
    }

    // Usa optional chaining (?.) para evitar errores
    const estadoLabel = this.form.formulario.value.estado?.label;

    this.form.formulario.patchValue({
        estado: estadoLabel
    });
    if (this.form.formulario.valid) {
        let limpio:any= Object.fromEntries(
            Object.entries(this.form.formulario.value).filter(([_, v]) => v !== null)
          );
        this.choferService.editarChofer(limpio).subscribe(
            (data:any) =>
            {
              this.choferService.handleCrearchofer(data);

              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {
              this.errorUsuario=this.choferService.handleCrearchoferError(error.error.data);
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
        const formValue = this.form.formulario.value;
    this.form.formulario.patchValue({
            operador_id: this.operador_id,
            estado: formValue.estado?.label || null
        });
    if (this.form.formulario.valid) {

        let limpio:any= Object.fromEntries(
            Object.entries(this.form.formulario.value).filter(([_, v]) => v !== null)
          );
        this.choferService.crearChofer(limpio).subscribe(
            (data:any) =>
            {
              this.choferService.handleCrearchofer(data);
              if(data.error==null)
              {
                this.form.formulario.reset();
                this.estadoDialogo.emit(false);
                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {
              this.errorUsuario=this.choferService.handleCrearchoferError(error.error.data);
              if(error.error.status=='fail')
              {
                this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
              }
            }
          );
      } else {
        (Object.values(this.form.formulario.controls) as AbstractControl[]).forEach(control => {
            control.markAsTouched();
        });
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
  }


}
