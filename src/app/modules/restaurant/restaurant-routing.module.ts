import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleRestaurantComponent } from './component/single-restaurant/single-restaurant.component';

const routes: Routes = [{ path: '', component: SingleRestaurantComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantRoutingModule {}
