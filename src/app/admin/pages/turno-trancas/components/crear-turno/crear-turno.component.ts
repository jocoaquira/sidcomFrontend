import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IFuncionarioTranca } from '@data/funcionarioTranca.metadata';
import { ITranca } from '@data/tranca.metadata';
import { TurnoValidatorService } from '../../services/validar-turno.service';
import { TurnoTrancaService } from 'src/app/admin/services/turno_tranca.service';
import { ITurnoTrancaLista } from '@data/turno_tranca.metadata';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-turno',
  templateUrl: './crear-turno.component.html',
  styleUrls: ['./crear-turno.component.scss']
})
export class CrearTurnoComponent implements OnInit {
  @Input() position: { top?: number; left?: number } = { top: 0, left: 0 };
  @Input() semanas: Date[] = [];
  @Input() listaTurnos: any[] = [];
  @Input() trancas: ITranca[] = [];
  @Input() ancho: number = 0;
  @Input() alto: number = 0;
  @Input() columnas: number = 0;
  @Input() filas: number = 0;
@Output() estadoDialogo = new EventEmitter<boolean>();
  public error: any=null;
  public dias:number=4;
  public fecha:Date | null = null;
  public tranca:ITranca | null = null;
  public turnos:ITurnoTrancaLista[]=[];
  public funcionario:IFuncionarioTranca|null=null;

  constructor(
    private validador:TurnoValidatorService,
    private turnoService:TurnoTrancaService,
    private notify:ToastrService,
  ) { }

  ngOnInit() {

  }
ngOnChanges(changes: SimpleChanges): void {
    this.trancas.sort((a, b) => a.id - b.id);
    this.tranca=this.obtenerTrancaClick();
    this.fecha=this.obtenerFechaClick();
    this.cargarTurnos();
}
  esCampoInvalido(event:any): boolean {

    return false;
  }
  ocultarDialogo(){
    this.estadoDialogo.emit(false);
  }
  public guardar():void{
    const turno = {
        usuarioId: this.funcionario?.id,
        trancaId: this.tranca?.id,
        fecha_inicio: this.fecha?.toISOString() || "2025-06-27T00:00:00.000Z",
        fecha_fin: this.calcularFechaFin(this.fecha || new Date(), this.dias)
    };
    const sw=this.validador.validarTurno(turno,this.turnos);
    if(turno.usuarioId && turno.trancaId && turno.fecha_inicio && turno.fecha_fin && sw.valido==true && this.dias>0 )
    {
        this.turnoService.crearTurnoTranca(turno).subscribe({
            next: (response: any) => {

                this.notify.success('Creado Correctamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
                this.ocultarDialogo();
            },
            error: (err) => {
                this.error = 'Error al crear el turno';
                console.error(err);
            }
        })
    }
    else{
        if(sw.valido){
            this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
        }else{
            this.notify.error(sw.mensaje,'Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});

        }
    }

  }
  public obtenerFechaClick(): Date | null {
    if (!this.semanas || this.semanas.length === 0 || this.ancho <= 0) {
      console.error('Datos insuficientes para calcular la fecha.');
      return null;
    }
    const columnaIndex = Math.floor((this.position.left) / this.ancho);


    if (columnaIndex > 0 && columnaIndex <= this.semanas.length) {
      return this.semanas[columnaIndex-1];
    }
    console.error('El clic está fuera del rango de columnas.');
    return null;
  }
  public obtenerTrancaClick(): ITranca | null {
    if (!this.trancas || this.trancas.length === 0 || this.alto <= 0) {
      console.error('Datos insuficientes para calcular la tranca.');
      return null;
    }
    const filaIndex = Math.floor(this.position.top / this.alto);

    if (filaIndex > 0 && filaIndex <= this.trancas.length) {
      return this.trancas[filaIndex-1];
    }

    console.error('El clic está fuera del rango de filas.');
    return null;
  }

private calcularFechaFin(fechaInicio: Date, dias: number): string {
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + dias-1);
    return fechaFin.toISOString();
}
cambioFuncionario(event: IFuncionarioTranca) {
  this.funcionario = event;

}
cargarTurnos(): void {
    this.turnoService.verTurnoTrancas('').subscribe({
      next: (response: any) => {
        this.turnos = this.turnoService.handleTurnoTranca(response);


      },
      error: (err) => {
        this.error = 'Error al cargar los turnos';

        console.error(err);
      }
    });
  }
}
