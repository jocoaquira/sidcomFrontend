import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { RolesService } from 'src/app/admin/services/roles.service';
import { IRol } from '@data/rol.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CanCrearTrancaGuard } from 'src/app/admin/guards/tranca/can-crear-tranca.guard';
import { CanEditarTrancaGuard } from 'src/app/admin/guards/tranca/can-editar-tranca.guard';
import { ITranca } from '@data/tranca.metadata';
import { TrancaService } from 'src/app/admin/services/tranca.service';
import { CanEliminarTrancaGuard } from 'src/app/admin/guards/tranca/can-eliminar-tranca.guard';



@Component({
    templateUrl: './listar-tranca.component.html',
    styleUrls: ['./listar-tranca.component.scss'],
    providers: [MessageService]
})
export class ListarTrancaComponent implements OnInit {

    public listaTrancas!:ITranca[];

    public roles!:IRol[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public isEditMode: boolean = false;
    public tranca:ITranca={
        id: null,
        nombre:null,
        latitud:null,
        longitud:null,
        municipio_id:null,
        descripcion:null,
        estado:null
    };
    public submitted = true;
    public deleteProductsDialog = false;
    public deleteProductDialog=false;
    public operador_id:number=0;

    constructor(
        private messageService: MessageService,
        private lugarVerificacionTDMService:TrancaService,
        public canCrearTranca:CanCrearTrancaGuard,
        public canEditarTranca:CanEditarTrancaGuard,
        public canEliminarTranca:CanEliminarTrancaGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
        private router: Router,
    ) {
        this.operador_id= authService.getUser.operador_id
        console.log(this.operador_id);
    }

    ngOnInit() {
        this.lugarVerificacionTDMService.verTranca('nada').subscribe(
            (data:any)=>{
            this.listaTrancas=this.lugarVerificacionTDMService.handlelugarverificacion(data);
            console.log(this.listaTrancas);
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
        this.lugarVerificacionTDMService.verTranca('nada').subscribe(
            (data:any)=>{
            this.listaTrancas=this.lugarVerificacionTDMService.handlelugarverificacion(data);
            console.log(this.listaTrancas);

          },
          (error:any)=> this.error=this.lugarVerificacionTDMService.handleError(error));
    }
    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = false;
    }
    edit(tranca:ITranca) {
        this.tranca = { ...tranca };
        console.log(this.tranca);
        this.router.navigate(['/admin/tranca/editar', this.tranca.id]);
    }
    eliminar(tranca:ITranca) {
        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Eliminar el registro de '+tranca.nombre+' definitivamente?',
            accept: () => {
                this.tranca = { ...tranca };
                console.log(this.tranca);
                this.lugarVerificacionTDMService.eliminarTranca(tranca.id).subscribe(
                    (data:any)=>{
                        this.lugarVerificacionTDMService.verTranca('nada').subscribe(
                            (data:any)=>{
                            this.listaTrancas=this.lugarVerificacionTDMService.handlelugarverificacion(data);
                            console.log(this.listaTrancas);
                        },
                        (error:any)=> this.error=this.lugarVerificacionTDMService.handleError(error));
                        this.notify.success('El Lugar de Toma de Muestra se eliminó exitosamente', 'Eliminado Correctamente', { timeOut: 2500, positionClass: 'toast-top-right' });
                        this.router.navigate(['/admin/tranca']);
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
        for (let i = 0; i < this.listaTrancas.length; i++) {
            if (this.listaTrancas[i].id === id) {
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
    bloquearDialogo(tranca:ITranca){

        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Realizar esta Operación?',
            accept: () => {
                if(tranca.estado=='ACTIVO')
                    {
                        tranca.estado='INACTIVO';
                    }
                    else{
                        tranca.estado='ACTIVO';
                    }
                this.lugarVerificacionTDMService.editarTranca(tranca).subscribe(
                    (data:any) =>
                    {
                      this.lugarVerificacionTDMService.handleCrearTranca(data);
                      console.log(data);
                      if(data.error==null)
                      {
                        this.lugarVerificacionTDMService.verTranca('nada').subscribe(
                            (data:any)=>{
                            this.listaTrancas=this.lugarVerificacionTDMService.handlelugarverificacion(data);
                            console.log(this.listaTrancas);

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
