import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {

  customers: any[] = [];
  searchTerm: string = '';
  selectedCustomer: any = null;
  newPassword: string = '';
  showCustomers: boolean = false;
  adminName: string = '';
  message: string = '';
  showBookingRequests: boolean = false;
  bookingRequests: any[] = [];

  agencies: any[] = [];
  showAgencies: boolean = false;
  showAddAgencyForm: boolean = false;
  newAgency = {
    name: '',
    location: '',
    domesticCylinders: 0,
    commercialCylinders: 0
  };

  selectedAgency: any = null;

  bookingSearchTerm: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.adminName = localStorage.getItem('adminname') || 'Admin';
  }

  resetViews() {
    this.showCustomers = false;
    this.showAgencies = false;
    this.showAddAgencyForm = false;
    this.showBookingRequests = false;
  }

  /** ---------------- CUSTOMER FUNCTIONS ---------------- **/

  fetchAllCustomers() {
    this.http.get<any>('http://localhost:8080/api/fetch-all-customers')
      .subscribe(res => {
        if (res.status === 'success') {
          this.customers = res.data;
          this.resetViews();
          this.showCustomers = true;
        }
      });
  }

  searchCustomers() {
    if (this.searchTerm.trim()) {
      this.http.get<any>(`http://localhost:8080/api/search-customers?keyword=${this.searchTerm}`)
        .subscribe(res => {
          if (res.status === 'success') {
            this.customers = res.data;
          }
        });
    } else {
      this.fetchAllCustomers();
    }
  }

  editCustomer(c: any) {
    this.selectedCustomer = { ...c };
    this.newPassword = '';
  }
updateDeliveryStatus(bookingId: number, status: string) {
  console.log('Delivery status:', status); // ← Add this!
  this.http.put<any>(
    `http://localhost:8080/api/admin/update-delivery-status/${bookingId}`,
    { deliveryStatus: status },
    { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  ).subscribe(
    res => {
      if (res.status === 'success') {
        this.fetchBookingRequests(); // Refresh list
        this.message = res.message;
      } else {
        alert(res.message || 'Delivery status update failed.');
      }
    },
    err => {
      console.error('Update error:', err);
      alert('🚨 Server error: Could not update delivery status.');
    }
  );
}



  updateCustomer() {
    const payload = { ...this.selectedCustomer };
    if (this.newPassword.trim()) {
      payload.password = this.newPassword;
    }

    this.http.put<any>(`http://localhost:8080/api/update-customer/${payload.id}`, payload)
      .subscribe(res => {
        if (res.status === 'success') {
          this.message = '✅ Customer updated successfully!';
          this.selectedCustomer = null;
          this.fetchAllCustomers();
          setTimeout(() => this.message = '', 3000);
        } else {
          alert('Update failed');
        }
      });
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.http.delete<any>(`http://localhost:8080/api/delete-customer/${id}`)
        .subscribe(res => {
          if (res.status === 'success') {
            this.message = '✅ Customer deleted successfully!';
            this.fetchAllCustomers();
            setTimeout(() => this.message = '', 3000);
          } else {
            alert('Delete failed');
          }
        });
    }
  }

  cancelEdit() {
    this.selectedCustomer = null;
    this.newPassword = '';
  }

  /** ---------------- GAS AGENCY FUNCTIONS ---------------- **/

 /** ---------------- GAS AGENCY FUNCTIONS ---------------- **/

fetchAllAgencies() {
  this.http.get<any>('http://localhost:8080/api/gas-agencies')
    .subscribe(res => {
      if (res.status === 'success') {
        this.agencies = res.data;
        this.resetViews();
        this.showAgencies = true;
      }
    });
}

editAgency(a: any) {
  this.selectedAgency = { ...a };
}

updateAgency() {
  if (!this.selectedAgency.name || !this.selectedAgency.location) {
    alert('Name and Location are required!');
    return;
  }

  this.http.put<any>(
    `http://localhost:8080/api/update-gas-agency/${this.selectedAgency.gasid}`,
    this.selectedAgency
  ).subscribe(res => {
    if (res.status === 'success') {
      this.message = '✅ Gas agency updated successfully!';
      this.selectedAgency = null;
      this.fetchAllAgencies();
      setTimeout(() => this.message = '', 3000);
    } else {
      alert(res.message || 'Update failed');
    }
  });
}

