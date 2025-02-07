import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import Quill from 'quill';
import { ProcedimientoService } from '../../services/toma-de-muestra/procedimiento-tm.service';
import { IProcedimiento } from '@data/procedimiento_tm.metadata';

@Component({
  selector: 'app-editar-procedimiento',
  templateUrl: './editar-procedimiento.html',
  styleUrls: ['./editar-procedimiento.scss']
})
export class EditarProcedimientoComponent implements OnInit {
  @Input() lista!:IProcedimiento;
  @Input() isEditMode: boolean = false;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  public listaProcedimientos:any[]=[];
  quill: any;
  // Configuración de las columnas
  cols: any[] = [
    { field: 'id', header: 'Id' },
    { field: 'nombre', header: 'Nombre' },
    { field: 'detalles', header: 'Detalles' },
    { field: 'acciones', header: 'Acciones' }
  ];
  constructor(private procedimientoService: ProcedimientoService) {}

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
      console.log(this.lista)
      if (changes && this.lista && this.isEditMode) {
        this.lista=this.lista
        console.log(this.lista)
        // Iniciar Quill con el contenido del lista
      this.quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Editar lista...',
        readOnly: false,
        modules: {
          toolbar: [
            [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      });
      this.quill.root.innerHTML = this.lista;  // Cargar el HTML actual
      }
    }

  guardarEdiciones() {
    const contenidoEditado = this.quill.root.innerHTML;  // Obtener el HTML editado
    console.log('Contenido editado:', contenidoEditado);
    
    // Aquí puedes enviar el contenido editado al backend
  }
}
