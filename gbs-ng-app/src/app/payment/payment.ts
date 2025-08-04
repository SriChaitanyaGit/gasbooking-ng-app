import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-payment',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class Payment implements OnInit {
  bookingData: any = null;
  paymentData: any = null;
  qrCodeUrl: string = '';
  upiId: string = '9347107831@ybl';
  agencyName: string = 'GasAgency';
  amount: number = 0;
  cylinderType: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const booking = sessionStorage.getItem('bookingData');
    const payment = sessionStorage.getItem('paymentData');

    if (!booking || !payment) {
      alert('No booking found!');
      this.router.navigate(['/customer']);
      return;
    }

    this.bookingData = JSON.parse(booking);
    this.paymentData = JSON.parse(payment);
    this.amount = this.paymentData.amount;
    this.cylinderType = this.bookingData.cylinderType;

if (!this.bookingData.agencyid || this.bookingData.agencyid <= 0) {
  alert('Agency information missing for this booking!');
  this.router.navigate(['/customer']);
  return;
}



    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${this.upiId}&pn=${this.agencyName}&am=${this.amount}`;

    this.http.get<any>(`http://localhost:8080/api/admin/gas-agency/${this.bookingData.agencyid}`)
  .subscribe(res => {
    if (res.status === 'success') {
      this.agencyName = res.data.name;
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${this.upiId}&pn=${this.agencyName}&am=${this.amount}`;
    }
  });

  }

  goBack(): void {
    this.router.navigate(['/customer']);
  }

  completePayment(): void {
    if (!this.bookingData || !this.paymentData) {
      alert('Missing booking or payment data!');
      return;
    }

    const payload = {
      ...this.bookingData,
      status: 'In Progress',             // Booking status for admin approval
      paymentStatus: 'PAID'              // ✅ New: Send payment status to backend
    };

    console.log("Payload being sent:", payload);

    this.http.post<any>('http://localhost:8080/api/book-gas', payload).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          alert('Payment successful & booking confirmed!');
          sessionStorage.removeItem('bookingData');
          sessionStorage.removeItem('paymentData');
          this.router.navigate(['/customer']);
        } else {
          alert('Booking failed: ' + res.message);
        }
      },
      error: (err) => {
        console.error('Booking error:', err);
        alert('Error submitting booking. Please try again.');
      }
    });
  }
}
