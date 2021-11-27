import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'E-Medications Portal';

  constructor(private router: Router, public apiService: ApiService,public authService: AuthService) {
  }

  // Method to Logout
  logOut(): void {
    this.authService.isLoggedIn$.next(false);
      this.authService.userRole$.next('');
    this.authService.isLoggedIn$.subscribe(value => {
      this.authService.isLoggedIn = value;
    });
    this.authService.userRole$.subscribe(value => {
      this.authService.userRole = value;
    });
    this.apiService.wishListProducts = [];
    this.apiService.shoppingCartProducts = [];
    this.apiService.wishListProductsCounter = 0;
    this.apiService.shoppingCartProductsCounter = 0;
    this.apiService.username = '';
    this.router.navigate(['home']);
  }
}
