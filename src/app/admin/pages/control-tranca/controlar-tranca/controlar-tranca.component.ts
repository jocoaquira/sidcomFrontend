import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CanCrearUsuarioGuard } from 'src/app/admin/guards/usuarios/can-crear-usuario.guard';

import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import jsQR from 'jsqr';
import { ConfirmationService } from 'primeng/api';
import { IFormularioInternoPDF } from '@data/formulario_interno_pdf.metadata';
import { IFormularioExternoPDF } from '@data/formulario_externo_pdf.metadata';
import { IFormularioInternoCooperativaPDF } from '@data/formulario_interno_cooperativa_pdf.metadata';
import { IFormularioTrasladoColaPDF } from '@data/formulario_cola_pdf.metadata';
import { ITomaDeMuestraPDF } from '@data/toma_de_muestra_pdf.metadata';
import { FormularioInternosService } from 'src/app/admin/services/formulario-interno/formulariosinternos.service';
import { FormularioExternosService } from 'src/app/admin/services/formulario-externo/formulariosexternos.service';
import { FormularioCooperativaService } from 'src/app/admin/services/formulario-interno-cooperativa/formulario-cooperativa.service';
import { FormularioTrasladoColaService } from 'src/app/admin/services/formulario-traslado-cola/formulario-traslado-cola.service';
import { TomaDeMuestraService } from 'src/app/admin/services/toma-de-muestra/toma-de-muestra.service';
import { IControlTranca } from '@data/control_tranca.metadata';
import { TurnoTrancaService } from 'src/app/admin/services/turno_tranca.service';
import { ControlTrancaService } from 'src/app/admin/services/control_tranca.service';



@Component({
    templateUrl: './controlar-tranca.component.html',
    styleUrls: ['./controlar-tranca.component.scss'],
    providers: []
})
export class ControlarTrancaComponent {
    @ViewChild('fileUploadComponent') fileUploadComponent: any;

    qrResult: string | null = null;
    isProcessing: boolean = false;
    errorMessage: string | null = null;

    // Configuración de optimización
    private readonly MAX_IMAGE_SIZE = 1024; // Máximo ancho/alto en píxeles
    private readonly JPEG_QUALITY = 0.8; // Calidad JPEG (0.1 - 1.0)
    private readonly MAX_FILE_SIZE = 15000000; // 15MB máximo
    public nro_formulario:string='';
    //------------tipos de formulario---------------------------------
    public formulario_interno:IFormularioInternoPDF=null;
    public formulario_externo:IFormularioExternoPDF=null;
    public formulario_interno_cooperativa:IFormularioInternoCooperativaPDF=null;
    public formulario_cola:IFormularioTrasladoColaPDF=null;
    public formulario_tdm:ITomaDeMuestraPDF=null;
    public controlTranca:IControlTranca={
        usuarioId:null,
        trancaId:null,
        formId:null,
        fecha_inspeccion:null,
        observaciones:null
      }
    public error:any=null;
    //------------------------UBICACION--------------------------------
    latitude: number | undefined;
    longitude: number | undefined;
    private watchId: number | undefined;
    //----------------------------------------------------------------=null;
    // Propiedades para la cámara
    @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement>;
    @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;

    public isCameraOpen: boolean = false;
    stream: MediaStream | null = null;
    facingMode: 'user' | 'environment' = 'environment'; // Iniciar con cámara trasera
    capturedImage: string | null = null;

    constructor(
        private authService:AuthService,
        private notify:ToastrService,
        private confirmationService:ConfirmationService,
        private formularioInternoService: FormularioInternosService,
        private formularioExternoService: FormularioExternosService,
        private formularioInternoCooperativaService: FormularioCooperativaService,
        private formularioTrasladoColaService: FormularioTrasladoColaService,
        private tomaDeMuestraService: TomaDeMuestraService,
        private turnoTrancaService:TurnoTrancaService,
        private controlTrancaService:ControlTrancaService
    ) {
        this.verUbicacion();
    }


