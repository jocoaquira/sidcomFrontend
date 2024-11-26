import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { FormularioInternosService } from 'src/app/admin/services/formulario-interno/formulariosinternos.service';

@Component({
  selector: 'app-anular-formulario-interno',
  templateUrl: './anular-formulario-interno.component.html',
  styleUrls: ['./anular-formulario-interno.component.scss']
})
export class AnularFormularioInternoComponent implements OnInit {
    public id!:any;
    public formulario_int:IFormularioInterno={
        id:null,
        user_id:null,
        operator_id:null,
        nro_formulario:null,
        lote:null,
        presentacion:null,
        cantidad:null,
        peso_bruto_humedo:0,
        peso_neto_seco:0,
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
  public id_formulario:string='E-12345/2024';
  constructor(
    private actRoute:ActivatedRoute,
    formularioInternoService:FormularioInternosService,
  ) {
    this.actRoute.paramMap.subscribe(params=>{
        this.id=params.get('id');
        console.log(this.id);
      });
   }

  ngOnInit() {
  }
  onSubmit(){

  }
}
