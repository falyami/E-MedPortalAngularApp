import { ShoppingCart } from './../../models/shopping-cart.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { WishList } from 'src/app/models/wish-list.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {
  // Declare Variables, Objects, & Arrays
  form: FormGroup = new FormGroup({});
  products: Product[] = [];
  categoryId: string = '';
  categoryTitle: string = '';
  product: Product = new Product();
  shoppingCart: ShoppingCart = new ShoppingCart();
  wishList: WishList = new WishList();
  imgPATH = this.apiService.baseUri + '/img/';
    
  constructor(private router: Router, private route: ActivatedRoute, public authService: AuthService, private apiService: ApiService) {
    this.categoryId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.apiService.getCategoryInfoById(this.categoryId).subscribe((data: any) => {
      this.categoryTitle = data.title;
    }, error => { console.log(error); });

    let group: FormGroup = new FormGroup({});
    this.apiService.getProductsByCategoryId(this.categoryId).subscribe((data: any) => {
      this.products = data as Product[];
      console.log(this.products);
      if (this.products.length > 0) {
        this.products.forEach(product => {
          if (product.status == 1) {
            group.addControl(product._id.toString(), new FormControl(0));
          }
        });
      }
    }, error => { console.log(error); });
    this.form = group;
  }

  addToShoppingCart(product:Product) {
    // if (this.form.controls[product._id.toString()].value > 0) {
      console.log(this.apiService.shoppingCartProducts);
      this.shoppingCart = this.apiService.shoppingCartProducts.find(c => c.productId == product._id);
      if (this.shoppingCart) {
        const index = this.apiService.shoppingCartProducts.indexOf(this.shoppingCart);
        if (index >= 0) {
          this.shoppingCart.quantity += this.form.controls[product._id.toString()].value;
          this.apiService.putShoppingCartProductById(this.shoppingCart).subscribe((data: any) => {
            let cart = data as ShoppingCart;
            this.apiService.shoppingCartProducts[index] = cart;
          });
        } 
      } else {
        this.shoppingCart = {
          _id: '',
          categoryId: product.categoryId,
          productId: product._id,
          name: product.name,
          img: product.img,
          description: product.description,
          quantity: this.form.controls[product._id.toString()].value,
          price: product.price,
          size: product.size,
          username: this.apiService.username,
          status: 1
        };
        this.apiService.postShoppingCart(this.shoppingCart).subscribe((data: any) => {
          this.shoppingCart = data as ShoppingCart;
          this.apiService.shoppingCartProducts.push(this.shoppingCart);
          this.apiService.shoppingCartProductsCounter++;
        });

      }
    //}
  }

  addToWishList(product:Product) {
    //if (this.form.controls[product._id.toString()].value > 0) {
      this.wishList = this.apiService.wishListProducts.find(c => c.productId == product._id);
      if (this.wishList) {
        const index = this.apiService.wishListProducts.indexOf(this.wishList);
        if (index >= 0) {
          this.wishList.quantity += this.form.controls[product._id.toString()].value;
          this.wishList.username = this.apiService.username;
          this.apiService.putWishListProductById(this.wishList).subscribe((data: any) => {
            this.wishList = data as WishList;
            this.apiService.wishListProducts[index] = this.wishList;
          });
        } 
      } else {
        this.wishList = {
          _id: '',
          categoryId: product.categoryId,
          productId: product._id,
          name: product.name,
          img: product.img,
          description: product.description,
          quantity: this.form.controls[product._id.toString()].value,
          price: product.price,
          size: product.size,
          username: this.apiService.username,
          status: 1
        };
        this.apiService.postWishList(this.wishList).subscribe((data: any) => {
          this.wishList = data as WishList;
          this.apiService.wishListProducts.push(this.wishList);
          this.apiService.wishListProductsCounter++;
        });
      }
    }
  //}
}
