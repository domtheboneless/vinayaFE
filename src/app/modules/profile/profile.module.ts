import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { UserComponent } from './user/user.component';
import { ProfileDescriptionUpdateComponent } from './component/profile-description-update/profile-description-update.component';
import { MaterialModule } from 'src/app/core/modules/material.module';
import { AppModule } from 'src/app/app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserComponent, ProfileDescriptionUpdateComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProfileModule {}
