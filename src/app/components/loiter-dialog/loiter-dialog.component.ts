import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MatDialogModule, 
  MatDialogRef, 
  MAT_DIALOG_DATA 
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-loiter-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatRadioModule,
    FormsModule // Required for ngModel
  ],
  templateUrl: './loiter-dialog.component.html',
  styleUrl: './loiter-dialog.component.scss'
})
export class LoiterDialogComponent {
  direction: string = 'left'; // Default value
  radius: number = 0;

  constructor(
    public dialogRef: MatDialogRef<LoiterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit(): void {
    const result = {
      direction: this.direction,
      radius: this.radius
    };
    this.dialogRef.close(result);
  }
}
