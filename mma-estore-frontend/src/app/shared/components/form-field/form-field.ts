import {
  Component,
  input
} from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css'
})
export class FormField {

  readonly label = input('');

  readonly required = input(false);

  readonly hint = input('');

  readonly error = input('');

}