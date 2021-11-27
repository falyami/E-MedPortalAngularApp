export class Order {
    _id: string = '';
    orderNo: string = '';
    username: string = '';
    fullName: string = '';
    totalPrice: number = 0;
    orderDate: Date;
    status: string;
    paymentMethod: string;
    paymentCard: string;
    orderDetails?: OrderDetails[] = [];
}

export interface OrderDetails {
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    price: number;
    status: boolean;
}

