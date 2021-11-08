import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeChamp'
})
export class TimeChampPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
