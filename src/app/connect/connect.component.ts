import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogService } from '../services/confirm-dialog.service';

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

  constructor(private confirmDialogService: ConfirmDialogService) {}

  openConfirmDialog() {
    this.confirmDialogService.confirm(
      'Confirm Connect',
      'Are you sure you want to connect?',
      'OK',
      'Cancel'
    ).subscribe(result => {
      if (result) {
        // User confirmed - perform delete action
        console.log('Item deleted');
      } else {
        // User cancelled
        console.log('Deletion cancelled');
      }
    });
  }
}
