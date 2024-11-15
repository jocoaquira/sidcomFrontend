import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOperator } from '@data/operator.metadata';
import { OperatorsService } from 'src/app/admin/services/operators.service';

@Component({
  selector: 'app-verificacion-operador',
  templateUrl: './verificacion-operador.component.html',
  styleUrls: ['./verificacion-operador.component.scss']
})
export class VerificacionOperadorComponent implements OnInit {
  public hash:string='';
  public error:any;
  public operador!:IOperator;

  constructor(
    private actRoute: ActivatedRoute,
    private operatorsService:OperatorsService
  ) {
    console.log('llego');
    this.actRoute.paramMap.subscribe(
      params=>
      {
        this.hash=params.get('hash');
        this.operatorsService.hashOperador(this.hash).subscribe(
          (data:any)=>{
              console.log(data);
              this.operador=this.operatorsService.handleOperador(data);
        },
        (error:any)=> this.error=this.operatorsService.handleError(error));
      }
    );
   }

  ngOnInit() {
    console.log('llego');
  }

}
