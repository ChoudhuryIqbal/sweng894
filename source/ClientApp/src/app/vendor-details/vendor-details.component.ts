import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VendorServicesService } from '../vendor-services/Services/vendor-services.service';
import { VendorService } from '../vendors/Services/vendor.service';
import { VendorServices } from '../shared/models/vendor-services.model';
import { Vendor } from '../shared/models/vendor.model';
import { Address } from '../shared/models/address.model';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent implements OnInit {

  vendor: Vendor;
  vendorServices: VendorServices[];
  vendorId = 0;
  userName: string;

  constructor(
    private auth: AuthService,
    private vendorServicesService: VendorServicesService,
    private vendorService: VendorService,
    private route: ActivatedRoute,
    ) {
  }

  ngOnInit() {
    if (this.auth.user) {
      this.setVendor(this.auth.user);
    } else {
      this.auth.user$.subscribe((result) => {
        this.setVendor(result);
      });
    }
  }

  setVendor(user: User) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const vendorId = +params.get('vendorId');
      this.userName = user.userName;
      this.vendorService.getVendorById(vendorId).subscribe(vendor => {
        this.vendor = vendor;
        this.vendorServicesService.getVendorServices(vendor.id).subscribe(response => {
          this.vendorServices = response;
        });
      }, error => {
        console.log(error);
      });
    });
  }

}
