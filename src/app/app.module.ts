import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsComponent, SearchFilterPipe } from './components/products/products.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { OrdersComponent } from './components/orders/orders.component';
import { UsersComponent } from './components/users/users.component';
import { HomeComponent } from './components/home/home.component';
import { MatCardModule} from '@angular/material/card';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { ApiService } from './services/api.service';
import { ProductComponent } from './components/product/product.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    ShoppingCartComponent,
    WishListComponent,
    OrdersComponent,
    UsersComponent,
    HomeComponent,
    CategoryProductsComponent,
    SignupComponent,
    SigninComponent,
    ProductComponent,
    SearchFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    NgImageSliderModule,
    MatButtonModule,
    HttpClientModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatExpansionModule,
    MatRadioModule
  ],
  providers: [ApiService, AuthService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
