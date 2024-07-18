import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { StorageService } from '../services/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ai',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.css']
})
export class AiComponent implements OnInit {
  messages: { content: string, isAnswer: boolean, chatId: string, historyQA: string[]}[] = [];
  newMessage: string = '';
  defaultQuestions: string[] = [
    'How to choose a cat?',
    'What should my Ragdoll cat eat?',
    'How to choose the right pet?',
    'Tips for training a new puppy?',
    'What are the best pet foods?',
    'How often should I bathe my dog?',
    'How to litter train a cat?',
    'What are the signs of a healthy pet?',
    'What should I do if my pet is sick?'
  ];
  isSendDisabled: boolean = false;

  constructor(
    private webSocketService: WebSocketService,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cachedMessages = this.storageService.getItem('messages');
      // console.log(this.messages.toString())
      if (cachedMessages) {
        this.messages = JSON.parse(cachedMessages);
      } else {
        this.messages = [];
      }
    } else {
      console.log('Server-side rendering');
    }

    this.checkMessages();
    // this.messages.forEach(msg => {
    //   console.log(this.decodeBuffer(msg.content));
    // });

    this.webSocketService.getMessages(message =>
      message.trim() !== '' && !message.includes('Request served by')).subscribe(message => {
        // console.log(this.messages);
        // console.log(this.messages.slice(-1)[0]);
        if (this.messages.length === 0 || this.messages.slice(-1)[0].content == message) {
          return;
        }
        this.messages.push({ content: message, isAnswer: true, historyQA:[], chatId:Date.now().toString()});
        // this.messages.forEach(msg => {
        //   console.log(this.decodeBuffer(msg.content));
        // });
        if (isPlatformBrowser(this.platformId)) {
          this.storageService.setItem('messages', JSON.stringify(this.messages));
        }
        this.checkMessages();
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = {
        content: this.newMessage,
        isAnswer: false,
        historyQA: this.messages.map(message => message.content),
        chatId: Date.now().toString()
      };
      console.log(message);
      this.messages.push(message);
      this.webSocketService.sendMessage(message);
      this.newMessage = '';
      this.isSendDisabled = true;
    }
  }

  sendDefaultQuestion(question: string): void {
    this.newMessage = question;
    this.sendMessage();
  }

  refresh(): void {
    this.messages = [];
    this.isSendDisabled = false;
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.removeItem('messages');
    }
  }

  private decodeBuffer(buffer: any): string {
    if (typeof buffer === 'string') {
      return buffer;
    } else {
      const textDecoder = new TextDecoder();
      return textDecoder.decode(new Uint8Array(buffer));
    }
  }

  private checkMessages(): void {
    const closedSessionMessages = [
      'The session has been closed',
      'Please refresh your chatbox'
    ];
    if (this.messages.some(message => closedSessionMessages.some(closedMessage => message.content.includes(closedMessage)))) {
      this.isSendDisabled = true;
    } else {
      this.isSendDisabled = false;
    }
  }
}
