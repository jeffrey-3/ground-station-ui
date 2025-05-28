import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-set-altitude',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './set-altitude.component.html',
  styleUrl: './set-altitude.component.scss'
})
export class SetAltitudeComponent {
  onAltitudeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    console.log('Altitude changed to:', value);
  }
}
