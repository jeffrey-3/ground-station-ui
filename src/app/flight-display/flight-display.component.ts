import { Component } from '@angular/core';
import { MapComponent } from '../components/map/map.component';
import { AltitudeProfileComponent } from '../components/altitude-profile/altitude-profile.component';
import { DataComponent } from '../components/data/data.component';

@Component({
  selector: 'app-flight-display',
  imports: [MapComponent, AltitudeProfileComponent, DataComponent],
  templateUrl: './flight-display.component.html',
  styleUrl: './flight-display.component.scss'
})
export class FlightDisplayComponent {

}
