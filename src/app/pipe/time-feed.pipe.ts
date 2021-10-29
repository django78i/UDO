import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'timeFeed',
})
export class TimeFeedPipe implements PipeTransform {
  transform(value) {
    console.log(value);
    const time = value;
    console.log(moment(time).fromNow());
    return moment(time).fromNow();
  }
}
