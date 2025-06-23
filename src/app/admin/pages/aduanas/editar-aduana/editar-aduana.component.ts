import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { tileLayer, latLng, Marker,marker, MapOptions,Map, LeafletEvent , control } from 'leaflet';
import { IDepartamento } from '@data/departamento.metadata';
import { DepartamentosService } from 'src/app/admin/services/departamentos.service';
import { IMunicipio } from '@data/municipio.metadata';
import { AduanaFormulario } from 'src/app/admin/validators/aduana';
import { AduanasService } from 'src/app/admin/services/aduanas.service';
import { IAduana } from '@data/aduana.metadata';

@Component({
  selector: 'app-editar-aduana',
  templateUrl: './editar-aduana.component.html',
  styleUrls: ['./editar-aduana.component.scss']
})
export class EditarAduanaComponent implements OnInit {

    public aduana=new AduanaFormulario();
    public departamento_id:number=0;

    public aduana_registrado:IAduana=null;
    public id:number=null;
    public error!:any;
    public nombre:string='';
    public estados:any;

  constructor(
    private aduanasService:AduanasService,
    private notify:ToastrService,
    private authService:AuthService,
    private router: Router,
    private departamentosService:DepartamentosService,
    private actRoute:ActivatedRoute,
  ) {
    this.actRoute.paramMap.subscribe(params=>{
      this.id=parseInt(params.get('id'));
     this.aduanasService.verAduana(this.id.toString()).subscribe(
       (data:any)=>{
       let aduana=data;
       this.cargar_datos(aduana);
     },
     (error:any)=> this.error=this.aduanasService.handleError(error));
   });
  }

  ngOnInit() {
    this.estados = [
      { label: 'ACTIVO', value: '1' },
      { label: 'INACTIVO', value: '0' }
  ];
    this.departamentosService.verdepartamentos(this.nombre).subscribe(
      (data:any)=>{
      this.departamento=this.departamentosService.handledepartamento(data);
      console.log(data);
    },
    (error:any)=> this.error=this.departamentosService.handleError(error)
  );


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
      departamento:IDepartamento[]=[];
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
                this.aduana.formulario.patchValue({latitud: position.lat, longitud:position.lng});
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
  if(this.aduana.formulario.value.departamento){
      let dept:any=this.departamento.find(val => val.id ===  this.aduana.formulario.value.departamento);
      console.log(this.aduana.formulario.value.departamento);
      if (this.map) {
          this.map.setView(latLng(dept.latitud, dept.longitud), 13.5);
      }
      this.sw_mapa=false;
      this.mapaDialogo = true;
  }
  else{
    if (this.map) {
        this.map.setView(latLng('-17.986080103148147', '-67.09125114199388'), 13.5);
    }
    this.sw_mapa=false;
    this.mapaDialogo = true;
      this.notify.error('Seleccione un departamento para abrir el mapa....','Error al Abrir el Mapa',{timeOut:2000,positionClass: 'toast-bottom-right'});
  }
}
cargar_datos(form:any){
  this.aduana.formulario.patchValue({
      id: form.id,
      nombre:form.nombre,
      codigo_aduana:form.codigo_aduana,
      latitud:form.latitud,
      longitud:form.longitud,
      departamento_id:this.departamento.find((e: any) => e.id === form.departamento_id) || null,
      estado: this.estados.find((e: any) => e.label === form.estado) || null,
  });
  console.log(this.aduana.formulario.value);
}
  onSubmit(){
    
  }
  guardar(){

    this.aduana.formulario.patchValue({
        estado: this.aduana.formulario.value.estado.label
      });
    if(this.aduana.formulario.valid){
      console.log(this.aduana.formulario.value);

      this.aduanasService.editaraduana(this.aduana.formulario.value).subscribe(
        (data:any) =>
        {
            this.aduana_registrado=this.aduanasService.handleCrearaduana(data);

          if(this.aduana_registrado!==null)
          {
            console.log(this.aduana_registrado);
            this.aduana.formulario.reset();
            this.notify.success('El el formulario interno se generó exitosamente','Creado Correctamente',{timeOut:2500,positionClass: 'toast-top-right'});
            this.router.navigate(['/admin/aduana/']);
          }
          else{
            this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
          }
        },
        (error:any) =>
        {

          this.error=this.aduanasService.handleCrearaduanaError(error.error.data);
          if(error.error.status=='fail')
          {
            this.notify.error('Falló...Revise los campos y vuelva a enviar....','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});
          }
        }

          );
    }
    else{
        this.mostrarErrorFormularios(this.aduana);
        this.notify.error('Revise los datos e intente nuevamente','Error con el Registro',{timeOut:2000,positionClass: 'toast-top-right'});

   }

  }

    cambioDepartamentoMapa(departamento_id:any){
            console.log(departamento_id);

            this.aduana.formulario.value.departamento=departamento_id.value;
            let dept:IDepartamento=this.departamento.find(element => element.id === departamento_id.value);

                this.options = {
                    center: latLng(dept.latitud,dept.longitud),
                    zoom: 13.5
                };
                if (this.map) {
                    this.map.setView(latLng(dept.latitud, dept.longitud), 13.5);
                  }
        }

    declaracionJuradaSwitch(event:any){
        const checkbox = event.target as HTMLInputElement;
        //this.lingotes=checkbox.checked;
    }

private mostrarErrorFormularios(formGroup: AduanaFormulario): void {
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
