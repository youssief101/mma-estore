import { Component, forwardRef, input, output } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quantity-selector.html',
  styleUrl: './quantity-selector.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuantitySelector),
      multi: true,
    },
  ],
})
export class QuantitySelector implements ControlValueAccessor {
  readonly min = input(1);

  readonly max = input(Number.MAX_SAFE_INTEGER);

  readonly step = input(1);

  readonly quantityChange = output<number>();

  value = 1;

  disabled = false;

  private onChange: (value: number) => void = () => {};

  private onTouched: () => void = () => {};

  writeValue(value: number | null): void {
    this.value = this.clamp(value ?? this.min());
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  increase(): void {
    if (this.disabled) {
      return;
    }

    this.setValue(this.value + this.step());
  }

  decrease(): void {
    if (this.disabled) {
      return;
    }

    this.setValue(this.value - this.step());
  }

  onInput(event: Event): void {
    if (this.disabled) {
      return;
    }

    const input = event.target as HTMLInputElement;

    if (input.value === '') {
      return;
    }

    const value = Number(input.value);

    if (Number.isNaN(value)) {
      return;
    }

    this.setValue(value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();

        this.increase();

        break;

      case 'ArrowDown':
        event.preventDefault();

        this.decrease();

        break;

      case 'Home':
        event.preventDefault();

        this.setValue(this.min());

        break;

      case 'End':
        event.preventDefault();

        this.setValue(this.max());

        break;
    }
  }

  markTouched(): void {
    this.onTouched();
  }

  private setValue(value: number): void {
    this.value = this.clamp(value);

    this.onChange(this.value);

    this.quantityChange.emit(this.value);

    this.onTouched();
  }

  private clamp(value: number): number {
    return Math.min(this.max(), Math.max(this.min(), value));
  }
}
