import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-parameters',
  imports: [MatButtonModule, MatIconModule, FormsModule, CommonModule],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.scss'
})
export class ParametersComponent {
  @ViewChild('fileInput')
  fileInput: any;

  file: File | null = null;

  constructor(private dialog: MatDialog, private webSocketService: WebSocketService) {}

  openConfirmDialog() {
    if (this.file) {
      ConfirmDialogComponent.open(
        this.dialog,
        'Confirm Parameters',
        'Send parameters to vehicle?',
      ).subscribe((result: boolean | undefined) => {
        if (result) {
          const reader = new FileReader();
      
          reader.onload = (e) => {
            try {
              const contents = e.target?.result as string;
              const jsonData = JSON.parse(contents);
              this.webSocketService.send({
                "type": "parameters",
                "data": jsonData
              });
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          };
          
          reader.onerror = (error) => {
            console.error('Error reading file:', error);
          };

          reader.readAsText(this.file!);
        } else {
          console.log('Cancelled');
        }
      });
    }
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }
}
