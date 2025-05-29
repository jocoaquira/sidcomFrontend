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
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PaisesService } from 'src/app/admin/services/paises.service';
import { ILugarVerificacionTDM } from '@data/lugar_verificacion_tdm.metadata';
import { LugarVerificacionTDMService } from 'src/app/admin/services/lugar_verificacion_tdm.service';



@Component({
    templateUrl: './listar-lugar-verificacion-tdm.component.html',
    styleUrls: ['./listar-lugar-verificacion-tdm.component.scss'],
    providers: [MessageService]
})
export class ListarLugarVerificacionTDMComponent implements OnInit {

    public listaLugaresVerificacion!:ILugarVerificacionTDM[];

    public roles!:IRol[];
    public operadores!:IOperatorSimple[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public isEditMode: boolean = false;
    public lugar_verificacion:ILugarVerificacionTDM={
        id: null,
        lugar:null,
        latitud:null,
        longitud:null,
        municipio_id:null,
        estado:null
    };
    public submitted = true;
    public deleteProductsDialog = false;
    public deleteProductDialog=false;
    public operador_id:number=0;

    constructor(
        private messageService: MessageService,
        private lugarVerificacionTDMService:LugarVerificacionTDMService,
        private rolesServices:RolesService,
        private operadoresService:OperatorsService,
        public canCrearUsuario:CanCrearUsuarioGuard,
        public canEditarUsuario:CanEditarUsuarioGuard,
        public canEliminarUsuario:CanEliminarUsuarioGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService
    ) {
        this.operador_id= authService.getUser.operador_id
        console.log(this.operador_id);
    }

    ngOnInit() {
        this.lugarVerificacionTDMService.verlugarverificacionTDMs('nada').subscribe(
            (data:any)=>{
            this.listaLugaresVerificacion=this.lugarVerificacionTDMService.handlelugarverificacion(data);
            console.log(this.listaLugaresVerificacion);

          },
          (error:any)=> this.error=this.lugarVerificacionTDMService.handleError(error));

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
        this.lugarVerificacionTDMService.verlugarverificacionTDMs('nada').subscribe(
            (data:any)=>{
            this.listaLugaresVerificacion=this.lugarVerificacionTDMService.handlelugarverificacion(data);
            console.log(this.listaLugaresVerificacion);

          },
          (error:any)=> this.error=this.lugarVerificacionTDMService.handleError(error));
    }
    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = false;
    }
    edit(lugar_verificacion:ILugarVerificacionTDM) {
        this.lugar_verificacion = { ...lugar_verificacion };
        console.log(this.lugar_verificacion);
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
        for (let i = 0; i < this.listaLugaresVerificacion.length; i++) {
            if (this.listaLugaresVerificacion[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    userRol(rol_id:any):string{
        if(this.roles!=null){
        let resp='';
        let index = -1;
        for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].id === rol_id) {
                index = i;
                break;
            }
        }
        return this.roles[index].nombre;
    }
    return '';
    }

    bloquearDialogo(pais:ILugarVerificacionTDM){
        /*
        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Realizar esta Operación?',
            accept: () => {
                if(pais.estado=='ACTIVO')
                    {
                        pais.estado='INACTIVO';
                    }
                    else{
                        pais.estado='ACTIVO';
                    }
                this.lugarVerificacionTDMService.editarpais(pais).subscribe(
                    (data:any) =>
                    {
                      this.lugarVerificacionTDMService.handleCrearpais(data);
                      console.log(data);
                      if(data.error==null)
                      {
                        this.lugarVerificacionTDMService.verpaiss('nada').subscribe(
                            (data:any)=>{
                            this.listaLugaresVerificacion=this.lugarVerificacionTDMService.handlepais(data);
                            console.log(this.listaLugaresVerificacion);

                          },
                          (error:any)=> this.error=this.lugarVerificacionTDMService.handleError(error));

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
        });*/
    }
}
