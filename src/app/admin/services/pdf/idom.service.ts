
import { Injectable } from '@angular/core';
import { IOperator } from '@data/operator.metadata';
import jsPDF from 'jspdf';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root',
})
export class IDOMService {

  constructor( ) {}

  generarPDF(operador:IOperator) {
    const doc = new jsPDF('p', 'pt', 'letter');

    const fechaActual = new Date(operador.fecha_creacion);
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const anio = fechaActual.getFullYear();
    const fecha_creacion = `${dia}/${mes}/${anio}`;


    const fechaActual2 = new Date(operador.fecha_expiracion);
    const dia2 = String(fechaActual2.getDate()).padStart(2, '0');
    const mes2 = String(fechaActual2.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const anio2 = fechaActual2.getFullYear();
    const fecha_expiracion = `${dia2}/${mes2}/${anio2}`;




    // Cargar imagen y convertirla a base64
    const logo = new Image();
    logo.src = 'assets/sidcom/fondo-idom.jpg'; // Aseg�fºrate de que la ruta sea correcta y est�f© dentro de "src/assets/"

    // Espera a que la imagen se cargue
    logo.onload = () => {
        QRCode.toDataURL(localStorage.getItem('url-frontend')+'operador/verificacion?hash='+operador.hash, (err, url) => {
            if (err) throw err;
      // Agregar la imagen al PDF una vez cargada
      doc.addImage(logo, 'JPEG', 0, 0, 612, 792); // Tama�f±o para cubrir toda la p�f¡gina Letter
      doc.addImage(url, 'PNG', 380, 555, 120, 120);
      // Agregar otros textos y elementos sobre la imagen de fondo
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.setFont("Helvetica", "bold");
      doc.text('SDMMRE - '+operador.id,355,203)

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('FECHA DE REGISTRO', 67, 265);

      doc.text('FECHA DE EXPIRACI�f�?oN', 417, 265);
      doc.text('FECHA DE REGISTRO', 67.5, 265);

      doc.text('FECHA DE EXPIRACI�f�?oN', 417.5, 265);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);

      doc.text(fecha_creacion, 97, 284);

      doc.text(fecha_expiracion, 452, 284);

      if(operador.fecha_actualizacion && operador.fecha_actualizacion.trim() !== "")
      {
          const fechaActual1 = new Date(operador.fecha_actualizacion);
          const dia1 = String(fechaActual1.getDate()).padStart(2, '0');
          const mes1 = String(fechaActual1.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
          const anio1 = fechaActual1.getFullYear();
          const fecha_actualizacion = `${dia1}/${mes1}/${anio1}`;
          doc.setFont("Helvetica", "bold");
          doc.text('FECHA DE ACTUALIZACI�f�?oN', 222, 265);
          doc.text('FECHA DE ACTUALIZACI�f�?oN', 222.5, 265);
          doc.setFont("Helvetica", "normal");
          doc.text(fecha_actualizacion, 265, 284);
      }

      const x =48; // Coordenada X
      const y = 275; // Coordenada Y
      const width = 510; // Ancho del recuadro
      const height = 100; // Alto del recuadro
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(21);
      const lines = doc.splitTextToSize(operador.razon_social, width);  // Ajusta el texto al ancho del recuadro

            // Calcular la altura de una l�f­nea de texto
        const lineHeight = 20 * 1.2; // 1 punto â�?��? 0.35277 mm

        // Calcular la altura total del texto
        const textHeight = lines.length * lineHeight;

        // Coordenadas centradas dentro del recuadro
        const centerX = x + (width - doc.getTextWidth(lines[0])) / 2;  // Centrar horizontalmente
        const centerY = y + (height - textHeight) / 2 + lineHeight / 2;   // Centrar verticalmente

        // Dibujar cada l�f­nea de texto
        lines.forEach((line, index) => {
        // Recalcular el centro horizontal para cada l�f­nea
        const lineWidth = doc.getTextWidth(line); // Ancho de la l�f­nea actual
        const lineX = x + (width - lineWidth) / 2; // Centrar la l�f­nea en el recuadro

        // Calcular la posici�f³n vertical para cada l�f­nea (evitar sobrescritura)
        const lineY = centerY + index * lineHeight;

        // Dibujar la l�f­nea centrada
        doc.text(line, lineX, lineY);
        });
        doc.setFontSize(11);
        doc.setFont("Helvetica", "bold");
        doc.text("NIT: ", 60, 360);
        doc.setFont("Helvetica", "normal");
        doc.text(String(operador.nit), 60 + doc.getTextWidth("NIT: "), 360);

        doc.setFont("Helvetica", "bold");
        doc.text("NIM/NIAR: ", 60, 380);
        doc.setFont("Helvetica", "normal");
        doc.text(String(operador.nro_nim), 60 + doc.getTextWidth("NIM/NIAR: "), 380);

        doc.setFont("Helvetica", "bold");
        doc.text("ACTOR MINERO: ", 60, 400);
        doc.setFont("Helvetica", "normal");
        doc.text(this.actorminero(operador.tipo_operador), 60 + doc.getTextWidth("ACTOR MINERO: "), 400);

        doc.setFont("Helvetica", "bold");
        doc.text("ACTIVIDAD: ", 60, 420);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.text(this.actividad(operador),70 + doc.getTextWidth("ACTIVIDAD: "), 420);

        doc.setFontSize(11);
        doc.setFont("Helvetica", "bold");
        doc.text("REPRESENTANTE LEGAL: ", 60, 440);
        doc.setFont("Helvetica", "normal");
        doc.text(String(operador.rep_nombre_completo), 68 + doc.getTextWidth("REPRESENTANTE LEGAL: "), 440);

        doc.setFont("Helvetica", "bold");
        doc.text("DIRECCI�f�?oN: ", 60, 460);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.text(String(operador.dl_direccion), 70 + doc.getTextWidth("DIRECCI�f�?oN: "), 460);
        doc.setFontSize(11);
        doc.setFont("Helvetica", "bold");
        doc.text("CORREO ELECTR�f�?oNICO: ", 60, 480);
        doc.setFont("Helvetica", "normal");
        doc.text(String(operador.correo_inst), 60 + doc.getTextWidth("CORREO ELECTR�f�?oNICO: "), 480);

        doc.setFont("Helvetica", "bold");
        doc.text("TEL�f�?�FONO Y/O CELULAR: ", 60, 500);
        doc.setFont("Helvetica", "normal");
        doc.text(String(operador.tel_fijo)+"    "+operador.celular+"   "+operador.rep_celular, 65 + doc.getTextWidth("TEL�f�?�FONO Y/O CELULAR: "), 500);


      // Pie de p�f¡gina
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      window.open(doc.output('bloburl'), '_blank');

    });
    };
  }
  actorminero(tipo:any):string{
    let actorminero='';
        switch (tipo) {
          case 1:
            actorminero='COOPERATIVA';
            break;
          case 2:
            actorminero='EMPRESA ESTATAL';
            break;
          case 3:
            actorminero='EMPRESA PRIVADA';
            break;
        }
    return actorminero;
  }
  actividad(oper:IOperator):string{
    let actorminero = [];

    if (oper.act_exploracion == 1) actorminero.push('EXPLORACI�f�?oN');
    if (oper.act_explotacion == 1) actorminero.push('EXPLOTACI�f�?oN');
    if (oper.act_comer_interna == 1) actorminero.push('COMERCIO INTERNO');
    if (oper.act_comer_externa == 1) actorminero.push('COMERCIO EXTERNO');
    if (oper.act_ben_concentracion == 1) actorminero.push('BENEFICIO O CONCENTRACI�f�?oN');
    if (oper.act_fundicion == 1) actorminero.push('FUNDICI�f�?oN');
    if (oper.act_industrializacion == 1) actorminero.push('INDUSTRIALIZACI�f�?oN');

    // Unir las actividades con coma, sin coma al final
    return actorminero.join(', ');

  }
}

