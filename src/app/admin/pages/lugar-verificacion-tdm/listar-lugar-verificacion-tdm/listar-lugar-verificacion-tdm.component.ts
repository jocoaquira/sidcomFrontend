import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { RolesService } from 'src/app/admin/services/roles.service';
import { IRol } from '@data/rol.metadata';
import { IOperatorSimple } from '@data/operador_simple.metadata';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PaisesService } from 'src/app/admin/services/paises.service';
import { ILugarVerificacionTDM } from '@data/lugar_verificacion_tdm.metadata';
import { LugarVerificacionTDMService } from 'src/app/admin/services/lugar_verificacion_tdm.service';
import { Router } from '@angular/router';
import { CanCrearLugarVerificacionTDMGuard } from 'src/app/admin/guards/lugar-verificacion-tdm/can-crear-lugar-verificacion-tdm.guard';
import { CanEditarLugarVerificacionTDMGuard } from 'src/app/admin/guards/lugar-verificacion-tdm/can-editar-lugar-verificacion-tdm.guard';
import { CanEliminarLugarVerificacionTDMGuard } from 'src/app/admin/guards/lugar-verificacion-tdm/can-eliminar-lugar-verificacion-tdm.guard';



@Component({
    templateUrl: './listar-lugar-verificacion-tdm.component.html',
    styleUrls: ['./listar-lugar-verificacion-tdm.component.scss'],
    providers: [MessageService]
})
export class ListarLugarVerificacionTDMComponent implements OnInit {

    public listaLugaresVerificacion!:ILugarVerificacionTDM[];

    public roles!:IRol[];
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
        public canCrearLugarVerificacionTDM:CanCrearLugarVerificacionTDMGuard,
        public canEditarLugarVerificacionTDM:CanEditarLugarVerificacionTDMGuard,
        public canEliminarLugarVerificacionTDM:CanEliminarLugarVerificacionTDMGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
        private router: Router,
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
        this.router.navigate(['/admin/lugar-verificacion-tdm/editar', this.lugar_verificacion.id]);
    }
    eliminar(lugar_verificacion:ILugarVerificacionTDM) {
        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Eliminar el registro de '+lugar_verificacion.lugar+' definitivamente?',
            accept: () => {
                this.lugar_verificacion = { ...lugar_verificacion };
                console.log(this.lugar_verificacion);
                this.lugarVerificacionTDMService.eliminarlugarverificacionTDM(lugar_verificacion.id).subscribe(
                    (data:any)=>{
                        this.lugarVerificacionTDMService.verlugarverificacionTDMs('nada').subscribe(
                            (data:any)=>{
                            this.listaLugaresVerificacion=this.lugarVerificacionTDMService.handlelugarverificacion(data);
                            console.log(this.listaLugaresVerificacion);
                        },
                        (error:any)=> this.error=this.lugarVerificacionTDMService.handleError(error));
                        this.notify.success('El Lugar de Toma de Muestra se eliminó exitosamente', 'Eliminado Correctamente', { timeOut: 2500, positionClass: 'toast-top-right' });
                        this.router.navigate(['/admin/lugar-verificacion-tdm']);
                },
                (error:any)=> this.error=this.lugarVerificacionTDMService.handleError(error));
              },
        });
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
openGoogleMaps(lat: number, lon: number) {
        if (lat && lon) {
            const url = `https://www.google.com/maps?q=${lat},${lon}`;
            window.open(url, '_blank');
        } else {
            console.warn('Coordenadas no disponibles');
            // Opcional: Mostrar mensaje al usuario
        }
    }
    bloquearDialogo(lugar_verificacion_tdm:ILugarVerificacionTDM){

        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Realizar esta Operación?',
            accept: () => {
                if(lugar_verificacion_tdm.estado=='ACTIVO')
                    {
                        lugar_verificacion_tdm.estado='INACTIVO';
                    }
                    else{
                        lugar_verificacion_tdm.estado='ACTIVO';
                    }
                this.lugarVerificacionTDMService.editarlugarverificacionTDM(lugar_verificacion_tdm).subscribe(
                    (data:any) =>
                    {
                      this.lugarVerificacionTDMService.handleCrearlugarverificacionTDM(data);
                      console.log(data);
                      if(data.error==null)
                      {
                        this.lugarVerificacionTDMService.verlugarverificacionTDMs('nada').subscribe(
                            (data:any)=>{
                            this.listaLugaresVerificacion=this.lugarVerificacionTDMService.handlelugarverificacion(data);
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
        });
    }
}
