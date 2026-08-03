import {
  Component,
  forwardRef,
  input
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './switch.html',
  styleUrl: './switch.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Switch),
      multi: true
    }
  ]
})
export class Switch
implements ControlValueAccessor {

  readonly label =
    input('');

  checked = false;

  disabled = false;

  private onChange: (value: boolean) => void =
    () => {};

  private onTouched: () => void =
    () => {};

  writeValue(value: boolean | null): void {

    this.checked = value ?? false;

  }

  registerOnChange(fn: (value: boolean) => void): void {

    this.onChange = fn;

  }

  registerOnTouched(fn: () => void): void {

    this.onTouched = fn;

  }

  setDisabledState(isDisabled: boolean): void {

    this.disabled = isDisabled;

  }

  toggle(): void {

    if (this.disabled) {

      return;

    }

    this.checked = !this.checked;

    this.onChange(this.checked);

    this.onTouched();

  }

}