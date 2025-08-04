  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
  import { Router } from '@angular/router';
  import { HttpClient, HttpClientModule } from '@angular/common/http';

  @Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
    templateUrl: './register-admin.html',
    styleUrls: ['./register-admin.css']
  })
  export class RegisterAdmin {
    passwordStrength: 'weak' | 'medium' | 'strong' | '' = '';
    passwordFocused = false;
    registerForm: FormGroup;
    passwordValid: any;

    constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
      this.registerForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.com$/)]],
        address: [''],
        phone: ['', [Validators.required, Validators.pattern(/^\+91[6-9]\d{9}$/)]],
        password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]],
        role: ['', Validators.required]
      });
    }

    checkPasswordStrength() {
      const password = this.registerForm.get('password')?.value || '';
      if (this.passwordFocused) {
        if (password.length < 8) {
          this.passwordStrength = 'weak';
        } else if (/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(password) && !/(?=.*[\W_])/.test(password)) {
          this.passwordStrength = 'medium';
        } else if (/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])/.test(password)) {
          this.passwordStrength = 'strong';
        } else {
          this.passwordStrength = 'weak';
        }
      } else {
        this.passwordStrength = '';
      }
    }

    onPasswordFocus() {
      this.passwordFocused = true;
    }

    onPasswordBlur() {
      this.passwordFocused = false;
      this.passwordStrength = '';
    }

    onRegister() {
      if (this.registerForm.valid) {
        this.http.post('http://localhost:8080/api/create-admin', this.registerForm.value).subscribe({
          next: () => {
            alert('Registration successful!');
            this.router.navigate(['/login-admin']);
          },
          error: err => {
            alert('Registration failed: ' + err.error.message);
          }
        });
      } else {
        this.registerForm.markAllAsTouched();
      }
    }

    navigateToLogin() {
      this.router.navigate(['/login-admin']);
    }

    get name() { return this.registerForm.get('name'); }
    get email() { return this.registerForm.get('email'); }
    get phone() { return this.registerForm.get('phone'); }
    get password() { return this.registerForm.get('password'); }
    get role() { return this.registerForm.get('role'); }
  }