deleteAgency(gasid: number) {
  if (confirm('Are you sure you want to delete this gas agency?')) {
    this.http.delete<any>(`http://localhost:8080/api/delete-gas-agency/${gasid}`)
      .subscribe(res => {
        if (res.status === 'success') {
          this.message = '✅ Gas agency deleted successfully!';
          this.fetchAllAgencies();
          setTimeout(() => this.message = '', 3000);
        } else {
          alert(res.message || 'Delete failed');
        }
      });
  }
}

cancelEditAgency() {
  this.selectedAgency = null;
}



  /** ---------------- BOOKING FUNCTIONS ---------------- **/

  fetchBookingRequests() {
    this.resetViews();
    this.http.get<any>('http://localhost:8080/api/admin/booking-requests')
      .subscribe(res => {
        if (res.status === 'success') {
          this.bookingRequests = res.data.map((b: any) => ({
            ...b,
            rejectionReason: '',
            showReject: false
          }));
          this.showBookingRequests = true;
        }
      });
  }

  approveBooking(bookingId: number) {
    this.http.put<any>(`http://localhost:8080/api/admin/approve-booking/${bookingId}`, {})
      .subscribe(res => {
        if (res.status === 'success') {
          this.fetchBookingRequests();
          alert(res.message || 'Approval successful');
        } else {
          alert(res.message || 'Failed to approve booking');
        }
      });
  }

  rejectBooking(bookingId: number, reason: string) {
    if (!reason.trim()) {
      alert('Rejection reason is required!');
      return;
    }

    const payload = { bookingId, reason };
    this.http.post<any>('http://localhost:8080/api/admin/reject-booking', payload)
      .subscribe(res => {
        if (res.status === 'success') {
          this.fetchBookingRequests();
          this.message = '❌ Booking rejected!';
          setTimeout(() => this.message = '', 3000);
        } else {
          alert('Rejection failed!');
        }
      });
  }

  deleteBooking(id: number) {
    if (confirm("Are you sure you want to delete this booking?")) {
      this.http.delete<any>(`http://localhost:8080/api/delete-booking/${id}`)
        .subscribe(res => {
          if (res.status === 'success') {
            alert(res.message);
            this.bookingRequests = this.bookingRequests.filter(b => b.bookingid !== id);
          } else {
            alert("Failed to delete booking");
          }
        });
    }
  }

  searchBookingRequests() {
    if (!this.bookingSearchTerm.trim()) {
      this.fetchBookingRequests();
      return;
    }

    this.http.get<any>(`http://localhost:8080/api/admin/search-bookings?keyword=${this.bookingSearchTerm}`)
      .subscribe(res => {
        if (res.status === 'success') {
          this.bookingRequests = res.data.map((b: any) => ({
            ...b,
            rejectionReason: '',
            showReject: false
          }));
        } else {
          this.bookingRequests = [];
        }
      });
  }

  /** ---------------- NAVIGATION ---------------- **/

  openAddAgencyForm() {
    this.resetViews();
    this.showAddAgencyForm = true;
  }

  cancelAddAgency() {
    this.showAddAgencyForm = false;
    this.newAgency = { name: '', location: '', domesticCylinders: 0, commercialCylinders: 0 };
  }

  addGasAgency() {
    this.http.post<any>('http://localhost:8080/api/admin/add-gas-agency', this.newAgency)
      .subscribe(res => {
        if (res.status === 'success') {
          this.message = '✅ Gas agency added!';
          this.fetchAllAgencies();
          setTimeout(() => this.message = '', 3000);
        }
      });
  }

  logout() {
    localStorage.removeItem('adminid');
    this.router.navigate(['/login-admin']);
  }

  navigateToAddCustomer() {
    this.router.navigate(['/register']);
  }
}
