import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../services/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-raw',
  imports: [],
  templateUrl: './raw.component.html',
  styleUrl: './raw.component.scss'
})
export class RawComponent implements OnInit, OnDestroy {
  rawData = signal('');

  private subscription!: Subscription;
  
  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.subscription = this.webSocketService.messages$.subscribe(data => {
      this.rawData.set(JSON.stringify(data, null, 2))
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
