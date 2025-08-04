import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  onLogin() {
    const loginData = { email: this.email, password: this.password };

    this.http.post('http://localhost:8080/api/login-customer', loginData).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          const role = res.data;
          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (role === 'customer') {
            // ✅ Store credentials in session
            sessionStorage.setItem('email', this.email);
            sessionStorage.setItem('password', this.password);
            this.router.navigate(['/customer']);
          }
        } else {
          alert('Login failed: ' + res.message);
        }
      },
      error: () => alert('Login error')
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
