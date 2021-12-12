import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'timeChamp',
})
export class TimeChampPipe implements PipeTransform {
  transform(value: any): any {
    moment.locale('fr');
    console.log(value);
    console.log(typeof value);
    const time = moment(
      typeof value == 'string' ? value : value.toDate()
    ).fromNow();
    // const newTime = time.split(' ');
    // newTime.splice(0, 3);
    // // newTime.push('restants');
    // const lasTime = newTime.join(' ');
    return time;
  }
}
