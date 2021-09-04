import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { Timestamp } from 'rxjs';

@Pipe({
  name: 'timeRelative'
})
export class TimeRelativePipe implements PipeTransform {

  transform(value:any): any {
    moment.locale('fr');
    console.log(value);
    var dat = new Date(value);
    console.log(dat)
    const time = moment(dat).fromNow();
    console.log(time);
    const newTime = time.split(' ');
    newTime.splice(0,1)
    newTime.push('restants')
    const lasTime = newTime.join(' ')
    console.log(lasTime)
    return lasTime;

  }

}
