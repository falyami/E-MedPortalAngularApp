import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Admin } from 'src/app/models/admin.model';
import { ShoppingCart } from 'src/app/models/shopping-cart.model';
import { User } from 'src/app/models/user.model';
import { WishList } from 'src/app/models/wish-list.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  showMessage: number = 0;
  result: any;
  wishList: WishList[] = [];
  shoppingCart: ShoppingCart[] = [];

  constructor(private router: Router, public apiService: ApiService, private formBuilder: FormBuilder, public authService: AuthService) {
    // Set Default Values
    this.submitted = false;
    this.showMessage = 0;
    this.authService.isLoggedIn = false;
    this.authService.isLoggedIn$.next(false);
    this.authService.userRole = '';
    this.authService.userRole$.next('');
   // Create Form Group
    this.form = this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
        status: [false]
      }
    );
  }

  ngOnInit(): void {
  }

  resetForm() {
    this.submitted = false;
    this.showMessage = 0;
    this.form.reset();
  }

  authenticateAdministrator(admin:Admin) {
    this.showMessage = 0;
    this.authService.authenticateAdministrator(admin).subscribe((res: any) => {
      this.authService.isLoggedIn$.next(res);
      if (admin.username == 'admin') {
        this.authService.userRole$.next('superadmin');
      } else {
        this.authService.userRole$.next('admin');
      }
      this.setAuthorizations();
      if (res) {
        this.router.navigate(['home']);
      } else {
        this.showMessage = 1;
      }
    }, error => { console.log(error); });
  }

  authenticateUser(user:User) {
    this.showMessage = 0;
    this.authService.authenticateUser(user).subscribe((res: any) => {
      this.authService.isLoggedIn$.next(res);
      this.authService.userRole$.next('user');
      this.setAuthorizations();
      if (res) {
        this.router.navigate(['home']);
      } else {
        this.showMessage = 1;
      }
    }, error => { console.log(error); });
  }

  setAuthorizations(){
    this.authService.isLoggedIn$.subscribe(value => {
      this.authService.isLoggedIn = value;
    });
    this.authService.userRole$.subscribe(value => {
      this.authService.userRole = value;
    });
  }

  onSubmit() {
    // Assign Values to Variables
    this.submitted = true;
    this.showMessage = 0;
    this.apiService.username = '';

    // Validate Form Entires
    if (this.form.valid) {
      if (this.form.value.status == true) {
        let admin = new Admin();
        admin.username = this.form.value.username.toLowerCase();
        admin.password = this.form.value.password;
        this.apiService.username = admin.username;
        this.authenticateAdministrator(admin);
      } else {
        let user = new User();
        user.username = this.form.value.username.toLowerCase();
        user.password = this.form.value.password;
        this.apiService.username = user.username;
        this.authenticateUser(user);
        // Prepare User Shopping Cart
        this.apiService.getShoppingCartProductsByUsername(this.apiService.username).subscribe((data: any) => {
          this.apiService.shoppingCartProducts = data as ShoppingCart[];
          this.apiService.shoppingCartProductsCounter = this.apiService.shoppingCartProducts.length;
        });
        // Prepare User Wish List
        this.apiService.getWishListProductsByUsername(this.apiService.username).subscribe((data: any) => {
          this.apiService.wishListProducts = data as WishList[];
          this.apiService.wishListProductsCounter = this.apiService.wishListProducts.length;
        });
      }
    }
  }

}
