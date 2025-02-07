import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormularioExterno } from '@data/formulario_externo.metadata';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormularioExternosService } from 'src/app/admin/services/formulario-externo/formulariosexternos.service';
import { FormularioInternosService } from 'src/app/admin/services/formulario-interno/formulariosinternos.service';

@Component({
  selector: 'app-anular-formulario-externo',
  templateUrl: './anular-formulario-externo.component.html',
  styleUrls: ['./anular-formulario-externo.component.scss'],

})
export class AnularFormularioExternoComponent implements OnInit {
    public id!:any;
    public valido:boolean=false;
    public status:string='';
    public error!:any;
    public formulario_int:IFormularioExterno={
      id:null,
      user_id:null,
      operador_id:null,
      nro_formulario:null,
      m03_id:null,
      nro_factura_exportacion:null,
      laboratorio:null,
      codigo_analisis:null,
      nro_formulario_tm:null,
      lote:null,
      presentacion:null,
      cantidad:null,
      peso_bruto_humedo:null,
      peso_neto:null,
      tara:null,
      humedad:null,
      merma:null,
      comprador:null,
      aduana_id: null,
      pais_destino_id: null,
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
        //traslado_mineral:null,
        //nro_viajes:null
    };
  //public id_formulario:string='E-12345/2024';
  constructor(
    private actRoute:ActivatedRoute,
    private formularioExternoService:FormularioExternosService,
    private notify:ToastrService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.actRoute.paramMap.subscribe(params=>{
        this.id=params.get('id');
        this.formularioExternoService.verFormularioExterno(this.id).subscribe(
          (data:any)=>{
          this.formulario_int=this.formularioExternoService.handleCrearFormularioExterno(data);
          
        },
        (error:any)=> this.error=this.formularioExternoService.handleError(error));
      });
   }

  ngOnInit() {

  }
  onSubmit(){
    
    if(this.valido)
    {
        this.formulario_int.estado='ANULADO';
        this.formularioExternoService.anularFormularioExterno(this.formulario_int).subscribe(
            (data:any) =>
            {
              //let sw:boolean=
              this.formulario_int= this.formularioExternoService.handleEditarFormularioExterno(data);

              if(this.formulario_int)
              {
                this.router.navigate(['/admin/formulario-101/formulario-interno']);
                this.notify.success('El el formulario'+this.formulario_int.nro_formulario+' se anuló exitosamente','Anulado Correctamente',{timeOut:2500,positionClass: 'toast-bottom-right'});
              }
            },
            (error:any) =>
            {
              this.error=this.formularioExternoService.handleCrearFormularioExternoError(error.data);
              this.status=error.error.status;
              if(this.status=='fail')
              {
                this.notify.error('Falló la anulación ...Revise el detalle de anulación y vuelva a enviar....','Error con la Anulación',{timeOut:2000,positionClass: 'toast-bottom-right'});
              }
            }
          );

    }
    else{
      this.notify.error('Falló la anulación ...Revise el detalle de anulación y vuelva a enviar....','Error con la Anulación',{timeOut:2000,positionClass: 'toast-bottom-right'});
    }
    //if(this.formulario_int.justificacion_anulacion.length>)
  }
  longitudTexto(event:any){
    if((event.target as HTMLInputElement).value.length>=200){
      this.valido=true;
      
    }
    else{
      this.valido=false;
    }
    
  }
  confirmarAnulacion() {
    this.confirmationService.confirm({
        key: 'confirm1',
        message: '¿Estas seguro de anular el formulario '+this.formulario_int.nro_formulario+'?',
        accept: () => {
            this.onSubmit(); // Llama a onSubmit cuando el usuario acepta
          },
    });
}
}
