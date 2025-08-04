import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-bookings.html',
  styleUrls: ['./admin-bookings.css']
})
export class AdminBookings implements OnInit {
  booking = {
    email: '',
    agencyId: 0,
    cylinderType: 'Domestic'
  };
  agencies: any[] = [];
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadAgencies();
  }

  loadAgencies() {
    this.http.get<any>('http://localhost:8080/api/gas-agencies')
      .subscribe(res => {
        if (res.status === 'success') {
          this.agencies = res.data;
        } else {
          this.message = 'Failed to load agencies';
        }
      });
  }

  bookGas() {
    if (!this.booking.email || !this.booking.agencyId || !this.booking.cylinderType) {
      this.message = 'All fields are required!';
      return;
    }

    const params = `email=${this.booking.email}&cylinderType=${this.booking.cylinderType}&agencyId=${this.booking.agencyId}`;
    this.http.post<any>(`http://localhost:8080/book-cylinder?${params}`, {})
      .subscribe(res => {
        if (res.status === 'success') {
          this.message = 'Gas booked successfully!';
          setTimeout(() => {
            this.router.navigate(['/admin']); // Redirect to admin dashboard
          }, 2000);
        } else {
          this.message = res.message || 'Booking failed';
        }
      }, error => {
        this.message = 'Error booking gas';
      });
  }
}
