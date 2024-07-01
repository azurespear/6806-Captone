import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnChanges {
  @Input() location: any;
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['location']) {
      this.updateSidebar(changes['location'].currentValue);
    }
  }

  updateSidebar(location: any) {
    // Perform any necessary updates when location changes
    // This method is called whenever the input property changes
  }
}
