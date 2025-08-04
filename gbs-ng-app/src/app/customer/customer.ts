import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './customer.html',
  styleUrls: ['./customer.css']
})
export class Customer implements OnInit {
  customerName: string = '';
  profileDetails: any = {};
  photoUrl: string = '';
  selectedPhoto: File | null = null;
email: string = '';
  showDropdown: boolean = false;
  showAgencies: boolean = false;
  bookings: any[] = [];
showBookings: boolean = false;
feedbackMessage: string = '';

  agencies: any[] = [];
    profileFields = [  // ✅ Add this block
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role' }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const email = sessionStorage.getItem('email');
    const password = sessionStorage.getItem('password');

    if (!email || !password) {
      this.router.navigate(['/login']);
      return;
    }
this.email = sessionStorage.getItem('email') || '';
const storedPhoto = localStorage.getItem(`photo_${this.email}`);
this.photoUrl = storedPhoto || 'assets/default-profile.png';

    this.loadCustomerProfile(email, password);
  }

  loadCustomerProfile(email: string, password: string): void {
    this.http.post<any>('http://localhost:8080/api/customer-profile', { email, password }).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          const data = res.data;
          this.customerName = data.name;
          this.profileDetails = data;
          sessionStorage.setItem('customerId', data.id);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: () => this.router.navigate(['/login'])
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  customerprofile(): void {
    this.router.navigate(['/customer-profile']);
  }

  bookGas(): void {
    this.router.navigate(['/book-gas']);
  }

  viewAgencies(): void {
  this.http.get<any>('http://localhost:8080/api/admin/all-gas-agencies')
    .subscribe(res => {
      if (res.status === 'success') {
        console.log("Agencies:", res.data); // <-- See what field the ID uses
        this.agencies = res.data;
        this.showAgencies = true;
        this.showBookings = false;
      }
    });
}

  bookGasFromAgency(gasid: number): void {
    console.log("Selected Agency ID:", gasid);
    sessionStorage.setItem('selectedAgencyId', String(gasid));
    this.router.navigate(['/book-gas']);
  }
   viewBookings(): void {
    const email = sessionStorage.getItem('email');
    this.http.get<any>(`http://localhost:8080/api/customer-bookings?email=${email}`)
      .subscribe(res => {
        if (res.status === 'success') {
          this.bookings = res.data;
          this.showBookings = true;
          this.showAgencies = false;
        }
      });
  }

cancelBooking(bookingId: number): void {
  if (!confirm('Are you sure you want to cancel this booking?')) return;

  this.http.put<any>(`http://localhost:8080/api/cancel-booking/${bookingId}`, {})
    .subscribe({
      next: (res) => {
        if (res.status === 'success') {
          alert('Booking canceled successfully');
          this.viewBookings(); // <-- auto-refresh list
        } else {
          alert(res.message || 'Failed to cancel booking');
        }
      },
error: (err) => {
  console.error('Cancel booking error:', err);
  alert(err.error?.message || 'Error cancelling booking');
}
    });
}



  // Make payment for a booking (fetch payment by bookingId)
  makePayment(booking: any): void {
  this.http.get<any>(`http://localhost:8080/api/fetch-payment-by-booking/${booking.bookingid}`).subscribe({
    next: (res) => {
      if (res.status === 'success') {
        sessionStorage.setItem('bookingData', JSON.stringify(booking));
        sessionStorage.setItem('paymentData', JSON.stringify(res.data));
        this.router.navigate(['/payment']);
      } else {
        alert('Payment details not found for this booking');
      }
    },
    error: () => alert('Error fetching payment details')
  });
}



  navigateTologin(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    this.showBookings = false;
    this.showAgencies = false;
  }

  // ---- SUBMIT FEEDBACK ----
  submitFeedback(): void {
    if (!this.feedbackMessage || this.feedbackMessage.trim() === '') {
      alert('Please enter your feedback');
      return;
    }

    const customerId = sessionStorage.getItem('customerId');
    const customerName = this.profileDetails?.name || '';
    const customerEmail = this.profileDetails?.email || '';

    if (!customerId || !customerName || !customerEmail) {
      alert('Unable to fetch your details. Please log in again.');
      return;
    }

    const payload = {
      customerId: +customerId,
      name: customerName,
      email: customerEmail,
      feedbackText: this.feedbackMessage.trim()
    };

    this.http.post<any>('http://localhost:8080/api/feedback', payload)
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            alert('Thank you for your feedback!');
            this.feedbackMessage = '';
          } else {
            alert('Failed to submit feedback. Please try again later.');
          }
        },
        error: () => alert('Failed to submit feedback. Please try again later.')
      });
  }
  onPhotoSelected(event: any): void {
  const file = event.target.files[0];
  if (file) this.selectedPhoto = file;
}

uploadPhoto(): void {
  if (!this.selectedPhoto) {
    alert("Please select a photo first.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result as string;
    this.photoUrl = base64;
    if (this.email) {
      localStorage.setItem(`photo_${this.email}`, base64);
      alert('Photo uploaded successfully!');
    }
  };
  reader.readAsDataURL(this.selectedPhoto);
}

}
