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
    fondoFormulario.src = 'assets/sidcom/formulario-fondo.png'; // Asegúrate de tener la imagen de fondo

    fondoFormulario.onload = () => {
      // Agregar imagen de fondo
      doc.addImage(fondoFormulario, 'JPEG', 0, 0, 612, 792);

      // Configuración de fuente base
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      // === SECCIÓN A: IDENTIFICACIÓN DEL ACTOR PRODUCTIVO MINERO ===

      // Razón Social
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      this.centrarTextoEnRectangulo(doc, operador.razon_social, 160, 137, 173, 50);
      doc.setFontSize(8);
      this.centrarTextoEnRectangulo(doc, operador.nro_personeria, 413, 139, 72, 11);
      doc.setFontSize(8);
      this.centrarTextoEnRectangulo(doc, operador.nro_matricula_seprec, 413, 151, 72, 11);
      doc.setFontSize(8);
      this.centrarTextoEnRectangulo(doc, operador.nit+'', 413, 164, 72, 11);
      doc.setFontSize(8);
      this.centrarTextoEnRectangulo(doc, operador.nro_nim+'', 413, 177, 72, 11);

      doc.setFontSize(8);
      this.centrarTextoEnRectangulo(doc, operador.departamento_ofi+'', 210, 196, 109, 20);
      doc.setFontSize(8);
      this.centrarTextoEnRectangulo(doc, operador.municipio_ofi+'', 369, 196, 112, 20);
      doc.setFontSize(6);
      this.centrarTextoEnRectangulo(doc, operador.direccion+'', 207, 226, 278, 13);

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

      doc.setFontSize(7);
      this.centrarTextoEnRectangulo(doc, operador.tel_fijo, 193, 358, 53, 16);
      doc.setFontSize(7);
      this.centrarTextoEnRectangulo(doc, operador.celular, 275, 358, 44, 16);
      doc.setFontSize(6);
      this.centrarTextoEnRectangulo(doc, operador.correo, 383, 358, 103, 16);
      // Generar y mostrar el PDF
      window.open(doc.output('bloburl'), '_blank');
    };
  }

  // Función para marcar el tipo de actor minero
  private marcarActorMinero(doc: jsPDF, tipo: number) {
    const checkmark = '✓';
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);

    switch (tipo) {
      case 1: // Cooperativa
        doc.text(checkmark, 620, 385);
        break;
      case 2: // Estatal
        doc.text(checkmark, 620, 365);
        break;
      case 3: // Privada
        doc.text(checkmark, 750, 385);
        break;
    }
  }
  // Función para centrar texto en un rectángulo específico
  private centrarTextoEnRectangulo(doc: jsPDF, texto: string, left: number, top: number, width: number, height: number) {
    // Dividir el texto en líneas si es muy largo para el ancho del rectángulo
      doc.setDrawColor(0, 0, 0); // Color negro para el borde
      doc.setLineWidth(1); // Grosor de línea
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
  // Función alternativa para dibujar rectángulo con diferentes estilos
  private dibujarRectangulo(doc: jsPDF, left: number, top: number, width: number, height: number, estilo: 'stroke' | 'fill' | 'fillAndStroke' = 'stroke', color?: [number, number, number]) {
    // Configurar color si se proporciona
    if (color) {
      if (estilo === 'fill' || estilo === 'fillAndStroke') {
        doc.setFillColor(color[0], color[1], color[2]);
      }
      if (estilo === 'stroke' || estilo === 'fillAndStroke') {
        doc.setDrawColor(color[0], color[1], color[2]);
      }
    }

    // Dibujar según el estilo
    switch (estilo) {
      case 'stroke':
        doc.rect(left, top, width, height); // Solo borde
        break;
      case 'fill':
        doc.rect(left, top, width, height, 'F'); // Solo relleno
        break;
      case 'fillAndStroke':
        doc.rect(left, top, width, height, 'FD'); // Relleno y borde
        break;
    }
  }
  // Función para marcar las actividades
  private marcarActividades(doc: jsPDF, operador: IOperator) {
    const checkmark = '✓';
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);

    // Primera fila de actividades
    if (operador.act_exploracion === 1) {
      doc.text(checkmark, 620, 405); // Exploración
    }
    if (operador.act_explotacion === 1) {
      doc.text(checkmark, 690, 405); // Explotación
    }
    if (operador.act_ben_concentracion === 1) {
      doc.text(checkmark, 620, 425); // Beneficio o Concentración
    }
    if (operador.act_fundicion === 1) {
      doc.text(checkmark, 750, 425); // Fundición y Refinación
    }

    // Segunda fila de actividades
    if (operador.act_industrializacion === 1) {
      doc.text(checkmark, 620, 445); // Industrialización
    }
    if (operador.act_comer_interna === 1) {
      doc.text(checkmark, 720, 445); // Comercialización Interna
    }
    if (operador.act_comer_externa === 1) {
      doc.text(checkmark, 780, 445); // Externa
    }
  }

  // Función helper para obtener nombre del departamento por ID
  private obtenerDepartamento(id: number): string {
    const departamentos = {
      1: 'LA PAZ',
      2: 'ORURO',
      3: 'POTOSÍ',
      4: 'COCHABAMBA',
      5: 'CHUQUISACA',
      6: 'TARIJA',
      7: 'SANTA CRUZ',
      8: 'BENI',
      9: 'PANDO'
    };
    return departamentos[id] || 'NO ESPECIFICADO';
  }

  // Función helper para obtener nombre del municipio por ID
  private obtenerMunicipio(id: number): string {
    // Aquí deberías tener un mapeo completo de municipios
    // Por ahora retorno algunos ejemplos comunes de Oruro
    const municipios = {
      1: 'ORURO',
      94: 'CHALLAPATA',
      98: 'MACHACAMARCA',
      // Agregar más municipios según tu base de datos
    };
    return municipios[id] || `MUNICIPIO-${id}`;
  }

  // Función para obtener el tipo de actor minero como texto
  actorminero(tipo: any): string {
    let actorminero = '';
    switch (tipo) {
      case 1:
        actorminero = 'COOPERATIVA';
        break;
      case 2:
        actorminero = 'EMPRESA ESTATAL';
        break;
      case 3:
        actorminero = 'EMPRESA PRIVADA';
        break;
    }
    return actorminero;
  }

  // Función para obtener las actividades como texto
  actividad(oper: IOperator): string {
    let actividades = [];

    if (oper.act_exploracion == 1) actividades.push('EXPLORACIÓN');
    if (oper.act_explotacion == 1) actividades.push('EXPLOTACIÓN');
    if (oper.act_comer_interna == 1) actividades.push('COMERCIO INTERNO');
    if (oper.act_comer_externa == 1) actividades.push('COMERCIO EXTERNO');
    if (oper.act_ben_concentracion == 1) actividades.push('BENEFICIO O CONCENTRACIÓN');
    if (oper.act_fundicion == 1) actividades.push('FUNDICIÓN');
    if (oper.act_industrializacion == 1) actividades.push('INDUSTRIALIZACIÓN');

    return actividades.join(', ');
  }
}
