import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-calibration',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './calibration.component.html',
  styleUrl: './calibration.component.scss'
})
export class CalibrationComponent {
  constructor(private dialog: MatDialog) {}

  openConfirmDialog() {
    ConfirmDialogComponent.open(
      this.dialog,
      'Confirm Calibration',
      'Save calibration to vehicle parameters?',
    ).subscribe((result: boolean | undefined) => {
      if (result) {
        console.log('Sent');
      } else {
        console.log('Cancelled');
      }
    });
  }
}
