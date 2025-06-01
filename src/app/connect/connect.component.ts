import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-connect',
  imports: [
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule, 
    FormsModule, 
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.scss'
})
export class ConnectComponent implements OnInit, OnDestroy {
  ports: string[] = [];
  selectedPort: string = "";
  isConnected: boolean = false;

  private subscription!: Subscription;

  constructor(
    private dialog: MatDialog,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.subscription = this.webSocketService.messages$.subscribe(data => {
      this.ports = data.serial.ports;

      if (data.serial.connected_port != "") {
        this.selectedPort = data.serial.connected_port;
        this.isConnected = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openConfirmDialog() { 
    ConfirmDialogComponent.open(
      this.dialog,
      'Confirm Connect',
      'Connect to vehicle?'
    ).subscribe((result: boolean | undefined) => {
      if (result) {
        console.log(this.selectedPort);
        console.log('Sent');

        this.webSocketService.connectComPort(this.selectedPort);
      } else {
        console.log('Cancelled');
      }
    });
  }
}
