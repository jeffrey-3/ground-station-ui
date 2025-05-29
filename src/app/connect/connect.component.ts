import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WebSocketService } from '../services/web-socket.service';
import { StateService } from '../services/state.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

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

  private subscription!: Subscription;

  constructor(
    private dialog: MatDialog, 
    private webSocketService: WebSocketService, 
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.ports = this.stateService.getComPorts();
    this.selectedPort = this.stateService.getPort();

    this.subscription = this.webSocketService.messages$.subscribe(data => {
      if (data.type === 'ports') {
        this.ports = data.ports;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.stateService.setComPorts(this.ports);
  }

  openConfirmDialog() {
    ConfirmDialogComponent.open(
      this.dialog,
      'Confirm Connect',
      'Connect to vehicle?'
    ).subscribe((result: boolean | undefined) => {
      if (result) {
        console.log(this.selectedPort);
        this.stateService.setPort(this.selectedPort);
        console.log(this.stateService.getPort());
        
        console.log('Sent');
      } else {
        console.log('Cancelled');
      }
    });
  }
}
