import { Directive, HostListener, ElementRef, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[appAutoResize]'
})
export class AutoResizeDirective implements AfterViewInit {

  @Input() ngModel: string;
  constructor(private el: ElementRef) {

  }

  @HostListener('keydown', ['$event', '$event.key'])
  onKeydown($event: KeyboardEvent, key: string): void {
    switch (key) {
      case 'Delete':
      case 'Backspace':
      case 'Enter':
      case 'Tab':
      case 'Escape':
        this.resize(); break;
      default:
        return;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.resize();
    }, 100);
  }
  private resize() {
    if (this.ngModel && this.ngModel !== '') {
      this.el.nativeElement.style.height = this.ngModel.split('\n', -1).length + 1 + 'rem';
    } else {
      this.el.nativeElement.style.height = this.el.nativeElement.scrollHeight - 12 + 'px';
    }
  }
}
