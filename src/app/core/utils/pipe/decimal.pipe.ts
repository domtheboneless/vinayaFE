import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimal',
})
export class DecimalPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    const decimalArray = value.toString().split('.');

    if (decimalArray.length === 2) {
      const decimalPart = decimalArray[1];
      const formattedDecimal =
        decimalPart.length === 1 ? decimalPart + '0' : decimalPart;
      return ',' + formattedDecimal;
    } else if (decimalArray.length === 1) {
      return ',00';
    }

    return '';
  }
}
