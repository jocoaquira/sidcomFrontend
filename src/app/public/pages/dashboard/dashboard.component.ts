import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from '../../layout/service/app.layout.service';
import { OperatorsService } from 'src/app/admin/services/operators.service';
import { AuthService } from '@core/authentication/services/auth.service';
import { IOperator } from '@data/operator.metadata';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

    constructor( 
        public layoutService: LayoutService,
        private operatorService:OperatorsService,
        private authService:AuthService,
        private sanitizer: DomSanitizer
            
    ) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
            this.initChart();
        });

        const user = this.authService.getUser.operador_id;
        if (user) {
            this.operatorService.verOperator(user.toString()).subscribe(
                (data: any) => {
                    console.log(data);
                    this.operador = this.operatorService.handleOperador(data);
                    this.nimLinkTransformado = this.baseUrl + (this.operador.nim_link ? this.operador.nim_link.replace(/\\/g, '/') : '');
                    this.seprecLinkTransformado = this.baseUrl + (this.operador.seprec_link ? this.operador.seprec_link.replace(/\\/g, '/') : '');                    
                    this.ruexLinkTransformado = this.baseUrl + (this.operador.ruex_link ? this.operador.ruex_link.replace(/\\/g, '/') : '');                    
                    
                    this.vigenciaNim = this.diasActivos(this.operador.fecha_exp_nim);
                    this.vigenciaSeprec = this.diasActivos(this.operador.fecha_exp_seprec);
                    this.vigenciaRuex = this.diasActivos(this.operador.fecha_exp_ruex);
                },
                (error: any) => this.error = this.operatorService.handleError(error)
            );
        } else {
            console.error('Usuario no válido');
        }



    }
    transform(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }

    ngOnInit() {

    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
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
}
