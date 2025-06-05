import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data',
  imports: [],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss'
})
export class DataComponent implements OnInit, OnDestroy {
  status = signal('---');
  batteryVoltage = signal(0);
  sats = signal(0);
  altitude = signal(0);

  private subscription!: Subscription;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.subscription = this.webSocketService.messages$.subscribe(data => {
      if (data.type === "vehicle_status") {
        this.status.set(data.mode);
        this.batteryVoltage.set(12.5);
        this.sats.set(15);
        this.altitude.set(11.2);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
