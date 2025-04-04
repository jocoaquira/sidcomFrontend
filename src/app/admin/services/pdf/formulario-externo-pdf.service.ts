
import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
import { IOperator } from '@data/operator.metadata';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as QRCode from 'qrcode';
import { ImageToBase64Service } from './image-to-base64.service';
import { IFormularioInternoMineral } from '@data/form_int_mineral.metadata';
import { IFormularioInternoMunicipioOrigen } from '@data/form_int_municipio_origen.metadata';
import { catchError, forkJoin, of, retry } from 'rxjs';
import { IMineral } from '@data/mineral.metadata';
import { IMunicipio } from '@data/municipio.metadata';
import { IDepartamento } from '@data/departamento.metadata';
import { IFormularioExternoPDF } from '@data/formulario_externo_pdf.metadata';
import { IFormularioInterno } from '@data/formulario_interno.metadata';

@Injectable({
  providedIn: 'root',
})
export class PdfFormularioExternoService {

   public error:any=null;
  constructor(
    private imageToBase64Service: ImageToBase64Service,
    ) {}
// Función para generar el código QR sin bordes blancos
 generateQRCode(data: string): Promise<string> {
    return QRCode.toDataURL(data, {
      margin: 0, // Establecer el margen en 0 para eliminar el borde blanco
      errorCorrectionLevel: 'H', // Nivel de corrección de errores (puedes ajustarlo según tus necesidades)
      width: 120, // Ancho del código QR
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  }
  // Función para mostrar los nombres de los minerales
  mostrarMinerales(mineral_tdm): string {
    return mineral_tdm.map(mineral => mineral.mineral).join(', ');
  }

  // Función para mostrar los detalles de los minerales
  mostrarDetalles(mineral_tdm): string {
    return mineral_tdm.map(mineral => `${mineral.sigla}(${mineral.ley} ${mineral.unidad})`).join(', ');
  }
  unirMunicipios(municipios): string {
    return municipios.map(municipio => municipio.municipio_origen).join(', ');
  }
  unirMunicipiosCodigo(municipios): string {
    return municipios.map(municipio => municipio.codigo).join(', ');
  }
  formatFecha(fecha: string): string {
    const date = new Date(fecha); // Convierte la fecha en un objeto Date
    const day = String(date.getDate()).padStart(2, '0'); // Día con 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes con 2 dígitos (recordando que los meses empiezan en 0)
    const year = date.getFullYear(); // Año
    const hours = String(date.getHours()).padStart(2, '0'); // Hora con 2 dígitos
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutos con 2 dígitos

    return `${day}/${month}/${year} a Hrs.: ${hours}:${minutes}`; // Formato final
  }
    generarPDF(formulario_externo: IFormularioExternoPDF) {
        let minerales!:IMineral[];
        let municipios: IMunicipio[] = [];
        let departamentos: IDepartamento[] = [];

        let mineralesString:string='';
        let leyesString:string='';
        let municipiosString:string='';
        let codigosMunicipioString:string='';

        let minerales_envio:any=[];
         let municipio_origen_envio:any=[];
         let lista_leyes_mineral:IFormularioInternoMineral[]=[];
         let lista_municipios_origen:IFormularioInternoMunicipioOrigen[]=[];

        let formulario_int_completo!: IFormularioInterno;
        let operator!: IOperator;
        let error: any = null;
        let departamentosObs,mineralesObs,municipiosObs;
        // Obtener datos del formulario interno y el operador

                      const doc = new jsPDF('p', 'pt', 'letter');

                      const logo = new Image();
                      logo.src = 'assets/sidcom/form-ext-cabecera.jpg';

                      logo.onload = () => {
                        doc.addImage(logo, 'JPEG', 30, 10, 565, 75);

                        QRCode.toDataURL(
                          localStorage.getItem('url-frontend') +
                            'formulario_externo/verificacion/' +
                            formulario_externo.hash,
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
                                  {content: 'N° DE FORMULARIO:',styles:{halign:'right',fillColor: [255, 255, 255], }},
                                  {content:formulario_externo.estado === 'GENERADO' ? formulario_externo.estado : formulario_externo.nro_formulario,

                                  styles:{halign:'center', fontSize: 14,fontStyle: 'bold',fillColor:formulario_externo.estado === 'GENERADO' ?[255,255,0]:[255,255,255]}
                                    }],

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

                        const mostrarDato2 = formulario_externo.estado === 'GENERADO'; // Verifica si el estado es 'GENERADO'

                        // Crear las celdas basadas en la condición
                        const celdas = [];

                        if (mostrarDato2) {
                        // Si el estado es 'GENERADO', agregar solo la primera celda
                        celdas.push({ content: 'ESTE FORMULARIO NO SE EMITIO, ESTA EN MODO GENERADO Y NO ES VALIDO PARA CIRCULACIÓN.', colSpan: 2, styles: { halign: 'center', fillColor: [255, 255, 0] } });
                        } else {
                        // Si no es 'GENERADO', agregar la segunda celda
                        celdas.push({ content: 'FECHA DE EMISIÓN:', styles: { halign: 'right',fontSize:10,fontStyle:'bold',fillColor: [255, 255, 255] } });
                        celdas.push({ content: formulario_externo.fecha_emision+' a Hrs.:'+ formulario_externo.hora_emision, styles: { halign: 'left' ,fillColor: [255, 255, 255] } });
                        celdas.push({ content: 'FECHA DE VENCIMIENTO:', styles: { halign: 'right',fontSize:10,fontStyle:'bold' ,fillColor: [255, 255, 255] } });
                        celdas.push({ content: formulario_externo.fecha_vencimiento+' a Hrs.:'+ formulario_externo.hora_vencimiento, styles: { halign: 'left' ,fillColor: [255, 255, 255] } });
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
                                { content: '1. OPERADOR MINERO', colSpan: 6, styles: { halign: 'left', fillColor: [140, 170, 190]  , fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                { content: 'RAZÓN SOCIAL:', styles: { halign: 'right', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: formulario_externo.razon_social, colSpan: 5, styles: { halign: 'left' , fillColor: [255, 255, 255]} },
                              ],
                              [
                                { content: 'NIT:', styles: { halign: 'right', fontStyle: 'bold' } },
                                { content: formulario_externo.nit, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'NIM/NIAR:', styles: { halign: 'right', fontStyle: 'bold' } },
                                { content: formulario_externo.nro_nim, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'IDOM:', styles: { halign: 'right', fontStyle: 'bold' } },
                                { content: 'SDMMRE-'+formulario_externo.operador_id, styles: { halign: 'left', fillColor: [255, 255, 255] } },
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
                              fillColor: [140, 170, 190]  , // Fondo verde para el encabezado
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
                                { content: '2. DATOS DE LA EXPORTACIÓN', colSpan: 5, styles: { halign: 'left', fillColor: [140, 170, 190]  , fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'ID M-03:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.m03, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'CÓDIGO DE ANALISIS:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.codigo_analisis, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // Alineación vertical centrada
                              fontSize: 9, // Tamaño de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            headStyles: {
                              fillColor: [140, 170, 190]  , // Fondo verde para el encabezado
                              textColor: [0, 0, 0], // Texto negro para el encabezado
                              fontStyle: 'bold', // Texto en negrita
                            },
                            columnStyles: {
                              0: { cellWidth: 20 }, // Primera columna
                              1: { cellWidth: 40 }, // Primera columna
                              2: { cellWidth: 200 }, // Segunda columna
                              3: { cellWidth:120 }, // Ajusta automáticamente
                              4: { cellWidth:150 }, // Ajusta automáticamente
                            },
                          });
                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,

                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'N° FACTURA:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.nro_factura_exportacion, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'ACTA DE VERIFICACIÓN:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.acta_verificacion+' Kg.', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],
                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // Alineación vertical centrada
                              fontSize: 9, // Tamaño de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            columnStyles: {
                              0: { cellWidth:20 }, // Primera columna
                              1: { cellWidth:65 }, // Primera columna
                              2: { cellWidth:175 }, // Segunda columna
                              3: { cellWidth:120 }, // Ajusta automáticamente
                              4: { cellWidth:150 }, // Ajusta automáticamente
                            },
                          });autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,

                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'LABORATORIO:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.laboratorio, styles: { halign: 'left', fillColor: [255, 255, 255] } },
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
                              1: { cellWidth: 75 }, // Primera columna
                              2: { cellWidth: 165 }, // Segunda columna
                              3: { cellWidth:30 }, // Ajusta automáticamente
                              4: { cellWidth:260 }, // Ajusta automáticamente
                            },
                           });

                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,

