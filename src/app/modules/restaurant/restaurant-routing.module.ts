import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleRestaurantComponent } from './component/single-restaurant/single-restaurant.component';
import { EditRestaurantComponent } from './component/edit-restaurant/edit-restaurant.component';
import { AuthGuardService } from 'src/app/core/guards/auth-guard.service';
import { RestaurantHolderGuardService } from 'src/app/core/guards/restaurant-holder.guard';

const routes: Routes = [
  { path: ':id', component: SingleRestaurantComponent },
  {
    path: 'edit/:id',
    canActivate: [AuthGuardService, RestaurantHolderGuardService],
    component: EditRestaurantComponent,
  },
  {
    path: 'manager/new',
    canActivate: [AuthGuardService],
    component: EditRestaurantComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantRoutingModule {}
