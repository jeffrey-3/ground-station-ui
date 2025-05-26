import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';

PlotlyModule.plotlyjs = PlotlyJS;


// Don't use set altitude input!!!!!!!!!!!!!!!!!!! USE BUTTON THAT OPENS POPUP, but still have an indicator for what the value of setpoint is

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, PlotlyModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  public graph: any = {
    data: [],
    layout: {}
  };

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    this.graph = {
      data: [{
        type: "scattermap"
      }],
      layout: {
        map: {
          style: "white-bg",
          layers: [{
            sourcetype: "raster",
            source: ["http://localhost:5000/tiles/{z}/{x}/{y}.png"]
          }],
          center: { 
            lat: 40.7128, 
            lon: -74.0060 
          },
          zoom: 10
        },
        margin: { 
          r: 0, 
          t: 0, 
          b: 0, 
          l: 0 
        }
      },
      config: {
        responsive: true,
        scrollZoom: true,
        displayModeBar: false
      }
    };
  }

  onPlotlyInit(event: any) {
    console.log('Plotly initialized', event);
  }
}