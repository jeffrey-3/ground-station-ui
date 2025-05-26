import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogService } from '../services/confirm-dialog.service';

@Component({
  selector: 'app-parameters',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.scss'
})
export class ParametersComponent {
  constructor(private confirmDialogService: ConfirmDialogService) {}

  openConfirmDialog() {
    this.confirmDialogService.confirm(
      'Confirm Parameters',
      'Send parameters to vehicle?',
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
