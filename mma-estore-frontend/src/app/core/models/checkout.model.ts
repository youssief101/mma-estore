export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface CheckoutPayment {
  method: 'card' | 'cash';
}

export interface CheckoutOrder {
  shippingAddress: CheckoutAddress;
  payment: CheckoutPayment;
}
