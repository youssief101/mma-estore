import {
    Component,
    input,
    output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Card } from '../card/card';

import { Button } from '../button/button';

import { OrderSummaryCardModel } from '../../models/order-summary-card.model';

@Component({

    selector:'app-order-summary-card',

    standalone:true,

    imports:[
        CommonModule,
        Card,
        Button
    ],

    templateUrl:'./order-summary-card.html',

    styleUrl:'./order-summary-card.css'

})

export class OrderSummaryCard{

    readonly summary =
        input.required<OrderSummaryCardModel>();

    readonly loading =
        input(false);

    readonly checkout =
        output<void>();

    readonly continueShopping =
        output<void>();

}