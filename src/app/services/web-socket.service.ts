import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private messageSubject = new Subject<any>();
  public messages$ = this.messageSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket('ws://localhost:8765');

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
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

  public send(data: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not open. Cannot send data.');
    }
  }

  public connectComPort(port: string) {
    this.send({
      type: "connect",
      port: port
    });
  }

  public commandLoiter(lat: number, lon: number, radius: number) {
    this.send({
      type: "loiter",
      data: {
        lat: lat,
        lon: lon,
        radius: radius
      }
    });
  }

  public commandPath(points: number[][], radius: number) {
    this.send({
      type: "path",
      data: {
        points: points,
        radius: radius
      }
    });
  }

  public commandLand(lat: number, lon: number, finalLeg:number, glideslope: number, heading: number, radius: number, direction: string) {
    this.send({
      type: "land",
      data: {
        lat: lat,
        lon: lon,
        finalLeg: finalLeg,
        glideslope: glideslope,
        heading: heading,
        radius: radius,
        direction: direction
      }
    });
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
