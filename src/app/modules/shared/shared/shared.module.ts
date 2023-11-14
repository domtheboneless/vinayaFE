import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from 'src/app/core/utils/pipe/capitalize.pipe';
import { TrimPipe } from 'src/app/core/utils/pipe/trim.pipe';
import { IntegerPipe } from 'src/app/core/utils/pipe/integer.pipe';
import { DecimalPipe } from 'src/app/core/utils/pipe/decimal.pipe';
@NgModule({
  declarations: [CapitalizePipe, TrimPipe, IntegerPipe, DecimalPipe],
  imports: [CommonModule],
  exports: [CapitalizePipe, TrimPipe, IntegerPipe, DecimalPipe],
})
export class SharedModule {}
