import { Component, Output, Input, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { IFuncionarioTranca } from '@data/funcionarioTranca.metadata';

import { catchError, of } from 'rxjs';
import { TurnoTrancaService } from 'src/app/admin/services/turno_tranca.service';

@Component({
  selector: 'app-funcionarioTrancaSelect',
  templateUrl: './funcionarioTrancaSelect.component.html',
  styleUrls: ['./funcionarioTrancaSelect.component.scss'],
})
export class FuncionarioTrancaSelectComponent implements OnChanges {
  @Input() funcionario_id: number | null = null;
  @Input() nro_licencia: string | null = null;
  @Output() funcionario = new EventEmitter<IFuncionarioTranca>();
  funcionario_trancas: IFuncionarioTranca[] = [];
  error: any;
  loading: boolean = false;

  constructor(public controlTrancaService: TurnoTrancaService) {}

  ngOnChanges(changes: SimpleChanges) {

    if (
      changes['funcionario_id'] &&
      changes['funcionario_id'].currentValue != null &&
      changes['funcionario_id'].currentValue !== changes['funcionario_id'].previousValue
    ) {
      this.cargarFuncionarioTrancas();
    }
  }

  cargarFuncionarioTrancas() {
    this.loading = true;
    this.controlTrancaService
      .verFuncionarioTrancas('')
      .pipe(
        catchError((error) => {
          this.error = this.controlTrancaService.handleError(error);
          this.funcionario_trancas = [];
          this.loading = false;
          return of([]);
        })
      )
      .subscribe((data: any) => {
        this.funcionario_trancas = this.controlTrancaService.handleListarFuncionarioTrancas(data)
        .filter(funcionario => funcionario.estado === 'ACTIVO');
        console.log('selectfuncionarios',this.funcionario_trancas);
        this.loading = false;
      });
  }

  cambioFuncionarioTranca(event: any) {
    console.log(event)
    const funcionario = this.funcionario_trancas.find((element) => element.id === event.value);

    if (funcionario) {
      this.funcionario.emit(funcionario);
    } else {
      console.warn('El funcionario seleccionado no existe');
    }
  }
}
