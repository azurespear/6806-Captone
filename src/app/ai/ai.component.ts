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
  messages: { content: string, isAnswer: boolean }[] = [];
  newMessage: string = '';
  defaultQuestions: string[] = [
    'How to groom my pet effectively?',
    'Can my dog eat cat food?',
    'How to choose the right pet?',
    'Tips for training a new puppy?',
    'What are the best pet foods?',
    'How often should I bathe my dog?',
    'How to litter train a cat?',
    'What are the signs of a healthy pet?',
    'How to introduce a new pet to the family?',
    'What should I do if my pet is sick?'
  ];
  session_id: string = '';

  constructor(
    private webSocketService: WebSocketService,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.session_id = this.generateSessionId();
      const cachedMessages = this.storageService.getItem('messages');
      if (cachedMessages) {
        this.messages = JSON.parse(cachedMessages);
      } else {
        this.messages = [];
      }
    } else {
      console.log('Server-side rendering');
    }

    this.webSocketService.getMessages().subscribe(message => {
      this.messages.push({ content: message, isAnswer: true });
      if (isPlatformBrowser(this.platformId)) {
        this.storageService.setItem('messages', JSON.stringify(this.messages));
      }
    });
  }

  generateSessionId(): string {
    return uuidv4();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = {
        content: this.newMessage,
        isAnswer: false
      };
      this.messages.push(message);
      this.webSocketService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  sendDefaultQuestion(question: string): void {
    this.newMessage = question;
    this.sendMessage();
  }

  refresh(): void {
    this.messages = [];
    this.session_id = this.generateSessionId();
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.removeItem('messages');
    }
  }
}
