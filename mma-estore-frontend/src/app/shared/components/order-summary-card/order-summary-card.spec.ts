import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSummaryCard } from './order-summary-card';

describe('OrderSummaryCard', () => {
  let component: OrderSummaryCard;
  let fixture: ComponentFixture<OrderSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSummaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSummaryCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
