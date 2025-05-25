import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-altitude-profile',
  standalone: true,
  imports: [CommonModule, PlotlyModule],
  templateUrl: './altitude-profile.component.html',
  styleUrl: './altitude-profile.component.scss'
})
export class AltitudeProfileComponent {
  public graph = {
    data: [
      { 
        x: [1, 2, 3, 4], 
        y: [10, 15, 13, 17], 
        type: 'scatter' 
      }
    ],
    layout: {
      title: 'Standalone Component Plot',
      width: 320,
      height: 240,
      margin: {
        l: 20,
        r: 20,
        t: 20,
        b: 20
      }
    },
    config: {
      staticPlot: true
    }
  };
}
