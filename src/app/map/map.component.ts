import { Component } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  center = { lat: 49.249212, lng: -123.127549 };
  zoom = 12;
}
