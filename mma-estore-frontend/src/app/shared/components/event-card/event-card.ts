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
    EventCardModel
} from '../../../core/models/event-card.model';

@Component({

    selector:'app-event-card',

    standalone:true,

    imports:[
        CommonModule,
        Card
    ],

    templateUrl:'./event-card.html',

    styleUrl:'./event-card.css'

})

export class EventCard{

    readonly event =
        input.required<EventCardModel>();

    readonly eventClick =
        output<string>();

    onClick():void{

        this.eventClick.emit(

            this.event().id

        );

    }

}