import { Injectable } from '@angular/core';
import { ITurnoTrancaLista } from '@data/turno_tranca.metadata';

@Injectable({
    providedIn: 'root'
})
export class TurnoValidatorService {

    haySolapamiento(fechaInicio1: string, fechaFin1: string, fechaInicio2: string, fechaFin2: string): boolean {
        const inicio1 = new Date(fechaInicio1);
        const fin1 = new Date(fechaFin1);
        const inicio2 = new Date(fechaInicio2);
        const fin2 = new Date(fechaFin2);

        // Normalizar fechas para comparar solo días (sin horas)
        const inicioNorm1 = new Date(inicio1.getFullYear(), inicio1.getMonth(), inicio1.getDate());
        const finNorm1 = new Date(fin1.getFullYear(), fin1.getMonth(), fin1.getDate());
        const inicioNorm2 = new Date(inicio2.getFullYear(), inicio2.getMonth(), inicio2.getDate());
        const finNorm2 = new Date(fin2.getFullYear(), fin2.getMonth(), fin2.getDate());

        // Si un turno termina ANTES de que otro comience (permitir mismo día)
        if (finNorm1 < inicioNorm2 || finNorm2 < inicioNorm1) {
            return false;
        }

        return true;
    }

    // Nueva función para verificar usuarios simultáneos máximos
    verificarUsuariosSimultaneos(nuevoTurno: ITurnoTrancaLista, turnosExistentes: ITurnoTrancaLista[], maxUsuarios: number = 2): boolean {
        // Filtrar solo turnos de la misma tranca
        const turnosEnTranca = turnosExistentes.filter(t => t.trancaId === nuevoTurno.trancaId);

        // Agregar el nuevo turno temporalmente para la validación
        const todosTurnos = [...turnosEnTranca, nuevoTurno];

        // Crear lista de eventos (inicio y fin de turnos)
        const eventos: { fecha: Date; tipo: 'inicio' | 'fin'; turnoId: number; usuarioId: number }[] = [];

        todosTurnos.forEach((turno, index) => {
            const fechaInicio = new Date(turno.fecha_inicio);
            const fechaFin = new Date(turno.fecha_fin);

            // Normalizar fechas
            const inicioNorm = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
            const finNorm = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate());

            eventos.push({
                fecha: inicioNorm,
                tipo: 'inicio',
                turnoId: turno.id || index,
                usuarioId: turno.usuarioId
            });

            // El fin es al final del día, así que agregamos 1 día para el evento de fin
            const siguienteDia = new Date(finNorm);
            siguienteDia.setDate(siguienteDia.getDate() + 1);

            eventos.push({
                fecha: siguienteDia,
                tipo: 'fin',
                turnoId: turno.id || index,
                usuarioId: turno.usuarioId
            });
        });

        // Ordenar eventos por fecha, procesando fins antes que inicios en la misma fecha
        eventos.sort((a, b) => {
            const fechaComp = a.fecha.getTime() - b.fecha.getTime();
            if (fechaComp !== 0) return fechaComp;

            // Si es la misma fecha, procesar 'fin' antes que 'inicio'
            if (a.tipo === 'fin' && b.tipo === 'inicio') return -1;
            if (a.tipo === 'inicio' && b.tipo === 'fin') return 1;
            return 0;
        });

        // Simular línea de tiempo y contar usuarios simultáneos
        const usuariosActivos = new Set<number>();
        let maxSimultaneos = 0;

        for (const evento of eventos) {
            if (evento.tipo === 'inicio') {
                usuariosActivos.add(evento.usuarioId);
            } else {
                usuariosActivos.delete(evento.usuarioId);
            }

            maxSimultaneos = Math.max(maxSimultaneos, usuariosActivos.size);

            // Si en algún momento se excede el límite, retornar false
            if (usuariosActivos.size > maxUsuarios) {
                return false;
            }
        }

        return true;
    }

    validarTurno(nuevoTurno: ITurnoTrancaLista, turnosExistentes: ITurnoTrancaLista[]): { valido: boolean; mensaje?: string } {
        // Asegurar que nombre_tranca esté definido
        const nombreTranca = nuevoTurno.nombre_tranca || `ID ${nuevoTurno.trancaId}`;

        // Validación 1: Verificar que no se exceda el máximo de usuarios simultáneos
        if (!this.verificarUsuariosSimultaneos(nuevoTurno, turnosExistentes, 2)) {
            return {
                valido: false,
                mensaje: `La tranca ${nombreTranca} excedería el límite de 2 usuarios simultáneos en este período.`
            };
        }

        // Validación 2: Usuario único - un usuario no puede estar en múltiples trancas al mismo tiempo
        const turnosDelUsuario = turnosExistentes.filter(t => {
            return t.usuarioId === nuevoTurno.usuarioId &&
                   this.haySolapamiento(
                       t.fecha_inicio,
                       t.fecha_fin,
                       nuevoTurno.fecha_inicio,
                       nuevoTurno.fecha_fin
                   );
        });

        if (turnosDelUsuario.length > 0) {
            const trancas = turnosDelUsuario.map(t => t.nombre_tranca || `ID ${t.trancaId}`).join(', ');
            return {
                valido: false,
                mensaje: `El usuario ${nuevoTurno.nombre_apellidos || nuevoTurno.usuarioId} ya está asignado a las trancas ${trancas} en este período.`
            };
        }

        return { valido: true };
    }
}
