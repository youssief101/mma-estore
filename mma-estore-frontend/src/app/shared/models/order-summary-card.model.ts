export interface OrderSummaryCardModel {

    subtotal:number;

    discount:number;

    shipping:number;

    tax:number;

    giftCard?:number;

    total:number;

    checkoutText?:string;

}