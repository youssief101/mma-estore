import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute
} from '@angular/router';

import {
  ProductService
} from '../../../../../services/product.service';

import {
  Product
} from '../../../../../models/product.model';

@Component({
  selector: 'app-product-details',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './product-details.html',

  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {

  private route =
    inject(ActivatedRoute);

  private productService =
    inject(ProductService);

  product: Product | null = null;

  loading = true;

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      return;
    }

    this.productService
      .getProduct(id)
      .subscribe({
        next: (response) => {

          this.product =
            response.product;

          this.loading = false;
        },

        error: () => {
          this.loading = false;
        }
      });

  }

}
