import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ShoppingCart } from 'src/app/models/shopping-cart.model';
import { WishList } from 'src/app/models/wish-list.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productId: string = '';
  product: Product = new Product();
  shoppingCart: ShoppingCart = new ShoppingCart();
  wishList: WishList = new WishList();

  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService) { 
    this.productId = this.route.snapshot.params.id;
    this.apiService.getProductInfoById(this.productId).subscribe((data: any) => {
      this.product = data as Product;
    });
  }

  ngOnInit(): void {
  }

  addToShoppingCart(id:any) {
    this.apiService.getProductInfoById(id).subscribe((data: any) => {
      this.product = data as Product;
      const filteredProduct = this.apiService.shoppingCartProducts.find(element => element.productId == this.product._id);
      if (filteredProduct) {
        const quantity = filteredProduct.quantity + 1;
        //const index = this.apiService.shoppingCartProducts.indexOf(this.product);
        //this.apiService.shoppingCartProducts[index].quantity = quantity;
      } else {
        //this.apiService.shoppingCartProducts.push(this.product);
        this.apiService.shoppingCartProductsCounter++;
      }
    });
  }

  addToWishList(id:any) {
    this.apiService.getProductInfoById(id).subscribe((data: any) => {
      this.product = data as Product;
      const filteredProduct = this.apiService.wishListProducts.find(element => element._id == this.product._id);
      if (filteredProduct) {
        const quantity = filteredProduct.quantity + 1;
        //const index = this.apiService.wishListProducts.indexOf(this.product);
        //this.apiService.wishListProducts[index].quantity = quantity;
      } else {
        //this.apiService.wishListProducts.push(this.product);
        this.apiService.wishListProductsCounter++;
      }
    });
  }

  goBackToProducts(id:any) {
    this.router.navigate(['/categories', id]);
  }

}
