import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value; // Restituisci la stringa originale se è vuota

    // Rendi maiuscola la prima lettera e mantieni le altre lettere in minuscolo
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
