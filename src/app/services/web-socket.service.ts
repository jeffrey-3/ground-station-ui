import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
        radius: radius,
        direction: 0,
        final_leg: 0,
        glideslope: 0 
      }
    });
  }

  public commandPath(points: number[][], radius: number) {
    var data: any[] = [];

    points.forEach(point => {
      data.push({
        type: "waypoint",
        lat: point[0],
        lon: point[1],
        radius: radius,
        direction: 0,
        final_leg: 0,
        glideslope: 0 
      });
    });
    
    this.send({
      type: "send_mission",
      data: data
    });
  }

  public commandLand(lat: number, lon: number, finalLeg: number, glideslope: number, heading: number, radius: number, direction: string) {
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
