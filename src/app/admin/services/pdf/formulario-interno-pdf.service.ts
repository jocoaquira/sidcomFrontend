
import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
import { IFormularioInterno } from '@data/formulario_interno.metadata';
import { IFormularioInternoSimple } from '@data/formulario_interno_simple.metadata';
import { IOperator } from '@data/operator.metadata';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as QRCode from 'qrcode';
import { FormularioInternoMineralService } from '../formulario-interno/formulariointerno-mineral.service';
import { FormularioInternoMunicipioOrigenService } from '../formulario-interno/formulariointerno-municipioorigen.service';
import { FormularioInternosService } from '../formulario-interno/formulariosinternos.service';
import { OperatorsService } from '../operators.service';
import { ImageToBase64Service } from './image-to-base64.service';

@Injectable({
  providedIn: 'root',
})
export class PdfFormularioInternoService {
  constructor(
    private imageToBase64Service: ImageToBase64Service,
    private operadorService:OperatorsService,
    private formularioInternoService:FormularioInternosService,
    private formularioInternoMineralService:FormularioInternoMineralService,
    private formularioInternoMunicipioOrigenService:FormularioInternoMunicipioOrigenService
    ) {}
// Función para generar el código QR sin bordes blancos
 generateQRCode(data: string): Promise<string> {
    return QRCode.toDataURL(data, {
      margin: 0, // Establecer el margen en 0 para eliminar el borde blanco
      errorCorrectionLevel: 'H', // Nivel de corrección de errores (puedes ajustarlo según tus necesidades)
      width: 120, // Ancho del código QR
      color: {
        dark: '#000000', // Color de los módulos oscuros
        light: '#FFFFFF', // Color de los módulos claros (fondo)
      },
    });
  }
    generarPDF(formulario_interno: IFormularioInternoSimple) {
        let formulario_int_completo!: IFormularioInterno;
        let operator!: IOperator;
        let error: any = null;

        // Obtener datos del formulario interno y el operador
        const formularioInternoObs = this.formularioInternoService
          .verFormularioInterno(formulario_interno.id.toString())
          .toPromise()
          .then((data: any) => {
            formulario_int_completo = this.formularioInternoService.handleCrearFormularioInterno(data);
          })
          .catch((err) => {
            error = this.formularioInternoService.handleError(err);
            console.error('Error al obtener formulario interno:', error);
          });

        const operatorObs = this.operadorService
          .verOperator(formulario_interno.operator_id.toString())
          .toPromise()
          .then((data: any) => {
            operator = this.operadorService.handleCrearoperator(data);
          })
          .catch((err) => {
            error = this.operadorService.handleError(err);
            console.error('Error al obtener operador:', error);
          });

        // Esperar a que ambas promesas se resuelvan
        Promise.all([formularioInternoObs, operatorObs]).then(() => {
          if (error) {
            console.error('Error al obtener los datos necesarios:', error);
            return; // No generar el PDF si hay errores
          }

          const doc = new jsPDF('p', 'pt', 'letter');

          const logo = new Image();
          logo.src = 'assets/sidcom/form-int-cabecera.jpg';

          logo.onload = () => {
            doc.addImage(logo, 'JPEG', 30, 10, 565, 75);

            QRCode.toDataURL(
              localStorage.getItem('url-frontend') +
                'formulario_interno/verificacion/' +
                formulario_interno.nro_formulario,
              (err, url) => {
                if (err) {
                  console.error('Error al generar el QR:', err);
                  return;
                }

                console.log(url);

                autoTable(doc, {

                    body: [
                      // Fila con 4 celdas, cada una ocupando una columna igual
                      [
                        { content: '',  styles: { halign: 'center',fillColor: [255, 255, 255] } },
                        { content: '',  styles: { halign: 'center',fillColor: [255, 255, 255] } },
                        { content: '',  styles: { halign: 'center',fillColor: [255, 255, 255] } },
                        { content: '',  styles: { halign: 'center',fillColor: [255, 255, 255] } },
                        { content: '',  styles: { halign: 'center',fillColor: [255, 255, 255] } },
                        { content: '',  styles: { halign: 'center',fillColor: [255, 255, 255] } },
                        { content: '', colSpan:6, styles: { halign: 'center',fillColor: [255, 255, 255] } },
                      {content: 'N° DE FORMULARIO:',styles:{halign:'right',fillColor: [255, 255, 255], }},
                      {content:formulario_interno.estado === 'GENERADO' ? formulario_interno.estado : formulario_interno.nro_formulario,

                      styles:{halign:'center', fontSize: 14,fontStyle: 'bold',fillColor:formulario_interno.estado === 'GENERADO' ?[255,255,0]:[255,255,255]}
                        }],

                      // Fila con 2 celdas que se distribuyen igualmente (colSpan 2 por celda)


                    ],
                    theme: 'striped',
                    styles: {
                      fillColor: [255, 255, 0], // Color de fondo amarillo
                      textColor: [0, 0, 0], // Color del texto negro
                      halign: 'center', // Alineación centrada
                      valign: 'middle', // Alineación vertical centrada
                      fontSize: 10, // Tamaño de fuente
                      cellPadding: 3, // Reduce el relleno dentro de las celdas
                    },
                    headStyles: {
                      fillColor: [0, 51, 102], // Fondo azul oscuro para el encabezado
                      textColor: [255, 255, 255], // Texto blanco para el encabezado
                      fontStyle: 'bold', // Texto en negrita
                    },


                    margin: { top: 0, bottom: 0 }, // Ajustar el margen entre tablas

                    startY: 80, // Posición inicial de la tabla
                  });

                // Más contenido o tablas aquí si es necesario...



            // Definir la condición
            const mostrarDato2 = formulario_interno.estado === 'GENERADO'; // Verifica si el estado es 'GENERADO'

            // Crear las celdas basadas en la condición
            const celdas = [];

            if (mostrarDato2) {
            // Si el estado es 'GENERADO', agregar solo la primera celda
            celdas.push({ content: 'ESTE FORMULARIO NO SE EMITIO, ESTA EN MODO GENERADO Y NO ES VALIDO PARA CIRCULACIÓN.', colSpan: 2, styles: { halign: 'center', fillColor: [255, 255, 0] } });
            } else {
            // Si no es 'GENERADO', agregar la segunda celda
            celdas.push({ content: 'FECHA DE EMISIÓN:', styles: { halign: 'right',fontSize:10,fontStyle:'bold',fillColor: [255, 255, 255] } });
            celdas.push({ content: formulario_interno.fecha_creacion, styles: { halign: 'left' ,fillColor: [255, 255, 255] } });
            celdas.push({ content: 'FECHA DE VENCIMIENTO:', styles: { halign: 'right',fontSize:10,fontStyle:'bold' ,fillColor: [255, 255, 255] } });
            celdas.push({ content: formulario_interno.fecha_vencimiento, styles: { halign: 'left' ,fillColor: [255, 255, 255] } });
        }
            autoTable(doc, {
                body: [celdas],
                startY: (doc as any).lastAutoTable.finalY,
                margin: { top: 0, bottom: 0 }, // Ajustar el margen entre tablas
                styles: {
                    cellPadding: 6, // Reduce el relleno dentro de las celdas
                    textColor: [0, 0, 0],
                    valign: 'middle', // Alineación vertical centrada
                  },
              });

              autoTable(doc, {
                startY: (doc as any).lastAutoTable?.finalY || 10,

                head: [
                  [
                    { content: '1. OPERADOR MINERO', colSpan: 6, styles: { halign: 'left', fillColor: [161, 216, 158], fontStyle: 'bold' } },
                  ],
                ],
                body: [
                  [
                    { content: 'RAZÓN SOCIAL:', styles: { halign: 'right', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                    { content: formulario_interno.razon_social, colSpan: 5, styles: { halign: 'left' , fillColor: [255, 255, 255]} },
                  ],
                  [
                    { content: 'NIT:', styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: operator.nit, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                    { content: 'NIM/NIAR:', styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: operator.nro_nim, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                    { content: 'IDOM:', styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: 'SDMMRE-'+operator.id, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                  ],
                ],

                styles: {
                  fillColor: [255, 255, 255], // Color de fondo por defecto
                  textColor: [0, 0, 0], // Color de texto negro
                  halign: 'left', // Alineación horizontal izquierda por defecto
                  valign: 'middle', // Alineación vertical centrada
                  fontSize: 9, // Tamaño de fuente
                  cellPadding: 2, // Espaciado interno de las celdas
                },
                headStyles: {
                  fillColor: [161, 216, 158], // Fondo verde para el encabezado
                  textColor: [0, 0, 0], // Texto negro para el encabezado
                  fontStyle: 'bold', // Texto en negrita
                },
                columnStyles: {
                  0: { cellWidth: 100 }, // Primera columna
                  1: { cellWidth: 80 }, // Segunda columna
                  2: { cellWidth: 'auto' }, // Ajusta automáticamente
                  3: { cellWidth: 'auto' }, // Ajusta automáticamente
                  4: { cellWidth: 'auto' }, // Ajusta automáticamente
                  5: { cellWidth: 80 }, // Última columna
                },
              });

              autoTable(doc, {
                startY: (doc as any).lastAutoTable?.finalY || 10,

                head: [
                  [
                    { content: '2. DATOS DEL MINERAL Y/O METAL TRANSPORTADO', colSpan: 5, styles: { halign: 'left', fillColor: [161, 216, 158], fontStyle: 'bold' } },
                  ],
                ],
                body: [
                  [
                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                    { content: 'LOTE:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.lote, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                    { content: 'MERMA:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.merma+' %', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                  ],
                ],

                styles: {
                  textColor: [0, 0, 0], // Color de texto negro
                  valign: 'middle', // Alineación vertical centrada
                  fontSize: 9, // Tamaño de fuente
                  cellPadding: 2, // Espaciado interno de las celdas
                },
                headStyles: {
                  fillColor: [161, 216, 158], // Fondo verde para el encabezado
                  textColor: [0, 0, 0], // Texto negro para el encabezado
                  fontStyle: 'bold', // Texto en negrita
                },
                columnStyles: {
                  0: { cellWidth: 20 }, // Primera columna
                  1: { cellWidth: 40 }, // Primera columna
                  2: { cellWidth: 200 }, // Segunda columna
                  3: { cellWidth:40 }, // Ajusta automáticamente
                  4: { cellWidth:230 }, // Ajusta automáticamente
                },
              });

              autoTable(doc, {
                startY: (doc as any).lastAutoTable?.finalY || 10,

                body: [
                  [
                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                    { content: 'PRESENTACION:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.presentacion, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                    { content: 'PESO NETO SECO:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.peso_neto_seco+' Kg.', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                  ],
                ],
                styles: {
                  textColor: [0, 0, 0], // Color de texto negro
                  valign: 'middle', // Alineación vertical centrada
                  fontSize: 9, // Tamaño de fuente
                  cellPadding: 2, // Espaciado interno de las celdas
                },
                columnStyles: {
                  0: { cellWidth: 20 }, // Primera columna
                  1: { cellWidth: 80 }, // Primera columna
                  2: { cellWidth: 160 }, // Segunda columna
                  3: { cellWidth:90 }, // Ajusta automáticamente
                  4: { cellWidth:180 }, // Ajusta automáticamente
                },
              });
              autoTable(doc, {
                startY: (doc as any).lastAutoTable?.finalY || 10,

                body: [
                  [
                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                    { content: 'PESO BRUTO HÚMEDO:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.peso_bruto_humedo+' Kg.', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                    { content: 'MINERAL Y/O METAL:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.des_planta, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                  ],
                ],
                styles: {
                  textColor: [0, 0, 0], // Color de texto negro
                  valign: 'middle', // Alineación vertical centrada
                  fontSize: 9, // Tamaño de fuente
                  cellPadding: 2, // Espaciado interno de las celdas
                },
                columnStyles: {
                  0: { cellWidth: 20 }, // Primera columna
                  1: { cellWidth: 110 }, // Primera columna
                  2: { cellWidth: 130 }, // Segunda columna
                  3: { cellWidth:105 }, // Ajusta automáticamente
                  4: { cellWidth:185 }, // Ajusta automáticamente
                },
              });
              autoTable(doc, {
                startY: (doc as any).lastAutoTable?.finalY || 10,

                body: [
                  [
                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                    { content: 'TARA:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.tara+' Kg.', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                    { content: 'LEY:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.lote, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                  ],
                ],
                styles: {
                  textColor: [0, 0, 0], // Color de texto negro
                  valign: 'middle', // Alineación vertical centrada
                  fontSize: 9, // Tamaño de fuente
                  cellPadding: 2, // Espaciado interno de las celdas
                },
                columnStyles: {
                  0: { cellWidth: 20 }, // Primera columna
                  1: { cellWidth: 40 }, // Primera columna
                  2: { cellWidth: 200 }, // Segunda columna
                  3: { cellWidth:30 }, // Ajusta automáticamente
                  4: { cellWidth:260 }, // Ajusta automáticamente
                },
               });

               autoTable(doc, {
                startY: (doc as any).lastAutoTable?.finalY || 10,

                body: [
                  [
                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                    { content: 'HUMEDAD:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.humedad+' %', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                  ],
                ],
                styles: {
                  textColor: [0, 0, 0], // Color de texto negro
                  valign: 'middle', // Alineación vertical centrada
                  fontSize: 9, // Tamaño de fuente
                  cellPadding: 2, // Espaciado interno de las celdas
                },
                columnStyles: {
                  0: { cellWidth: 20 }, // Primera columna
                  1: { cellWidth: 60 }, // Primera columna
                  2: { cellWidth: 180 }, // Segunda columna
                  3: { cellWidth:30 }, // Ajusta automáticamente
                  4: { cellWidth:260 }, // Ajusta automáticamente
                },
               });

               autoTable(doc, {
                startY: (doc as any).lastAutoTable?.finalY || 10,

                head: [
                  [
                    { content: '3. ORIGEN DEL MINERAL Y/0 METAL', colSpan: 5, styles: { halign: 'left', fillColor: [161, 216, 158], fontStyle: 'bold' } },
                  ],
                ],
                body: [
                  [
                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                    { content: 'MUNICIPIO PRODUCTOR:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.lote, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                    { content: ' CODIGO MUNICIPIO:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.merma+' %', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                  ],
                ],

                styles: {
                  textColor: [0, 0, 0], // Color de texto negro
                  valign: 'middle', // Alineación vertical centrada
                  fontSize: 9, // Tamaño de fuente
                  cellPadding: 2, // Espaciado interno de las celdas
                },
                headStyles: {
                  fillColor: [161, 216, 158], // Fondo verde para el encabezado
                  textColor: [0, 0, 0], // Texto negro para el encabezado
                  fontStyle: 'bold', // Texto en negrita
                },
                columnStyles: {
                  0: { cellWidth: 20 }, // Primera columna
                  1: { cellWidth: 120 }, // Primera columna
                  2: { cellWidth: 120 }, // Segunda columna
                  3: { cellWidth:100 }, // Ajusta automáticamente
                  4: { cellWidth:170 }, // Ajusta automáticamente
                },
              });

              autoTable(doc, {
                startY: (doc as any).lastAutoTable?.finalY || 10,

                head: [
                  [
                    { content:  '4. DESTINO DEL MINERAL Y/O METAL', colSpan: 5, styles: { halign: 'left', fillColor: [161, 216, 158], fontStyle: 'bold' } },
                  ],
                ],
                body: [
                  [
                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                    { content: formulario_int_completo.des_tipo+':', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.des_tipo === 'COMPRADOR' ? formulario_int_completo.des_comprador : formulario_int_completo.des_planta, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                    { content: 'DESTINO FINAL (MUNICIPIO):', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                    { content: formulario_int_completo.id_municipio_destino+' %', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                  ],
                ],

                styles: {
                  textColor: [0, 0, 0], // Color de texto negro
                  valign: 'middle', // Alineación vertical centrada
                  fontSize: 9, // Tamaño de fuente
                  cellPadding: 2, // Espaciado interno de las celdas
                },
                headStyles: {
                  fillColor: [161, 216, 158], // Fondo verde para el encabezado
                  textColor: [0, 0, 0], // Texto negro para el encabezado
                  fontStyle: 'bold', // Texto en negrita

                },
                columnStyles: {
                  0: { cellWidth: 20 }, // Primera columna
                  1: { cellWidth: 70 }, // Primera columna
                  2: { cellWidth: 170 }, // Segunda columna
                  3: { cellWidth:135 }, // Ajusta automáticamente
                  4: { cellWidth:135 }, // Ajusta automáticamente
                },
              });
              if(formulario_int_completo.tipo_transporte=='VIA FERREA'){
                autoTable(doc, {
                    startY: (doc as any).lastAutoTable?.finalY || 10,

                    head: [
                      [
                        { content:  ' 5. MEDIO DE TRANSPORTE', colSpan: 5, styles: { halign: 'left', fillColor: [161, 216, 158], fontStyle: 'bold' } },
                      ],
                    ],
                    body: [
                      [
                        {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                        { content: 'TIPO DE TRANSPORTE:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                        { content: formulario_int_completo.tipo_transporte, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                        { content: 'EMPRESA:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                        { content: formulario_int_completo.empresa_ferrea, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                      ],
                    ],

                    styles: {
                      textColor: [0, 0, 0], // Color de texto negro
                      valign: 'middle', // Alineación vertical centrada
                      fontSize: 9, // Tamaño de fuente
                      cellPadding: 2, // Espaciado interno de las celdas
                    },
                    headStyles: {
                      fillColor: [161, 216, 158], // Fondo verde para el encabezado
                      textColor: [0, 0, 0], // Texto negro para el encabezado
                      fontStyle: 'bold', // Texto en negrita

                    },
                    columnStyles: {
                      0: { cellWidth: 20 }, // Primera columna
                      1: { cellWidth: 110 }, // Primera columna
                      2: { cellWidth: 130 }, // Segunda columna
                      3: { cellWidth:90 }, // Ajusta automáticamente
                      4: { cellWidth:180 }, // Ajusta automáticamente
                    },
                  });
                  autoTable(doc, {
                    startY: (doc as any).lastAutoTable?.finalY || 10,

                    body: [
                      [
                        {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                        { content: 'Nro. DE VAGON(ES):', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                        { content: formulario_int_completo.nro_vagon, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                        {content:'FECHA DE SALIDA: ',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                        {content:formulario_int_completo.fecha_ferrea,  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                      ],
                    ],
                    styles: {
                      textColor: [0, 0, 0], // Color de texto negro
                      valign: 'middle', // Alineación vertical centrada
                      fontSize: 9, // Tamaño de fuente
                      cellPadding: 2, // Espaciado interno de las celdas
                    },
                    columnStyles: {
                      0: { cellWidth: 20 }, // Primera columna
                      1: { cellWidth: 100 }, // Primera columna
                      2: { cellWidth: 140 }, // Segunda columna
                      3: { cellWidth:100 }, // Ajusta automáticamente
                      4: { cellWidth:190 }, // Ajusta automáticamente
                    },
                   });

                   autoTable(doc, {
                    startY: (doc as any).lastAutoTable?.finalY || 10,

                    body: [
                      [
                        {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                        { content: 'HORA DE SALIDA: ', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                        { content: formulario_int_completo.hr_ferrea, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                        {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                        {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                      ],
                    ],
                    styles: {
                      textColor: [0, 0, 0], // Color de texto negro
                      valign: 'middle', // Alineación vertical centrada
                      fontSize: 9, // Tamaño de fuente
                      cellPadding: 2, // Espaciado interno de las celdas
                    },
                    columnStyles: {
                      0: { cellWidth: 20 }, // Primera columna
                      1: { cellWidth: 90 }, // Primera columna
                      2: { cellWidth: 150 }, // Segunda columna
                      3: { cellWidth:30 }, // Ajusta automáticamente
                      4: { cellWidth:260 }, // Ajusta automáticamente
                    },
                   });
              }
              else{
                autoTable(doc, {
                    startY: (doc as any).lastAutoTable?.finalY || 10,

                    head: [
                      [
                        { content:  ' 5. MEDIO DE TRANSPORTE', colSpan: 5, styles: { halign: 'left', fillColor: [161, 216, 158], fontStyle: 'bold' } },
                      ],
                    ],
                    body: [
                      [
                        {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                        { content: 'TIPO DE TRANSPORTE:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                        { content: formulario_int_completo.tipo_transporte, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                        { content: 'CONDUCTOR:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                        { content: formulario_int_completo.nom_conductor, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                      ],
                    ],

                    styles: {
                      textColor: [0, 0, 0], // Color de texto negro
                      valign: 'middle', // Alineación vertical centrada
                      fontSize: 9, // Tamaño de fuente
                      cellPadding: 2, // Espaciado interno de las celdas
                    },
                    headStyles: {
                      fillColor: [161, 216, 158], // Fondo verde para el encabezado
                      textColor: [0, 0, 0], // Texto negro para el encabezado
                      fontStyle: 'bold', // Texto en negrita

                    },
                    columnStyles: {
                      0: { cellWidth: 20 }, // Primera columna
                      1: { cellWidth: 110 }, // Primera columna
                      2: { cellWidth: 130 }, // Segunda columna
                      3: { cellWidth:70 }, // Ajusta automáticamente
                      4: { cellWidth:200 }, // Ajusta automáticamente
                    },
                  });
                  autoTable(doc, {
                    startY: (doc as any).lastAutoTable?.finalY || 10,

                    body: [
                      [
                        {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                        { content: 'PLACA: ', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                        { content: formulario_int_completo.placa, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                        {content:'LICENCIA DE CONDUCIR:',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                        {content:formulario_int_completo.licencia,  styles: { halign: 'left', fillColor: [255, 255, 255] } },
                      ],
                    ],
                    styles: {
                      textColor: [0, 0, 0], // Color de texto negro
                      valign: 'middle', // Alineación vertical centrada
                      fontSize: 9, // Tamaño de fuente
                      cellPadding: 2, // Espaciado interno de las celdas
                    },
                    columnStyles: {
                      0: { cellWidth: 20 }, // Primera columna
                      1: { cellWidth: 40 }, // Primera columna
                      2: { cellWidth: 200 }, // Segunda columna
                      3: { cellWidth:115 }, // Ajusta automáticamente
                      4: { cellWidth:175 }, // Ajusta automáticamente
                    },
                   });
              }
              autoTable(doc, {
                startY: (doc as any).lastAutoTable?.finalY || 10,

                head: [
                  [
                    { content:  ' 6. OBSERVACIONES',colSpan:2, styles: { halign: 'left', fillColor: [161, 216, 158], fontStyle: 'bold' } },
                  ],
                ],
                body: [
                  [
                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                    {content:formulario_int_completo.observaciones!=null?formulario_int_completo.observaciones:'',  styles: { halign: 'justify', fillColor: [255, 255, 255] } },
                  ],
                ],

                styles: {
                  textColor: [0, 0, 0], // Color de texto negro
                  valign: 'middle', // Alineación vertical centrada
                  fontSize: 9, // Tamaño de fuente
                  cellPadding: 2, // Espaciado interno de las celdas
                },
                headStyles: {
                  fillColor: [161, 216, 158], // Fondo verde para el encabezado
                  textColor: [0, 0, 0], // Texto negro para el encabezado
                  fontStyle: 'bold', // Texto en negrita

                },
                columnStyles: {
                  0:{cellWidth:20},
                  1: { cellWidth: 510 }, // Primera columna
                },
              });

              autoTable(doc, {
                startY: (doc as any).lastAutoTable?.finalY || 10,

                head: [
                  [
                    { content:  '  VERIFICACIÓN DE PUNTOS DE CONTROL (FIJOS Y/O MÓVILES) EN EL CIRCUITO DE TRASLADO.',colSpan:5, styles: { halign: 'center', fillColor: [255, 255, 255], fontStyle: 'bold' } },
                  ],
                ],
                body: [
                  [
                    {content:'1er Punto de Control',  styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                    {content:'2do Punto de Control',  styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255] , lineColor: [0, 0, 0] } },
                    {content:'',  styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255] , lineColor: [255, 255, 255]} },
                    {content:'Sello de Autorización',  styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                    {content:'Escanee el código QR para verificar la autenticidad del Formulario 101',  styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255],fontSize: 7,  } },
                  ],
                ],

                styles: {
                  textColor: [0, 0, 0], // Color de texto negro
                  valign: 'bottom', // Alineación vertical centrada
                  fontSize: 9, // Tamaño de fuente
                  cellPadding: 2, // Espaciado interno de las celdas
                  lineWidth: 1, // Ancho de la línea del borde
                  lineColor: [0, 0, 0], // Color de la línea del borde
                },
                headStyles: {
                  fillColor: [161, 216, 158], // Fondo verde para el encabezado
                  textColor: [0, 0, 0], // Texto negro para el encabezado
                  fontStyle: 'bold', // Texto en negrita
                  cellPadding: 7, // Espaciado interno de las celdas
                  lineColor: [255, 255, 255], // Color de la línea del borde
                },
                columnStyles: {
                  0:{cellWidth:130,minCellHeight:100},
                  1: { cellWidth: 130 }, // Primera columna
                  2:{cellWidth:20},
                  3: { cellWidth: 130 }, // Primera columna
                  4:{cellWidth:130},
                },
              });




              const sello_auth = new Image();
              sello_auth.src = 'assets/sidcom/sello_blanco.jpg';

              sello_auth.onload = () => {
                doc.addImage(sello_auth, 'JPEG', 42, (doc as any).lastAutoTable?.finalY-98, 127,86);
                doc.addImage(sello_auth, 'JPEG',172, (doc as any).lastAutoTable?.finalY-98, 127,86);


                const sello_autorizado = new Image();

                sello_autorizado.src = 'assets/sidcom/sello.jpg';

                sello_autorizado.onload = () => {
                    if(formulario_interno.estado!=='GENERADO')
                    {
                        doc.addImage(url, 'PNG', 475, (doc as any).lastAutoTable?.finalY-99, 81, 81);
                        doc.addImage(sello_autorizado, 'JPEG',321, (doc as any).lastAutoTable?.finalY-98, 127,86);
                    }
                    else
                    {
                        doc.addImage(sello_auth, 'JPEG', 321, (doc as any).lastAutoTable?.finalY-98, 127,86);
                        doc.addImage(sello_auth, 'JPEG',452, (doc as any).lastAutoTable?.finalY-98, 127,86);
                    }



                  autoTable(doc, {
                    startY: (doc as any).lastAutoTable?.finalY+1,

                    head: [
                      [
                        { content:  ' El Formulario 101 es el único instrumento que habilita el transporte de minerales y/o metales al interior o exterior del país, que permite la identificación del Municipio, Departamento Productor y otros datos técnicos, tiene carácter de Declaración Jurada de uso obligatorio conforme al Art. 31 del D.D. de Oruro N° 157 para los actores productivos mineros, operadores mineros, comercializadoras y personas naturales que se encuentran en posesión o realicen el transporte de minerales y/o metales en sujeción al D.S. N° 2288, Art 7', styles: { fontStyle:'normal', fontSize: 8, halign: 'center', fillColor: [255, 255, 255] } },
                      ],
                    ],
                    body: [

                      [

                        {content:'',  styles: { halign: 'center', fillColor: [255, 255, 255] , lineColor: [255, 255, 255],cellPadding: 20} },
                      ],
                      [
                        {content:' Firma del Representante Legal o',  styles: { halign: 'center', fillColor: [255, 255, 255] } },
                      ],
                      [
                        {content:' Responsable del Formulario 101',  styles: { halign: 'center', fillColor: [255, 255, 255] , lineColor: [0, 0, 0] } },
                      ],
                    ],

                    styles: {
                      textColor: [0, 0, 0], // Color de texto negro
                      valign: 'bottom', // Alineación vertical centrada
                      fontSize: 9, // Tamaño de fuente
                      cellPadding: 2, // Espaciado interno de las celdas
                    },
                    headStyles: {
                      fontSize: 9, // Tamaño de fuente
                      fillColor: [161, 216, 158], // Fondo verde para el encabezado
                      textColor: [0, 0, 0], // Texto negro para el encabezado
                      cellPadding: 7, // Espaciado interno de las celdas
                    },
                    columnStyles: {
                      0:{cellWidth:530},
                    },
                  });


                  window.open(doc.output('bloburl'), '_blank');
                };
                sello_autorizado.onerror = () => {
                  console.error('Error al cargar la imagen de cabecera.');
                };

              };
              sello_auth.onerror = () => {
                console.error('Error al cargar la imagen de cabecera.');
              };

                // Abrir el PDF

              }
            );
          };

          logo.onerror = () => {
            console.error('Error al cargar la imagen de cabecera.');
          };
        });
      }
    }
