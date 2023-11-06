import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from 'src/app/core/utils/pipe/capitalize.pipe';
import { TrimPipe } from 'src/app/core/utils/pipe/trim.pipe';

@NgModule({
  declarations: [CapitalizePipe, TrimPipe],
  imports: [CommonModule],
  exports: [CapitalizePipe, TrimPipe],
})
export class SharedModule {}
