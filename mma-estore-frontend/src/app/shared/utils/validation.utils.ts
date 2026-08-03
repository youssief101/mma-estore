import {
    AbstractControl
} from '@angular/forms';

import {
    VALIDATION_MESSAGES
} from '../constants/validation-messages';

export function getValidationMessage(

    control: AbstractControl | null

): string {

    if (!control) {

        return '';

    }

    if (

        !control.errors ||

        !(control.touched || control.dirty)

    ) {

        return '';

    }

    const firstError =

        Object.keys(control.errors)[0];

    const error =

        control.errors[firstError];

    const messageFactory =

        VALIDATION_MESSAGES[
            firstError as keyof typeof VALIDATION_MESSAGES
        ];

    if (!messageFactory) {

        return 'Invalid value.';

    }

    return messageFactory(error);

}