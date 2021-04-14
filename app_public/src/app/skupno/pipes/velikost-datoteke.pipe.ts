import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'velikostDatoteke'
})
export class VelikostDatotekePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    return (Math.round((value / (1024**2)) * 100) / 100) + ' MB';
  }

}
