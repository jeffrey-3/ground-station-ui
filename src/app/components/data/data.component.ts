import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-data',
  imports: [],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss'
})
export class DataComponent {
  batt_volts = signal('12.07V');
  counterValue = signal(0);

  increment() {
    this.counterValue.update((val) => val + 1);
  }

  reset() {
    this.counterValue.set(0)
  }
}
