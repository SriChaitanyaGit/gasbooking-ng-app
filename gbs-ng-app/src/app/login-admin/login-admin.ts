import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login-admin.html',
  styleUrls: ['./login-admin.css']
})
export class LoginAdmin {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  onLoginAdmin() {
    const loginData = { email: this.email, password: this.password };

    this.http.post('http://localhost:8080/api/login-admin', loginData).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          const role = res.data.role;
          if (role === 'admin') {
            localStorage.setItem('adminid', res.data.adminid);
            localStorage.setItem('adminname', res.data.name); // store ID if needed
            this.router.navigate(['/admin']);
          } else {
            alert('Unauthorized role');
          }
        } else {
          alert('Login failed: ' + res.message);
        }
      },
      error: err => {
        const msg = err.error?.message || 'Login error';
        alert(msg);
      }
    });
  }

  navigateToRegisterAdmin() {
    this.router.navigate(['/admin-register']);
  }
}
