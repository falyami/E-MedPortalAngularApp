import { SigninComponent } from './components/signin/signin.component';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { UsersComponent } from './components/users/users.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProductComponent } from './components/product/product.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'register', component: SignupComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: { role: 'superadmin'}},
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard], data: { role: ['admin','superadmin']}},
  { path: 'product/:id', component: ProductComponent},
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard], data: { role: 'user'}},
  { path: 'categories/:id', component: CategoryProductsComponent},
  { path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard], data: { role: 'user'}},
  { path: 'wish-list', component: WishListComponent, canActivate: [AuthGuard], data: { role: 'user'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
