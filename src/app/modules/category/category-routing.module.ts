import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemEditComponent } from './component/item-edit/item-edit.component';
import { ItemGuard } from 'src/app/core/guards/item.guard';
import { AuthGuardService } from 'src/app/core/guards/auth-guard.service';

const routes: Routes = [
  {
    path: 'edit/:idItem',
    component: ItemEditComponent,
    canActivate: [AuthGuardService, ItemGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
