import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiLine'
})
export class MultiLinePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value instanceof Array) {
      return (value as string[]).join('\n');
    }
    return value;
  }

}
