import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'casOddaje'
})
export class CasOddajePipe implements PipeTransform {

  transform(dateString: string, ...args: unknown[]): string {
    var date: Date = new Date(Date.parse(dateString));
    var now = new Date();

    var dnevi = Math.abs(Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) ) /(1000 * 60 * 60 * 24)));
    
    if (dnevi == 0)
      return 'Danes';
    else if (dnevi == 1)
      return 'Včeraj'
    else if (dnevi <= 30)
      return `Pred ${dnevi} dnevi`;
    else
      return 'Več kot mesec nazaj';
  }

}
