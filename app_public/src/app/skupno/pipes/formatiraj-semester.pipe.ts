import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatirajSemester'
})
export class FormatirajSemesterPipe implements PipeTransform {

  transform(v: unknown, ...args: unknown[]): string {
    if (v === 1) return 'Zimski semester';
    if (v === 2) return 'Poletni semester';
    return 'Napaka';
  }

}
