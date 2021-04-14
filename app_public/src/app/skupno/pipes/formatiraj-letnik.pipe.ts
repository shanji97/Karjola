import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatirajLetnik'
})
export class FormatirajLetnikPipe implements PipeTransform {

  transform(v: unknown, ...args: unknown[]): string {
    if (v === 1) return '1. letnik';
    if (v === 2) return '2. letnik';
    if (v === 3) return '3. letnik';
    return 'Ni v letniku';
  }

}
