export interface ProductCardModel {

    id:string;

    name:string;

    image:string;

    brand:string;

    category:string;

    price:number;

    oldPrice?:number;

    discountPercentage?:number;

    rating?:number;

    reviewCount?:number;

    inStock:boolean;

    isNew?:boolean;

}