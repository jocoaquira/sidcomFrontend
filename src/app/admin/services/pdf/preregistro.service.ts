import { Injectable } from '@angular/core';
import { IOperator } from '@data/operator.metadata';
import jsPDF from 'jspdf';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root',
})
export class SIDCOMFormService {

  constructor() {}

generarFormularioPDF(operador: any) {
  const doc = new jsPDF('p', 'pt', 'letter'); // 612 x 792 pts

  // Función auxiliar para manejar valores nulos
  const limpiarValor = (valor: any): string => {
    return valor == null ? '' : String(valor);
  };

  // Formatear fechas
  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const anio = fechaObj.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  // Cargar imagen de fondo
  const fondoFormulario = new Image();
  fondoFormulario.src = 'assets/sidcom/formulario-fondo.jpg'; // Asegúrate de tener la imagen de fondo

  fondoFormulario.onload = () => {
    // Agregar imagen de fondo
    doc.addImage(fondoFormulario, 'JPEG', 0, 0, 612, 792);

    // Configuración de fuente base
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // === SECCIÓN A: IDENTIFICACIÓN DEL ACTOR PRODUCTIVO MINERO ===

    // Razón Social - usando función auxiliar
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.razon_social), 160, 137, 173, 50);
    doc.setFontSize(8);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.nro_personeria), 413, 139, 72, 11);
    doc.setFontSize(8);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.nro_matricula_seprec), 413, 151, 72, 11);
    doc.setFontSize(8);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.nit), 413, 164, 72, 11);
    doc.setFontSize(8);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.nro_nim), 413, 177, 72, 11);

    doc.setFontSize(8);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.departamento_ofi), 210, 196, 109, 20);
    doc.setFontSize(8);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.municipio_ofi), 369, 196, 112, 20);
    doc.setFontSize(6);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.direccion), 207, 226, 278, 13);

    // Las siguientes líneas NO necesitan cambios porque ya manejan la lógica de X o ''
    doc.setFontSize(10);
    const textoTipoOperador = operador.tipo_operador === 2 ? 'X' : '';
    this.centrarTextoEnRectangulo(doc, textoTipoOperador, 213, 256, 15, 20);
    doc.setFontSize(10);
    const textoTipoOperador1 = operador.tipo_operador === 1 ? 'X' : '';
    this.centrarTextoEnRectangulo(doc, textoTipoOperador1, 312, 256, 15, 20);
    doc.setFontSize(10);
    const textoTipoOperador2 = operador.tipo_operador === 3 ? 'X' : '';
    this.centrarTextoEnRectangulo(doc, textoTipoOperador2, 393, 256, 12, 20);

    doc.setFontSize(10);
    const actividad = operador.act_exploracion === 1 ? 'X' : '';
    this.centrarTextoEnRectangulo(doc, actividad, 211, 293, 15, 20);
    doc.setFontSize(10);
    const actividad1 = operador.act_explotacion === 1 ? 'X' : '';
    this.centrarTextoEnRectangulo(doc, actividad1, 312, 293, 15, 20);
    doc.setFontSize(10);
    const actividad2 = operador.act_ben_concentracion === 1 ? 'X' : '';
    this.centrarTextoEnRectangulo(doc, actividad2, 391, 293, 13, 20);
    doc.setFontSize(10);
    const actividad3 = operador.act_fundicion === 1 ? 'X' : '';
    this.centrarTextoEnRectangulo(doc, actividad3, 462, 293, 20, 20);

    doc.setFontSize(10);
    const actividad0 = operador.act_industrializacion === 1 ? 'X' : '';
    this.centrarTextoEnRectangulo(doc, actividad0, 213, 323, 13, 20);
    doc.setFontSize(10);
    const actividad01 = (operador.act_comer_interna === 1 || operador.act_comer_externa === 1) ? 'X' : '';
    this.centrarTextoEnRectangulo(doc, actividad01, 315, 323, 12, 20);

    doc.setFontSize(7);
    const actividad02 = operador.act_comer_interna === 1 ? 'X' : '';
    this.centrarTextoEnRectangulo(doc, actividad02, 358, 323, 12, 11);
    doc.setFontSize(7);
    const actividad03 = operador.act_comer_externa === 1 ? 'X' : '';
    this.centrarTextoEnRectangulo(doc, actividad03, 358, 334, 12, 10);

    // Solo aplicar limpiarValor a campos de texto que pueden ser null
    doc.setFontSize(7);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.tel_fijo), 193, 358, 53, 16);
    doc.setFontSize(7);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.celular), 275, 358, 44, 16);
    doc.setFontSize(6);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.correo), 383, 358, 103, 16);

    doc.setFontSize(7);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.rep_nombre_completo), 165, 412, 321, 14);
    doc.setFontSize(7);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.rep_ci), 233, 434, 64, 14);
    doc.setFontSize(7);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.departamento_rep), 231, 456, 88, 20);
    doc.setFontSize(7);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.municipio_rep), 368, 456, 117, 20);

    doc.setFontSize(7);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.rep_direccion), 212, 484, 273, 13);
    doc.setFontSize(7);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.rep_telefono), 198, 505, 52, 15);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.rep_celular), 281, 505, 42, 15);
    doc.setFontSize(6);
    this.centrarTextoEnRectangulo(doc, limpiarValor(operador.rep_correo), 385, 505, 100, 15);

    // Generar y mostrar el PDF
    window.open(doc.output('bloburl'), '_blank');
  };
}

  // Función para centrar texto en un rectángulo específico
  private centrarTextoEnRectangulo(doc: jsPDF, texto: string, left: number, top: number, width: number, height: number) {
    // Dividir el texto en líneas si es muy largo para el ancho del rectángulo
     // doc.setDrawColor(0, 0, 0); // Color negro para el borde
     // doc.setLineWidth(1); // Grosor de línea
      doc.rect(left, top, width, height);
    const lines = doc.splitTextToSize(texto, width);

    // Calcular la altura de una línea de texto
    const fontSize = doc.getFontSize();
    const lineHeight = fontSize * 1.15; // Factor de espaciado entre líneas

    // Calcular la altura total del texto
    const totalTextHeight = lines.length * lineHeight;

    // Calcular la posición Y inicial para centrar verticalmente
    const startY = top + (height - totalTextHeight) / 2 + lineHeight * 0.75;

    // Dibujar cada línea centrada horizontalmente
    lines.forEach((line: string, index: number) => {
      const lineWidth = doc.getTextWidth(line);
      const x = left + (width - lineWidth) / 2; // Centrar horizontalmente
      const y = startY + (index * lineHeight); // Posición vertical de cada línea

      doc.text(line, x, y);
    });
  }

}
