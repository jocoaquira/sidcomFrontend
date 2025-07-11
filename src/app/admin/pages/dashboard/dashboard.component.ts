import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from '../../layout/service/app.layout.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { AuthService } from '@core/authentication/services/auth.service';
import { IOperator } from '@data/operator.metadata';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormularioInternosService } from '../../services/formulario-interno/formulariosinternos.service';
import { FormularioExternosService } from '../../services/formulario-externo/formulariosexternos.service';
import { IFormularioInternoEmitidos } from '@data/formulario_interno_emitidos.metadata';


@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {


    chartData: any;
    public operador:IOperator;

    chartOptions: any;
    error:any;
    subscription!: Subscription;
    public baseUrl = localStorage.getItem('url-backend');
    public nimLinkTransformado:any;
    public vigenciaNim:number=0;
    public seprecLinkTransformado:any;
    public vigenciaSeprec:number=0;
    public ruexLinkTransformado:any;
    public vigenciaRuex:number=0;
    public reporteFornIntCantOperador:IFormularioInternoEmitidos;
    public reporteFormExtCantOperador:IFormularioInternoEmitidos;
    fechaActual: Date = new Date();
    inicioSemana: Date;
    finSemana: Date;

    //-----------para minerales Top---------------------------------------------


    constructor(
        public layoutService: LayoutService,
        private operatorService:OperatorsService,
        private authService:AuthService,
         private formInterno:FormularioInternosService,
        private formExterno:FormularioExternosService,
        private sanitizer: DomSanitizer

    ) {


        const user = this.authService.getUser.id;
        if(user){
            this.formInterno.verReporteFormIntCantidades().subscribe(
                (data: any) => {
                    this.reporteFornIntCantOperador = this.formInterno.handleReporteFormIntCantidades(data);


                },
                (error: any) => this.error = this.formInterno.handleError(error)
            );
            this.formExterno.verReporteFormExtCantidades().subscribe(
                (data: any) => {
                    this.reporteFormExtCantOperador = this.formExterno.handleReporteFormExtCantidades(data);


                },
                (error: any) => this.error = this.formExterno.handleError(error)
            );
        }

    }
    transform(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }

    ngOnInit() {
        this.calcularRangoSemana();

    }


      private parsearPorcentaje(valor: unknown): number {
        // Caso 1: Ya es número
        if (typeof valor === 'number') {
          return valor;
        }

        // Caso 2: Es string con formato "12.34%"
        if (typeof valor === 'string') {
          const num = parseFloat(valor.replace('%', ''));
          return isNaN(num) ? 0 : num;
        }

        // Caso 3: Cualquier otro tipo (undefined, null, objeto, etc)
        return 0;
      }


    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    diasActivos(fecha1:string):number{
        let dias:any;
        let fechas1 = new Date(fecha1);
        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);
        dias=fechas1.getTime()-hoy.getTime();
        dias=dias / 1000 / 60 / 60 / 24;
        dias=Math.round (dias);
        return dias+1;
    }
    downloadNimFile(operador_link:string) {
        const fileUrl = this.baseUrl + operador_link.replace(/\\/g, '/');

  // Abre el archivo en una nueva pestaña
         window.open(fileUrl, '_blank');  // '_blank' indica que se abrirá en una nueva pestaña
}

getFileName(filePath: string): string {
    const segments = filePath.split('/');
    return segments[segments.length - 1]; // Devuelve el nombre del archivo
  }
  calcularRangoSemana(): void {
    // Ajuste para semana de sábado a domingo
    const hoy = new Date();
    const dia = hoy.getDay(); // 0 (domingo) a 6 (sábado)

    // Si es domingo (0), restamos 1 día para ir al sábado anterior
    // Si no, restamos (dia + 1) días para ir al sábado anterior
    const diff = dia === 0 ? 1 : dia + 1;

    this.inicioSemana = new Date(hoy);
    this.inicioSemana.setDate(hoy.getDate() - diff);
    this.inicioSemana.setHours(0, 0, 0, 0);

    this.finSemana = new Date(this.inicioSemana);
    this.finSemana.setDate(this.inicioSemana.getDate() + 6); // +6 días para llegar al domingo
    this.finSemana.setHours(23, 59, 59, 999);
  }
}
