import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { OrderService, Order } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  orders: Order[] = [];
  selectedOrder: Order | null = null;
  searchOrderNum = '';
  loading = true;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const orderId = params['id'];
      if (orderId) {
        this.loadSingleOrder(orderId);
      } else {
        this.loadOrders();
      }
    });
  }

  loadOrders(): void {
    this.loading = true;
    this.selectedOrder = null;
    this.orderService.getUserOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.orders = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSingleOrder(id: string): void {
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.selectedOrder = order;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.selectedOrder = null;
        this.loading = false;
        this.toastService.error('Order not found');
        this.cdr.detectChanges();
      }
    });
  }

  searchOrder(): void {
    const num = this.searchOrderNum.trim();
    if (!num) return;
    this.router.navigate(['/orders', num]);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.toastService.success(`Copied code "${text}" to clipboard!`);
    });
  }

  getStatusStepIndex(status: string): number {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return 0;
      default: return 2;
    }
  }
}
