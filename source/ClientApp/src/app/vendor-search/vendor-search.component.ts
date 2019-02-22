import { Component, OnInit } from '@angular/core';
import { VendorSearchService } from './Services/vendor-search.service';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { EmailDialogComponent } from '../shared/components/email-dialog/email-dialog.component';
import { VendorServices } from '../shared/models/vendor-services.model';

@Component({
  selector: 'app-vendor-search',
  templateUrl: './vendor-search.component.html',
  styleUrls: [ './vendor-search.component.css']
})
export class VendorSearchComponent implements OnInit {
  vendorServices: VendorServices[];

  userName: string;

  searchForm = new FormGroup({
    price: new FormControl(''),
    capacity: new FormControl(''),
    zip: new FormControl('', [ Validators.required ]),
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
    private dialog: MatDialog,
    private auth: AuthService,
    private vendorSearchService: VendorSearchService,
    private snackbar: MatSnackBar,
    ) {
  }

  ngOnInit() {
    this.searchForm.controls['zip'].disable();

  }

  onSearchClicked() {
    const properties = {
      maxPrice: this.searchForm.controls['price'].value || 999999,
      maxCapacity: this.searchForm.controls['capacity'].value || 999999,
      zip: this.searchForm.controls['zip'].value,
      type: this.searchForm.controls['category'].value,
    };

    this.vendorSearchService.searchVendorServices(properties).subscribe((result) => {
      console.log(result);
      this.vendorServices = result;
    }, error => {
      console.log('SEARCH ERROR', error);
    });
  }
}
