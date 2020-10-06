import { Directive, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { bufferTime, filter } from 'rxjs/operators';
import { UnSubscribable } from 'src/app/components/unsub';
@Directive({
  selector: '[appTrueClick]'
})
export class TrueClickDirective extends UnSubscribable {

  private clickStream = new Subject<MouseEvent>();
  public click$ = this.clickStream.asObservable();
  @Input() buffer = 1000;
  @Output() click1 = new EventEmitter<MouseEvent>();
  @Output() click2 = new EventEmitter<MouseEvent>();

  constructor() {
    super();
    this.managed(this.click$).pipe(bufferTime(this.buffer), filter(events => events.length > 0))
      .subscribe(events => {
        if (events.length >= 2) {
          this.click2.emit(events.pop());
        } else if (events.length === 1) {
          this.click1.emit(events.pop());
        }
      });
  }
  @HostListener('click', ['$event'])
  clickHandler(event: MouseEvent) {
    this.clickStream.next(event);
  }
}
