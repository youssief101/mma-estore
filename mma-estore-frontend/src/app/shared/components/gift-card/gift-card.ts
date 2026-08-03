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
    GiftCardModel
} from '../../models/gift-card.model';

@Component({

    selector:'app-gift-card',

    standalone:true,

    imports:[
        CommonModule,
        Card
    ],

    templateUrl:'./gift-card.html',

    styleUrl:'./gift-card.css'

})

export class GiftCard{

    readonly giftCard =
        input.required<GiftCardModel>();

    readonly giftCardClick =
        output<string>();

    onClick():void{

        this.giftCardClick.emit(

            this.giftCard().id

        );

    }

}