    onFileSelect(event: any) {
      const file = event.files[0];

      if (file) {
        console.log(`Archivo original: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        this.processImageFile(file);
      }
    }

    processImageFile(file: File) {
      this.isProcessing = true;
      this.errorMessage = null;
      this.qrResult = null;

      // Verificar tamaño máximo
      if (file.size > this.MAX_FILE_SIZE) {
        this.errorMessage = `El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo permitido: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`;
        this.isProcessing = false;
        return;
      }

      // Verificar que sea una imagen
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Por favor selecciona una imagen válida (JPG, PNG, JPEG)';
        this.isProcessing = false;
        return;
      }

      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = new Image();

        img.onload = () => {
          // Redimensionar imagen antes de procesar
          this.resizeAndProcessImage(img);
        };

        img.onerror = () => {
          this.errorMessage = 'Error al cargar la imagen';
          this.isProcessing = false;
        };

        img.src = e.target.result;
      };

      reader.onerror = () => {
        this.errorMessage = 'Error al leer el archivo';
        this.isProcessing = false;
      };

      reader.readAsDataURL(file);
    }

    resizeAndProcessImage(img: HTMLImageElement) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        this.errorMessage = 'Error al crear el canvas';
        this.isProcessing = false;
        return;
      }

      // Calcular nuevas dimensiones manteniendo proporción
      const { width, height } = this.calculateOptimalSize(img.width, img.height);

      canvas.width = width;
      canvas.height = height;

      console.log(`Redimensionando de ${img.width}x${img.height} a ${width}x${height}`);

      // Configurar canvas para mejor calidad
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Procesar imagen optimizada
      this.scanQRFromCanvas(canvas);
    }

    calculateOptimalSize(originalWidth: number, originalHeight: number): { width: number, height: number } {
      const maxSize = this.MAX_IMAGE_SIZE;

      // Si la imagen ya es pequeña, no redimensionar
      if (originalWidth <= maxSize && originalHeight <= maxSize) {
        return { width: originalWidth, height: originalHeight };
      }

      // Calcular proporción
      const aspectRatio = originalWidth / originalHeight;

      let width, height;

      if (originalWidth > originalHeight) {
        // Imagen horizontal
        width = maxSize;
        height = Math.round(maxSize / aspectRatio);
      } else {
        // Imagen vertical
        height = maxSize;
        width = Math.round(maxSize * aspectRatio);
      }

      return { width, height };
    }

    scanQRFromCanvas(canvas: HTMLCanvasElement) {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        this.errorMessage = 'Error al obtener contexto del canvas';
        this.isProcessing = false;
        return;
      }

      // Múltiples intentos de escaneo
      this.attemptQRScan(canvas, ctx);
    }

    attemptQRScan(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
      const attempts = [
        { name: 'Original', transform: (imageData: ImageData) => imageData },
        { name: 'Alto contraste', transform: (imageData: ImageData) => this.enhanceContrast(imageData) },
        { name: 'Escala de grises', transform: (imageData: ImageData) => this.convertToGrayscale(imageData) },
        { name: 'Binarización', transform: (imageData: ImageData) => this.binarizeImage(imageData) }
      ];

      for (const attempt of attempts) {
        console.log(`Intentando escaneo: ${attempt.name}`);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        imageData = attempt.transform(imageData);

        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrCode) {
          console.log(`QR encontrado con método: ${attempt.name}`);
          this.qrResult = qrCode.data;
          let datosForm=this.extraerDatosFormulario(this.qrResult);
          this.cargarFormulario(datosForm.tipoFormulario,datosForm.hash)
          this.processQRResult(qrCode.data);
          this.isProcessing = false;
          return;
        }
      }

      // Si no se encontró QR con ningún método

      this.errorMessage = 'No se encontró código QR en la imagen. Asegúrate de que el QR sea visible y esté completo.';
      this.isProcessing = false;
    }

    enhanceContrast(imageData: ImageData): ImageData {
      const data = imageData.data;
      const factor = 1.5; // Factor de contraste

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));     // R
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128)); // G
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128)); // B
      }

      return imageData;
    }

    convertToGrayscale(imageData: ImageData): ImageData {
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        data[i] = gray;     // R
        data[i + 1] = gray; // G
        data[i + 2] = gray; // B
      }

      return imageData;
    }

    binarizeImage(imageData: ImageData): ImageData {
      const data = imageData.data;

      // Primero convertir a escala de grises
      for (let i = 0; i < data.length; i += 4) {
        const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }

      // Calcular umbral (Otsu's method simplificado)
      const threshold = this.calculateOtsuThreshold(data);

      // Aplicar binarización
      for (let i = 0; i < data.length; i += 4) {
        const binary = data[i] > threshold ? 255 : 0;
        data[i] = binary;
        data[i + 1] = binary;
        data[i + 2] = binary;
      }

      return imageData;
    }

    calculateOtsuThreshold(data: Uint8ClampedArray): number {
      const histogram = new Array(256).fill(0);

      // Construir histograma
      for (let i = 0; i < data.length; i += 4) {
        histogram[data[i]]++;
      }

      const total = data.length / 4;
      let sum = 0;

      for (let i = 0; i < 256; i++) {
        sum += i * histogram[i];
      }

      let sumB = 0;
      let wB = 0;
      let wF = 0;
      let mB = 0;
      let mF = 0;
      let max = 0;
      let between = 0;
      let threshold1 = 0;
      let threshold2 = 0;

      for (let i = 0; i < 256; i++) {
        wB += histogram[i];
        if (wB === 0) continue;

        wF = total - wB;
        if (wF === 0) break;

        sumB += i * histogram[i];
        mB = sumB / wB;
        mF = (sum - sumB) / wF;

        between = wB * wF * (mB - mF) * (mB - mF);

        if (between >= max) {
          threshold1 = i;
          if (between > max) {
            threshold2 = i;
          }
          max = between;
        }
      }

      return (threshold1 + threshold2) / 2;
    }

    processQRResult(qrData: string) {
      console.log('QR procesado exitosamente:', qrData);

      // Procesar según el tipo de datos
      try {
        const jsonData = JSON.parse(qrData);
        console.log('Datos JSON del QR:', jsonData);
      } catch (e) {
        if (qrData.startsWith('http')) {
          console.log('URL encontrada:', qrData);
        } else {
          console.log('Texto plano:', qrData);
        }
      }
    }

    clearResults() {
        this.nro_formulario='';
      this.qrResult = null;
      this.errorMessage = null;
      this.formulario_interno=null;
        this.formulario_externo=null;
        this.formulario_interno_cooperativa=null;
        this.formulario_cola=null;
        this.formulario_tdm=null;
      if (this.fileUploadComponent) {
        this.fileUploadComponent.clear();
      }
    }

    fallbackCopyTextToClipboard(text: string) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        console.log('Texto copiado (fallback)');
      } catch (err) {
        console.error('Error al copiar:', err);
      }

      document.body.removeChild(textArea);
    }

    // Método para mostrar información de la imagen
    getImageInfo(): string {
      if (!this.qrResult) return '';

      return `Imagen procesada y QR detectado exitosamente`;
    }
//-----------------------buscar formulario-----------------------------------------------------------
extraerDatosFormulario(url) {
    // Expresión regular para extraer el tipo de formulario y el hash
    const regex = /formulario-101\/([^\/]+)\/verificacion\?hash=([^&]+)/;
    const match = url.match(regex);

    if (match && match.length >= 3) {
        return {
            tipoFormulario: match[1], // formulario-interno, formulario-tdm, etc.
            hash: match[2] // El hash completo después de ?hash=
        };
    } else {
        return null; // No se encontró un patrón coincidente
    }
}
cargarFormulario(tipoFormulario: string, hash: string) {
    switch (tipoFormulario) {
      case 'formulario-interno':
        this.formularioInternoService.hashFormularioInterno(hash).subscribe(
          (data: IFormularioInternoPDF) => {
            this.formulario_interno = data;
            this.controlTranca.formId=this.formulario_interno.nro_formulario;
            this.formulario_externo=null;
            this.formulario_interno_cooperativa=null;
            this.formulario_cola=null;
            this.formulario_tdm=null;
            console.log(this.formulario_interno)
          },
          (error) => {
            this.error = this.handleError(error); // Manejo de errores personalizado
          }
        );
        break;

      case 'formulario-externo':
        this.formularioExternoService.hashFormularioExterno(hash).subscribe(
          (data: IFormularioExternoPDF) => {
            this.formulario_externo = data;
            this.controlTranca.formId=this.formulario_externo.nro_formulario;
            this.formulario_interno=null;
            this.formulario_interno_cooperativa=null;
            this.formulario_cola=null;
            this.formulario_tdm=null;
            console.log(this.formulario_externo)
          },
          (error) => {
            this.error = this.handleError(error);
          }
        );
        break;

      case 'formulario-interno-cooperativa':
        this.formularioInternoCooperativaService.hashFormularioInternoCooperativa(hash).subscribe(
          (data: IFormularioInternoCooperativaPDF) => {
            this.formulario_interno_cooperativa = data;
            this.controlTranca.formId=this.formulario_interno_cooperativa.nro_formulario;
            this.formulario_interno=null;
            this.formulario_externo=null;
            this.formulario_cola=null;
            this.formulario_tdm=null;
            console.log(this.formulario_interno_cooperativa)
          },
          (error) => {
            this.error = this.handleError(error);
          }
        );
        break;

      case 'formulario-cola':
        this.formularioTrasladoColaService.hashFormularioTrasladoCola(hash).subscribe(
          (data: IFormularioTrasladoColaPDF) => {
            this.formulario_cola = data;
            this.controlTranca.formId=this.formulario_cola.nro_formulario;
            this.formulario_interno=null;
            this.formulario_externo=null;
            this.formulario_interno_cooperativa=null;
            this.formulario_tdm=null;
            console.log(this.formulario_cola)
          },
          (error) => {
            this.error = this.handleError(error);
          }
        );
        break;

      case 'formulario-tdm':
        this.tomaDeMuestraService.hashFormularioTomaDeMuestra(hash).subscribe(
          (data: ITomaDeMuestraPDF) => {
            this.formulario_tdm = data;
            this.controlTranca.formId=this.formulario_tdm.nro_formulario;
            this.formulario_interno=null;
            this.formulario_externo=null;
            this.formulario_interno_cooperativa=null;
            this.formulario_cola=null;
            console.log(this.formulario_tdm)
          },
          (error) => {
            this.error = this.handleError(error);
          }
        );
        break;

      default:
        this.error = 'Tipo de formulario no válido';
    }
  }


//-----------------------buscar formulario-----------------------------------------------------------
extraerDatosNumeroFormulario(nro:string){
    return nro.split('-')[0];
}
cargarFormularioNumero() {
    console.log(this.nro_formulario)
    let tipoFormulario:string=this.extraerDatosNumeroFormulario(this.nro_formulario);
    console.log(tipoFormulario)
    switch (tipoFormulario) {
      case 'I':
        console.log(tipoFormulario)
        this.formularioInternoService.verFormularioInternoNroForm(this.nro_formulario).subscribe(
          (data: IFormularioInternoPDF) => {
            console.log(data);
            this.qrResult='encontrado'
            this.formulario_interno = data;
            this.controlTranca.formId=this.formulario_interno.nro_formulario;
            this.formulario_externo=null;
            this.formulario_interno_cooperativa=null;
            this.formulario_cola=null;
            this.formulario_tdm=null;
            console.log(this.formulario_interno)
          },
          (error) => {
            this.error = this.handleError(error); // Manejo de errores personalizado
          }
        );
        break;

      case 'E':
        this.formularioExternoService.verFormularioExternoNroForm(this.nro_formulario).subscribe(
          (data: IFormularioExternoPDF) => {
            this.qrResult='encontrado'
            this.formulario_externo = data;
            this.controlTranca.formId=this.formulario_externo.nro_formulario;
            this.formulario_interno=null;
            this.formulario_interno_cooperativa=null;
            this.formulario_cola=null;
            this.formulario_tdm=null;
            console.log(this.formulario_externo)
          },
          (error) => {
            this.error = this.handleError(error);
          }
        );
        break;

      case 'C':
        this.formularioTrasladoColaService.verFormularioTrasladoColaNroForm(this.nro_formulario).subscribe(
          (data: IFormularioTrasladoColaPDF) => {
            this.qrResult='encontrado'
            this.formulario_cola = data;
            this.controlTranca.formId=this.formulario_cola.nro_formulario;
            this.formulario_interno=null;
            this.formulario_externo=null;
            this.formulario_interno_cooperativa=null;
            this.formulario_tdm=null;
            console.log(this.formulario_cola)
          },
          (error) => {
            this.error = this.handleError(error);
          }
        );
        break;

      default:
        this.error = 'Tipo de formulario no válido';
    }
  }



  // Función para manejar errores (similar a choferService.handleError)
  private handleError(error: any): string {
    console.error('Error al cargar formulario:', error);
    return error.message || 'Error desconocido al cargar el formulario';
  }
  guardar() {
    let fecha=new Date().toISOString();
    let usuarioId=this.authService.getUser.id;
    console.log(fecha,usuarioId);
    this.turnoTrancaService.verificarFechaUsuario(fecha,usuarioId).subscribe(
        (data: any) => {
            if(data.existe){
                this.controlTranca.trancaId=data.turno.trancaId;
                this.controlTranca.usuarioId=usuarioId
                this.controlTranca.fecha_inspeccion=fecha
                this.controlTrancaService.crearControlTranca(this.controlTranca).subscribe(
                    (data: any) => {
                        console.log(data);
                        this.clearResults()
                        this.notify.success(data.message,'Control Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
                    },
                    (error) => {
                        this.clearResults()
                        this.notify.error(error.error.message,'Error al Guardar',{timeOut:3000,positionClass: 'toast-top-right'});

                    }
                );
            }
            else{
                this.clearResults()
                console.log(data);
                this.notify.error(data.mensaje,'Error al Guardar',{timeOut:3000,positionClass: 'toast-top-right'});
            }
        },
        (error) => {
          this.error = this.handleError(error);
        }
      );

  }
  verUbicacion(){
    if (navigator.geolocation) {
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            console.log(`Ubicación actual: Latitud ${this.latitude}, Longitud ${this.longitude}`);
            },
            (error) => {
            console.error("Error getting location:", error);
            }
        );
    } else {
    console.log("Geolocation is not supported by this browser.");
    }
  }



  //-------------------------------ACCESOS A LA CAMARA---------------------------------------
  // Método para cerrar la cámara
closeCamera() {
  if (this.stream) {
    this.stream.getTracks().forEach(track => track.stop());
    this.stream = null;
  }

  if (this.videoElement?.nativeElement) {
    this.videoElement.nativeElement.srcObject = null;
  }

  this.isCameraOpen = false;
  this.capturedImage = null;
}
// Método para manejar errores de cámara
private handleCameraError(error: any) {
  let errorMessage = 'Error al acceder a la cámara: ';

  switch (error.name) {
    case 'NotAllowedError':
      errorMessage += 'Permisos denegados. Por favor, permite el acceso a la cámara.';
      break;
    case 'NotFoundError':
      errorMessage += 'No se encontró ninguna cámara en el dispositivo.';
      break;
    case 'NotReadableError':
      errorMessage += 'La cámara está siendo usada por otra aplicación.';
      break;
    case 'OverconstrainedError':
      errorMessage += 'La configuración solicitada no es compatible.';
      break;
    default:
      errorMessage += error.message || 'Error desconocido.';
  }

  this.errorMessage = errorMessage;
  this.isCameraOpen = false;
}


  // Método para abrir/cerrar la cámara
// En tu controlar-tranca.component.ts

// Método corregido para abrir la cámara
async openCamera() {
  try {
    // Cerrar stream anterior si existe
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }

    // Constraints mejorados para móviles
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: this.facingMode,
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30 }
      }
    };

    // Solicitar permisos de cámara
    this.stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.srcObject = this.stream;

      // Esperar a que el video esté listo
      await new Promise<void>((resolve) => {
        if (this.videoElement?.nativeElement) {
          this.videoElement.nativeElement.onloadedmetadata = () => {
            resolve();
          };
        }
      });


      this.errorMessage = null;

      // Iniciar detección de QR en tiempo real si está en cámara trasera
      if (this.facingMode === 'environment') {
        this.startQRDetection();
      }
    }
  } catch (error) {
    console.error('Error al abrir la cámara:', error);
    this.handleCameraError(error);
  }
}

// Nuevo método para detección continua de QR
private qrDetectionInterval: any;
startQRDetection() {
  // Limpiar intervalo anterior si existe
  if (this.qrDetectionInterval) {
    clearInterval(this.qrDetectionInterval);
  }

  this.qrDetectionInterval = setInterval(() => {
    if (this.isCameraOpen && this.videoElement?.nativeElement) {
      this.scanQRFromVideo();
    }
  }, 500); // Escanear cada 500ms
}

// Método para escanear QR desde el video
async scanQRFromVideo() {
  if (!this.videoElement?.nativeElement || !this.canvasElement?.nativeElement) {
    return;
  }

  const video = this.videoElement.nativeElement;
  const canvas = this.canvasElement.nativeElement;
  const ctx = canvas.getContext('2d');

  if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
    return;
  }

  // Configurar canvas con las dimensiones del video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Dibujar frame actual del video en el canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Obtener imagen para procesar
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Intentar detectar QR
  const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

  if (qrCode && qrCode.data) {
    console.log('QR detectado:', qrCode.data);
    this.qrResult = qrCode.data;

    // Detener la detección continua
    if (this.qrDetectionInterval) {
      clearInterval(this.qrDetectionInterval);
      this.qrDetectionInterval = null;
    }

    // Procesar el resultado
    let datosForm = this.extraerDatosFormulario(this.qrResult);
    if (datosForm) {
      this.cargarFormulario(datosForm.tipoFormulario, datosForm.hash);
    }

    // Cerrar la cámara automáticamente
    this.closeCamera();
  }
}

// Método mejorado para cambiar entre cámaras
async switchCamera() {
  if (!this.isCameraOpen) return;

  // Detener detección de QR
  if (this.qrDetectionInterval) {
    clearInterval(this.qrDetectionInterval);
    this.qrDetectionInterval = null;
  }

  this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';

  // Cerrar cámara actual
  this.closeCamera();

  // Pequeña pausa antes de abrir la nueva cámara
  await new Promise(resolve => setTimeout(resolve, 300));

  // Abrir nueva cámara
  await this.openCamera();
}

// Método mejorado para verificar soporte de cámara
checkCameraSupport(): boolean {
  const isSecure = window.location.protocol === 'https:' ||
                  window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1';

  const hasGetUserMedia = !!(navigator.mediaDevices &&
                            navigator.mediaDevices.getUserMedia);

  return isSecure && hasGetUserMedia;
}

// Método para mostrar alerta amigable sobre HTTPS
showHTTPSWarning() {
  if (window.location.protocol !== 'https:' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1') {
    this.errorMessage = 'La cámara requiere una conexión segura (HTTPS) o localhost para funcionar.';
    return true;
  }
  return false;
}

// Modificar toggleCamera para incluir verificación HTTPS
async toggleCamera() {
  if (this.isCameraOpen) {
    this.closeCamera();
  } else {
    if (this.showHTTPSWarning()) {
      return;
    }
    this.isCameraOpen = true;
    await this.openCamera();
  }
}

// Modificar capturePhoto para usar la detección existente
capturePhoto() {
  if (!this.videoElement?.nativeElement) {
    this.errorMessage = 'Error: elemento de video no disponible';
    return;
  }

  // Simplemente forzar una detección de QR
  this.scanQRFromVideo();
}

// Asegurar limpieza completa
ngOnDestroy() {
  this.closeCamera();
  if (this.qrDetectionInterval) {
    clearInterval(this.qrDetectionInterval);
  }
  if (this.watchId) {
    navigator.geolocation.clearWatch(this.watchId);
  }
}
}
