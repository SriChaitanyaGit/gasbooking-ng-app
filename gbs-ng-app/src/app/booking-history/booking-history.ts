import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-history',
  imports:[FormsModule,CommonModule,HttpClientModule],
  templateUrl: './booking-history.html',
  styleUrls: ['./booking-history.css'],
  standalone: true
})
export class BookingHistory implements OnInit {
  bookings: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = sessionStorage.getItem('email');
    this.http.get<{ status: string; data: any[] }>(
      `http://localhost:8080/customer-bookings?email=${email}`
    ).subscribe({
      next: res => {
        if (res.status === 'success') {
          this.bookings = res.data;
        }
      },
      error: () => alert('Failed to load booking history')
    });
  }
}
