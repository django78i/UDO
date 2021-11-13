import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { Timestamp } from 'rxjs';

@Pipe({
  name: 'timeRelative',
})
export class TimeRelativePipe implements PipeTransform {
  transform(value: any): any {
    moment.locale('fr');
    console.log(value)
    const time = moment(value.toDate()).fromNow();
    const newTime = time.split(' ');
    newTime.splice(0, 3);
    // newTime.push('restants');
    const lasTime = newTime.join(' ');
    return lasTime;
  }
}
