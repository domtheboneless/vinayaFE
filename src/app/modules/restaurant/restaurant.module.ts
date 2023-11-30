import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { SingleRestaurantComponent } from './component/single-restaurant/single-restaurant.component';
import { MaterialModule } from 'src/app/core/modules/material.module';
import { ItemDetailComponent } from '../category/component/item-detail/item-detail.component';
import { SharedModule } from '../shared/shared/shared.module';
import { CategoryExpansionPanelComponent } from './component/category-expansion-panel/category-expansion-panel.component';
import { EditRestaurantComponent } from './component/edit-restaurant/edit-restaurant.component';
import { RestaurantFormComponent } from './component/restaurant-form/restaurant-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { QrCodeDialogComponent } from './component/qr-code-dialog/qr-code-dialog.component';
import { RestaurantHeaderCoverLogoComponent } from './component/restaurant-header-cover-logo/restaurant-header-cover-logo.component';
import { MoreVertBtnComponent } from './component/more-vert-btn/more-vert-btn.component';

@NgModule({
  declarations: [
    RestaurantHeaderCoverLogoComponent,
    SingleRestaurantComponent,
    ItemDetailComponent,
    CategoryExpansionPanelComponent,
    EditRestaurantComponent,
    RestaurantFormComponent,
    QrCodeDialogComponent,
    MoreVertBtnComponent,
  ],
  imports: [
    CommonModule,
    RestaurantRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    QRCodeModule,
  ],
})
export class RestaurantModule {}
