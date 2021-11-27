import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentCards, User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';

export interface TablePaymentCards {
  cardNumber: number;
  fullName: string;
  expirationdate: string;
  code: number;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  cardSubmitted: boolean = false;
  showMessage: number = 0;
  user: User = new User();
  displayedColumns: string[] = ['cardNumber', 'fullName', 'expirationdate', 'code', 'actions'];
  cards: TablePaymentCards[] = [];

  constructor(public apiService: ApiService, private formBuilder: FormBuilder, private router: Router) {
    this.submitted = false;
    this.user.paymentCards = [];
   // Create Form Group
    this.form = this.formBuilder.group(
      {
        _id: [''],
        fullName: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required],
        street: ['', Validators.required],
        phone: [, Validators.required],
        cardNumber: [],
        cardFullName: [''],
        month: [, [Validators.min(1), Validators.max(12)]],
        year: [, [Validators.min(2021), Validators.minLength(4), Validators.maxLength(4)]],
        code: []
      }
    );
  }

  ngOnInit(): void {
  }

  resetForm() {
    this.submitted = false;
    this.cardSubmitted = false;
    this.showMessage = 0;
    this.form.reset();
  }

  savePaymentCard() {
    this.submitted = false;
    this.cardSubmitted = true;
    if (this.form.value.cardNumber && this.form.value.cardFullName && this.form.value.month && this.form.value.year && this.form.value.code
      && this.form.get('month').valid && this.form.get('year').valid) {
      let card: PaymentCards = {
        cardNumber: this.form.value.cardNumber,
        fullName: this.form.value.cardFullName,
        month: this.form.value.month,
        year: this.form.value.year,
        code: this.form.value.code
      };

      let index = this.user.paymentCards.findIndex(c => c.cardNumber === card.cardNumber);
      if (index >= 0) {
        this.user.paymentCards[index] = card;
      } else {
        this.user.paymentCards.push(card);
      }
  
      let tableCard: TablePaymentCards = {
        cardNumber: this.form.value.cardNumber,
        fullName: this.form.value.cardFullName,
        expirationdate: this.form.value.month + '/' + this.form.value.year,
        code: this.form.value.code
      };

      let tableIndex = this.cards.findIndex(c => c.cardNumber === card.cardNumber);
      if (tableIndex >= 0) {
        this.cards[index] = tableCard;
      } else {
        this.cards.push(tableCard);
      }
    }
  }

  editPaymentCard(cardNumber: number) {
    this.submitted = false;
    this.cardSubmitted = false;
    this.showMessage = 0;
    let card = this.user.paymentCards.find(c => c.cardNumber === cardNumber);
    if (card) {
      this.form.patchValue({cardNumber: cardNumber, cardFullName: card.fullName, month: card.month, year: card.year, code: card.code});
    }
  }

  removePaymentCard(cardNumber: number) {
    this.submitted = false;
    this.cardSubmitted = false;
    this.showMessage = 0;

    this.user.paymentCards = this.user.paymentCards.filter(c => c.cardNumber !== cardNumber);
    this.cards = this.cards.filter(c => c.cardNumber !== cardNumber);

    this.form.patchValue({ cardNumber: null, cardFullName: null, month: null, year: null, code: null});
  }

  onSubmit() {
    // Assign Values to Variables
    this.submitted = true;
    this.cardSubmitted = false;
    this.showMessage = 0;

    // Validate Form Entires
    if (this.form.valid) {
      this.user.fullName = this.form.value.fullName;
      this.user.username = this.form.value.username.toLowerCase();
      this.user.password = this.form.value.password;
      this.user.email = this.form.value.email;
      this.user.address ={
        country: this.form.value.country,
        city: this.form.value.city,
        street: this.form.value.street,
        phone: this.form.value.phone
      };

      this.apiService.postUser(this.user).subscribe((res: any) => {
        this.submitted = false;
        console.log(res);
        if (res) {
          this.showMessage = 2;
          this.form.reset();
          this.user = new User();
          this.cards = [];
          return;
        } else {
          this.showMessage = 1;
        }
      }, error => { console.log(error); });
    }
  }

}
