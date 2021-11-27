import { WishList } from 'src/app/models/wish-list.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup } from '@angular/forms';
import { ShoppingCart } from 'src/app/models/shopping-cart.model';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  // Declare Variables, Objects, & Arrays
  wishListProducts: WishList[] = [];
  shoppingCart: ShoppingCart = new ShoppingCart();
  imgPATH = this.apiService.baseUri + '/img/';
      
  constructor(private router: Router, private apiService: ApiService, private authService: AuthService) {
    this.wishListProducts = this.apiService.wishListProducts;
  }

  ngOnInit(): void {
  }

  addToShoppingCart(product:WishList): void {
    this.shoppingCart = this.apiService.shoppingCartProducts.find(c => c.productId == product.productId);
    if (this.shoppingCart) {
      const index = this.apiService.shoppingCartProducts.indexOf(this.shoppingCart);
      if (index >= 0) {
        this.shoppingCart.quantity += product.quantity;
        this.apiService.putShoppingCartProductById(this.shoppingCart).subscribe((data: any) => {
          let cart = data as ShoppingCart;
          this.apiService.shoppingCartProducts[index] = cart;
          this.removeProductFromWishList(product);
        });
      } 
    } else {
      this.shoppingCart = {
        _id: '',
        categoryId: product.categoryId,
        productId: product.productId,
        name: product.name,
        img: product.img,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        size: product.size,
        username: this.apiService.username,
        status: 1
      };
      this.apiService.postShoppingCart(this.shoppingCart).subscribe((data: any) => {
        this.shoppingCart = data as ShoppingCart;
        this.apiService.shoppingCartProducts.push(this.shoppingCart);
        this.apiService.shoppingCartProductsCounter++;
        this.removeProductFromWishList(product);
      });
    }
  }

  removeProductFromWishList(product:WishList) {
    this.apiService.deleteWishListProductById(product._id).subscribe((data: any) => {
      this.wishListProducts = this.wishListProducts.filter(p => p._id !== product._id);
      this.apiService.wishListProducts = this.wishListProducts;
      this.apiService.wishListProductsCounter = this.apiService.wishListProductsCounter - 1;
    });
  }
}
