import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOperator } from '@data/operator.metadata';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { IDOMService } from 'src/app/admin/services/pdf/idom.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verificacion-operador',
  template: `
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
      padding: 2rem;
      font-family: sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
  `]
})
export class VerificacionOperadorComponent {
  public hash: string = '';
  public error: any;
  public loading: boolean = false;
  public operador: IOperator;

  constructor(
    private actRoute: ActivatedRoute,
    private operatorsService: OperatorsService,
    private idomServices: IDOMService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.actRoute.paramMap.subscribe(params => {
      this.hash = params.get('hash');
      this.operatorsService.hashOperador(this.hash).subscribe(
        (data: any) => {
          this.operador = this.operatorsService.handleOperador(data);
          this.loadPDF(this.operador);
        },
        (error: any) => this.error = this.operatorsService.handleError(error)
      );
    });
  }

  async loadPDF(operadorData: IOperator) {
    this.loading = true;
    try {
      // Genera el PDF en el servidor
      await this.idomServices.generarPDF(operadorData);

      // Espera un pequeño retraso por seguridad
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirige directamente al PDF
      const pdfUrl = `/api/pdf/generated/${this.hash}?timestamp=${Date.now()}`;
      window.location.href = pdfUrl; // 🔥 Esto reemplaza Angular con el PDF
    } catch (error) {
      this.error = this.operatorsService.handleError(error);
      this.loading = false;
    }
  }
}
