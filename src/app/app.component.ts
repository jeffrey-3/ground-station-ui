import { Component } from '@angular/core';
import { FlightDisplayComponent } from './flight-display/flight-display.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, FlightDisplayComponent],
  template: `
    <app-header />
    <main>
      <app-flight-display />
    </main>
  `,
  styles: [
    `
      main {
        padding: 16px;
        overflow-x: hidden;
      }
    `,
  ],
})
export class AppComponent {
  title = 'ground-station-ui'
}
