import { Component } from '@angular/core';
import { MapComponent } from './components/map/map.component';
import { DataComponent } from './components/data/data.component';

@Component({
  selector: 'app-root',
  imports: [MapComponent, DataComponent],
  template: `
    <app-map />
    <app-data />
  `,
  styles: [],
})
export class AppComponent {
  title = 'ground-station-ui';
}
