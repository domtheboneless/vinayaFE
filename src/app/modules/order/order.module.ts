import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckOrderDialogComponent } from './components/check-order-dialog/check-order-dialog.component';
import { MaterialModule } from 'src/app/core/modules/material.module';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
  declarations: [CheckOrderDialogComponent],
  imports: [CommonModule, MaterialModule, SharedModule],
})
export class OrderModule {}
