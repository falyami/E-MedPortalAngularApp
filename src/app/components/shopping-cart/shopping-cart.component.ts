import { Product } from './../../models/product.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Order, OrderDetails } from 'src/app/models/order.model';
import { ShoppingCart } from 'src/app/models/shopping-cart.model';
import { ApiService } from 'src/app/services/api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  // Declare Variables, Objects, & Arrays
  shoppingCartProducts: ShoppingCart[] = [];
  imgPATH = this.apiService.baseUri + '/img/';
    
  constructor(private router: Router, public apiService: ApiService) {
    this.shoppingCartProducts = this.apiService.shoppingCartProducts;
  }

  ngOnInit(): void {
    
  }

  removeProductFromCart(product:ShoppingCart) {
    this.apiService.deleteShoppingCartProductById(product._id).subscribe((data: any) => {
      this.shoppingCartProducts = this.shoppingCartProducts.filter(p => p._id !== product._id);
      this.apiService.shoppingCartProducts = this.shoppingCartProducts;
      this.apiService.shoppingCartProductsCounter = this.apiService.shoppingCartProductsCounter - 1;
    });
  }

  adjustOrder(order:Order) {
    this.apiService.putOrderById(order).subscribe();
  }

  adjustProducts(order:Order) {
    order.orderDetails.forEach(element => {
      this.apiService.getProductInfoById(element.productId).subscribe((data: any) => {
        let product = data as Product;
        let quantity = product.quantity;
        let actualQuantity = 0;
        let index = order.orderDetails.indexOf(element);

        if (quantity > 0) {
          if (element.quantity <= quantity) {
            actualQuantity = element.quantity;
          } else {
            actualQuantity = quantity;
          }
          order.totalPrice = order.totalPrice - (element.quantity * element.price);
          element.quantity = actualQuantity;
          product.quantity = product.quantity - actualQuantity;
          order.totalPrice = order.totalPrice + (element.quantity * element.price);
          this.apiService.putProduct(product._id, product).subscribe();
          order.orderDetails[index] = element;
        } else {
          order.orderDetails[index].status = false;
          order.totalPrice = order.totalPrice - (element.quantity * element.price);
        }
        if (index === order.orderDetails.length - 1) {
          this.adjustOrder(order);
        }
      });
    });
  }

  addOrder(order:Order) {
    this.apiService.postOrder(order).subscribe((data: any) => {
      let order = data as Order;
      this.adjustProducts(order);
      this.shoppingCartProducts.forEach(product => { 
        this.removeProductFromCart(product);
      });
    });
  }

  prepareOrder() {
    let order: Order = {
      _id: '',
      orderNo: Math.random().toString(),
      orderDate: null,
      username: this.apiService.username,
      fullName: '',
      totalPrice: 0,
      status: 'Pending',
      paymentMethod: '',
      paymentCard: ''
    };

    order.orderDetails = [];
    let orderProduct: OrderDetails;
    this.shoppingCartProducts.forEach(product => {
      orderProduct = {
        productId: product.productId,
        productName: product.name,
        size: product.size,
        quantity: product.quantity,
        price: product.price,
        status: true
      };
      order.totalPrice = order.totalPrice + (product.price * product.quantity);
      order.orderDetails.push(orderProduct);
    });

    this.apiService.getUserByUsername(this.apiService.username).subscribe((data: any) => { 
      order.fullName = data.fullName;
      this.addOrder(order);
    });
  }

}
