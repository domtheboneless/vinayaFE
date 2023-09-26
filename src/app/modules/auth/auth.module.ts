import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from 'src/app/core/modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreService } from 'src/app/core/services/core/core.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class AuthModule {}
