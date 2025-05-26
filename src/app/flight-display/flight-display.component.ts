import { Component } from '@angular/core';
import { MapComponent } from '../components/map/map.component';
import { AltitudeProfileComponent } from '../components/altitude-profile/altitude-profile.component';
import { DataComponent } from '../components/data/data.component';
import { SetAltitudeComponent } from '../components/set-altitude/set-altitude.component';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-flight-display',
  imports: [MapComponent, AltitudeProfileComponent, DataComponent, SetAltitudeComponent, MatGridListModule],
  templateUrl: './flight-display.component.html',
  styleUrl: './flight-display.component.scss'
})
export class FlightDisplayComponent {

}
