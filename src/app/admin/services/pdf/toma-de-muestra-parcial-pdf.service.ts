
import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { addAnuladoWatermark } from './pdf-watermark.util';
import autoTable from 'jspdf-autotable'
import * as QRCode from 'qrcode';

import { ITomaDeMuestraPDF } from '@data/toma_de_muestra_pdf.metadata';

@Injectable({
  providedIn: 'root',
})
export class PdfTomaDeMuestraParcialService {

   public error:any=null;
  constructor(
    ) {}
// Funcion para generar el código QR sin bordes blancos
 generateQRCode(data: string): Promise<string> {
    return QRCode.toDataURL(data, {
      margin: 0, // Establecer el margen en 0 para eliminar el borde blanco
      errorCorrectionLevel: 'H', // Nivel de correcciÃ³n de errores (puedes ajustarlo segÃºn tus necesidades)
      width: 120, // Ancho del código QR
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  }
  formatFecha(fecha: string): string {
    const date = new Date(fecha); // Convierte la fecha en un objeto Date
    const day = String(date.getDate()).padStart(2, '0'); // DÃ­a con 2 dÃ­gitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes con 2 dÃ­gitos (recordando que los meses empiezan en 0)
    const year = date.getFullYear(); // AÃ±o
    const hours = String(date.getHours()).padStart(2, '0'); // Hora con 2 dÃ­gitos
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutos con 2 dÃ­gitos

    return `${day}/${month}/${year} a Hrs.: ${hours}:${minutes}`; // Formato final
  }
  // Funcion para mostrar los nombres de los minerales
  mostrarMinerales(mineral_tdm): string {
    return mineral_tdm.map(mineral => mineral.mineral).join(', ');
  }

  // Funcion para mostrar los detalles de los minerales
  mostrarDetalles(mineral_tdm): string {
    return mineral_tdm.map(mineral => `${mineral.sigla} ${mineral.ley} ${mineral.unidad}`).join(', ');
  }
  unirMunicipios(municipios): string {
    return municipios.map(municipio => municipio.municipio_origen).join(', ');
  }
  // Funcion que convierte HTML a texto y reemplaza <ul> y <li> por vinetas
convertirHTMLATextoConVinetas(html) {
  // Crear un div temporal para manejar el HTML
  const div = document.createElement('div');
  div.innerHTML = html;

  // Encontrar todos los elementos <ul>
  const ulElements = div.querySelectorAll('ul');

  // Reemplazar cada <li> con una viÃ±eta
  ulElements.forEach(ul => {
    const lis = ul.querySelectorAll('li');
    lis.forEach(li => {
      li.innerHTML = `* ${li.innerText.trim()}`;  // Agregar la viÃ±eta a cada <li>
    });
  });

  // Obtener el texto final, incluyendo <h6> y otros elementos que no son <li>
  let texto = div.innerText || div.textContent;

  // Devolver el texto con las vinetas correctamente aplicadas
  return texto;
}

    generarPDF(toma_de_muestra: ITomaDeMuestraPDF) {
                     const doc = new jsPDF('p', 'pt', 'letter');

                      const logo = new Image();
                      logo.src = 'assets/sidcom/form-tdm-cabecera.jpg';

                      logo.onload = () => {
                        doc.addImage(logo, 'JPEG', 30, 10, 565, 75);

                        QRCode.toDataURL(
                          localStorage.getItem('url-frontend') +
                            'formulario-101/formulario-tdm/verificacion?hash=' +
                            toma_de_muestra.hash,
                          (err, url) => {
                            if (err) {

                              return;
                            }

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
                                    {
                                      content: 'N° DE FORMULARIO:',
                                      styles: { halign: 'right', fillColor: [255, 255, 255] }
                                    },
                                    {
                                      content:
                                        toma_de_muestra.estado === 'GENERADO' ? toma_de_muestra.estado :
                                        toma_de_muestra.estado === 'SOLICITADO' ? 'SOLICITADO' :
                                        toma_de_muestra.estado === 'ANULADO' ? 'ANULADO' :
                                        toma_de_muestra.nro_formulario,

                                      styles: {
                                        halign: 'center',
                                        fontSize: 14,
                                        fontStyle: 'bold',
                                        fillColor:
                                          toma_de_muestra.estado === 'GENERADO' ? [255, 255, 0] :
                                          toma_de_muestra.estado === 'SOLICITADO' ? [0, 255, 255] : // Cambiar color si es solicitado
                                          toma_de_muestra.estado === 'ANULADO' ? [255, 0, 0] : [255, 255, 255] // Cambiar color si es anulado
                                      }
                                    }
                                  ],

                                ],
                                theme: 'striped',
                                styles: {
                                  fillColor: [255, 255, 0], // Color de fondo amarillo
                                  textColor: [0, 0, 0], // Color del texto negro
                                  halign: 'center', // AlineaciÃ³n centrada
                                  valign: 'middle', // AlineaciÃ³n vertical centrada
                                  fontSize: 10, // TamaÃ±o de fuente
                                  cellPadding: 3, // Reduce el relleno dentro de las celdas
                                },
                                headStyles: {
                                  fillColor: [0, 51, 102], // Fondo azul oscuro para el encabezado
                                  textColor: [255, 255, 255], // Texto blanco para el encabezado
                                  fontStyle: 'bold', // Texto en negrita
                                },


                                margin: { top: 0, bottom: 0 }, // Ajustar el margen entre tablas

                                startY: 80, // PosiciÃ³n inicial de la tabla
                              });
                        // Crear las celdas basadas en la condiciÃ³n
                        const celdas = [];

                        if (toma_de_muestra.estado === 'GENERADO') {
                        // Si el estado es 'GENERADO', agregar solo la primera celda
                        celdas.push({ content: 'ESTE FORMULARIO NO SE EMITIÓ, ESTA EN MODO GENERADO Y NO ES VÁLIDO APARA SU USO.', colSpan: 2, styles: { halign: 'center', fillColor: [255, 255, 0] } });
                        }
                        if (toma_de_muestra.estado === 'SOLICITADO') {
                          // Si el estado es 'GENERADO', agregar solo la primera celda
                          celdas.push({ content: 'ESTE FORMULARIO SE ENCUENTRA EN PROCESO DE APROBACIÓN, NO ES VÁLIDO APARA SU USO.', colSpan: 2, styles: { halign: 'center', fillColor: [255, 255, 0] } });
                          }
                        if (toma_de_muestra.estado === 'EMITIDO') {
                          // Si el estado es 'GENERADO', agregar solo la primera celda
                          celdas.push({ content: 'ESTE FORMULARIO YA SE EMITIÓ, ESTA A LA ESPERA DE APROBACIÓN DEL OPERADOR MINERO PARA SU USO.', colSpan: 2, styles: { halign: 'center', fillColor: [255, 255, 0] } });
                          }
                        if (toma_de_muestra.estado === 'ANULADO') {
                          // Si el estado es 'GENERADO', agregar solo la primera celda
                          celdas.push({ content: 'ESTE FORMULARIO SE ANULÃ“, NO VÁLIDO PARA SU USO.', colSpan: 2, styles: { halign: 'center', fillColor: [255, 0, 0] } });
                          }

                        autoTable(doc, {
                            body: [celdas],
                            startY: (doc as any).lastAutoTable.finalY,
                            margin: { top: 0, bottom: 0 }, // Ajustar el margen entre tablas
                            styles: {
                                cellPadding: 6, // Reduce el relleno dentro de las celdas
                                textColor: [0, 0, 0],
                                valign: 'middle', // AlineaciÃ³n vertical centrada
                              },
                          });

                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY+3 || 40,

                            head: [
                              [
                                { content: '1. DATOS GENERALES', colSpan: 6, styles: { halign: 'left', fillColor:[255,204,204], fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'FECHA DE EMISIÓN:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: toma_de_muestra.fecha_aprobacion+' a Horas: '+toma_de_muestra.hora_aprobacion,colSpan: 5, styles: { halign: 'left' , fillColor: [255, 255, 255]} },
                              ],
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'LUGAR DE VERIFICACIÓN:', styles: { halign: 'left', fontStyle: 'bold' } },
                                { content: toma_de_muestra.lugar_verificacion, styles: { halign: 'left', fillColor: [255, 255, 255] } },

                              ],
                            ],

                            styles: {
                              fillColor: [255, 255, 255], // Color de fondo por defecto
                              textColor: [0, 0, 0], // Color de texto negro
                              halign: 'left', // AlineaciÃ³n horizontal izquierda por defecto
                              valign: 'middle', // AlineaciÃ³n vertical centrada
                              fontSize: 9, // TamaÃ±o de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            headStyles: {
                              fillColor:[255,204,204], // Fondo verde para el encabezado
                              textColor: [0, 0, 0], // Texto negro para el encabezado
                              fontStyle: 'bold', // Texto en negrita
                            },
                            columnStyles: {
                              0: { cellWidth: 20 }, // Primera columna
                              1: { cellWidth: 120 }, // Segunda columna
                              2: { cellWidth: 360 }, // Ajusta automÃ¡ticamente
                            },
                          });

                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY+3 || 50, // Increased the starting Y value for more space

