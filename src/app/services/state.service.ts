import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private comPorts = [];
  private port: String = "";

  setComPorts(data: any) {
    this.comPorts = data;
  }

  setPort(data: any) {
    this.port = this.port;
  }

  getComPorts(): any {
    return this.comPorts;
  }

  getPort(): any {
    return this.port;
  }
}
