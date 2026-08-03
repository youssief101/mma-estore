import {
    Component,
    input,
    output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Card } from '../card/card';

import { Button } from '../button/button';

import { CartItemCardModel } from '../../models/cart-item-card.model';

@Component({

    selector:'app-cart-item-card',

    standalone:true,

    imports:[
        CommonModule,
        Card,
        Button
    ],

    templateUrl:'./cart-item-card.html',

    styleUrl:'./cart-item-card.css'

})

export class CartItemCard{

    readonly item =
        input.required<CartItemCardModel>();

    readonly increase =
        output<string>();

    readonly decrease =
        output<string>();

    readonly remove =
        output<string>();

    get total():number{

        return this.item().price * this.item().quantity;

    }

}