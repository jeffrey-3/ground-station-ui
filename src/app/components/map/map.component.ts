import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  ngOnInit(): void {
    this.configMap();
  }

  map: any 

  configMap() {
    this.map = L.map('map', {
      center: [40.3994, -74.0060],
      zoom: 10,
      attributionControl: false
    })

    L.tileLayer("http://localhost:5000/tiles/{z}/{x}/{y}.png").addTo(this.map);

    L.circle([40.3994, -74.0060], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(this.map);
  }
}


// http://localhost:5000/tiles/{z}/{x}/{y}.png
// 90.3994, -74.0060