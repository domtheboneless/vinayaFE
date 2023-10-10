import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { ItemEditComponent } from './component/item-edit/item-edit.component';
import { MaterialModule } from 'src/app/core/modules/material.module';
import { ItemFormComponent } from './component/item-form/item-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateCategoryComponent } from './component/create-category/create-category.component';

@NgModule({
  declarations: [ItemEditComponent, ItemFormComponent, CreateCategoryComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class CategoryModule {}
