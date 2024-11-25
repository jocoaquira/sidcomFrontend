import { Component, OnInit } from '@angular/core';
import { FormularioInternoFormulario } from 'src/app/admin/validators/formulario-interno';

@Component({
  selector: 'app-anular-formulario-interno',
  templateUrl: './anular-formulario-interno.component.html',
  styleUrls: ['./anular-formulario-interno.component.scss']
})
export class AnularFormularioInternoComponent implements OnInit {
  public formulario_interno=new FormularioInternoFormulario();
  public id_formulario:string='E-12345/2024';
  constructor() { }

  ngOnInit() {
  }
  onSubmit(){

  }
}
