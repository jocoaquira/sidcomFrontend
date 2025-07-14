import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IFormularioTrasladoColaPDF } from '@data/formulario_cola_pdf.metadata';
import { PdfFormularioTrasladoColaService } from 'src/app/admin/services/pdf/traslado-cola-pdf.service';
import { FormularioTrasladoColaService } from 'src/app/admin/services/formulario-traslado-cola/formulario-traslado-cola.service';

@Component({
  selector: 'app-verificacion-formulario_cola',
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
export class VerificacionFormularioTrasladoColaComponent {
  public hash: string = '';
  public error: any;
  public loading: boolean = false;
  public formulario_cola: IFormularioTrasladoColaPDF;

  constructor(
    private actRoute: ActivatedRoute,
    private formularioColaService: FormularioTrasladoColaService,
    private formularioTrasladoColaPDFService: PdfFormularioTrasladoColaService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.actRoute.queryParamMap.subscribe(params => {
      this.hash = params.get('hash');
      this.formularioColaService.hashFormularioTrasladoCola(this.hash).subscribe(
        (data: any) => {
          this.formulario_cola = this.formularioColaService.handleFormularioTrasladoColaPDF(data);
          this.loadPDF(this.formulario_cola);
        },
        (error: any) => this.error = this.formularioColaService.handleError(error)
      );
    });
  }

  async loadPDF(formulario_colaData: IFormularioTrasladoColaPDF) {
    this.loading = true;
    try {
      // Genera el PDF en el servidor
      await this.formularioTrasladoColaPDFService.generarPDF(formulario_colaData);

      // Espera un pequeño retraso por seguridad
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirige directamente al PDF
      const pdfUrl = `/api/pdf/generated/${this.hash}?timestamp=${Date.now()}`;
      window.location.href = pdfUrl; // 🔥 Esto reemplaza Angular con el PDF
    } catch (error) {
      this.error = this.formularioColaService.handleError(error);
      this.loading = false;
    }
  }
}
