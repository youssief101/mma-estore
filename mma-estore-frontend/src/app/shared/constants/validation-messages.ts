import { ValidationErrors } from '@angular/forms';

export const VALIDATION_MESSAGES = {

    required: () =>

        'This field is required.',

    email: () =>

        'Please enter a valid email address.',

    minlength: (error: ValidationErrors) =>

        `Minimum ${error['requiredLength']} characters.`,

    maxlength: (error: ValidationErrors) =>

        `Maximum ${error['requiredLength']} characters.`,

    min: (error: ValidationErrors) =>

        `Minimum value is ${error['min']}.`,

    max: (error: ValidationErrors) =>

        `Maximum value is ${error['max']}.`,

    pattern: () =>

        'Invalid format.'

};