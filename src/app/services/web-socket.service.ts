import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// NOTE: Every component MUST unsubscribe from the message subscription in OnDestroy 
// otherwise the websocket will stay connected and cause issues!

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private messageSubject = new Subject<any>();
  public messages$ = this.messageSubject.asObservable();
  private socketOpenSubject = new Subject<void>();
  public socketOpen$ = this.socketOpenSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket('ws://localhost:8765');

    this.socket.onopen = () => {
      console.log('WebSocket connection opened.');
      this.socketOpenSubject.next();  // Notify subscribers that the socket is ready
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // console.log(data);
        this.messageSubject.next(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Attempt to reconnect after a delay
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected. Attempting to reconnect...');
      setTimeout(() => this.connect(), 5000);
    };
  }

  public isOpen(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  public send(data: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not open. Cannot send data.');
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
