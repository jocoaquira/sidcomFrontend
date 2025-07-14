import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormularioCooperativaService } from 'src/app/admin/services/formulario-interno-cooperativa/formulario-cooperativa.service';
import { PdfFormularioInternoCooperativaService } from 'src/app/admin/services/pdf/formulario-cooperativa-pdf.service';
import { IFormularioInternoCooperativaPDF } from '@data/formulario_interno_cooperativa_pdf.metadata';

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
export class VerificacionFormularioInternoCooperativaComponent {
  public hash: string = '';
  public error: any;
  public loading: boolean = false;
  public formulario_cola: IFormularioInternoCooperativaPDF;

  constructor(
    private actRoute: ActivatedRoute,
    private formularioInternoCooperativaService: FormularioCooperativaService,
    private formularioInternoCooperativaPDFService: PdfFormularioInternoCooperativaService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.actRoute.queryParamMap.subscribe(params => {
      this.hash = params.get('hash');
      this.formularioInternoCooperativaService.hashFormularioInternoCooperativa(this.hash).subscribe(
        (data: any) => {
          this.formulario_cola = this.formularioInternoCooperativaService.handleFormularioInternoCooperativaPDF(data);
          this.loadPDF(this.formulario_cola);
        },
        (error: any) => this.error = this.formularioInternoCooperativaService.handleError(error)
      );
    });
  }

  async loadPDF(formulario_colaData: IFormularioInternoCooperativaPDF) {
    this.loading = true;
    try {
      // Genera el PDF en el servidor
      await this.formularioInternoCooperativaPDFService.generarPDF(formulario_colaData);

      // Espera un pequeño retraso por seguridad
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirige directamente al PDF
      const pdfUrl = `/api/pdf/generated/${this.hash}?timestamp=${Date.now()}`;
      window.location.href = pdfUrl; // 🔥 Esto reemplaza Angular con el PDF
    } catch (error) {
      this.error = this.formularioInternoCooperativaService.handleError(error);
      this.loading = false;
    }
  }
}
