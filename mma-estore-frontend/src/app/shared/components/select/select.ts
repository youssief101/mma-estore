import {
  Component,
  forwardRef,
  input
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import { SelectOption } from '../../models/select-option.model';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './select.html',
  styleUrl: './select.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true
    }
  ]
})
export class Select
implements ControlValueAccessor {

  readonly options =
    input<SelectOption[]>([]);

  readonly placeholder =
    input('Select...');

  readonly disabledOption =
    input(true);

  value = '';

  disabled = false;

  private onChange: (value: string) => void =
    () => {};

  private onTouched: () => void =
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

    const select =
      event.target as HTMLSelectElement;

    this.value = select.value;

    this.onChange(this.value);

  }

  markTouched(): void {

    this.onTouched();

  }

}