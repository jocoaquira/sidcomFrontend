import { ChangeDetectorRef, Component, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ProcedimientoService } from '../../services/toma-de-muestra/procedimiento-tm.service';
import { IProcedimiento } from '@data/procedimiento_tm.metadata';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-procedimiento',
  templateUrl: './editar-procedimiento.html',
  styleUrls: ['./editar-procedimiento.scss']
})
export class EditarProcedimientoComponent implements OnInit {

  @Input() lista!: IProcedimiento;
  @Input() isEditMode: boolean = false;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  public listaProcedimientos: string[] = [];
  editandoTexto: string = "";
  editandoIndex: number | null = null;

  cols: any[] = [
    { field: 'id', header: 'Id' },
    { field: 'nombre', header: 'Nombre' },
    { field: 'detalles', header: 'Detalles' },
    { field: 'acciones', header: 'Acciones' }
  ];

  constructor(
    private procedimientoService: ProcedimientoService,
    private notify:ToastrService,
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.lista && this.isEditMode) {
      this.listaProcedimientos = this.convertirHtmlALista(this.lista.procedimiento);
    }
  }

  convertirHtmlALista(html: string): string[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const items = doc.querySelectorAll("ul li");

    return Array.from(items).map(item => item.textContent?.trim() || '');
  }

  onEditInit(procedimiento: string, index: number) {
    this.editandoIndex = index;
    this.editandoTexto = procedimiento;  // Asignamos el valor a editar
  }

  guardarCambios(index: number, dt: any) {
    if (this.editandoIndex !== null) {
      this.listaProcedimientos[this.editandoIndex] = this.editandoTexto;  // Guardamos el valor editado en el array
    }
    this.editandoIndex = null;  // Limpiamos el índice
  }

  eliminarFila(index: number) {
    this.listaProcedimientos.splice(index, 1);  // Eliminar la fila en la posición indicada
  }
  ocultarDialogo(){
    this.estadoDialogo.emit(false);
  }
  guardar(){
    this.lista.procedimiento=this.generarHTML(this.lista.nombre,this.listaProcedimientos);
    
    if (this.lista.nombre!='' && this.lista.procedimiento.length>0) {
      this.procedimientoService.editarProcedimientoTM(this.lista).subscribe(
          (data:any) =>
          {
            this.procedimientoService.handleCrearProcedimiento(data);
            console.log(data);
            if(data.error==null)
            {
              this.estadoDialogo.emit(false);
              this.notify.success('Actualizado Correctamente','Actualizado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
            }
          },
          (error:any) =>
          {
            console.log(error);
            if(error.error.status=='fail')
            {
              this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con la Actualización',{timeOut:2000,positionClass: 'toast-top-right'});
            }
          }
        );
    } else {
      this.notify.error('Revise los datos e intente nuevamente','Error con la Actualización',{timeOut:2000,positionClass: 'toast-top-right'});
    }
    console.log(this.lista)
  }
  generarHTML(titulo, descripciones) {
    // Crear el HTML deseado
    let html = `<h6>${titulo}</h6>\r\n  <ul>\r\n`;

    // Iterar sobre las descripciones y crear los elementos <li>
    descripciones.forEach(descripcion => {
        html += `    <li>${descripcion}</li>\r\n`;
    });

    html += "  </ul>";

    // Retornar el HTML generado
    return html;
}
}
