import {
    Component,
    input,
    output
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    Card
} from '../card/card';

import {
    Button
} from '../button/button';

import {
    ProductCardModel
} from '../../models/product-card.model';

@Component({

    selector:'app-product-card',

    standalone:true,

    imports:[
        CommonModule,
        Card,
        Button
    ],

    templateUrl:'./product-card.html',

    styleUrl:'./product-card.css'

})

export class ProductCard{

    readonly product =
        input.required<ProductCardModel>();

    readonly addToCart =
        output<void>();

}