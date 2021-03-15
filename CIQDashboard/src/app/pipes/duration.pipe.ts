import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDuration'
})
export class AppDurationPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return this.duration(value,1000);
  }
  duration(duration: number, unit=1000): string {
    if(!duration){
      return '00s'
    }
    // convert  to seconds
    duration = Math.ceil(duration / unit);
    let hours: any = Math.floor(duration / 3600);
    let minutes: any = Math.floor((duration - (hours * 3600)) / 60);
    let seconds: any = duration - (hours * 3600) - (minutes * 60);

    let hourSeparator = 'h ';
    let minuteSeparator = 'm ';

    if (hours === 0) { hours = hourSeparator = ''; }
    if (minutes === 0) { minutes = minuteSeparator = ''; }

    if (seconds === 0) { seconds = '1s'; } else
        if (seconds < 10) { seconds = '0' + seconds + 's'; } else { seconds += 's'; }
    return hours + hourSeparator + minutes + minuteSeparator + seconds;
}


}
