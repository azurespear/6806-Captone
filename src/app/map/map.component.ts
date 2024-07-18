import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  polygons: google.maps.Polygon[] = [];
  autocomplete!: google.maps.places.Autocomplete;
  searchRadius = 10000; 

  constructor(
    private router: Router, 
    private http: HttpClient, 
    private ngZone: NgZone) {}

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

    this.map.addListener('click', (event: any) => {
      if (event.placeId) {
        event.stop();
        this.getPlaceDetails(event.placeId);
      }
    });

    this.map.addListener('zoom_changed', () => {
      this.searchRadius = this.calculateRadius(this.map.getZoom());
    });
  }

  calculateRadius(zoom: number | undefined): number {
    if (zoom === undefined) {
      zoom = this.zoom;
    }
    return Math.round(20000 / Math.pow(2, zoom - 11));
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
            website: place.website || null,
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
      radius: this.searchRadius, 
      type: type 
    };

    this.service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        this.clearMarkers();
        results.forEach(result => {
          if (result.geometry?.location) {
            this.addMarker(result.geometry.location, result);
          }
        });
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
            website: place.website || null,
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

  addPolygons() {
    this.http.get('/assets/dog-off-leash-parks.json').subscribe((data: any) => {
      data.forEach((park: any) => {
        const paths = park.geom.geometry.coordinates[0].map((coord: any) => ({
          lat: coord[1],
          lng: coord[0]
        }));

        const polygon = new google.maps.Polygon({
          paths: paths,
          strokeColor: '#0080FE',
          strokeOpacity: 0.75,
          strokeWeight: 1,
          fillColor: '#0080FE',
          fillOpacity: 0.5
        });

        polygon.setMap(this.map);
        this.polygons.push(polygon);
      });
    });
  }

  clearPolygons() {
    this.polygons.forEach(polygon => polygon.setMap(null));
    this.polygons = [];
  }

  storeButtonClick(){
    this.searchNearby('pet_store');
    this.clearPolygons();
    console.log(this.searchRadius);
  }

  hospitalButtonClick(){
    this.searchNearby('veterinary_care');
    this.clearPolygons();
    console.log(this.searchRadius);
  }

  parkButtonClick(){
    this.searchNearby('park');
    this.clearPolygons();
    this.addPolygons();
    console.log(this.searchRadius);
  }

}
