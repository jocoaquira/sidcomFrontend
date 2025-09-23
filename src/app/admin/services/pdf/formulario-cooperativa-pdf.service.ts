
import { Injectable } from '@angular/core';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as QRCode from 'qrcode';
import { ImageToBase64Service } from './image-to-base64.service';
import { IFormularioInternoCooperativaPDF } from '@data/formulario_interno_cooperativa_pdf.metadata';

@Injectable({
  providedIn: 'root',
})
export class PdfFormularioInternoCooperativaService {

   public error:any=null;
  constructor(
    private imageToBase64Service: ImageToBase64Service,
    ) {}

 generateQRCode(data: string): Promise<string> {
    return QRCode.toDataURL(data, {
      margin: 0,
      errorCorrectionLevel: 'H',
      width: 120,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  }

  mostrarMinerales(mineral_tdm): string {
    return mineral_tdm.map(mineral => mineral.mineral).join(', ');
  }


  mostrarDetalles(mineral_tdm): string {
    return mineral_tdm.map(mineral => `${mineral.sigla} (${mineral.unidad})`).join(', ');
  }
  unirMunicipios(municipios): string {
    return municipios.map(municipio => municipio.municipio_origen).join(', ');
  }
  unirMunicipiosCodigo(municipios): string {
    return municipios.map(municipio => municipio.codigo).join(', ');
  }
  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} a Hrs.: ${hours}:${minutes}`;
  }
    generarPDF(formulario_cooperativa: IFormularioInternoCooperativaPDF) {



                      const doc = new jsPDF('p', 'pt', 'letter');

                      const logo = new Image();
                      logo.src = 'assets/sidcom/form-int-cabecera.jpg';

                      logo.onload = () => {
                        doc.addImage(logo, 'JPEG', 30, 10, 565, 75);

                        QRCode.toDataURL(
                          localStorage.getItem('url-frontend') +
                            'formulario-101/formulario-interno-cooperativa/verificacion?hash=' +
                            formulario_cooperativa.hash,
                          (err, url) => {
                            if (err) {

                              return;
                            }



                            autoTable(doc, {

                                body: [

                                  [
                                    { content: '',  styles: { halign: 'center',fillColor: [255, 255, 255] } },
                                    { content: '',  styles: { halign: 'center',fillColor: [255, 255, 255] } },
                                    { content: '',  styles: { halign: 'center',fillColor: [255, 255, 255] } },
                                    { content: '',  styles: { halign: 'center',fillColor: [255, 255, 255] } },
                                    { content: '',  styles: { halign: 'center',fillColor: [255, 255, 255] } },
                                    { content: '',  styles: { halign: 'center',fillColor: [255, 255, 255] } },
                                    { content: '', colSpan:6, styles: { halign: 'center',fillColor: [255, 255, 255] } },
                                  {content: 'N° DE FORMULARIO:',styles:{halign:'right',fillColor: [255, 255, 255], }},
                                  {content:formulario_cooperativa.estado === 'GENERADO' ? formulario_cooperativa.estado : formulario_cooperativa.nro_formulario,

                                  styles:{halign:'center', fontSize: 14,fontStyle: 'bold',fillColor:formulario_cooperativa.estado === 'GENERADO' ?[255,255,0]:[255,255,255]}
                                    }],

                                ],
                                theme: 'striped',
                                styles: {
                                  fillColor: [255, 255, 0],
                                  textColor: [0, 0, 0],
                                  halign: 'center',
                                  valign: 'middle',
                                  fontSize: 10,
                                  cellPadding: 3,
                                },
                                headStyles: {
                                  fillColor: [0, 51, 102],
                                  textColor: [255, 255, 255],
                                  fontStyle: 'bold',
                                },


                                margin: { top: 0, bottom: 0 },

                                startY: 80,
                              });

                        const mostrarDato2 = formulario_cooperativa.estado === 'GENERADO';


                        const celdas = [];

                        if (mostrarDato2) {

                        celdas.push({ content: 'ESTE FORMULARIO NO SE EMITIO, ESTA EN MODO GENERADO Y NO ES VALIDO PARA CIRCULACIÓN.', colSpan: 2, styles: { halign: 'center', fillColor: [255, 255, 0] } });
                        } else {

                        celdas.push({ content: 'FECHA DE EMISIÓN:', styles: { halign: 'right',fontSize:10,fontStyle:'bold',fillColor: [255, 255, 255] } });
                        celdas.push({ content: formulario_cooperativa.fecha_emision+' a Hrs.:'+ formulario_cooperativa.hora_emision, styles: { halign: 'left' ,fillColor: [255, 255, 255] } });
                        celdas.push({ content: 'FECHA DE VENCIMIENTO:', styles: { halign: 'right',fontSize:10,fontStyle:'bold' ,fillColor: [255, 255, 255] } });
                        celdas.push({ content: formulario_cooperativa.fecha_vencimiento+' a Hrs.:'+ formulario_cooperativa.hora_vencimiento, styles: { halign: 'left' ,fillColor: [255, 255, 255] } });
                    }
                        autoTable(doc, {
                            body: [celdas],
                            startY: (doc as any).lastAutoTable.finalY,
                            margin: { top: 0, bottom: 0 },
                            styles: {
                                cellPadding: 6,
                                textColor: [0, 0, 0],
                                valign: 'middle',
                              },
                          });

                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,

                            head: [
                              [
                                { content: '1. OPERADOR MINERO', colSpan: 6, styles: { halign: 'left', fillColor: [161, 216, 158]  , fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                { content: 'RAZÓN SOCIAL:', styles: { halign: 'right', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: formulario_cooperativa.razon_social, colSpan: 5, styles: { halign: 'left' , fillColor: [255, 255, 255]} },
                              ],
                              [
                                { content: 'NIT:', styles: { halign: 'right', fontStyle: 'bold' } },
                                { content: formulario_cooperativa.nit, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'NIM/NIAR:', styles: { halign: 'right', fontStyle: 'bold' } },
                                { content: formulario_cooperativa.nro_nim, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'IDOM:', styles: { halign: 'right', fontStyle: 'bold' } },
                                { content: 'SDMMRE-'+formulario_cooperativa.operador_id, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              fillColor: [255, 255, 255],
                              textColor: [0, 0, 0],
                              halign: 'left',
                              valign: 'middle',
                              fontSize: 9,
                              cellPadding: 2,
                            },
                            headStyles: {
                              fillColor: [161, 216, 158]  ,
                              textColor: [0, 0, 0],
                              fontStyle: 'bold',
                            },
                            columnStyles: {
                              0: { cellWidth: 100 },
                              1: { cellWidth: 80 },
                              2: { cellWidth: 'auto' },
                              3: { cellWidth: 'auto' },
                              4: { cellWidth: 'auto' },
                              5: { cellWidth: 80 },
                            },
                          });
                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,

                            head: [
                              [
                                { content: '2. DATOS DEL MINERAL Y/O METAL TRANSPORTADO', colSpan: 5, styles: { halign: 'left', fillColor: [161, 216, 158]  , fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'LOTE/ N° TORNAGUIA:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_cooperativa.lote, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'PESO NETO SECO:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_cooperativa.peso_neto+' Kg.', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0],
                              valign: 'middle',
                              fontSize: 9,
                              cellPadding: 2,
                            },
                            headStyles: {
                              fillColor: [161, 216, 158]  ,
                              textColor: [0, 0, 0],
                              fontStyle: 'bold',
                            },
                            columnStyles: {
                              0: { cellWidth: 20 },
                              1: { cellWidth: 120 },
                              2: { cellWidth: 120 },
                              3: { cellWidth:90},
                              4: { cellWidth:180 },
                            },
                          });

                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,

                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'PRESENTACION:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_cooperativa.presentacion, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'MINERAL Y/O METAL:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: this.mostrarMinerales(formulario_cooperativa.minerales), styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],
                            styles: {
                              textColor: [0, 0, 0],
                              valign: 'middle',
                              fontSize: 9,
                              cellPadding: 2,
                            },
                            columnStyles: {
                              0: { cellWidth:20 },
                              1: { cellWidth:80 },
                              2: { cellWidth:160 },
                              3: { cellWidth:105 },
                              4: { cellWidth:185 },
                            },
                          });
                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,

                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'PESO BRUTO HÚMEDO:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_cooperativa.peso_bruto_humedo+' Kg.', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'LEY:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: this.mostrarDetalles(formulario_cooperativa.minerales), styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],
                            styles: {
                              textColor: [0, 0, 0],
                              valign: 'middle',
                              fontSize: 9,
                              cellPadding: 2,
                            },
                            columnStyles: {
                              0: { cellWidth: 20 },
                              1: { cellWidth: 110 },
                              2: { cellWidth: 130 },
                              3: { cellWidth:30 },
                              4: { cellWidth:260 },
                            },
                          });
                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,

                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'CANTIDAD:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_cooperativa.cantidad || 0, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],
                            styles: {
                              textColor: [0, 0, 0],
                              valign: 'middle',
                              fontSize: 9,
                              cellPadding: 2,
                            },
                            columnStyles: {
                              0: { cellWidth: 20 },
                              1: { cellWidth: 60 },
                              2: { cellWidth: 180 },
                              3: { cellWidth:50 },
                              4: { cellWidth:220 },
                            },
                           });


                           autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,

                            head: [
                              [
                                { content: '3. ORIGEN DEL MINERAL Y/0 METAL', colSpan: 5, styles: { halign: 'left', fillColor: [161, 216, 158]  , fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'MUNICIPIO PRODUCTOR:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: this.unirMunicipios(formulario_cooperativa.municipio_origen), styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: ' CODIGO MUNICIPIO:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: this.unirMunicipiosCodigo(formulario_cooperativa.municipio_origen), styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0],
                              valign: 'middle',
                              fontSize: 9,
                              cellPadding: 2,
                            },
                            headStyles: {
                              fillColor: [161, 216, 158]  ,
                              textColor: [0, 0, 0],
                              fontStyle: 'bold',
                            },
                            columnStyles: {
                              0: { cellWidth: 20 },
                              1: { cellWidth: 120 },
                              2: { cellWidth: 120 },
                              3: { cellWidth:100 },
                              4: { cellWidth:170 },
                            },
                          });

                        if (formulario_cooperativa.des_tipo === 'COMPRADOR' && formulario_cooperativa.compradores.length > 1) {
                        // Encabezado verde
                        autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,
                            head: [
                            [
                                { content: '4. DESTINO DEL MINERAL Y/O METAL', colSpan: 5, styles: { halign: 'left', fillColor: [161, 216, 158], fontStyle: 'bold' } },
                            ],
                            ],
                            styles: { fontSize: 9, cellPadding: 2 },
                            headStyles: { fontSize: 10, fontStyle: 'bold', fillColor: [161, 216, 158], textColor: [0, 0, 0] }
                        });

                        // Tabla de compradores con encabezado gris/plomo claro
                        autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,
                            head: [[
                                { content: '', styles: { halign: 'center', fillColor: [255, 255, 255], fontStyle: 'bold' } },
                                { content: 'Nro.', styles: { halign: 'center', fontStyle: 'bold' } },
                                { content: 'Comprador', styles: { halign: 'center', fontStyle: 'bold' } },
                                { content: 'Municipio', styles: { halign: 'center', fontStyle: 'bold' } },
                                { content: 'Departamento', styles: { halign: 'center', fontStyle: 'bold' } },
                                { content: 'Cantidad', styles: { halign: 'center', fontStyle: 'bold' } },
                            ]],
                                body: formulario_cooperativa.compradores.map((c, idx) => [
                                { content: '', styles: { halign: 'center' ,fillColor: [255, 255, 255]} },
                                { content: (idx + 1).toString(), styles: { halign: 'center' } },
                                { content: c.comprador, styles: { halign: 'left' } },
                                { content: c.municipio_destino || '', styles: { halign: 'center' } },
                                { content: c.departamento_destino || '', styles: { halign: 'center' } },
                                { content: `${c.cantidad} ${formulario_cooperativa.presentacion}`, styles: { halign: 'center' } },
                            ]),
                            styles: {
                            textColor: [0, 0, 0],
                            valign: 'middle',
                            fontSize: 9,
                            cellPadding: 2,
                            },
                            headStyles: {
                            fillColor: [220, 220, 220], // plomo claro
                            textColor: [0, 0, 0],
                            fontStyle: 'bold',
                            halign: 'center',
                            },
                            columnStyles: {
                            0: { cellWidth: 30 },
                            1: { cellWidth: 30 },
                            2: { cellWidth: 170 },
                            3: { cellWidth: 100 },
                            4: { cellWidth: 100 },
                            5: { cellWidth: 70 },
                            },
                        });
                        } else {
                        autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,
                            head: [
                            [
                                { content: '4. DESTINO DEL MINERAL Y/O METAL', colSpan: 5, styles: { halign: 'left', fillColor: [161, 216, 158], fontStyle: 'bold' } },
                            ],
                            ],
                            body: [
                                [
                                    { content: '', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    { content: formulario_cooperativa.des_tipo + ':', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    { content: formulario_cooperativa.des_tipo === 'COMPRADOR' && Array.isArray(formulario_cooperativa.compradores) && formulario_cooperativa.compradores.length === 1
                                        ? formulario_cooperativa.compradores[0].comprador
                                        : formulario_cooperativa.des_planta,
                                    styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                    { content: 'DESTINO FINAL (MUNICIPIO):', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    { content: formulario_cooperativa.des_tipo === 'COMPRADOR' && Array.isArray(formulario_cooperativa.compradores) && formulario_cooperativa.compradores.length === 1
                                        ? (formulario_cooperativa.compradores[0].municipio_destino || '') + ', ' + (formulario_cooperativa.compradores[0].departamento_destino || '')
                                        : formulario_cooperativa.municipio_destino + ', ' + formulario_cooperativa.departamento_destino,
                                    styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                ],
                            ],
                            styles: {
                            textColor: [0, 0, 0],
                            valign: 'middle',
                            fontSize: 9,
                            cellPadding: 2,
                            },
                            headStyles: {
                            fillColor: [161, 216, 158],
                            textColor: [0, 0, 0],
                            fontStyle: 'bold',
                            },
                            columnStyles: {
                            0: { cellWidth: 20 },
                            1: { cellWidth: 70 },
                            2: { cellWidth: 170 },
                            3: { cellWidth: 140 },
                            4: { cellWidth: 130 },
                            },
                        });
                        }
                          if(formulario_cooperativa.tipo_transporte=='VIA FERREA'){
                            autoTable(doc, {
                                startY: (doc as any).lastAutoTable?.finalY || 10,

                                head: [
                                  [
                                    { content:  ' 5. MEDIO DE TRANSPORTE', colSpan: 5, styles: { halign: 'left', fillColor: [161, 216, 158]  , fontStyle: 'bold' } },
                                  ],
                                ],
                                body: [
                                  [
                                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    { content: 'TIPO DE TRANSPORTE:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                    { content: formulario_cooperativa.tipo_transporte, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                    { content: 'EMPRESA:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                    { content: formulario_cooperativa.empresa_ferrea, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                  ],
                                ],

                                styles: {
                                  textColor: [0, 0, 0],
                                  valign: 'middle',
                                  fontSize: 9,
                                  cellPadding: 2,
                                },
                                headStyles: {
                                  fillColor: [161, 216, 158]  ,
                                  textColor: [0, 0, 0],
                                  fontStyle: 'bold',

                                },
                                columnStyles: {
                                  0: { cellWidth: 20 },
                                  1: { cellWidth: 110 },
                                  2: { cellWidth: 130 },
                                  3: { cellWidth:90 },
                                  4: { cellWidth:180 },
                                },
                              });
                              autoTable(doc, {
                                startY: (doc as any).lastAutoTable?.finalY || 10,

                                body: [
                                  [
                                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    { content: 'Nro. DE VAGON(ES):', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                    { content: formulario_cooperativa.nro_vagon, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                    {content:'FECHA DE SALIDA: ',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    {content:formulario_cooperativa.fecha_ferrea,  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                  ],
                                ],
                                styles: {
                                  textColor: [0, 0, 0],
                                  valign: 'middle',
                                  fontSize: 9,
                                  cellPadding: 2,
                                },
                                columnStyles: {
                                  0: { cellWidth: 20 },
                                  1: { cellWidth: 100 },
                                  2: { cellWidth: 140 },
                                  3: { cellWidth:100 },
                                  4: { cellWidth:190 },
                                },
                               });

                               autoTable(doc, {
                                startY: (doc as any).lastAutoTable?.finalY || 10,

                                body: [
                                  [
                                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    { content: 'HORA DE SALIDA: ', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                    { content: formulario_cooperativa.hr_ferrea, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                  ],
                                ],
                                styles: {
                                  textColor: [0, 0, 0],
                                  valign: 'middle',
                                  fontSize: 9,
                                  cellPadding: 2,
                                },
                                columnStyles: {
                                  0: { cellWidth: 20 },
                                  1: { cellWidth: 90 },
                                  2: { cellWidth: 150 },
                                  3: { cellWidth:30 },
                                  4: { cellWidth:260 },
                                },
                               });
                          }
                          else{
                            autoTable(doc, {
                                startY: (doc as any).lastAutoTable?.finalY || 10,

                                head: [
                                  [
                                    { content:  ' 5. MEDIO DE TRANSPORTE', colSpan: 5, styles: { halign: 'left', fillColor: [161, 216, 158]  , fontStyle: 'bold' } },
                                  ],
                                ],
                                body: [
                                  [
                                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    { content: 'TIPO DE TRANSPORTE:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                    { content: formulario_cooperativa.tipo_transporte, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                    { content: 'CONDUCTOR:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                    { content: formulario_cooperativa.conductor, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                  ],
                                ],

                                styles: {
                                  textColor: [0, 0, 0],
                                  valign: 'middle',
                                  fontSize: 9,
                                  cellPadding: 2,
                                },
                                headStyles: {
                                  fillColor: [161, 216, 158]  ,
                                  textColor: [0, 0, 0],
                                  fontStyle: 'bold',

                                },
                                columnStyles: {
                                  0: { cellWidth: 20 },
                                  1: { cellWidth: 110 },
                                  2: { cellWidth: 130 },
                                  3: { cellWidth:70 },
                                  4: { cellWidth:200 },
                                },
                              });
                              autoTable(doc, {
                                startY: (doc as any).lastAutoTable?.finalY || 10,

                                body: [
                                  [
                                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    { content: 'PLACA: ', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                    { content: formulario_cooperativa.placa, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                    {content:'LICENCIA DE CONDUCIR:',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    {content:formulario_cooperativa.licencia,  styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                  ],
                                ],
                                styles: {
                                  textColor: [0, 0, 0],
                                  valign: 'middle',
                                  fontSize: 9,
                                  cellPadding: 2,
                                },
                                columnStyles: {
                                  0: { cellWidth: 20 },
                                  1: { cellWidth: 40 },
                                  2: { cellWidth: 200 },
                                  3: { cellWidth:115 },
                                  4: { cellWidth:175 },
                                },
                               });
                          }
                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,

                            head: [
                              [
                                { content:  ' 6. OBSERVACIONES',colSpan:2, styles: { halign: 'left', fillColor: [161, 216, 158]  , fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                {content:formulario_cooperativa.observacion!=null?formulario_cooperativa.observacion:'',  styles: { halign: 'justify', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0],
                              valign: 'middle',
                              fontSize: 9,
                              cellPadding: 2,
                            },
                            headStyles: {
                              fillColor: [161, 216, 158]  ,
                              textColor: [0, 0, 0],
                              fontStyle: 'bold',

                            },
                            columnStyles: {
                              0:{cellWidth:20},
                              1: { cellWidth: 510 },
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
                              textColor: [0, 0, 0],
                              valign: 'bottom',
                              fontSize: 9,
                              cellPadding: 2,
                              lineWidth: 1,
                              lineColor: [0, 0, 0],
                            },
                            headStyles: {
                              fillColor: [161, 216, 158]  ,
                              textColor: [0, 0, 0],
                              fontStyle: 'bold',
                              cellPadding: 7,
                              lineColor: [255, 255, 255],
                            },
                            columnStyles: {
                              0:{cellWidth:130,minCellHeight:100},
                              1: { cellWidth: 130 },
                              2:{cellWidth:20},
                              3: { cellWidth: 130 },
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
                                if(formulario_cooperativa.estado!=='GENERADO')
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
                                  textColor: [0, 0, 0],
                                  valign: 'bottom',
                                  fontSize: 9,
                                  cellPadding: 2,
                                },
                                headStyles: {
                                  fontSize: 9,
                                  fillColor: [161, 216, 158]  ,
                                  textColor: [0, 0, 0],
                                  cellPadding: 7,
                                },
                                columnStyles: {
                                  0:{cellWidth:530},
                                },
                              });


                              window.open(doc.output('bloburl'), '_blank');
                            };
                            sello_autorizado.onerror = () => {

                            };

                          };
                          sello_auth.onerror = () => {

                          };



                          }
                        );
                      };

                      logo.onerror = () => {

                      };

      }
    mostrarCompradores(compradores,presentacion): string {
        if (!Array.isArray(compradores)) return compradores || '';
        return compradores.map(c => `${c.comprador} (${c.cantidad} ${presentacion})`).join(', ');
    }
    mostrarDestinos(compradores): string {
        if (!Array.isArray(compradores)) return compradores || '';
        return compradores.map(c => `${c.departamento_destino} ${c.municipio_destino}`).join(', ');
    }
}
