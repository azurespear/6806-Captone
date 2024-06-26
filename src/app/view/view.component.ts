import { Component } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {
  comments = [
    { id: 1, author: 'Kristina F.', description: 'Is she tattooed and chipped?', date: '2024-01-01: 10:00:00' },
    { id: 2, author: 'Coleen M.', description: '🙏🙏🙏', date: '2024-01-01: 10:00:00' },
    { id: 3, author: 'Crystal s.', description: 'Is she tattooed and chipped?', date: '2024-01-01: 10:00:00' },
  ]
}
