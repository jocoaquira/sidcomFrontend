import { Injectable } from '@angular/core';
import { IOperator } from '@data/operator.metadata';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class IDOMService {

  constructor() {}

  generarPDF(operador:IOperator) {
    const doc = new jsPDF('p', 'pt', 'letter');

    // Cargar imagen y convertirla a base64
    const logo = new Image();
    logo.src = 'assets/sidcom/fondo-idom.jpg'; // Asegúrate de que la ruta sea correcta y esté dentro de "src/assets/"

    // Espera a que la imagen se cargue
    logo.onload = () => {
      // Agregar la imagen al PDF una vez cargada
      doc.addImage(logo, 'JPEG', 0, 0, 612, 792); // Tamaño para cubrir toda la página Letter
      // Agregar otros textos y elementos sobre la imagen de fondo
      doc.setFontSize(14);
      doc.setTextColor(150, 0, 0);
      doc.text('IDOM', 50, 50);

      // Detalles de fecha
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('FECHA DE REGISTRO', 50, 100);
      doc.text('FECHA DE ACTUALIZACIÓN', 200, 100);
      doc.text('FECHA DE EXPIRACIÓN', 400, 100);

      doc.text('09/12/2022', 50, 120);
      doc.text('03/04/2024', 200, 120);
      doc.text('03/04/2025', 400, 120);

      // Datos principales
      doc.setFontSize(12);
      doc.text('"EMCAARBOL" S.R.L.', 50, 160);
      doc.text('NIT: 402229026', 50, 180);
      doc.text('NIM/NIAR: 04-0450-04', 50, 200);

      // Información adicional
      doc.text('ACTOR MINERO:', 50, 240);
      doc.text('EMPRESA PRIVADA', 150, 240);

      doc.text('ACTIVIDAD:', 50, 260);
      doc.text('COMERCIO INTERNO, COMERCIO EXTERNO', 150, 260);
      doc.setFont("helvetica", "bold");
      doc.text('REPRESENTANTE LEGAL:', 50, 280);
      doc.setFont("helvetica", "normal");
      doc.text('JHIM HEBER CACERES GUTIERREZ', 200, 280);

      doc.text('DIRECCIÓN DE OFICINA:', 50, 300);
      doc.text('ORURO - SORACACHI - CARRETERA ORURO - POTOSI NRO S/N ZONA SUD ESTE', 200, 300);

      doc.text('CORREO ELECTRÓNICO:', 50, 320);
      doc.text('emcaarbol.srl@gmail.com', 200, 320);

      doc.text('TELÉFONO Y/O CELULAR:', 50, 340);
      doc.text('5213945, 68366410, 76137852', 200, 340);
      doc.text(" y texto en normal", 10 + doc.getTextWidth("Texto en negrita"), 10);

      const x = 10; // Coordenada X
const y = 10; // Coordenada Y
const width = 180; // Ancho del recuadro
const height = 50; // Alto del recuadro

// Agregar un rectángulo de fondo para representar el área de texto
doc.rect(x, y, width, height);
      // Texto largo que se ajustará al recuadro
const text = "Este es un texto largo que debería ajustarse dentro del recuadro. Si el texto es muy largo, debería dividirse en varias líneas para que no se salga del límite.";

// Usar splitTextToSize para ajustar el texto al recuadro
const lines = doc.splitTextToSize(text, width);  // Ajusta el texto al ancho del recuadro

// Escribe el texto ajustado dentro del recuadro, comenzando en la posición (x, y)
doc.text(lines, x, y + 10); // El +10 es para dar un pequeño margen en la parte superior

      // Pie de página
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.save('Formulario_Registro.pdf');
    };
  }
}