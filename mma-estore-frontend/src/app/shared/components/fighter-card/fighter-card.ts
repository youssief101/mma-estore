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
    FighterCardModel
} from '../../models/fighter-card.model';

@Component({

    selector:'app-fighter-card',

    standalone:true,

    imports:[
        CommonModule,
        Card
    ],

    templateUrl:'./fighter-card.html',

    styleUrl:'./fighter-card.css'

})

export class FighterCard{

    readonly fighter =
        input.required<FighterCardModel>();

    readonly fighterClick =
        output<string>();

    onClick():void{

        this.fighterClick.emit(

            this.fighter().id

        );

    }

}