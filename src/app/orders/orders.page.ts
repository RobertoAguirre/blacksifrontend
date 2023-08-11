import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  customers: any[] = [];

  constructor(
    private authService: AuthService, 
    private navCtrl: NavController, 
    private router: Router
    ) {}

  ngOnInit(): void {
    this.authService.getCustomer().subscribe(
      (data: any[]) => {
        // Add a 'selected' property to each customer
        this.customers = data.map(customer => ({ ...customer, selected: false }));
      },
      (error) => {
        console.log('Error fetching customer information:', error);
      }
    );
  }

  calculateTotalPrice() {
    // Calculate total price based on selected customers
    const selectedCustomers = this.customers.filter(customer => customer.selected);
    let totalPrice = 0;
    for (const customer of selectedCustomers) {
      totalPrice += parseFloat(customer.customer.total_spent);
    }
    return totalPrice.toFixed(2);
  }

  confirm() {
    // Navigate to confirmed-orders page
    this.router.navigate(['/confirmed-orders']);
  }


  createRoute() {
    const selectedCustomers = this.customers.filter(customer => customer.selected);
    const selectedWaypoints = selectedCustomers.map(customer => {
      const address = customer.customer.default_address.address;
      const num = customer.customer.default_address.number;
      const locality = customer.customer.default_address.locality;
      return `${address}, ${num}, ${locality}`;
    });

    this.router.navigate(['/map'], { state: { waypoints: selectedWaypoints } });
  }
}



