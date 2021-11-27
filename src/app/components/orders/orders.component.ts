
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/models/order.model';
import { User, PaymentCards } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  order: Order = new Order();
  orders: Order[] = [];
  user: User = new User();
  showMessage: number = 0;
  selectedCard: number;
  // selectedMethod: string = '';
  paymentMethods: any[] = [{value: 'cash', title: 'Cash on Delivery'}, {value: 'card', title: 'Payment Card'}];

  constructor(public apiService: ApiService, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef) { 
    this.submitted = false;
    this.showMessage = 0;
    this.selectedCard = 0;

   // Create Form Group
    this.form = this.formBuilder.group(
      {
        _id: [''],
        paymentMethod: ['', Validators.required],
        paymentCard: ['']
      }
    );
  }

  ngOnInit(): void {
    this.getOrders();
    this.apiService.getUserByUsername(this.apiService.username).subscribe((data: any) => {
      this.user = data as User;
    }, error => console.log(error));
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getOrders() {
    this.submitted = false;
    this.showMessage = 0;
    this.selectedCard = 0;
    this.order = null;
    this.apiService.getOrdersByUsername(this.apiService.username).subscribe((data: any) => {
      this.orders = data as Order[];
      if (this.orders.length > 0) {
        this.orders.forEach(order => {
          order.orderDetails = order.orderDetails.filter(o => o.status != false);
        });
        this.order = this.orders[this.orders.length - 1];
        this.selectedCard = Number(this.order.paymentCard);
      }
    }, error => console.log(error));
  }

  viewOrder(order:Order) {
    this.showMessage = 0;
    this.submitted = false;
    this.selectedCard = 0;
    this.order = order;
    this.form.controls['paymentMethod'].reset();
    this.form.controls['paymentCard'].reset();
    this.selectedCard = Number(this.order.paymentCard);
    console.log(this.selectedCard);
    this.form.patchValue({
      _id: this.order._id,
      paymentMethod: this.order.paymentMethod,
      paymentCard: this.selectedCard
    });
  }

  removeProduct(product:any) {
    this.showMessage = 0;
    this.submitted = false;
    const index = this.order.orderDetails.indexOf(product);
    this.order.orderDetails[index].status = false;
    this.order.totalPrice = this.order.totalPrice - (this.order.orderDetails[index].quantity * this.order.orderDetails[index].price);

    this.apiService.putOrderById(this.order).subscribe((data: any) => {
      this.order = data as Order;
      this.getOrders();
    }, error => console.log(error));
  }

  clearCards() {
    this.form.controls['paymentCard'].reset();
    this.order.paymentCard = '';
    this.selectedCard = null;
  }

  onSubmit() {
    this.showMessage = 0;
    this.submitted = true;
    if (this.form.valid) {
      this.order.paymentMethod = this.form.value.paymentMethod;
      this.order.paymentCard = this.form.value.paymentCard;
      console.log(this.order);
      if ((this.order.paymentMethod == 'card' && this.order.paymentCard != '') || (this.order.paymentMethod == 'cash')) {
        this.order.status = 'In Progress';
        this.apiService.putOrderById(this.order).subscribe((data: any) => {
          this.order = data as Order;
          this.getOrders();
          if (data) {
            this.showMessage = 2;
          } else {
            this.showMessage = 1;
          }
      });
      }
    }
    
  }

}
