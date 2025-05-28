import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-connect',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.scss'
})
export class ConnectComponent {
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  constructor(private dialog: MatDialog) {}

  openConfirmDialog() {
    ConfirmDialogComponent.open(
      this.dialog,
      'Confirm Connect',
      'Connect to vehicle?',
    ).subscribe((result: boolean | undefined) => {
      if (result) {
        console.log('Sent');
      } else {
        console.log('Cancelled');
      }
    });
  }
}
