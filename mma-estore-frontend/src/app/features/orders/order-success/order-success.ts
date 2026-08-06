import { ActivatedRoute } from '@angular/router';

export class OrderSuccessComponent {

  orderNumber = '';

  constructor(private route: ActivatedRoute) {

    this.orderNumber =
      this.route.snapshot.paramMap.get('orderNumber')!;
  }

}
