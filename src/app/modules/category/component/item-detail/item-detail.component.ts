import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core/core.service';
import { CategoryService } from '../../service/category.service';
import { Items } from 'src/app/core/models/Category.class';
import { Observable, of } from 'rxjs';
import { ItemEditComponent } from '../item-edit/item-edit.component';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<ItemDetailComponent>,
    private core: CoreService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) {}

  itemId = this.dialogData.item;
  item$: Observable<Items>;
  qta = 0;

  ngOnInit() {
    this.item$ = this.categoryService.getSingleItem(this.itemId);
    this.checkQta();
  }

  close() {
    this.dialogRef.close(false);
  }

  moreQta() {
    this.qta += 1;
  }

  lessQta() {
    if (this.qta > 0) {
      this.qta -= 1;
    }
  }

  async addToCart() {
    const item = await this.item$.toPromise();
    if (this.qta > 0 && item) {
      const totalEuro = item.price * this.qta;
      this.cartService.addItem(this.itemId, this.qta, totalEuro);
      this.dialogRef.close({ order: true });
    }
  }

  checkQta() {
    this.cartService.cartItems.forEach((item) => {
      if (item.itemId === this.itemId) {
        this.qta = item.quantity;
      }
    });
  }
}
