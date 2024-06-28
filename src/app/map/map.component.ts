import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare global {
  interface Window {
    initMap: () => void;
  }
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})

export class MapComponent implements OnInit {

  selectedLocation: any;
  map!: google.maps.Map;
  service!: google.maps.places.PlacesService;

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.loadGoogleMaps();
    }
  }

  loadGoogleMaps() {
    if (typeof google === 'undefined' || !google.maps) {
      window.initMap = () => {
        this.ngZone.run(() => this.initializeMap());
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDBK7wgcn-uvE3bE3VnqLtuQndwRirKTto&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      this.initializeMap();
    }
  }

  initializeMap() {
    const mapOptions: google.maps.MapOptions = {
      center: this.center,
      zoom: this.zoom
    };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
    this.service = new google.maps.places.PlacesService(this.map);

    // Add listener for POI clicks
    this.map.addListener('click', (event: any) => {
      if (event.placeId) {
        event.stop();
        this.getPlaceDetails(event.placeId);
      }
    });
  }

  getPlaceDetails(placeId: string) {
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: placeId,
      fields: ['name', 'formatted_address', 'geometry', 'rating', 'website', 'photos']
    };

    this.service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        this.ngZone.run(() => {
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();
          this.selectedLocation = {
            name: place.name || 'Unknown location',
            address: place.formatted_address || 'No address available',
            position: {
              lat: lat ?? 0,
              lng: lng ?? 0
            },
            rating: place.rating || 'No rating available',
            website: place.website || 'No website available',
            photos: place.photos || []
          };
        });
      } else {
        this.setUnknownLocation(0, 0);
      }
    });
  }

  setUnknownLocation(lat: number, lng: number) {
    this.ngZone.run(() => {
      this.selectedLocation = {
        name: 'Unknown location',
        address: 'No address available',
        position: { lat, lng },
        rating: 'No rating available',
        website: 'No website available',
        photos: []
      };
    });
  }
  center = { lat: 49.249212, lng: -123.127549 };
  zoom = 12;

  onStoreButtonClick() {
    console.log("Store")
  }

  onHospitalButtonClick() {
    console.log("Hospital")
  }

  onParkButtonClick() {
    console.log("Park")
  }
}
