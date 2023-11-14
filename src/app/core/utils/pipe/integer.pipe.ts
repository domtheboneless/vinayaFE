import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'integer',
})
export class IntegerPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    return Math.floor(value);
  }
}
