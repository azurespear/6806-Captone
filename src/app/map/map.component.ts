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
  center = { lat: 49.249212, lng: -123.127549 };
  zoom = 12;

  selectedLocation: any;
  map!: google.maps.Map;
  service!: google.maps.places.PlacesService;
  markers: google.maps.Marker[] = [];
  autocomplete!: google.maps.places.Autocomplete;

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

    // Initialize Autocomplete
    const input = document.getElementById('search-input') as HTMLInputElement;
    this.autocomplete = new google.maps.places.Autocomplete(input);
    this.autocomplete.bindTo('bounds', this.map);

    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = this.autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          return;
        }
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(15);

        this.clearMarkers();
        this.addMarker(place.geometry.location, place);

        this.selectedLocation = {
          name: place.name || 'Unknown location',
          address: place.formatted_address || place.vicinity || 'No address available',
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          },
          rating: place.rating || 'No rating available',
          website: place.website || 'No website available',
          photos: place.photos || []
        };
      });
    });

    // Add listener for POI clicks
    this.map.addListener('click', (event: any) => {
      if (event.placeId) {
        event.stop();
        this.getPlaceDetails(event.placeId);
      }
    });
  }

  addMarker(location: google.maps.LatLng | google.maps.LatLngLiteral, place?: google.maps.places.PlaceResult) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map
    });

    if (place) {
      marker.addListener('click', () => {
        this.ngZone.run(() => {
          this.selectedLocation = {
            name: place.name || 'Unknown location',
            address: place.formatted_address || place.vicinity || 'No address available',
            position: {
              lat: location.lat || 0,
              lng: location.lng || 0
            },
            rating: place.rating || 'No rating available',
            website: place.website || 'No website available',
            photos: place.photos || []
          };
        });
      });
    }

    this.markers.push(marker);
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  searchNearby(type: string) {
    const request: google.maps.places.PlaceSearchRequest = {
      location: this.map.getCenter() as google.maps.LatLng,
      radius: 5000, // 5 km radius
      type: type // Correct type specification as a string
    };

    this.service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        this.clearMarkers();
        results.forEach(result => {
          if (result.geometry?.location) {
            this.addMarker(result.geometry.location, result);
          }
        });
        if (results[0].geometry?.location) {
          this.map.setCenter(results[0].geometry.location);
          this.map.setZoom(15);
        }
      }
    });
  }

  getPlaceDetails(placeId: string) {
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: placeId,
      fields: ['name', 'formatted_address', 'vicinity', 'geometry', 'rating', 'website', 'photos']
    };

    this.service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        this.ngZone.run(() => {
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();
          this.selectedLocation = {
            name: place.name || 'Unknown location',
            address: place.formatted_address || place.vicinity || 'No address available',
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
}
