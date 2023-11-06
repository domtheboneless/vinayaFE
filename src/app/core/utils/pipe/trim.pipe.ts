import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim',
})
export class TrimPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value; // Restituisci la stringa originale se è vuota
    return value.replaceAll(' ', '');
  }
}
