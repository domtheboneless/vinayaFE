import { ElementRef } from '@angular/core';

export function findElementByText(
  element: ElementRef<HTMLElement>,
  text: string
): HTMLElement | null {
  const el = element.nativeElement as HTMLElement;
  const elements = Array.from(el.querySelectorAll('*'));

  for (const el of elements) {
    if (el.textContent?.trim() === text) {
      return el as HTMLElement;
    }
  }

  return null;
}
