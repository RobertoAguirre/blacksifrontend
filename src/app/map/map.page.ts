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

  //calculate distance between pints
  public totalDistance: number = 0; // To store the total distance of the route
  public totalTravelTime: number = 0; // To store the total travel time in minutes


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


  public calculateAndDisplayRoute() {
    // Exit if there are no locations to draw a route
    if (this.currLocations.length === 0) {
      console.error('No locations provided to calculate the route.');
      return;
    }
  
    const waypoints = this.currLocations.slice(1, this.currLocations.length - 1).map(location => ({ location: location }));
  
    const request = {
      origin: this.currLocations[0], // Start from the first location
      destination: this.currLocations[this.currLocations.length - 1], // End at the last location
      waypoints: waypoints,
      optimizeWaypoints: true, // Optimize the order of waypoints for the shortest route
      travelMode: 'DRIVING'
    };
  
    this.directionsService.route(request, (response, status) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(response);
        
        // Reset the travel times array
        this.estimatedTravelTimes = [];
  
        // Calculating the total distance, total travel time and individual travel times
        let totalDistanceMeters = 0;
        let totalDurationSeconds = 0;
        const legs = response.routes[0].legs;
        for (let i = 0; i < legs.length; i++) {
          totalDistanceMeters += legs[i].distance.value;
          totalDurationSeconds += legs[i].duration.value;
  
          // Convert individual leg duration to minutes and push to estimatedTravelTimes
          const legDurationMinutes = Math.floor(legs[i].duration.value / 60);
          this.estimatedTravelTimes.push(`${legDurationMinutes} minutes`);
        }
        this.totalDistance = totalDistanceMeters / 1000; // Convert to kilometers
        this.totalTravelTime = totalDurationSeconds / 60; // Convert to minutes
        
        console.log(`Total distance: ${this.totalDistance.toFixed(2)} km`);
        console.log(`Total estimated travel time: ${Math.floor(this.totalTravelTime)} minutes`);
      } else {
        console.error('Directions request failed due to', status);
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

      // Call the function to calculate and display the route
    this.calculateAndDisplayRoute();

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
