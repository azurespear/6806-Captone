import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: any;
  private messages: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.connectClient();
    } else {
      this.connectServer();
    }
  }

  private connectClient() {
    this.socket = new WebSocket('wss://echo.websocket.org/');
    this.socket.onmessage = (event: MessageEvent) => this.messages.next(event.data);
  }

  private connectServer() {
    const WebSocket = require('ws');
    this.socket = new WebSocket('wss://echo.websocket.org/');
    this.socket.on('message', (data: string) => this.messages.next(data));
  }

  sendMessage(message: string) {
    this.socket.send(message);
  }

  getMessages(): Observable<string> {
    return this.messages.asObservable().pipe(share());
  }
}
