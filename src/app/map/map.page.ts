import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  public currLocations: any[] = [];
  private directionsService: any;
  map: any;
  waypoints: any[] = [];
  private directionsRenderer: any;
  private currentPositionMarker: any;
  private currentLocationInterval: any;
  estimatedTravelTimes: string[] = [];
  selectedWaypoint: string;

  constructor(
    private activatedRoute: ActivatedRoute, // Inject ActivatedRoute
    private router: Router // Inject Router
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let receivedLocations = this.router.getCurrentNavigation().extras.state['locations'];
        console.log(receivedLocations);
        this.currLocations = receivedLocations;
      }
    });
  

  }


  ngOnInit() {
    this.initializeMap();
    this.currLocations = JSON.parse(localStorage.getItem('selectedLocations') || '[]')
    
    console.log(this.currLocations);

    // Retrieve waypoints from route state
    this.activatedRoute.queryParams.subscribe(params => {
      const state = this.router.getCurrentNavigation()?.extras.state;
      if (state && state['waypoints']) {  // Access 'waypoints' using square brackets
        this.waypoints = state['waypoints'];  // Access 'waypoints' using square brackets
        
      }
    });

  }

  public initializeMap() {
    const mapOptions = {
      center: { lat: 28.637240, lng: -106.075057 }, // Set the initial position of the map
      zoom: 12, // Adjust the initial zoom level
    };

    const mapElement = document.getElementById('map');
    const map = new google.maps.Map(mapElement, mapOptions);

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
    this.map = map;

    if(this.currLocations){
      for (const address of this.currLocations) {
        this.geocodeAddress(address).then(location => {
            new google.maps.Marker({
                map: this.map,
                position: location
            });
        }).catch(error => {
            console.error('Error placing marker for address:', address, 'Error:', error);
        });
    }
    }


  }

  geocodeAddress(address: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, (results, status) => {
            if (status === 'OK') {
                resolve(results[0].geometry.location);
            } else {
                reject('Geocode was not successful for the following reason: ' + status);
            }
        });
    });
}




  
}
