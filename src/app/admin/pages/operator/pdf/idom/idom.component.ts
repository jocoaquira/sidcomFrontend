import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-idom',
  templateUrl: './idom.component.html',
  styleUrls: ['./idom.component.css']
})
export class IdomComponent {
/*
  constructor() {
    this.downloadPDF();
   }

  public downloadPDF(): void {
    const doc = new jsPDF();
    doc.text('Hello world!', 10, 10);
    doc.save('hello-world.pdf');
  }


*/
  constructor() {}

  generarPDF() {
    const doc = new jsPDF('p', 'pt', 'a4');

    // Base64 de la imagen de fondo (reemplaza este string con el Base64 real de fondo-idom.jpg)
   // const imagenBase64 = 'data:image/jpeg;base64,...'; // Coloca el Base64 de tu imagen aquí

    // Agrega la imagen de fondo
    //doc.addImage(imagenBase64, 'JPEG', 0, 0, 595.28, 841.89); // Ajusta el tamaño para que cubra toda la página (A4 en puntos)

    // Agrega los campos principales
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('IDOM:', 50, 120);
    doc.rect(100, 105, 300, 25); // cuadro para el IDOM

    doc.setFontSize(10);
    doc.text('IDENTIFICACIÓN DE OPERADOR MINERO', 50, 140);

    // Línea y contenedores para las fechas
    doc.setFontSize(10);
    doc.text('FECHA DE REGISTRO', 50, 180);
    doc.text('FECHA DE ACTUALIZACIÓN', 220, 180);
    doc.text('FECHA DE EXPIRACIÓN', 390, 180);
    
    doc.rect(50, 190, 100, 25);  // cuadro para fecha de registro
    doc.rect(220, 190, 100, 25); // cuadro para fecha de actualización
    doc.rect(390, 190, 100, 25); // cuadro para fecha de expiración

    // Agrega un ejemplo de datos en el documento
    doc.setFontSize(12);
    doc.text('NOMBRE EMPRESA:', 50, 250);
    doc.text('EMCAARBOL S.R.L.', 200, 250);
    
    doc.text('NIT:', 50, 280);
    doc.text('402229026', 200, 280);

    doc.text('NIM/NIAR:', 50, 310);
    doc.text('04-0450-04', 200, 310);

    doc.text('ACTOR MINERO:', 50, 340);
    doc.text('EMPRESA PRIVADA', 200, 340);

    doc.text('ACTIVIDAD:', 50, 370);
    doc.text('COMERCIO INTERNO, COMERCIO EXTERNO', 200, 370);

    doc.text('REPRESENTANTE LEGAL:', 50, 400);
    doc.text('JHIM HEBER CACERES GUTIERREZ', 200, 400);

    doc.text('DIRECCIÓN DE OFICINA:', 50, 430);
    doc.text('ORURO - SORACACHI - CARRETERA ORURO - POTOSI NRO S/N ZONA SUD ESTE', 200, 430);

    doc.text('CORREO ELECTRÓNICO:', 50, 460);
    doc.text('emcaarbol.srl@gmail.com', 200, 460);

    doc.text('TELÉFONO Y/O CELULAR:', 50, 490);
    doc.text('5213945, 68366410, 76137852', 200, 490);

    // Pie de página
    doc.setFontSize(10);
    doc.text('SIDCOM - Sistema Departamental de Control para el Transporte de Minerales y Metales', 100, 800);

    // Guarda el PDF
    doc.save('Formulario_Registro.pdf');
  }
}
