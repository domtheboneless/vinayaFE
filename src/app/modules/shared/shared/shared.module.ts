import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from 'src/app/core/utils/pipe/capitalize.pipe';

@NgModule({
  declarations: [CapitalizePipe],
  imports: [CommonModule],
  exports: [CapitalizePipe],
})
export class SharedModule {}
