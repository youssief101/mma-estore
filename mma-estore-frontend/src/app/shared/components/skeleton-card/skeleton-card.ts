import {
    Component,
    input
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({

    selector:'app-skeleton-card',

    standalone:true,

    imports:[
        CommonModule
    ],

    templateUrl:'./skeleton-card.html',

    styleUrl:'./skeleton-card.css'

})

export class SkeletonCard{

    readonly count =
        input(1);

    readonly compact =
        input(false);

}