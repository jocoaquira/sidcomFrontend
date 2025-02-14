import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { tileLayer, latLng, MapOptions, Map, Marker, marker } from 'leaflet';

@Component({
  selector: 'app-ver-mapa',
  templateUrl: './ver-mapa.component.html',
  styleUrls: ['./ver-mapa.component.scss']
})
export class VerMapaComponent implements OnInit, OnChanges {
  @Input() latitud!: number;
  @Input() longitud!: number;
  @Output() estadoDialogo = new EventEmitter<boolean>();
  @Input() isInsideDialog: boolean = false; // Input que nos dice si está en un modal

  options!: MapOptions;
  satelliteLayer: any;
  streetLayer: any;
  map: Map | null = null;
  currentMarker: Marker | null = null;

  constructor() {}

  ngOnInit() {
    this.satelliteLayer = tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: '&copy; <a href="https://www.esri.com/">Esri</a>', maxZoom: 19, opacity: 0.4 }
    );

    this.streetLayer = tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }
    );

    // Establecer la opción del mapa con una ubicación por defecto
    this.options = {
      center: latLng(this.latitud || -16.5, this.longitud || -68.1),
      zoom: 12,
      layers: [this.streetLayer]
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['latitud'] || changes['longitud']) && this.latitud && this.longitud) {
      if (this.map) {
        this.addMarker(this.latitud, this.longitud);
      }
    }
  }

  onMapReady(map: Map) {
    this.map = map;
    this.addMarker(this.latitud, this.longitud); // Asegura que el marcador se agregue al mapa cuando se inicializa
    if (this.isInsideDialog) {
      this.actualizarMapa(); // Redibujar el mapa si está dentro de un modal
    }
  }

  addMarker(lat: number, lng: number) {
    if (!this.map) {
      return;
    }

    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }

    this.currentMarker = marker([lat, lng]).addTo(this.map);
    this.currentMarker.bindPopup(`📍 Ubicación: Latitud: ${lat}, Longitud: ${lng}`).openPopup();
    
    this.map.setView(latLng(lat, lng), 12); // Mueve la vista del mapa al marcador
  }

  actualizarMapa() {
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize(); // Forzar el redibujado del mapa si está en un modal
      }, 500); // Esperar medio segundo para asegurar que el modal se haya abierto completamente
    }
  }
}
