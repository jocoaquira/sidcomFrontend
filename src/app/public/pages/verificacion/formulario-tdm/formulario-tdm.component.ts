import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TomaDeMuestraService } from 'src/app/admin/services/toma-de-muestra/toma-de-muestra.service';
import { PdfTomaDeMuestraService } from 'src/app/admin/services/pdf/toma-de-muestra-pdf.service';
import { ITomaDeMuestraPDF } from '@data/toma_de_muestra_pdf.metadata';

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
export class VerificacionFormularioTDMComponent {
  public hash: string = '';
  public error: any;
  public loading: boolean = false;
  public formulario_externo: ITomaDeMuestraPDF;

  constructor(
    private actRoute: ActivatedRoute,
    private formularioTDMService: TomaDeMuestraService,
    private formularioTDMPDFService: PdfTomaDeMuestraService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.actRoute.queryParamMap.subscribe(params => {
        this.hash = params.get('hash') || '';
      console.log(this.hash);
      this.formularioTDMService.hashFormularioTomaDeMuestra(this.hash).subscribe(
        (data: any) => {
            console.log(data);
          this.formulario_externo = this.formularioTDMService.handleTomaDeMuestraPDF(data);
          console.log(this.formulario_externo);
          this.loadPDF(this.formulario_externo);
        },
        (error: any) => this.error = this.formularioTDMService.handleError(error)
      );
    });
  }

  async loadPDF(formulario_externoData: ITomaDeMuestraPDF) {
    this.loading = true;
    try {
      // Genera el PDF en el servidor
      await this.formularioTDMPDFService.generarPDF(formulario_externoData);

      // Espera un pequeño retraso por seguridad
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirige directamente al PDF
      const pdfUrl = `/api/pdf/generated/${this.hash}?timestamp=${Date.now()}`;
      window.location.href = pdfUrl; // 🔥 Esto reemplaza Angular con el PDF
    } catch (error) {
      this.error = this.formularioTDMService.handleError(error);
      this.loading = false;
    }
  }
}
