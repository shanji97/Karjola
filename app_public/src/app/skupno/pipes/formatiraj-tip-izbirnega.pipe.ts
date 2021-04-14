import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatirajTipIzbirnega'
})
export class FormatirajTipIzbirnegaPipe implements PipeTransform {

  transform(v: unknown, ...args: unknown[]): string {
    if (v === 1) return 'Splošni izbirni predmet';
    if (v === 2) return 'Strokovni izbirni predmet';
    return 'Ni izbirni predmet'
  }

}
