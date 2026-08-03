import {
  Component,
  forwardRef,
  input
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './textarea.html',
  styleUrl: './textarea.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Textarea),
      multi: true
    }
  ]
})
export class Textarea
implements ControlValueAccessor {

  readonly placeholder =
    input('');

  readonly rows =
    input(5);

  readonly readonly =
    input(false);

  readonly resize =
    input<'none' | 'vertical' | 'horizontal' | 'both'>('vertical');

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

    const textarea =
      event.target as HTMLTextAreaElement;

    this.value = textarea.value;

    this.onChange(this.value);

  }

  markTouched(): void {

    this.onTouched();

  }

}