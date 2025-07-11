import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UsuariosService } from 'src/app/admin/services/usuarios.service';
import { CanCrearUsuarioGuard } from 'src/app/admin/guards/usuarios/can-crear-usuario.guard';
import { CanEditarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-editar-usuario.guard';
import { CanEliminarUsuarioGuard } from 'src/app/admin/guards/usuarios/can-eliminar-usuario.guard';
import { RolesService } from 'src/app/admin/services/roles.service';
import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { ResponsableTMService } from 'src/app/admin/services/toma-de-muestra/responsable-tm.service';
import { IResponsableTM } from '@data/responsable_tm.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { ResponsableSenarecomService } from 'src/app/admin/services/responsable-senarecom.service';
import { IResponsableSenarecom } from '@data/responsable_senarecom_tm.metadata';
import { ToastrService } from 'ngx-toastr';



@Component({
    templateUrl: './listar-responsable-senarecom.component.html',
    providers: [MessageService]
})
export class ListarResponsableSenarecomComponent implements OnInit {

    public listaUsuarios!:IResponsableSenarecom[];
    public usuario:IResponsableTM={
        id: null,
        email: null,
        nombre:null,
        apellidos:null,
        ci:null,
        celular:null,
        operador_id:null,
        estado:null,
        created_at:null,
        updated_at:null,
    };
    public roles!:IRol[];
    public operadores!:IOperatorSimple[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public isEditMode: boolean = false;
    public responsable:IResponsableSenarecom={
        id: null,
        email: null,
        nombre:null,
        apellidos:null,
        ci:null,
        celular:null,
        cargo:null,
        estado:null,
    };
    public submitted = true;
    public operador_id:number=0;

    constructor(
        private messageService: MessageService,
        private responsableSenarecomService:ResponsableSenarecomService,
        private rolesServices:RolesService,
        private operadoresService:OperatorsService,
        public canCrearUsuario:CanCrearUsuarioGuard,
        public canEditarUsuario:CanEditarUsuarioGuard,
        public canEliminarUsuario:CanEliminarUsuarioGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
    ) {
        this.operador_id= authService.getUser.operador_id
      
    }

    ngOnInit() {
        this.responsableSenarecomService.verResponsableSenarecom('nada').subscribe(
            (data:any)=>{
            this.listaUsuarios=this.responsableSenarecomService.handleusuario(data);
          

          },
          (error:any)=> this.error=this.responsableSenarecomService.handleError(error));

        this.operadoresService.verOperatorsSimple(this.nombre).subscribe(
            (data:any)=>{
            this.operadores=this.operadoresService.handleOperatorSimple(data.data);
        },
        (error:any)=> this.error=this.operadoresService.handleOperatorSimpleError(error));
        //this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }
    cerrar(event:any){
        this.productDialog=event;
        this.responsableSenarecomService.verResponsableSenarecom('nada').subscribe(
            (data:any)=>{
            this.listaUsuarios=this.responsableSenarecomService.handleusuario(data);
          

          },
          (error:any)=> this.error=this.responsableSenarecomService.handleError(error));
    }
    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = false;
    }
    edit(responsable:IResponsableSenarecom) {
        this.responsable = { ...responsable };

        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = true;
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    diasActivos(fecha1:string):number{
        let dias:any;
        let fechas1 = new Date(fecha1);
        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);
        dias=fechas1.getTime()-hoy.getTime();
        dias=dias / 1000 / 60 / 60 / 24;
        dias=Math.round (dias);
        return dias;
    }
    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.listaUsuarios.length; i++) {
            if (this.listaUsuarios[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    bloquearDialogo(responsable:IResponsableSenarecom){
    this.confirmationService.confirm({
        key: 'confirm1',
        message: '¿Estas seguro de Realizar esta Operación?',
        accept: () => {
        if(responsable.estado=='ACTIVO')
        {
            responsable.estado='INACTIVO';
        }
        else{
            responsable.estado='ACTIVO';
        }
        this.responsableSenarecomService.editarResponsableSenarecom(responsable).subscribe(
            (data:any) =>
            {
              this.responsableSenarecomService.handleCrearusuario(data);
            
              if(data.error==null)
              {
                this.responsableSenarecomService.verResponsableSenarecom('nada').subscribe(
                    (data:any)=>{
                    this.listaUsuarios=this.responsableSenarecomService.handleusuario(data);
                  

                  },
                  (error:any)=> this.error=this.responsableSenarecomService.handleError(error));

                this.notify.success('Actualizado Correctamente','Actualizado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
              }
            },
            (error:any) =>
            {
              if(error.error.status=='fail')
              {
                this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con la Actualizacion',{timeOut:2000,positionClass: 'toast-top-right'});
              }
            }
          );
        },
    });
    }
}
