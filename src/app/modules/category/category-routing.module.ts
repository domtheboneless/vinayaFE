import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemEditComponent } from './component/item-edit/item-edit.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: ItemEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
