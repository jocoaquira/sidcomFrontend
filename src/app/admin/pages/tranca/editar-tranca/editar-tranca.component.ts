import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { tileLayer, latLng, Marker,marker, MapOptions,Map, LeafletEvent , control } from 'leaflet';
import { IDepartamento } from '@data/departamento.metadata';
import { MunicipiosService } from 'src/app/admin/services/municipios.service';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { IMunicipio } from '@data/municipio.metadata';
import { ITranca } from '@data/tranca.metadata';
import { TrancaService } from 'src/app/admin/services/tranca.service';
import { TrancaFormulario } from 'src/app/admin/validators/tranca';

@Component({
  selector: 'app-editar-tranca',
  templateUrl: './editar-tranca.component.html',
  styleUrls: ['./editar-tranca.component.scss']
})
export class EditarTrancaComponent implements OnInit {


    public tranca=new TrancaFormulario();
    public departamento_id:number=0;
    public municipio_id:number=0;
    public id:number=0;
    public dept:IDepartamento={
        longitud:null,
        latitud:null
        };
    public estados:any[] = [];
  // Método que se llama cuando cambia el departamento
  cambioDepartamento1(departamentoId: number): void {

    // Aquí puedes hacer cualquier acción extra cuando el departamento cambie
  }
    public tranca_registrado:ITranca=null;

    public error!:any;
    public nombre:string='';



  public activeStep: number = 0; // Establecer el paso activo inicial
  constructor(

    private trancaService:TrancaService,
    private notify:ToastrService,
    private authService:AuthService,
    private router: Router,
    private municipiosService:MunicipiosService,
    private departamentosService:DepartamentosService,
    private actRoute:ActivatedRoute,
  ) {
        this.actRoute.paramMap.subscribe(params=>{
        this.id=parseInt(params.get('id'));
        this.trancaService.verTranca(this.id.toString()).subscribe(
        (data:any)=>{
        let formulario_int=data;
            this.cargar_datos(formulario_int);
        },
        (error:any)=> this.error=this.trancaService.handleError(error));
    });

   }

  ngOnInit() {
    this.departamento_id = 4;
    this.municipiosService.vermunicipios( this.departamento_id.toString()).subscribe(
        (data:any)=>{

        this.municipio=this.municipiosService.handlemunicipio(data);
      },
      (error:any)=> this.error=this.municipiosService.handleError(error)
    );
    this.estados = [
        { label: 'ACTIVO', value: '1' },
        { label: 'INACTIVO', value: '0' }
    ];

    this.satelliteLayer = tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
        maxZoom: 19,
        opacity:0.4
      }
    );
    // Capa de calles de OpenStreetMap
    this.streetLayer = tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    );
    this.departamentosService.verdepartamentos(this.nombre).subscribe(
      (data:any)=>{
      this.departamento=this.departamentosService.handledepartamento(data);
      // Para asignar todos los valores del formulario (debe incluir todos los campos)
        console.log(this.tranca.formulario.value);
      // Esperamos un momento para asegurar que el mapa esté listo
      setTimeout(() => {
        this.cambioDepartamentoMapa(4);
      }, 800);



    },
    (error:any)=> this.error=this.departamentosService.handleError(error)
  );

  }
      options: any;
      satelliteLayer: any;
      standardLayer:any;
      streetLayer:any;
      clickedCoordinates: string = '';
      markerLayer: any;
      tonerLayer:any;
      currentMarker: Marker;
      map: any;
      sw_mapa:boolean=false;
      mapaDialogo:boolean=false;
      departamento:IDepartamento[]=[];
      municipio:IMunicipio[]=[];

cargar_datos(form:any){
  this.tranca.formulario.patchValue({
      id: form.id,
      municipio_id: form.municipio_id,
      lugar: form.lugar,
      latitud: form.latitud,
      longitud: form.longitud,
      estado: form.estado
  });
}

  actualizarMapa() {
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 0);
    }
  }
