import { Directive, HostListener, ElementRef, Output, Input, EventEmitter, Renderer2 } from '@angular/core';

const ENTER = 'Enter';
const ESCAPE = 'Escape';
const BACKSPACE = 'Backspace';
const DELETE = 'Delete';

@Directive({
  selector: '[appEditable]'
})
export class EditableDirective {

  @Output()
  textChange = new EventEmitter<string>();
  @Output()
  templateChange = new EventEmitter<string>();

  private _text: string;
  @Input() set text(val: string) {
    this._text = val;
    this.el.nativeElement.innerText = val;
  }
  @Input() template: string;
  @Input() multiLine = false;
  @Input() charLength = 1000;

  private gClickListener: any;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    renderer.addClass(el.nativeElement, 'is-editable');
  }
  @HostListener('dblclick', ['$event'])
  activate($event: MouseEvent) {
    this.enableEditing();
    $event.preventDefault();
  }

  @HostListener('blur', ['$event.target.innerText'])
  onBlur(text: string = '') {
    if (this.template) {
      this.templateChange.emit(text);
    } else {
      this.textChange.emit(text);
    }
    this.cancelEditing();
  }

  @HostListener('keydown', ['$event', '$event.key'])
  onKeydown($event: KeyboardEvent, key: string): void {
    if (key === ESCAPE || (key === ENTER && !(this.multiLine && $event.shiftKey)) ||
      (this.el.nativeElement.innerText.length > this.charLength - 1 && key !== BACKSPACE && key !== DELETE)) {
      this.cancelEditing();
      $event.preventDefault();
    }
  }
  @HostListener('focusout', ['$event'])
  onFocusLost($event: FocusEvent) {
    this.cancelEditing();
  }
  @HostListener('mousedown', ['$event'])
  onClick($event: MouseEvent) {
    if (this.template) {
      const x = $event.pageX - this.el.nativeElement.getBoundingClientRect().x;
      const per = x / this.el.nativeElement.getBoundingClientRect().width;
      const pos = this.el.nativeElement.innerText.length * per;
      setCaretPosition(this.el.nativeElement, Math.ceil(pos));
    }
  }
  onClickOutSide($event: MouseEvent) {
    if (this.el.nativeElement.contentEditable && this.el.nativeElement !== $event.target) {
      this.cancelEditing();
    }
  }
  cancelEditing(): void {
    this.el.nativeElement.contentEditable = 'false';
    this.renderer.removeClass(this.el.nativeElement, 'is-editing');
    this.removeListeners();
    if (this.template) {
      this.el.nativeElement.innerText = this._text;
    }
  }
  enableEditing(): void {
    const element = this.el.nativeElement;
    if (this.template) {
      element.innerText = this.template;
    }
    element.contentEditable = 'true';
    element.focus();
    this.renderer.addClass(element, 'is-editing');
    this.gClickListener = this.renderer.listen('document', 'click', this.onClickOutSide.bind(this));
  }
  removeListeners() {
    if (this.gClickListener) {
      this.gClickListener();
    }
  }
  ngOnDestroy() {
    this.removeListeners();
  }

}
function setCaretPosition(node, position) {
  node.focus();
  const range = document.createRange();
  range.setStart(node.firstChild, position);
  range.setEnd(node.firstChild, position);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
}
