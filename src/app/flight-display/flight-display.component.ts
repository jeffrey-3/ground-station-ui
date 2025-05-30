import { Component } from '@angular/core';
import { MapComponent } from '../components/map/map.component';
import { DataComponent } from '../components/data/data.component';
import { SetAltitudeComponent } from '../components/set-altitude/set-altitude.component';

@Component({
  selector: 'app-flight-display',
  imports: [MapComponent, DataComponent, SetAltitudeComponent],
  templateUrl: './flight-display.component.html',
  styleUrl: './flight-display.component.scss'
})
export class FlightDisplayComponent {

}
