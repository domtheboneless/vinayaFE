import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantRoutingModule } from './restaurant-routing.module';
import { SingleRestaurantComponent } from './component/single-restaurant/single-restaurant.component';
import { MaterialModule } from 'src/app/core/modules/material.module';
import { ItemDetailComponent } from '../category/component/item-detail/item-detail.component';
import { SharedModule } from '../shared/shared/shared.module';
import { CategoryExpansionPanelComponent } from './component/category-expansion-panel/category-expansion-panel.component';

@NgModule({
  declarations: [SingleRestaurantComponent, ItemDetailComponent, CategoryExpansionPanelComponent],
  imports: [
    CommonModule,
    RestaurantRoutingModule,
    MaterialModule,
    SharedModule,
  ],
})
export class RestaurantModule {}