agregarPunto() {

    if(this.currentMarker!==undefined){
        const position = this.currentMarker.getLatLng();
        if(!this.sw_mapa)
            {
                this.tranca.formulario.patchValue({latitud: position.lat, longitud:position.lng});
            }
            else{
            }
            this.mapaDialogo = false;
    }
    else{
        this.notify.error('Seleccione un punto en el mapa para agregar....','Error al Seleccionar un Punto',{timeOut:2000,positionClass: 'toast-bottom-right'});
    }


}
onMapReady(map: Map) {
  this.map = map;

  // Agregar evento de clic en el mapa
  this.map.on('click', (event) => {
    this.addMarker(event.latlng.lat, event.latlng.lng);
  });
}
addMarker(lat: number, lng: number) {
  // Si ya existe un marcador, lo eliminamos
  if (this.currentMarker) {
    this.map.removeLayer(this.currentMarker);
  }

  // Crear y agregar un nuevo marcador
  this.currentMarker = marker([lat, lng]).addTo(this.map);
  this.currentMarker.bindPopup(`Latitud: ${lat}, Longitud: ${lng}`).openPopup();
}
abrirMapa() {
  if(this.departamento_id){
      this.dept=this.departamento.find(val => val.id ===  this.departamento_id);

      if (this.map) {
          this.map.setView(latLng(this.dept.latitud, this.dept.longitud), 13.5);
      }
      this.sw_mapa=false;
      this.mapaDialogo = true;
  }
  else{
      this.notify.error('Seleccione un departamento para abrir el mapa....','Error al Abrir el Mapa',{timeOut:2000,positionClass: 'toast-bottom-right'});
  }
}
cerrarMapa(){
    this.mapaDialogo = false;
}

  onSubmit(){
      if (this.tranca.formulario.valid) {
         // Ahora puedes enviar el formulario reducido
        this.trancaService.editarTranca(this.tranca.formulario.value).subscribe(
          (data: any) => {
            this.tranca_registrado = this.trancaService.handleCrearTranca(data);
            if (this.tranca_registrado !== null) {

              this.tranca.formulario.reset();
              this.notify.success('El lugar de verificacion se actualizó exitosamente', 'Creado Correctamente', { timeOut: 2500, positionClass: 'toast-top-right' });
              this.router.navigate(['/admin/tranca']);
            } else {
              this.notify.error('Falló... Revise los campos y vuelva a enviar...', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
            }
          },
          (error: any) => {
            this.error = this.trancaService.handleCrearlugarverificacionError(error.error.data);
            if (error.error.status == 'fail') {
              this.notify.error('Falló... Revise los campos y vuelva a enviar...', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
            }
          }
        );
      } else {
        this.mostrarErrorFormularios(this.tranca);
        this.notify.error('Revise los datos e intente nuevamente', 'Error con el Registro', { timeOut: 2000, positionClass: 'toast-top-right' });
      }
  }
    cambioDepartamentoMapa(departamento_id:any){


            this.tranca.formulario.value.departamento_id=departamento_id;
            this.dept=this.departamento.find(element => element.id === departamento_id);
            this.municipiosService.vermunicipios( departamento_id.toString()).subscribe(
                (data:any)=>{

                this.municipio=this.municipiosService.handlemunicipio(data);
                this.options = {
                    center: latLng(this.dept.latitud,this.dept.longitud),
                    zoom: 13.5
                };
                if (this.map) {
                    this.map.setView(latLng(this.dept.latitud, this.dept.longitud), 13.5);
                  }
              },
              (error:any)=> this.error=this.municipiosService.handleError(error)
            );
        }
    cambioMunicipio(event){
        this.municipio_id=event;
    }
    cambioMunicipioMapa(municipio:any){

 }

private mostrarErrorFormularios(formGroup: TrancaFormulario): void {
    const errores: any[] = [];
  Object.keys(formGroup.formulario.controls).forEach((campo) => {
    const control = formGroup.formulario.get(campo);
    if (control?.errors) {
      const mensajeError =formGroup.getErrorMessage(campo);
      errores.push({ campo, mensajeError });
    }
  });

  if (errores.length > 0) {

  } else {

  }
}
cancelar(): void {
    this.router.navigate(['/admin/tranca']);
}
 formatFechaCompleta(fecha: string | Date): string {
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
        throw new Error("Fecha inválida");
    }

    const anio = fechaObj.getFullYear();
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Mes comienza en 0
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const hora = String(fechaObj.getHours()).padStart(2, '0');
    const minutos = String(fechaObj.getMinutes()).padStart(2, '0');
    const segundos = String(fechaObj.getSeconds()).padStart(2, '0');

    let esto=`${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
    // Convierte el string al formato Date
    let fechas = new Date(esto.replace(' ', 'T'));

    // Convierte a formato ISO 8601 con el sufijo 'Z' para indicar UTC
    let fechaConvertida = fechas.toISOString();
    return fechaConvertida;
}
}
