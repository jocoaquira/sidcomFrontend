import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PdfFormularioTrasladoColaService } from 'src/app/admin/services/pdf/traslado-cola-pdf.service';
import { FormularioTrasladoColaService } from 'src/app/admin/services/formulario-traslado-cola/formulario-traslado-cola.service';
import { IFormularioExternoPDF } from '@data/formulario_externo_pdf.metadata';
import { FormularioExternosService } from 'src/app/admin/services/formulario-externo/formulariosexternos.service';
import { PdfFormularioExternoService } from 'src/app/admin/services/pdf/formulario-externo-pdf.service';

@Component({
  selector: 'app-verificacion-formulario_externo',
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
export class VerificacionFormularioExternoComponent {
  public hash: string = '';
  public error: any;
  public loading: boolean = false;
  public formulario_externo: IFormularioExternoPDF;

  constructor(
    private actRoute: ActivatedRoute,
    private formularioExternoService: FormularioExternosService,
    private formularioExternoPDFService: PdfFormularioExternoService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.actRoute.queryParamMap.subscribe(params => {
      this.hash = params.get('hash');
      this.formularioExternoService.hashFormularioExterno(this.hash).subscribe(
        (data: any) => {
          this.formulario_externo = this.formularioExternoService.handleFormularioExternoPDF(data);
          this.loadPDF(this.formulario_externo);
        },
        (error: any) => this.error = this.formularioExternoService.handleError(error)
      );
    });
  }

  async loadPDF(formulario_externoData: IFormularioExternoPDF) {
    this.loading = true;
    try {
      // Genera el PDF en el servidor
      await this.formularioExternoPDFService.generarPDF(formulario_externoData);

      // Espera un pequeño retraso por seguridad
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirige directamente al PDF
      const pdfUrl = `/api/pdf/generated/${this.hash}?timestamp=${Date.now()}`;
      window.location.href = pdfUrl; // 🔥 Esto reemplaza Angular con el PDF
    } catch (error) {
      this.error = this.formularioExternoService.handleError(error);
      this.loading = false;
    }
  }
}
