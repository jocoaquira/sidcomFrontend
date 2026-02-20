import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormularioInternosService } from 'src/app/admin/services/formulario-interno/formulariosinternos.service';

@Component({
  selector: 'app-anular-formulario-interno',
  templateUrl: './anular-formulario-interno.component.html',
  styleUrls: ['./anular-formulario-interno.component.scss'],

})
export class AnularFormularioInternoComponent implements OnInit {
    public id!:any;
    public valido:boolean=false;
    public status:string='';
    public error!:any;
    public formulario_int:IFormularioInterno={
        id:null,
        user_id:null,
        operador_id:null,
        nro_formulario:null,
        lote:null,
        presentacion_id:0,
        cantidad:null,
        peso_bruto_humedo:0,
        peso_neto:0,
        tara:0,
        humedad:0,
        merma:0,
        des_tipo:'',
        des_comprador:null,
        des_planta: null,
        id_municipio_destino: null,
        tipo_transporte: null,
        placa: null,
        nom_conductor: null,
        licencia: null,
        observaciones: null,
        fecha_creacion: null,
        fecha_vencimiento: null,
        justificacion_anulacion: null,
        estado:null, //'GENERADO','EMITIDO','VENCIDO', 'ANULADO'
        nro_vagon:null,
        empresa_ferrea:null,
        fecha_ferrea:null,
        hr_ferrea:null,
        tara_volqueta:null,
        //copes
        traslado_mineral:null,
        nro_viajes:null
    };
  //public id_formulario:string='E-12345/2024';
  constructor(
    private actRoute:ActivatedRoute,
    private formularioInternoService:FormularioInternosService,
    private notify:ToastrService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.actRoute.paramMap.subscribe(params=>{
        this.id=params.get('id');
        this.formularioInternoService.verFormularioInterno(this.id).subscribe(
          (data:any)=>{
          this.formulario_int=this.formularioInternoService.handleCrearFormularioInterno(data);
          
        },
        (error:any)=> this.error=this.formularioInternoService.handleError(error));
      });
   }

  ngOnInit() {

  }
  onSubmit(){
    
    if(this.valido)
    {
        this.formulario_int.estado='ANULADO';
        this.formularioInternoService.anularFormularioInterno(this.formulario_int).subscribe(
            (data:any) =>
            {
              //let sw:boolean=
              this.formulario_int= this.formularioInternoService.handleEditarFormularioInterno(data);

              if(this.formulario_int)
              {
                this.router.navigate(['/admin/formulario-101/formulario-interno']);
                this.notify.success('El el formulario'+this.formulario_int.nro_formulario+' se anulÃ³ exitosamente','Anulado Correctamente',{timeOut:2500,positionClass: 'toast-bottom-right'});
              }
            },
            (error:any) =>
            {
              this.error=this.formularioInternoService.handleCrearFormularioInternoError(error.data);
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
    //if(this.formulario_int.justificacion_anulacion.length>)
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
        message: 'Â¿Estas seguro de anular el formulario '+this.formulario_int.nro_formulario+'?',
        accept: () => {
            this.onSubmit(); // Llama a onSubmit cuando el usuario acepta
          },
    });
}
}

