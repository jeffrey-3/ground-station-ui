import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-parameters',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.scss'
})
export class ParametersComponent {
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
