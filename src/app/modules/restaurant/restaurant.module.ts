import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantRoutingModule } from './restaurant-routing.module';
import { SingleRestaurantComponent } from './component/single-restaurant/single-restaurant.component';
import { MaterialModule } from 'src/app/core/modules/material.module';
import { ItemDetailComponent } from '../category/component/item-detail/item-detail.component';

@NgModule({
  declarations: [SingleRestaurantComponent, ItemDetailComponent],
  imports: [CommonModule, RestaurantRoutingModule, MaterialModule],
})
export class RestaurantModule {}
