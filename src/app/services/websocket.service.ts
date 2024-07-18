import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { Client, IFrame, IMessage } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
  private webSocketURL: string = 'wss://57.152.32.19:8443/app/chat-websocket';
  private subscribeRoute: string = '/topic/chat';
  private client: Client | null = null;
  private messages: BehaviorSubject<string> = new BehaviorSubject('');
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // console.log('Client');
      this.connectClient();
    }
  }

  private connectClient() {
    this.client = new Client({
      brokerURL: this.webSocketURL,
      reconnectDelay: 5000,
      // debug: (str) => {
      //   console.log(new Date(), str);
      // },
    });

    this.client.onConnect = (frame: IFrame) => {
      // console.log('Connected: ' + frame);
      this.reconnectAttempts = 0; // 重置重连次数
      this.client!.subscribe(this.subscribeRoute, (message: IMessage) => {
        const data = JSON.parse(message.body);
        // console.log(data);
        this.messages.next(data.body.content);
      });
    };

    this.client.onStompError = (frame: IFrame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      this.messages.next('The session has been closed, please click the refresh button to start a new session.');
    };

    this.client.onWebSocketClose = () => {
      this.reconnectAttempts++;
      if (this.reconnectAttempts > this.maxReconnectAttempts) {
        console.error(`Max reconnect attempts of ${this.maxReconnectAttempts} exceeded.`);
        this.messages.next('The session has been closed due to excessive reconnect attempts, please click the refresh button to start a new session.');
        this.client?.deactivate();
      } else {
        console.log(`Reconnect attempt #${this.reconnectAttempts}`);
      }
    };

    this.client.activate();
  }

  sendMessage(message: any) {
    if (this.client && this.client.connected) {
      // console.log(message.toString());
      this.client.publish({
        destination: '/app/chat-websocket',
        body: JSON.stringify(message)
      });
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
