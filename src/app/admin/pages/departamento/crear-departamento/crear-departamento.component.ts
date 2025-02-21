import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { tileLayer, latLng, Marker,marker, MapOptions,Map, LeafletEvent , control } from 'leaflet';
import { IDepartamento } from '@data/departamento.metadata';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { IMunicipio } from '@data/municipio.metadata';
import { DepartamentoFormulario } from 'src/app/admin/validators/departamento';

@Component({
  selector: 'app-crear-departamento',
  templateUrl: './crear-departamento.component.html',
  styleUrls: ['./crear-departamento.component.scss']
})
export class CrearDepartamentoComponent implements OnInit {

    public departamento=new DepartamentoFormulario();
    public departamento_id:number=0;

    public departamento_registrado:IDepartamento=null;

    public error!:any;
    public nombre:string='';
    public estados:any;
    public ubicacion:any={
      latitud:-16.451615981589992, 
      longitus:-65.34825300026785
    }

  constructor(
    private departamentosService:DepartamentosService,
    private notify:ToastrService,
    private authService:AuthService,
    private router: Router,
  ) {

    this.departamento.formulario.patchValue({
        user_id: authService.getUser.id
      });
   }

  ngOnInit() {
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



    this.departamento_id=0;

     /* this.presentaciones = [
        { nombre: 'ENSACADO', id: '1',humedad:1,merma:1,cantidad:1 },
        { nombre: 'LINGOTES', id: '2',humedad:0,merma:0,cantidad:1 },
        { nombre: 'A GRANEL', id: '3',humedad:1,merma:1,cantidad:0 },
        { nombre: 'CATODO DE COBRE', id: '4',humedad:0,merma:0,cantidad:1 },
        { nombre: 'CONTENEDOR CILINDRICO', id: '5',humedad:1,merma:1,cantidad:1 },
        { nombre: 'EMBALADAS', id: '6',humedad:1,merma:1,cantidad:1 },
        { nombre: 'ENVASADO', id: '7',humedad:1,merma:1,cantidad:1 },
        { nombre: 'BROZA', id: '8',humedad:1,merma:1,cantidad:0 },
        { nombre: 'AMALGAMA', id: '9',humedad:0,merma:0,cantidad:1 },
        { nombre: 'GRANALLA', id: '10',humedad:0,merma:0,cantidad:1 },
        { nombre: 'ORO PEPA', id: '11',humedad:0,merma:0,cantidad:1 },
        { nombre: 'SACOS', id: '12',humedad:1,merma:1,cantidad:1 },
        { nombre: 'OTRO', id: '13',humedad:1,merma:1,cantidad:0 }
    ];*/

  }
 // Función

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
      departamentos:IDepartamento[]=[];
      municipio:IMunicipio[]=[];

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
                this.departamento.formulario.patchValue({latitud: position.lat, longitud:position.lng});
            }
            else{
                //this.sucursal.latitud=position.lat;
                //this.sucursal.longitud=position.lng;
                //this.operador.formulario.patchValue({created_at: position.lat, updated_at:position.lng});

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
  
    if (this.map) {
        this.map.setView(latLng('-17.986080103148147', '-67.09125114199388'), 13.5);
    this.sw_mapa=false;
    this.mapaDialogo = true;
      this.notify.error('Seleccione un departamento para abrir el mapa....','Error al Abrir el Mapa',{timeOut:2000,positionClass: 'toast-bottom-right'});
  }




}

  onSubmit(){

  }
  guardar(){

    this.departamento.formulario.patchValue({
        estado: this.departamento.formulario.value.estado.label
      });
    if(this.departamento.formulario.valid){
      console.log(this.departamento.formulario.value);

      this.departamentosService.creardepartamento(this.departamento.formulario.value).subscribe(
        (data:any) =>
        {
            this.departamento_registrado=this.departamentosService.handleCreardepartamento(data);

          if(this.departamento_registrado!==null)
          {
            console.log(this.departamento_registrado);
            this.departamento.formulario.reset();
            this.notify.success('El el formulario interno se generó exitosamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
            this.router.navigate(['/admin/departamento/']);
          }
          else{
            this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
          }
        },
        (error:any) =>
        {

          this.error=this.departamentosService.handleCreardepartamentoError(error.error.data);
          if(error.error.status=='fail')
          {
            this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
          }
        }

          );
    }
    else{
        this.mostrarErrorFormularios(this.departamento);
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});

   }

  }

    declaracionJuradaSwitch(event:any){
        const checkbox = event.target as HTMLInputElement;
        //this.lingotes=checkbox.checked;
    }

private mostrarErrorFormularios(formGroup: DepartamentoFormulario): void {
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
cancelar(){

}

}
