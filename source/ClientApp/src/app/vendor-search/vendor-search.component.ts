/// <reference types="@types/googlemaps" />

import { Component, OnInit } from '@angular/core';
import { VendorSearchService } from './Services/vendor-search.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VendorServices } from '../shared/models/vendor-services.model';
import { Router } from '@angular/router';
import { GooglePlacesService } from './Services/google-places.service';
import { of, Subject } from 'rxjs';
import { GoogleMapsService } from '../google-map/Services/google-maps.service';
import { VendorService } from '../vendors/Services/vendor.service';

@Component({
  selector: 'app-vendor-search',
  templateUrl: './vendor-search.component.html',
  styleUrls: [ './vendor-search.component.css']
})
export class VendorSearchComponent implements OnInit {
  services: VendorServices[];

  map: google.maps.Map;
  geolocation$ = new Subject();
  userName: string;
  markers: google.maps.Marker[] = [];

  searchForm = new FormGroup({
    price: new FormControl(''),
    capacity: new FormControl(''),
    location: new FormControl('', [ Validators.required ]),
    category: new FormControl('', [ Validators.required]),
  });

  svcs = [
    {
      value: 'Venue',
      viewValue: 'Venue'
    },
    {
      value: 'Catering',
      viewValue: 'Catering'
    },
    {
      value: 'Flowers',
      viewValue: 'Flowers'
    },
    {
      value: 'Supplies',
      viewValue: 'Supplies'
    },
    {
      value: 'Lodging',
      viewValue: 'Lodging'
    },
    {
      value: 'Activities',
      viewValue: 'Activities'
    },
    {
      value: 'Other',
      viewValue: 'Other'
    },
  ];

  constructor(
    private router: Router,
    private vendorSearchService: VendorSearchService,
    private googlePlacesService: GooglePlacesService,
    private googleMapsService: GoogleMapsService,
    ) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.geolocation$.next({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, function(error) {
        console.log(error);
      });

      this.geolocation$.subscribe((location: {lat: number, lng: number}) => {
        this.googlePlacesService.getAddressFromGeolocation(location)
        .subscribe((address) => {
          this.searchForm.controls['location'].setValue(address);
        });
      });
  }

  ngOnInit() {
    this.geolocation$.subscribe((location: {lat: number, lng: number}) => {
      const property = {
        zoom: 12,
        center: location
      };

      this.map = this.googleMapsService.setMap(document.getElementById('search-map'), property);

      const marker = this.googleMapsService.setMarker(location, this.map);
      this.markers.push(marker);
    });
  }

  onSearchClicked() {
    this.searchVendors();

    const properties = {
      maxPrice: this.searchForm.controls['price'].value || 999999,
      maxCapacity: this.searchForm.controls['capacity'].value || 0,
      zip: this.searchForm.controls['location'].value,
      type: this.searchForm.controls['category'].value,
    };

    this.vendorSearchService.searchVendorServices(properties).subscribe((result) => {
      console.log(result);
      this.services = result;
    }, error => {
      console.log('SEARCH ERROR', error);
    });
  }

  onResetClicked() {
    this.searchForm.reset();
  }

  searchVendors() {
    const address = this.searchForm.controls['location'].value;
    this.googlePlacesService.getGeoLocationFromAddress(address)
      .subscribe((location: {lat: number, lng: number}) => {
        const request = {
          location: location,
          radius: 10000,
          type: this.getCategory()
        };

        this.googlePlacesService.locationSearch(request, this.map).subscribe(results => {
          const services: VendorServices[] = results.map(loc => {
            return {
              price: 0,
              vendorId: 0,
              serviceType: loc.types.toString(),
              serviceName: loc.name,
              serviceDescription: '',
            };
          });
          this.services = services;
        });
      });
  }

  onViewClicked(service: VendorServices) {
    this.router.navigate(['vendor-details/' + service.vendorId]);
  }

  getCategory() {
    switch (this.searchForm.controls['category'].value) {
      case 'Flowers': return ['florist'];
      case 'Venue': return ['church', 'hindu_temple', 'mosque', 'synagogue'];
      case 'Catering': return ['meal_delivery'];
      case 'Lodging': return ['lodging'];
      case 'Activites': return ['library'];
      case 'Other': return ['travel_agency'];
      default: return ['car_rental', 'clothing_store', 'hair_care', 'jewelry_store'];
    }
  }
}
