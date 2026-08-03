import {
    Component,
    computed,
    input
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    AbstractControl
} from '@angular/forms';

import {
    getValidationMessage
} from '../../utils/validation.utils';

@Component({

    selector:'app-form-error',

    standalone:true,

    imports:[
        CommonModule
    ],

    templateUrl:'./form-error.html',

    styleUrl:'./form-error.css'

})

export class FormError{

    readonly control =
        input<AbstractControl | null>(null);

    readonly message =
        computed(()=>

            getValidationMessage(
                this.control()
            )

        );

}