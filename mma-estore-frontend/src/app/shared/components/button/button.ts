import {
  Component,
  input
} from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button {

  readonly variant = input<
    'primary' |
    'secondary' |
    'outline' |
    'danger' |
    'ghost' |
    'link'
  >('primary');

  readonly size = input<
    'xs' |
    'sm' |
    'md' |
    'lg' |
    'xl'
  >('md');

  readonly type = input<
    'button' |
    'submit' |
    'reset'
  >('button');

  readonly disabled = input(false);

  readonly loading = input(false);

  readonly fullWidth = input(false);

  readonly rounded = input(false);

}