import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setItem(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    } else {
      // Implement server-side storage if necessary
    }
  }

  getItem(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    } else {
      // Implement server-side storage if necessary
      return null;
    }
  }

  removeItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    } else {
      // Implement server-side storage if necessary
    }
  }
}
