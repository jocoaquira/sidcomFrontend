// operador.service.ts
import { Injectable } from '@angular/core';
import { IOperator } from '@data/operator.metadata';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class preRegistroService {
    private operadorSource = new BehaviorSubject<IOperator | null>(null);
    currentOperador = this.operadorSource.asObservable();

    setOperador(operador: IOperator) {
        this.operadorSource.next(operador);
    }
    clearCurrentOperador() {
        this.operadorSource.next(null); // Limpia el valor
    }
}
