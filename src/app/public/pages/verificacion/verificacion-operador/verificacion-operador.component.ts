import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOperator } from '@data/operator.metadata';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { IDOMService } from 'src/app/admin/services/pdf/idom.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verificacion-operador',
  template: `
    <div *ngIf="pdfUrl">
      <object [data]="pdfUrl" type="application/pdf" width="100%" height="100%">
        <p>Tu navegador no soporta visualización de PDF.
           <a [href]="pdfUrl">Descargar PDF</a>.
        </p>
      </object>
    </div>
    <div *ngIf="loading">
      Generando PDF, por favor espere...
    </div>
    <div *ngIf="error">
      Error: {{ error }}
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
    }
    object {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  `]
})
export class VerificacionOperadorComponent {
  public hash: string = '';
  public error: any;
  public pdfUrl: string;
  public loading: boolean = false;
  public operador:IOperator;

  constructor(
    private actRoute: ActivatedRoute,
    private operatorsService: OperatorsService,
    private idomServices: IDOMService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.actRoute.paramMap.subscribe(
        params=>
        {
          this.hash=params.get('hash');
          this.operatorsService.hashOperador(this.hash).subscribe(
            (data:any)=>{
                this.operador=this.operatorsService.handleOperador(data);
                this.loadPDF(this.operador);
          },
          (error:any)=> this.error=this.operatorsService.handleError(error));
        }
      );
  }

  async loadPDF(operadorData:IOperator) {
    this.loading = true;
    try {

      // Llamamos al servicio que genera el PDF
      this.idomServices.generarPDF(operadorData);

      // Esperamos un breve momento para que el PDF se genere
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Obtenemos el PDF del servidor (ajusta esta URL según tu API)
      this.pdfUrl = `/api/pdf/generated/${this.hash}?timestamp=${Date.now()}`;

    } catch (error) {
      this.error = this.operatorsService.handleError(error);
    } finally {
      this.loading = false;
    }
  }
}
