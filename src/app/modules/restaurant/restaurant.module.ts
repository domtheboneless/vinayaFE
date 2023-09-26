import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantRoutingModule } from './restaurant-routing.module';
import { SingleRestaurantComponent } from './component/single-restaurant/single-restaurant.component';


@NgModule({
  declarations: [
    SingleRestaurantComponent
  ],
  imports: [
    CommonModule,
    RestaurantRoutingModule
  ]
})
export class RestaurantModule { }
