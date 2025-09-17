import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IRol } from '@data/rol.metadata';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { IPlantaDeTratamiento } from '@data/planta_tratamiento.metadata';
import { PlantaDeTratamientoService } from 'src/app/admin/services/planta-tratamientos.service';
import { CanCrearPlantaDeTratamientoGuard } from 'src/app/admin/guards/planta-de-tratamiento/can-crear-planta-de-tratamiento.guard';
import { CanEditarPlantaDeTratamientoGuard } from 'src/app/admin/guards/planta-de-tratamiento/can-editar-planta-de-tratamiento.guard';
import { CanEliminarPlantaDeTratamientoGuard } from 'src/app/admin/guards/planta-de-tratamiento/can-eliminar-planta-de-tratamiento.guard';

@Component({
    templateUrl: './listar-planta-tratamiento.component.html',
    styleUrls: ['./listar-planta-tratamiento.component.scss'],
    providers: [MessageService]
})
export class ListarPlantaDeTratamientoComponent implements OnInit {

    public listarPlantaDeTratamientos!:IPlantaDeTratamiento[];

    public roles!:IRol[];
    public error!:any;
    public nombre!:string;
    public buscarTexto:string='';
    public cols!:any;
    public statuses!:any;
    public productDialog=false;
    public isEditMode: boolean = false;
    public plantaDeTratamiento:IPlantaDeTratamiento={
        id: null,
        direccion:null,
        nombre:null,
        latitud:null,
        longitud:null,
        municipioId:null,
        estado:null
    };
    public submitted = true;
    public deleteProductsDialog = false;
    public deleteProductDialog=false;
    public operador_id:number=0;

    constructor(
        private messageService: MessageService,
        private plantaDeTratamientoService:PlantaDeTratamientoService,
        public canCrearPlantaDeTratamiento:CanCrearPlantaDeTratamientoGuard,
        public canEditarPlantaDeTratamiento:CanEditarPlantaDeTratamientoGuard,
        public canEliminarPlantaDeTratamiento:CanEliminarPlantaDeTratamientoGuard,
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
        private router: Router,
    ) {
        this.operador_id= authService.getUser.operador_id

    }

    ngOnInit() {
        this.plantaDeTratamientoService.verPlantaDeTratamientos('nada').subscribe(
            (data:any)=>{
            this.listarPlantaDeTratamientos=this.limpiarArrayPlantas(this.plantaDeTratamientoService.handlePlantaDeTratamiento(data));

          },
          (error:any)=> this.error=this.plantaDeTratamientoService.handleError(error));

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
        this.plantaDeTratamientoService.verPlantaDeTratamientos('nada').subscribe(
            (data:any)=>{
            this.listarPlantaDeTratamientos=this.limpiarArrayPlantas(this.plantaDeTratamientoService.handlePlantaDeTratamiento(data));


          },
          (error:any)=> this.error=this.plantaDeTratamientoService.handleError(error));
    }
    openNew() {
        //this.product = {};
        //this.submitted = false;
        this.productDialog = true;
        this.isEditMode = false;
    }
    edit(plantaDeTratamiento:IPlantaDeTratamiento) {
        this.plantaDeTratamiento = { ...plantaDeTratamiento };

        this.router.navigate(['/admin/planta-tratamiento/editar', this.plantaDeTratamiento.id]);
    }
    eliminar(plantaDeTratamiento:IPlantaDeTratamiento) {
        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Eliminar el registro de '+plantaDeTratamiento.nombre+' definitivamente?',
            accept: () => {
                this.plantaDeTratamiento = { ...plantaDeTratamiento };

                this.plantaDeTratamientoService.eliminarPlantaDeTratamiento(plantaDeTratamiento.id).subscribe(
                    (data:any)=>{
                        this.plantaDeTratamientoService.verPlantaDeTratamientos('nada').subscribe(
                            (data:any)=>{
                            this.listarPlantaDeTratamientos=this.limpiarArrayPlantas(this.plantaDeTratamientoService.handlePlantaDeTratamiento(data));

                        },
                        (error:any)=> this.error=this.plantaDeTratamientoService.handleError(error));
                        this.notify.success('El PlantaDeTratamiento se eliminó exitosamente', 'Eliminado Correctamente', { timeOut: 2500, positionClass: 'toast-top-right' });
                        this.router.navigate(['/admin/planta-tratamiento']);
                },
                (error:any)=> this.error=this.plantaDeTratamientoService.handleError(error));
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
        for (let i = 0; i < this.listarPlantaDeTratamientos.length; i++) {
            if (this.listarPlantaDeTratamientos[i].id === id) {
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
    bloquearDialogo(plantaDeTratamiento:IPlantaDeTratamiento){
        console.log('esto es:',plantaDeTratamiento);

        this.confirmationService.confirm({
            key: 'confirm1',
            message: '¿Estas seguro de Realizar esta Operación?',
            accept: () => {
                if(plantaDeTratamiento.estado=='ACTIVO')
                    {
                        plantaDeTratamiento.estado='INACTIVO';
                    }
                    else{
                        plantaDeTratamiento.estado='ACTIVO';
                    }
                this.plantaDeTratamientoService.editarPlantaDeTratamiento(plantaDeTratamiento).subscribe(
                    (data:any) =>
                    {
                      this.plantaDeTratamientoService.handleCrearPlantaDeTratamiento(data);

                      if(data.error==null)
                      {
                        this.plantaDeTratamientoService.verPlantaDeTratamientos('nada').subscribe(
                            (data:any)=>{
                            this.listarPlantaDeTratamientos=this.limpiarArrayPlantas(this.plantaDeTratamientoService.handlePlantaDeTratamiento(data));


                          },
                          (error:any)=> this.error=this.plantaDeTratamientoService.handleError(error));

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
    limpiarArrayPlantas(plantas: any[]): IPlantaDeTratamiento[] {
        return plantas.map(({ departamento, municipio, ...plantaLimpia }) => plantaLimpia);
    }
}
