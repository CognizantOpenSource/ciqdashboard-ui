import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { suffledColors } from '../../services/items.data';

export function resetDisabledFieldsInOptions(options, disabled) {
  let changed = false;
  Object.keys(disabled).filter(f => disabled[f]).forEach(fieldToDisable => {
    delete options[fieldToDisable];
    changed = true;
  });
  return changed;
}

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
  disabled: any = {};
  @Input('disabledOptions') set setDisabled(disabled: Map<string, boolean>) {
    if (disabled) {
      this.disabled = disabled;
      this.updateDisabledFields();
    }
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
      
    this.data.colors = this.data.colors && this.data.colors.length && this.data.colors || suffledColors().join(',');
    }
    this.updateDisabledFields();
  }
  private updateDisabledFields() {

    if (this.data && this.disabled && Object.keys(this.data).some(k => this.data[k] !== null)) {
      if (resetDisabledFieldsInOptions(this.data, this.disabled)) {
        this.onFormChange(this.data);
        this.dataChange.emit(this.data);
      }
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
    this.onFormChange(this.data);
    this.dataChange.emit(this.data);
  }

  onImageChange(param, value) {
    this.data[param.name] = value;
    this.onChange(param, value);
  }

  increasePadding(param) {
    this.data[param.name] += 10;
    this.onChange(param, 'true');
  }

  decreasePadding(param) {
    this.data[param.name] = (this.data[param.name] <= 0) ? 0 : this.data[param.name] - 10;
    this.onChange(param, 'true');
  }

}
