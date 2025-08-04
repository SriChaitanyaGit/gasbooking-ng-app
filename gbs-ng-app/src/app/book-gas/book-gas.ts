// book-gas.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  selector: 'app-book-gas',
  templateUrl: './book-gas.html',
  styleUrls: ['./book-gas.css']
})
export class BookGas implements OnInit {
  email: string = '';
  cylinderType: string = '';
  deliveryDate: string = '';
  price: number = 0;
  constructor(private http: HttpClient, private router: Router) {}
agencyId: number | null = null;

ngOnInit(): void {
  this.email = sessionStorage.getItem('email') || '';
  const storedAgencyId = sessionStorage.getItem('selectedAgencyId');
  this.agencyId = storedAgencyId ? Number(storedAgencyId) : null;

  console.log("Loaded Agency ID:", this.agencyId); // Debug

  if (!this.email) {
    alert('Please log in first!');
    this.router.navigate(['/login']);
    return;
  }

  if (!this.agencyId) {
    alert('Please select an agency before booking!');
    this.router.navigate(['/customer']);
    return;
  }
    const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 5);
  this.deliveryDate = currentDate.toISOString().split('T')[0];
}

  updatePrice(): void {
    if (this.cylinderType === 'Domestic') {
      this.price = 900;
    } else if (this.cylinderType === 'Commercial') {
      this.price = 1850;
    } else {
      this.price = 0;
    }
  }
  

 deliveryLocation: string = '';


bookGas(): void {
  if (!this.cylinderType) {
    alert('Please select cylinder type!');
    return;
  }
  if (!this.deliveryLocation.trim()) {
    alert('Please enter delivery location!');
    return;
  }

  const bookingData = {
    email: this.email,
    cylinderType: this.cylinderType,
    deliveryLocation: this.deliveryLocation,
    agencyId: this.agencyId // 🧩 Only send what your backend expects
  };

  this.http.post<any>('http://localhost:8080/api/book-gas', bookingData).subscribe({
    next: (res) => {
      if (res.status === 'success' && res.data) {
        // ✅ Store full booking object for payment
        sessionStorage.setItem('bookingData', JSON.stringify(res.data));

        // ✅ Store payment info separately
        sessionStorage.setItem('paymentData', JSON.stringify({
          amount: this.price,
          paymentid: new Date().getTime()
        }));

        alert('Booking placed successfully. Proceeding to payment.');
        this.router.navigate(['/payment']);
      } else {
        alert(res.message || 'Booking failed');
      }
    },
    error: (err) => {
      console.error('Booking error:', err);
      alert(err.error?.message || 'Server error while booking');
    }
  });
}


// ✅ Update local agency availability
updateAgenciesAvailability(agencyId: number, cylinderType: string) {
  const agencies = JSON.parse(sessionStorage.getItem('agencies') || '[]');
  const agencyIndex = agencies.findIndex((a: any) => a.agencyId === agencyId);

  if (agencyIndex !== -1) {
    if (cylinderType === 'Domestic' && agencies[agencyIndex].domesticCylinders > 0) {
      agencies[agencyIndex].domesticCylinders -= 1;
    }
    if (cylinderType === 'Commercial' && agencies[agencyIndex].commercialCylinders > 0) {
      agencies[agencyIndex].commercialCylinders -= 1;
    }
    sessionStorage.setItem('agencies', JSON.stringify(agencies));
  }
}

}
