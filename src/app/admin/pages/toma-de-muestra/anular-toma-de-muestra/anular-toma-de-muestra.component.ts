import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TomaDeMuestraService } from 'src/app/admin/services/toma-de-muestra/toma-de-muestra.service';

@Component({
  selector: 'app-anular-toma-de-muestra',
  templateUrl: './anular-toma-de-muestra.component.html',
  styleUrls: ['./anular-toma-de-muestra.component.scss'],

})
export class AnularTomaDeMuestraComponent implements OnInit {
    public id!:any;
    public valido:boolean=false;
    public status:string='';
    public error!:any;
    public anulacion_tm:any={
      id:null,
      estado:null,
      justificacion_anulacion:null
    }
    public tdm:any;
  //public id_formulario:string='E-12345/2024';
  constructor(
    private actRoute:ActivatedRoute,
    private tomaDeMuestraService:TomaDeMuestraService,
    private notify:ToastrService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.actRoute.paramMap.subscribe(params=>{
        this.id=params.get('id');
        this.tomaDeMuestraService.verTomaDeMuestra(this.id).subscribe(
          (data:any)=>{
          this.tdm=this.tomaDeMuestraService.handleCrearTomaDeMuestraError(data);
          this.anulacion_tm.id=this.id
        },
        (error:any)=> this.error=this.tomaDeMuestraService.handleError(error));
      });
   }

  ngOnInit() {

  }
  onSubmit(){
    
    if(this.valido)
    {

        this.anulacion_tm.estado='ANULADO';
       
        this.tomaDeMuestraService.anularTomaDeMuestra(this.anulacion_tm).subscribe(
            (data:any) =>
            {
              //let sw:boolean=
              this.tdm= data;

              if(this.tdm)
              {
                this.router.navigate(['/admin/toma-de-muestra/']);
                this.notify.success('El el formulario'+this.tdm.nro_formulario+' se anulÃ³ exitosamente','Anulado Correctamente',{timeOut:2500,positionClass: 'toast-bottom-right'});
              }
            },
            (error:any) =>
            {
              this.error=this.tomaDeMuestraService.handleAprobarTomaDeMuestraError(error.data);
              this.status=error.error.status;
              if(this.status=='fail')
              {
                this.notify.error('FallÃ³ la anulaciÃ³n ...Revise el detalle de anulaciÃ³n y vuelva a enviar....','Error con la AnulaciÃ³n',{timeOut:2000,positionClass: 'toast-bottom-right'});
              }
            }
          );

    }
    else{
      this.notify.error('FallÃ³ la anulaciÃ³n ...Revise el detalle de anulaciÃ³n y vuelva a enviar....','Error con la AnulaciÃ³n',{timeOut:2000,positionClass: 'toast-bottom-right'});
    }
    //if(this.tdm.justificacion_anulacion.length>)
  }
  longitudTexto(event:any){
    if((event.target as HTMLInputElement).value.length>=100){
      this.valido=true;
      
    }
    else{
      this.valido=false;
    }
    
  }
  confirmarAnulacion() {
    this.confirmationService.confirm({
        key: 'confirm1',
        message: 'Â¿Estas seguro de anular el formulario '+this.tdm.nro_formulario+'?',
        accept: () => {
            this.onSubmit(); // Llama a onSubmit cuando el usuario acepta
          },
    });
}
}

