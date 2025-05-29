import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-set-altitude',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './set-altitude.component.html',
  styleUrl: './set-altitude.component.scss'
})
export class SetAltitudeComponent {
  constructor(private dialog: MatDialog) {}

  openConfirmDialog() {
    ConfirmDialogComponent.open(
      this.dialog,
      'Confirm Parameters',
      'Send parameters to vehicle?',
    ).subscribe((result: boolean | undefined) => {
      if (result) {
        console.log('Sent');
      } else {
        console.log('Cancelled');
      }
    });
  }
}
