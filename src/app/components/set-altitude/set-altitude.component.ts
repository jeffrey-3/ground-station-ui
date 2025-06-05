import { Component, signal, ViewChild, OnInit, inject } from '@angular/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { WebSocketService } from '../../services/web-socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-set-altitude',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './set-altitude.component.html',
  styleUrl: './set-altitude.component.scss'
})
export class SetAltitudeComponent implements OnInit {
  currentTargetAltitude = signal(null);
  targetAltitude: number | null = null;

  @ViewChild(MatInput) input!: MatInput;

  private _snackBar = inject(MatSnackBar);

  constructor(private dialog: MatDialog, private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.messages$.subscribe(data => {
      if (data.type === "control_setpoints") {
        this.currentTargetAltitude.set(data.alt_sp);
      } else if (data.type === "set_altitude_result") {
        this._snackBar.open("Successfully sent target altitude to vehicle", "", {
          duration: 3000
        });
      }
    })
  }

  openConfirmDialog() {
    ConfirmDialogComponent.open(
      this.dialog,
      'Confirm Altitude',
      'Send target altitude to vehicle?',
    ).subscribe((result: boolean | undefined) => {
      if (result) {
        console.log(this.targetAltitude);

        this.webSocketService.send({
          type: 'send_altitude',
          data: this.targetAltitude
        });

        this.targetAltitude = null;
        this.input.value = '';
      } else {
        console.log('Cancelled');
      }
    });
  }
}
