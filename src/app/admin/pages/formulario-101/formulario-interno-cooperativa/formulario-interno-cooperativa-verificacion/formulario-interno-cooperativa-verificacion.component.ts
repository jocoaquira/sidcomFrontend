
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IFormularioInternoCooperativaPDF } from '@data/formulario_interno_cooperativa_pdf.metadata';
import { FormularioCooperativaService } from 'src/app/admin/services/formulario-interno-cooperativa/formulario-cooperativa.service';

@Component({
  selector: 'app-formulario-interno-cooperativa-verificacion',
  templateUrl: './formulario-interno-cooperativa-verificacion.component.html',
  styleUrls: ['./formulario-interno-cooperativa-verificacion.component.scss']
})
export class FormularioInternoCooperativaVerificacionComponent implements OnInit {
    public hash:string='';
    public error:any;
    public formIntCoope!:IFormularioInternoCooperativaPDF;

  constructor(
    private actRoute: ActivatedRoute,
    private FormularioCooperativaService:FormularioCooperativaService
  ) {
        this.actRoute.paramMap.subscribe(
            params=>
            {
            this.hash=params.get('hash');
            this.FormularioCooperativaService.verFormularioInternoCooperativaHash(this.hash).subscribe(
                (data:any)=>{
                    this.formIntCoope=this.FormularioCooperativaService.handleFormularioInternoCooperativaPDF(data);
            },
            (error:any)=> this.error=this.FormularioCooperativaService.handleError(error));
            }
        );
  }

  ngOnInit() {
  }

}
