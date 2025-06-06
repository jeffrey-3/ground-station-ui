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
        this.altitude.set(data.alt);
      } else if (data.type === "gps_raw") {
        this.sats.set(data.sats);
      } else if (data.type === "power") {
        this.batteryVoltage.set(data.batt_volt);
      }
    });
  }

  formatAltitude(value: number): string {
    const rounded = Math.round(value * 10) / 10; // Round to 1 decimal
    const [integerPart, decimalPart = '0'] = rounded.toString().split('.');
    const paddedInteger = integerPart.padStart(3, '0');
    return `${paddedInteger}.${decimalPart}`;
  }

  formatSats(value: number): string {
    return value.toString().padStart(2, '0');
  }

  formatBattery(value: number): string {
    const rounded = Math.round(value * 100) / 100; // Round to 2 decimals
    const [integerPart, decimalPart = '00'] = rounded.toString().split('.');
    const paddedInteger = integerPart.padStart(1, '0');
    return `${paddedInteger}.${decimalPart.padEnd(2, '0')}`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}