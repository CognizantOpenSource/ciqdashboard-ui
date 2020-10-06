import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'leap-item-options-editor',
  templateUrl: './item-options-editor.component.html',
  styleUrls: ['./item-options-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ItemOptionsEditorComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemOptionsEditorComponent implements OnInit, ControlValueAccessor {

  params: any[] = [];
  @Input('params') set setParams(list) {
    this.params = (list || []).map(p => ({ label: p.name, ...p }));
    this.updateFields();
  }
  data: any = {};
  @Input('data') set setData(data) {
    this.data = data || {};
    this.updateFields();
  }

  @Output() dataChange = new EventEmitter<any>();
  onFormChange: any = () => undefined;

  imgIcon;
  constructor() { }

  ngOnInit() {
  }

  private updateFields() {
    if (this.params && this.data) {
      this.params.filter(p => !this.data.hasOwnProperty(p.name)).forEach(p => {
        this.data[p.name] = null;
      });
    }
  }
  writeValue(obj: any): void {    
    this.data = obj || {};
    this.updateFields();
  }
  registerOnChange(fn: any): void {
    this.onFormChange = fn;
  }
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }
  onChange(param, value) {
    this.dataChange.emit(this.data);
    this.onFormChange(this.data);
  }
  onImageChange(param, value) {
    this.data[param.name] = value;
    this.onChange(param, value);
  }

  increasePadding(param) {
    this.data[param.name]+=10;
    this.onChange(param , 'true');
  }

  decreasePadding(param) {
    this.data[param.name] = (this.data[param.name]<= 0) ? 0 : this.data[param.name]-10;
    this.onChange(param , 'true');
  }

}
