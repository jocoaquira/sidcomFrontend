import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { IRol } from '@data/rol.metadata';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/authentication/services/auth.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { IChofer } from '@data/chofer.metadata';
import { ChoferFormulario } from 'src/app/admin/validators/chofer';
import { ChoferService } from 'src/app/admin/services/chofer.service';
import { IOperatorSimple } from '@data/operador_simple.metadata';

@Component({
  selector: 'app-crear-chofer-admin',
  templateUrl: './crear-chofer-admin.component.html',
  styleUrls: ['./crear-chofer-admin.component.scss']
})
export class CrearChoferAdminComponent implements OnInit {

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
  public categorias:any;
  public admin:boolean=false;
  public form=new ChoferFormulario();
  public errorUsuario:any={};
  public operador_id:number=0;
  public operadores!:IOperatorSimple[];

  constructor(
    private choferService:ChoferService,
    private operadoresService:OperatorsService,
    private notify:ToastrService,
    private authService:AuthService,
        ) {
        }

  ngOnInit(): void {
    this.operadoresService.verOperatorsSimple('hj').subscribe(
        (data:any)=>{
        this.operadores=this.operadoresService.handleOperatorSimple(data);
        console.log(this.operadores);
      },
      (error:any)=> this.error=this.operadoresService.handleOperatorSimpleError(error));

    this.estados = [
      { label: 'ACTIVO', value: '1' },
      { label: 'INACTIVO', value: '0' }
  ];
  this.categorias = [
    { label: 'A', value: '0' },
    { label: 'B', value: '1' },
    { label: 'C', value: '2' }
];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.usuario && this.isEditMode) {
      this.form.formulario.patchValue({
        id:this.usuario.id,
        nombre_apellidos: this.usuario.nombre_apellidos,
        nro_licencia: this.usuario.nro_licencia,
        fecha_vencimiento: this.usuario.fecha_vencimiento ? new Date(this.usuario.fecha_vencimiento) : null,
        categoria:this.categorias.find((e: any) => e.label === this.usuario.categoria) || null,
        celular: this.usuario.celular,
        fecha_nacimiento: this.usuario.fecha_nacimiento ? new Date(this.usuario.fecha_nacimiento) : null,
        operador_id: this.operadores.find((op: any) => op.id === this.usuario.operador_id).id || null, // Buscar el operador en la lista
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

    if (!this.form.formulario.value.categoria || !this.form.formulario.value.estado) {
        this.notify.error('Seleccione una categoría y estado válidos', 'Error', { timeOut: 2000 });
        return;
    }

    // Usa optional chaining (?.) para evitar errores
    const categoriaLabel = this.form.formulario.value.categoria?.label;
    const estadoLabel = this.form.formulario.value.estado?.label;

    this.form.formulario.patchValue({
        categoria: categoriaLabel,
        estado: estadoLabel,
        celular: parseInt(this.form.formulario.value.celular)
    });
    if (this.form.formulario.valid) {
        let limpio:any= Object.fromEntries(
            Object.entries(this.form.formulario.value).filter(([_, v]) => v !== null)
          );
          console.log(this.form.formulario.value)
          console.log(limpio)
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

    this.form.formulario.patchValue({
      celular:parseInt(this.form.formulario.value.celular),
      estado:this.form.formulario.value.estado.label,
      categoria:this.form.formulario.value.categoria.label
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
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
      }
  }


}
