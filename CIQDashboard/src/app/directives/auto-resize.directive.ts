// © [2021] Cognizant. All rights reserved.
 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
 
//     http://www.apache.org/licenses/LICENSE-2.0
 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
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
