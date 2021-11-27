import { ShoppingCart } from './../models/shopping-cart.model';
import { WishList } from './../models/wish-list.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Admin } from '../models/admin.model';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  
  baseUri:string = 'http://localhost:4300';

  shoppingCartProductsCounter = 0;
  wishListProductsCounter = 0;
  wishListProducts: WishList[] = [];
  shoppingCartProducts: ShoppingCart[] = [];
  username = '';
  fullName = '';
  order: Order = new Order();
  selectedMethod: string = '';
  selectedCard: number = 0;

  constructor(private http: HttpClient) { }

  // Get All Categories
  getCategories() {
    return this.http.get(`${this.baseUri}/categories`);
  }

  // Get All Products
  getProducts() {
    return this.http.get(`${this.baseUri}/products`);
  }

  // Post Product
  postProduct(product:any) {
    return this.http.post(`${this.baseUri}/products`, product);
  }

  // Put Product
  putProduct(id:string, product:any) {
    console.log(product);
    return this.http.put(`${this.baseUri}/products/${id}`, product);
  }

  // Get All Products By Category Id
  getProductsByCategoryId(id:string) {
    return this.http.get(`${this.baseUri}/products/${id}`);
  }

  // Get Category Info By Id
  getCategoryInfoById(id:string) {
    return this.http.get(`${this.baseUri}/categories/categorybyid/${id}`);
  }

  // Get Product Info By Id
  getProductInfoById(id:string) {
    return this.http.get(`${this.baseUri}/products/productbyid/${id}`);
  }

  // Get Administrators
  getAdministrators() {
    return this.http.get(`${this.baseUri}/admins`);
  }

  // Get Administrator Info By Id
  getAdministratorInfoById(id:string) {
    return this.http.get(`${this.baseUri}/admins/adminbyid/${id}`);
  }

  // Post Administrator
  postAdministrator(admin: Admin) {
    return this.http.post(`${this.baseUri}/admins`, admin);
  }

  // Put Administrator
  putAdministrator(admin: Admin) {
    return this.http.put(`${this.baseUri}/admins/${admin._id}`, admin);
  }

  // Remove Administrator
  removeAdministrator(_id: string) {
    return this.http.delete(`${this.baseUri}/admins/${_id}`);
  }

  // Post Shopping Cart
  postShoppingCart(shoppingCart:ShoppingCart) {
    return this.http.post(`${this.baseUri}/products/shoppingcart`, shoppingCart);
  }

  //  Put Shopping Cart Product By Id
  putShoppingCartProductById(shoppingCart:ShoppingCart) {
    return this.http.put(`${this.baseUri}/products/shoppingcart/${shoppingCart._id}`, shoppingCart);
  }

  //  Delete Shopping Cart Product By Id
  deleteShoppingCartProductById(id:string) {
    return this.http.delete(`${this.baseUri}/products/shoppingcart/${id}`);
  }

  //  Get Shopping Cart Products By Username
  getShoppingCartProductsByUsername(username:string) {
    return this.http.get(`${this.baseUri}/products/shoppingcart/${username}`);
  }

  // Post Wish List
  postWishList(wishList:WishList) {
    return this.http.post(`${this.baseUri}/products/wishList`, wishList);
  }

  //  Put Wish List Product By Id
  putWishListProductById(wishList:WishList) {
    return this.http.put(`${this.baseUri}/products/wishList/${wishList._id}`, wishList);
  }

   //  Delete Wish List Product By Id
   deleteWishListProductById(id:string) {
    return this.http.delete(`${this.baseUri}/products/wishList/${id}`);
  }

  //  Get Wish List Products By Username
  getWishListProductsByUsername(username:string) {
    return this.http.get(`${this.baseUri}/products/wishList/${username}`);
  }

  // Post User
  postUser(user:User) {
    return this.http.post(`${this.baseUri}/users`, user);
  }

  //  Get User By Username
  getUserByUsername(username:string) {
    return this.http.get(`${this.baseUri}/users/${username}`);
  }

  //  Get Orders By Username
  getOrdersByUsername(username:string) {
    return this.http.get(`${this.baseUri}/orders/${username}`);
  }

  //  Get Order By Id
  getOrderById(id:string) {
    return this.http.get(`${this.baseUri}/orders/${id}`);
  }

  //  Post Order
  postOrder(order:Order) {
    return this.http.post(`${this.baseUri}/orders`, order);
  }

  //  Put Order By Id
  putOrderById(order:Order) {
    return this.http.put(`${this.baseUri}/orders/${order._id}`, order);
  }
  
}