                            head: [
                              [
                                { content: '3. DATOS DEL MINERAL Y/O METAL TRANSPORTADO', colSpan: 5, styles: { halign: 'left', fillColor: [140, 170, 190]  , fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'LOTE:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.lote, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'MERMA:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.merma+' %', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // Alineación vertical centrada
                              fontSize: 9, // Tamaño de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            headStyles: {
                              fillColor: [140, 170, 190]  , // Fondo verde para el encabezado
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
                                { content: formulario_externo.presentacion, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'PESO NETO SECO:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.peso_neto+' Kg.', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],
                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // Alineación vertical centrada
                              fontSize: 9, // Tamaño de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            columnStyles: {
                              0: { cellWidth:20 }, // Primera columna
                              1: { cellWidth:80 }, // Primera columna
                              2: { cellWidth:160 }, // Segunda columna
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
                                { content: formulario_externo.peso_bruto_humedo+' Kg.', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'MINERAL Y/O METAL:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: this.mostrarMinerales(formulario_externo.minerales), styles: { halign: 'left', fillColor: [255, 255, 255] } },
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
                                { content: formulario_externo.tara+' Kg.', styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'LEY:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: this.mostrarDetalles(formulario_externo.minerales), styles: { halign: 'left', fillColor: [255, 255, 255] } },
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
                              4: { cellWidth:240 }, // Ajusta automáticamente
                            },
                           });

                           autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,

                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'HUMEDAD:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.humedad+' %', styles: { halign: 'left', fillColor: [255, 255, 255] } },
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
                                { content: '4. ORIGEN DEL MINERAL Y/0 METAL', colSpan: 5, styles: { halign: 'left', fillColor: [140, 170, 190]  , fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'MUNICIPIO PRODUCTOR:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: this.unirMunicipios(formulario_externo.municipio_origen), styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: ' CODIGO MUNICIPIO:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: this.unirMunicipios(formulario_externo.municipio_origen), styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // Alineación vertical centrada
                              fontSize: 9, // Tamaño de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            headStyles: {
                              fillColor: [140, 170, 190]  , // Fondo verde para el encabezado
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
                                { content:  '5. DESTINO DEL MINERAL Y/O METAL', colSpan: 5, styles: { halign: 'left', fillColor: [140, 170, 190]  , fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'COMPRADOR:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.comprador, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'ADUANA DE SALIDA:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.aduana, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // Alineación vertical centrada
                              fontSize: 9, // Tamaño de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            headStyles: {
                              fillColor: [140, 170, 190]  , // Fondo verde para el encabezado
                              textColor: [0, 0, 0], // Texto negro para el encabezado
                              fontStyle: 'bold', // Texto en negrita

                            },
                            columnStyles: {
                              0: { cellWidth: 20 }, // Primera columna
                              1: { cellWidth: 70 }, // Primera columna
                              2: { cellWidth: 170 }, // Segunda columna
                              3: { cellWidth:100 }, // Ajusta automáticamente
                              4: { cellWidth:170 }, // Ajusta automáticamente
                            },
                          });
                          autoTable(doc, {
                            startY: (doc as any).lastAutoTable?.finalY || 10,

                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                { content: 'PAIS DE DESTINO:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.pais, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                { content: 'CÓDIGO ADUANA:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                { content: formulario_externo.codigo_aduana, styles: { halign: 'left', fillColor: [255, 255, 255] } },
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
                              3: { cellWidth:90 }, // Ajusta automáticamente
                              4: { cellWidth:200 }, // Ajusta automáticamente
                            },
                          });

                          if(formulario_externo.tipo_transporte=='VIA FERREA'){
                            autoTable(doc, {
                                startY: (doc as any).lastAutoTable?.finalY || 10,

                                head: [
                                  [
                                    { content:  ' 5. MEDIO DE TRANSPORTE', colSpan: 5, styles: { halign: 'left', fillColor: [140, 170, 190]  , fontStyle: 'bold' } },
                                  ],
                                ],
                                body: [
                                  [
                                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    { content: 'TIPO DE TRANSPORTE:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                    { content: formulario_externo.tipo_transporte, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                    { content: 'EMPRESA:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                    { content: formulario_externo.empresa_ferrea, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                  ],
                                ],

                                styles: {
                                  textColor: [0, 0, 0], // Color de texto negro
                                  valign: 'middle', // Alineación vertical centrada
                                  fontSize: 9, // Tamaño de fuente
                                  cellPadding: 2, // Espaciado interno de las celdas
                                },
                                headStyles: {
                                  fillColor: [140, 170, 190]  , // Fondo verde para el encabezado
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
                                    { content: formulario_externo.nro_vagon, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                    {content:'FECHA DE SALIDA: ',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    {content:formulario_externo.fecha_ferrea,  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
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
                                    { content: formulario_externo.hr_ferrea, styles: { halign: 'left', fillColor: [255, 255, 255] } },
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
                                    { content:  ' 5. MEDIO DE TRANSPORTE', colSpan: 5, styles: { halign: 'left', fillColor: [140, 170, 190]  , fontStyle: 'bold' } },
                                  ],
                                ],
                                body: [
                                  [
                                    {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    { content: 'TIPO DE TRANSPORTE:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                    { content: formulario_externo.tipo_transporte, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                    { content: 'CONDUCTOR:', styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] }  },
                                    { content: formulario_externo.conductor, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                  ],
                                ],

                                styles: {
                                  textColor: [0, 0, 0], // Color de texto negro
                                  valign: 'middle', // Alineación vertical centrada
                                  fontSize: 9, // Tamaño de fuente
                                  cellPadding: 2, // Espaciado interno de las celdas
                                },
                                headStyles: {
                                  fillColor: [140, 170, 190]  , // Fondo verde para el encabezado
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
                                    { content: formulario_externo.placa, styles: { halign: 'left', fillColor: [255, 255, 255] } },
                                    {content:'LICENCIA DE CONDUCIR:',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                    {content:formulario_externo.licencia,  styles: { halign: 'left', fillColor: [255, 255, 255] } },
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
                                { content:  ' 6. OBSERVACIONES',colSpan:2, styles: { halign: 'left', fillColor: [140, 170, 190]  , fontStyle: 'bold' } },
                              ],
                            ],
                            body: [
                              [
                                {content:'',  styles: { halign: 'left', fontStyle: 'bold', fillColor: [255, 255, 255] } },
                                {content:formulario_externo.observacion!=null?formulario_externo.observacion:'',  styles: { halign: 'justify', fillColor: [255, 255, 255] } },
                              ],
                            ],

                            styles: {
                              textColor: [0, 0, 0], // Color de texto negro
                              valign: 'middle', // Alineación vertical centrada
                              fontSize: 9, // Tamaño de fuente
                              cellPadding: 2, // Espaciado interno de las celdas
                            },
                            headStyles: {
                              fillColor: [140, 170, 190]  , // Fondo verde para el encabezado
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
                              fillColor: [140, 170, 190]  , // Fondo verde para el encabezado
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
                                if(formulario_externo.estado!=='GENERADO')
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
                                  fillColor: [140, 170, 190]  , // Fondo verde para el encabezado
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

                            };

                          };
                          sello_auth.onerror = () => {

                          };

                            // Abrir el PDF

                          }
                        );
                      };

                      logo.onerror = () => {

                      };

      }
}
