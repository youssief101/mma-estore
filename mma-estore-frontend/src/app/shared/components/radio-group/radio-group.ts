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

import { SelectOption } from '../../../core/models/select-option.model';

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './radio-group.html',
  styleUrl: './radio-group.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroup),
      multi: true
    }
  ]
})
export class RadioGroup
implements ControlValueAccessor {

  readonly options =
    input<SelectOption[]>([]);

  readonly name =
    input('radio-group');

  readonly direction =
    input<'vertical' | 'horizontal'>('vertical');

  value: string | number | null = null;

  disabled = false;

  private onChange: (value: string | number) => void =
    () => {};

  private onTouched: () => void =
    () => {};

writeValue(value: string | number | null): void {

    this.value = value;

}

  registerOnChange(
      fn: (value: string | number) => void
  ): void {

    this.onChange = fn;

  }

  registerOnTouched(fn: () => void): void {

    this.onTouched = fn;

  }

  setDisabledState(isDisabled: boolean): void {

    this.disabled = isDisabled;

  }

  select(value: string | number): void {

    if (this.disabled) {

      return;

    }

    this.value = value;

    this.onChange(value);

    this.onTouched();

  }

}