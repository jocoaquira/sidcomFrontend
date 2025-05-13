import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormularioTrasladoCola } from '@data/formulario_cola.metadata';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormularioTrasladoColaService } from 'src/app/admin/services/formulario-traslado-cola/formulario-traslado-cola.service';

@Component({
  selector: 'app-anular-formulario-traslado-cola',
  templateUrl: './anular-formulario-traslado-cola.component.html',
  styleUrls: ['./anular-formulario-traslado-cola.component.scss'],

})
export class AnularFormularioTrasladoColaComponent implements OnInit {
    public id!:any;
    public valido:boolean=false;
    public status:string='';
    public error!:any;
    public formulario_int:IFormularioTrasladoCola={
        id:null,
        user_id:null,
        operador_id:null,
        nro_formulario:null,
        lote:null,

        peso_bruto_humedo:0,
        peso_neto:0,
        tara:0,

        destino:'',
        almacen:null,
        dique_cola: null,
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
        nro_viajes:null
    };
  //public id_formulario:string='E-12345/2024';
  constructor(
    private actRoute:ActivatedRoute,
    private formularioInternoService:FormularioTrasladoColaService,
    private notify:ToastrService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.actRoute.paramMap.subscribe(params=>{
        this.id=params.get('id');
        this.formularioInternoService.verFormularioTrasladoCola(this.id).subscribe(
          (data:any)=>{
          this.formulario_int=this.formularioInternoService.handleCrearFormularioTrasladoCola(data);

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
        this.formularioInternoService.anularFormularioTrasladoCola(this.formulario_int).subscribe(
            (data:any) =>
            {
              //let sw:boolean=
              this.formulario_int= this.formularioInternoService.handleEditarFormularioTrasladoCola(data);

              if(this.formulario_int)
              {
                this.router.navigate(['/public/formulario-101/formulario-traslado-cola']);
                this.notify.success('El el formulario'+this.formulario_int.nro_formulario+' se anuló exitosamente','Anulado Correctamente',{timeOut:2500,positionClass: 'toast-bottom-right'});
              }
            },
            (error:any) =>
            {
              this.error=this.formularioInternoService.handleCrearFormularioTrasladoColaError(error.data);
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
