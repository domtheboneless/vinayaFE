import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Items } from 'src/app/core/models/Category.class';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = [];
  cartItems$ = new BehaviorSubject([]);

  constructor() {}

  addItem(item: string, qta: number, tottotalEuroOrderItem: number) {
    let itemToAdd = {
      itemId: item,
      quantity: qta,
      totalEuro: tottotalEuroOrderItem,
    };
    const exist = this.cartItems.find((itemCart) => {
      if (itemCart.itemId === item) {
        itemCart.quantity = qta;
        itemCart.totalEuro = tottotalEuroOrderItem;
      }
      return itemCart.itemId === item;
    });

    if (!exist) {
      console.log('aggiungo prodotto');
      this.cartItems.push(itemToAdd);
      console.log(this.cartItems);
    }
    this.cartItems$.next(this.cartItems);
  }
}
