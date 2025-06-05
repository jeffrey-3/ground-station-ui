import { Component, ViewChild, OnInit, signal, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../services/web-socket.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-parameters',
  imports: [
    MatButtonModule, 
    MatIconModule, 
    FormsModule, 
    CommonModule, 
    MatProgressBarModule
  ],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.scss'
})
export class ParametersComponent implements OnInit {
  @ViewChild('fileInput')
  fileInput: any;

  file: File | null = null;

  progress = signal(0);

  private _snackBar = inject(MatSnackBar);

  private subscription!: Subscription;

  constructor(private dialog: MatDialog, private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.subscription = this.webSocketService.messages$.subscribe(data => {
      if (data.type === "param_set_progress") {
        this.progress.set(100 * data.progress / data.total);
      } else if (data.type === "param_set_success") {
        this._snackBar.open("Successfully uploaded parameters to vehicle", "", {
          duration: 3000
        });
      }
    });
  }
  
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
                "type": "send_params",
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
