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
  batt_volts = signal('3.89');
  counterValue = signal(0);
  rawData = signal('');
  private subscription!: Subscription;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.subscription = this.webSocketService.messages$.subscribe(data => {
      this.batt_volts.set(data.value);
      this.rawData.set(JSON.stringify(data))
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  increment() {
    this.counterValue.update((val) => val + 1);
  }

  reset() {
    this.counterValue.set(0)
  }
}
