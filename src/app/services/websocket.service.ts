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
    this.socket = new WebSocket('wss://localhost:8443/app/chat-websocket');

    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.topic === '/topic/chat') {
        this.messages.next(data.message);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.messages.next('The session has been closed, please click the refresh button to start a new session.');
    };

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  }

  private connectServer() {
    const WebSocket = require('ws');

    //just for local test
    const https = require('https');

    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    const options = {
      agent: agent
    };

    this.socket = new WebSocket('wss://localhost:8443/app/chat-websocket', options);
    // this.socket = new WebSocket('wss://localhost:8443/app/chat-websocket');

    this.socket.on('open', () => {
      console.log('Server-side WebSocket connection opened');
    });

    this.socket.on('message', (data: string) => {
      const message = JSON.parse(data);
      if (message.topic === '/topic/chat') {
        this.messages.next(message.message);
      }
    });


    this.socket.on('close', () => {
      console.log('Server-side WebSocket connection closed');
      this.messages.next('The session has been closed, please click the refresh button to start a new session.');
    });

    this.socket.on('error', (error: Error) => {
      console.error('Server-side WebSocket error:', error);
    });
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        destination: '/app/chat',
        message: message
      }));
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
