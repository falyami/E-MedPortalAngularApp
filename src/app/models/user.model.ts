export class User {
    _id: string = '';
    fullName: string = '';
    username: string = '';
    email: string = '';
    password: string = '';
    status: boolean = false;
    address: {
        country: string;
        city: string;
        street: string;
        phone: number
    };
    paymentCards?: PaymentCards[] = [];
}

export interface PaymentCards {
    cardNumber: number;
    fullName: string;
    year: number;
    month: number;
    code: number;
}
