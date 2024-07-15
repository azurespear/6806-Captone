import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { share, filter } from 'rxjs/operators';

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
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      this.messages.next('The session has been closed, please click the refresh button to start a new session.');
    }
  }

  getMessages(filterFn?: (message: string) => boolean): Observable<string> {
    let observable = this.messages.asObservable().pipe(share());

    if (filterFn) {
      observable = observable.pipe(filter(filterFn));
    }

    return observable;
  }
}
