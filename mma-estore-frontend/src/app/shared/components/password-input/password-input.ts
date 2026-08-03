import {
  Component,
  forwardRef,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './password-input.html',
  styleUrl: './password-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInput),
      multi: true
    }
  ]
})
export class PasswordInput
implements ControlValueAccessor {

  readonly visible =
    signal(false);

  value = '';

  disabled = false;

  private onChange =
    (value: string) => {};

  private onTouched =
    () => {};

  writeValue(value: string | null): void {

    this.value = value ?? '';

  }

  registerOnChange(fn: (value: string) => void): void {

    this.onChange = fn;

  }

  registerOnTouched(fn: () => void): void {

    this.onTouched = fn;

  }

  setDisabledState(isDisabled: boolean): void {

    this.disabled = isDisabled;

  }

  updateValue(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.value = input.value;

    this.onChange(this.value);

  }

  markTouched(): void {

    this.onTouched();

  }

  toggleVisibility(): void {

    this.visible.update(v => !v);

  }

}