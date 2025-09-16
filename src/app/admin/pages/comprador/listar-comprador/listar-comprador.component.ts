import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IRol } from '@data/rol.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { IComprador } from '@data/comprador.metadata';
import { CompradoresService } from 'src/app/admin/services/compradores.service';
import { CanCrearCompradorGuard } from 'src/app/admin/guards/comprador/can-crear-comprador.guard';
import { CanEditarCompradorGuard } from 'src/app/admin/guards/comprador/can-editar-comprador.guard';
import { CanEliminarCompradorGuard } from 'src/app/admin/guards/comprador/can-eliminar-comprador.guard';

@Component({
    templateUrl: './listar-comprador.component.html',
    styleUrls: ['./listar-comprador.component.scss'],
    providers: [MessageService]
})
export class ListarCompradorComponent implements OnInit {

    public listarCompradores!:IComprador[];

    public roles!:IRol[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public isEditMode: boolean = false;
    public comprador:IComprador={
        id: null,
        nit:null,
        direccion:null,
        razon_social:null,
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
        private compradorService:CompradoresService,
        public canCrearComprador:CanCrearCompradorGuard,
        public canEditarComprador:CanEditarCompradorGuard,
        public canEliminarComprador:CanEliminarCompradorGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
        private router: Router,
    ) {
        this.operador_id= authService.getUser.operador_id

    }

    ngOnInit() {
        this.compradorService.verCompradores('nada').subscribe(
            (data:any)=>{
            this.listarCompradores=this.compradorService.handleComprador(data);

          },
          (error:any)=> this.error=this.compradorService.handleError(error));

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
        this.compradorService.verCompradores('nada').subscribe(
            (data:any)=>{
            this.listarCompradores=this.compradorService.handleComprador(data);


          },
          (error:any)=> this.error=this.compradorService.handleError(error));
    }
    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = false;
    }
    edit(comprador:IComprador) {
        this.comprador = { ...comprador };

        this.router.navigate(['/admin/lugar-verificacion-tdm/editar', this.comprador.id]);
    }
    eliminar(comprador:IComprador) {
        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Eliminar el registro de '+comprador.razon_social+' definitivamente?',
            accept: () => {
                this.comprador = { ...comprador };

                this.compradorService.eliminarComprador(comprador.id).subscribe(
                    (data:any)=>{
                        this.compradorService.verCompradores('nada').subscribe(
                            (data:any)=>{
                            this.listarCompradores=this.compradorService.handleComprador(data);

                        },
                        (error:any)=> this.error=this.compradorService.handleError(error));
                        this.notify.success('El Comprador se eliminó exitosamente', 'Eliminado Correctamente', { timeOut: 2500, positionClass: 'toast-top-right' });
                        this.router.navigate(['/admin/lugar-verificacion-tdm']);
                },
                (error:any)=> this.error=this.compradorService.handleError(error));
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
        for (let i = 0; i < this.listarCompradores.length; i++) {
            if (this.listarCompradores[i].id === id) {
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
    bloquearDialogo(comprador:IComprador){

        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Realizar esta Operación?',
            accept: () => {
                if(comprador.estado=='ACTIVO')
                    {
                        comprador.estado='INACTIVO';
                    }
                    else{
                        comprador.estado='ACTIVO';
                    }
                this.compradorService.editarComprador(comprador).subscribe(
                    (data:any) =>
                    {
                      this.compradorService.handleCrearComprador(data);

                      if(data.error==null)
                      {
                        this.compradorService.verCompradores('nada').subscribe(
                            (data:any)=>{
                            this.listarCompradores=this.compradorService.handleComprador(data);


                          },
                          (error:any)=> this.error=this.compradorService.handleError(error));

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