                            head: [
                              [
                                { content: '2. DATOS DEL OPERADOR MINERO', colSpan: 6, styles: { halign: 'left', fillColor: [255, 204, 204], fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                { content: '', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'RAZÓN SOCIAL:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: toma_de_muestra.razon_social, colSpan: 5, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                              [
                                { content: '', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'ENCARGADO:', styles: { halign: 'left', fontStyle: 'bold' } },
                                { content: toma_de_muestra.responsable_muestra, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'MUNICIPIO:', styles: { halign: 'right', fontStyle: 'bold' } },
                                { content: toma_de_muestra.municipio, styles: { halign: 'left', fillColor: [255, 255, 255] } }
                              ],
                            ],

                            styles: {
                              fillColor: [255, 255, 255], // Color de fondo por defecto
                              textColor: [0, 0, 0], // Color de texto negro
                              halign: 'left', // AlineaciÃ³n horizontal izquierda por defecto
                              valign: 'middle', // AlineaciÃ³n vertical centrada
                              fontSize: 9, // TamaÃ±o de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            headStyles: {
                              fillColor: [255, 204, 204], // Fondo rosado para el encabezado
                              textColor: [0, 0, 0], // Texto negro para el encabezado
                              fontStyle: 'bold', // Texto en negrita
                            },
                            columnStyles: {
                              0: { cellWidth: 20 }, // Primera columna
                              1: { cellWidth: 90 }, // Primera columna
                              2: { cellWidth: 130 }, // Segunda columna
                              3: { cellWidth: 105 }, // Ajusta automÃ¡ticamente
                              4: { cellWidth: 175 }, // Ajusta automÃ¡ticamente
                            },
                          });


                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY+3 || 40,

                            head: [
                              [
                                { content: '3. DATOS DEL MINERAL', colSpan: 5, styles: { halign: 'left', fillColor:[255,204,204], fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'PRESENTACIÓN:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: toma_de_muestra.presentacion, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'LOTE:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: toma_de_muestra.lote, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // AlineaciÃ³n vertical centrada
                              fontSize: 9, // TamaÃ±o de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            headStyles: {
                              fillColor:[255,204,204], // Fondo verde para el encabezado
                              textColor: [0, 0, 0], // Texto negro para el encabezado
                              fontStyle: 'bold', // Texto en negrita
                            },
                            columnStyles: {
                              0: { cellWidth: 20 }, // Primera columna
                              1: { cellWidth: 80 }, // Primera columna
                              2: { cellWidth: 160 }, // Segunda columna
                              3: { cellWidth:90 }, // Ajusta automÃ¡ticamente
                              4: { cellWidth:180 }, // Ajusta automÃ¡ticamente
                            },
                          });
                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY+3 || 40,

                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'MINERAL Y/O METAL:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: this.mostrarMinerales(toma_de_muestra.minerales), styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'COMPUESTO:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: this.mostrarDetalles(toma_de_muestra.minerales), styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],
                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // AlineaciÃ³n vertical centrada
                              fontSize: 9, // TamaÃ±o de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            columnStyles: {
                              0: { cellWidth: 20 }, // Primera columna
                              1: { cellWidth: 110 }, // Primera columna
                              2: { cellWidth: 130 }, // Segunda columna
                              3: { cellWidth:105 }, // Ajusta automÃ¡ticamente
                              4: { cellWidth:185 }, // Ajusta automÃ¡ticamente
                            },
                          });
                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY+3 || 40,

                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'PESO NETO SECO:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: toma_de_muestra.peso_neto+' [Kgs.]', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'N° DE CAMIONES:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: toma_de_muestra.camiones, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],
                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // AlineaciÃ³n vertical centrada
                              fontSize: 9, // TamaÃ±o de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            columnStyles: {
                              0: { cellWidth: 20 }, // Primera columna
                              1: { cellWidth: 110 }, // Primera columna
                              2: { cellWidth: 130 }, // Segunda columna
                              3: { cellWidth:105 }, // Ajusta automÃ¡ticamente
                              4: { cellWidth:185 }, // Ajusta automÃ¡ticamente
                            },
                          });
                            autoTable(doc, {
                                startY: (doc as any).lastAutoTable?.finalY+3 || 40,

                                body: [
                                [
                                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    { content: (toma_de_muestra.cantidad !== null && toma_de_muestra.cantidad !== undefined)
                                    ? 'CANTIDAD:'
                                    : '', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                    { content:(toma_de_muestra.cantidad !== null && toma_de_muestra.cantidad !== undefined)
                                    ? toma_de_muestra.cantidad
                                    : '', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                    ],
                                ],
                                styles: {
                                textColor: [0, 0, 0], // Color de texto negro
                                valign: 'middle', // AlineaciÃ³n vertical centrada
                                fontSize: 9, // TamaÃ±o de fuente
                                cellPadding: 2, // Espaciado interno de las celdas
                                },
                                columnStyles: {
                                0: { cellWidth: 20 }, // Primera columna
                                1: { cellWidth: 110 }, // Primera columna
                                2: { cellWidth: 130 }, // Segunda columna
                                3: { cellWidth:105 }, // Ajusta automÃ¡ticamente
                                4: { cellWidth:185 }, // Ajusta automÃ¡ticamente
                                },
                            });

                           autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY+3 || 40,

                            head: [
                              [
                                { content: '4. ORIGEN DEL MINERAL Y/0 METAL', colSpan: 3, styles: { halign: 'left', fillColor:[255,204,204], fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'MUNICIPIO PRODUCTOR:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: this.unirMunicipios(toma_de_muestra.municipio_origen), styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // AlineaciÃ³n vertical centrada
                              fontSize: 9, // TamaÃ±o de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            headStyles: {
                              fillColor:[255,204,204], // Fondo verde para el encabezado
                              textColor: [0, 0, 0], // Texto negro para el encabezado
                              fontStyle: 'bold', // Texto en negrita
                            },
                            columnStyles: {
                              0: { cellWidth: 20 }, // Primera columna
                              1: { cellWidth: 120 }, // Primera columna
                              2: { cellWidth: 390 }, // Segunda columna
                            },
                          });

                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY+3 || 40,

                            head: [
                              [
                                { content:  '5. ENCARGADO DE LA TOMA DE MUESTRA - SENARECOM', colSpan: 3, styles: { halign: 'left', fillColor:[255,204,204], fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'TÉCNICO(A) ENCARGADO(A): ', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: toma_de_muestra.responsable_senarecom, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // AlineaciÃ³n vertical centrada
                              fontSize: 9, // TamaÃ±o de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            headStyles: {
                              fillColor:[255,204,204], // Fondo verde para el encabezado
                              textColor: [0, 0, 0], // Texto negro para el encabezado
                              fontStyle: 'bold', // Texto en negrita

                            },
                            columnStyles: {
                              0: { cellWidth: 20 }, // Primera columna
                              1: { cellWidth: 140 }, // Primera columna
                              2: { cellWidth: 370 }, // Segunda columna
                            },
                          });
                            // Funcion para extraer el nÃºmero del paso (ej: "Paso 3" â†’ 3)
                            const extraerNÚMEROPaso = (numPasoStr: string): number => {
                                const match = numPasoStr.match(/\d+/);
                                return match ? parseInt(match[0]) : 0;
                            };
                                                    const procedimientoParcialRaw = (toma_de_muestra as any).procedimiento_parcial;
                          const procedimientoParcialDetalle =
                            typeof procedimientoParcialRaw === 'string' && procedimientoParcialRaw.includes('|')
                              ? procedimientoParcialRaw.split('|').slice(1).join('|').trim()
                              : (procedimientoParcialRaw ?? '').toString().trim();
                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY + 3 || 40,
                            head: [
                              [
                                { content: '6. PROCEDIMIENTO PARCIAL', colSpan: 2, styles: { halign: 'left', fillColor:[255,204,204], fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                { content: '', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: procedimientoParcialDetalle || 'Sin detalle de procedimiento parcial.', styles: { halign: 'justify', fillColor: [255, 255, 255] } },
                              ],
                            ],
                            styles: {
                              textColor: [0, 0, 0],
                              valign: 'middle',
                              fontSize: 9,
                              cellPadding: 2,
                            },
                            headStyles: {
                              fillColor:[255,204,204],
                              textColor: [0, 0, 0],
                              fontStyle: 'bold',
                            },
                            columnStyles: {
                              0:{cellWidth:20},
                              1: { cellWidth: 510 },
                            },
                          });
autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY+3 || 10,

                            head: [
                              [
                                { content:  ' 7. OBSERVACIONES',colSpan:2, styles: { halign: 'left', fillColor:[255,204,204], fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                {content:toma_de_muestra.observaciones!=null?toma_de_muestra.observaciones:'',  styles: { halign: 'justify', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // AlineaciÃ³n vertical centrada
                              fontSize: 9, // TamaÃ±o de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            headStyles: {
                              fillColor:[255,204,204], // Fondo verde para el encabezado
                              textColor: [0, 0, 0], // Texto negro para el encabezado
                              fontStyle: 'bold', // Texto en negrita

                            },
                            columnStyles: {
                              0:{cellWidth:20},
                              1: { cellWidth: 510 }, // Primera columna
                            },
                          });

                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY + 10 || 10,

                            head: [
                              [
                                { content: 'DATOS DE VERIFICACIÓN Y APROBACIÓN', colSpan: 4, styles: { halign: 'center', fillColor: [255, 255, 255], fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                { content: 'Emitido por: ' + toma_de_muestra.responsable_gador + '; Responsable de Toma de Muestra de la Secretaría de Minería, Metalurgia y Recursos Energéticos GADOR, en fecha:' + toma_de_muestra.fecha_aprobacion + ' a Horas: ' + toma_de_muestra.hora_aprobacion, styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'Aprobado por: ' + toma_de_muestra.responsable_muestra + '; Responsable de Toma de Muestra de la Empresa: ' + toma_de_muestra.razon_social + ' en fecha: ' + toma_de_muestra.fecha_firma + ' a Horas: ' + toma_de_muestra.hora_firma, styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255]} },
                                { content: 'Imagen de la Toma de Muestra', styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255], fontSize: 6 } },
                                { content: 'Escanee el código QR para verificar la autenticidad del Formulario de Toma de Muestra', styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255], fontSize: 6 } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'bottom', // AlineaciÃ³n vertical centrada
                              fontSize: 9, // TamaÃ±o de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                              fillColor: [255, 255, 255], // Fondo blanco general
                            },
                            headStyles: {
                              fillColor: [255, 204, 204], // Fondo rosado para el encabezado
                              textColor: [0, 0, 0], // Texto negro para el encabezado
                              fontStyle: 'bold', // Texto en negrita
                              cellPadding: 7, // Espaciado interno de las celdas
                              lineColor: [255, 255, 255], // Color de la lÃ­nea del borde
                            },
                            columnStyles: {
                              0: { cellWidth: 140, minCellHeight: 100, fillColor: [255, 255, 255] }, // Fondo blanco para la primera columna
                              1: { cellWidth: 140 }, // Primera columna
                              2: { cellWidth: 160 },
                              3: { cellWidth: 100 },
                            },
                          });
                          const sello_auth = new Image();
                          sello_auth.src = 'assets/sidcom/sello_blanco.jpg';

                          sello_auth.onload = () => {
                            const sello_autorizado = new Image();
                            sello_autorizado.src = 'assets/sidcom/sello.jpg';

                            sello_autorizado.onload = () => {
                              const nueva_imagen = new Image();

                              // Verifica si toma_de_muestra.foto_link es vÃ¡lido
                              let correctedPath = '';
                              if (toma_de_muestra.foto_link) {
                                  // Si existe el foto_link, procesa la ruta
                                  correctedPath = toma_de_muestra.foto_link.replace(/\\/g, "/");
                                  nueva_imagen.src = localStorage.getItem('url-backend') + correctedPath; // Imagen desde el backend
                              } else {
                                  // Si no hay foto, asigna una imagen por defecto
                                  nueva_imagen.src = 'ruta/a/tu/imagen/por/defecto.png'; // AquÃ­ colocas la URL de tu imagen por defecto
                              }

                              const extension = correctedPath.split('.').pop().toUpperCase();

                              nueva_imagen.onload = () => {
                                  if (toma_de_muestra.estado !== 'GENERADO') {
                                      doc.addImage(url, 'PNG', 490, (doc as any).lastAutoTable?.finalY - 110, 81, 81);
                                  } else {
                                      doc.addImage(sello_auth, 'JPEG', 470, (doc as any).lastAutoTable?.finalY - 110, 127, 86);
                                  }

                                  // Agregar la nueva imagen en una posiciÃ³n especÃ­fica (si la imagen se carga correctamente)
                                  doc.addImage(nueva_imagen, extension, 350, (doc as any).lastAutoTable?.finalY - 100, 100, 85);

                                  // Generar el PDF y abrirlo
                                  addAnuladoWatermark(doc, toma_de_muestra.estado);
                                  window.open(doc.output('bloburl'), '_blank');
                              };

                              nueva_imagen.onerror = () => {
                                  // En caso de error, puedes continuar generando el PDF sin la imagen
                                  addAnuladoWatermark(doc, toma_de_muestra.estado);
                                  window.open(doc.output('bloburl'), '_blank');
                              };
                          };


                            sello_autorizado.onerror = () => {
                            };
                          };

                          sello_auth.onerror = () => {
                          };

                          }
                        );
                      };
      }
}




