import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [HttpClientModule, CommonModule,FormsModule],
  templateUrl: './customer-profile.html',
  styleUrls: ['./customer-profile.css']
})
export class CustomerProfile implements OnInit {
  profile: any = {};
  originalProfile: any = {};
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const email = sessionStorage.getItem('email');
    const password = sessionStorage.getItem('password');

    if (!email || !password) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.post<any>('http://localhost:8080/api/customer-profile', { email, password }).subscribe({
      next: res => {
        if (res.status === 'success') {
          this.profile = res.data;
        } else {
          this.message = res.message;
        }
      },
      error: () => {
        this.message = 'Failed to load profile.';
      }
    });
  }

  updateProfile(): void {
    const hasChanges =
      this.profile.name !== this.originalProfile.name ||
      this.profile.phone !== this.originalProfile.phone ||
      this.profile.role !== this.originalProfile.role;

    if (!hasChanges) {
      this.setMessage('Details are up to date.', 'success');
      return;
    }

    this.http.put<any>('http://localhost:8080/api/customer-profile/update', this.profile).subscribe({
      next: res => {
        if (res.status === 'success') {
          this.originalProfile = { ...this.profile };
          this.setMessage('Profile updated successfully.', 'success');
        } else {
          this.setMessage(res.message, 'error');
        }
      },
      error: () => {
        this.setMessage('Failed to update profile.', 'error');
      }
    });
  }

  updatePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.setMessage('Passwords do not match.', 'error');
      return;
    }

    if (this.newPassword.length < 6) {
      this.setMessage('Password must be at least 6 characters.', 'error');
      return;
    }

    if (this.newPassword === this.profile.password) {
      this.setMessage('Enter a new password different from the current one.', 'error');
      return;
    }

    this.http.put<any>('http://localhost:8080/api/update-password', {
      email: this.profile.email,
      newPassword: this.newPassword
    }).subscribe({
      next: res => {
        if (res.status === 'success') {
          this.profile.password = this.newPassword;
          this.newPassword = '';
          this.confirmPassword = '';
          this.setMessage('Password updated successfully.', 'success');
        } else {
          this.setMessage(res.message, 'error');
        }
      },
      error: () => {
        this.setMessage('Details are up to date.', 'success');
      }
    });
  }

  setMessage(msg: string, type: 'success' | 'error'): void {
  this.message = msg;
  this.messageType = type;
  
}

}
