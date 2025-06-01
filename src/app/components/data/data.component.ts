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
  batteryVoltage = signal(0);
  sats = signal(0);
  altitude = signal(0);

  private subscription!: Subscription;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.subscription = this.webSocketService.messages$.subscribe(data => {
      const telem = data.telemetry;
      this.batteryVoltage.set(Math.round(telem.batt_voltage * 100) / 100);
      this.sats.set(telem.gps_sats);
      this.altitude.set(telem.altitude);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
