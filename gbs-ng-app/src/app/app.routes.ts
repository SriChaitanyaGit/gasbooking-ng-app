import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Customer } from './customer/customer';
import { Admin } from './admin/admin';
import { RegisterAdmin } from './register-admin/register-admin';
import { LoginAdmin } from './login-admin/login-admin';
import { CustomerProfile} from './customer-profile/customer-profile';
import { BookGas } from './book-gas/book-gas';
import { BookingHistory } from './booking-history/booking-history';
import { AdminBookings } from './admin-bookings/admin-bookings';
import { Payment } from './payment/payment';
// import { Home2 } from './home2/home2';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  {path:'login-admin',component:LoginAdmin},
  { path: 'register', component: Register },
   {path: 'admin-register',component:RegisterAdmin},
  { path: 'customer', component: Customer },
  {path:'customer-profile',component:CustomerProfile},
   { path: 'book-gas', component: BookGas },
  { path: 'booking-history', component: BookingHistory },
   { path: 'admin-bookings', component: AdminBookings },
  { path: 'admin', component: Admin },
  {path:'payment',component:Payment}
  
 
];
