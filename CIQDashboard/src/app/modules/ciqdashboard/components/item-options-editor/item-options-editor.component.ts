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
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { suffledColors } from '../../services/items.data';

export function resetDisabledFieldsInOptions(options, disabled) {
  const changes = [];
  Object.keys(disabled).filter(f => disabled[f] && options[f] !== null && options[f] !== undefined).forEach(fieldToDisable => {
    delete options[fieldToDisable];
    changes.push(fieldToDisable);
  }); 
  return changes.length > 0;
}

@Component({
  selector: 'app-item-options-editor',
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
      // apply disabled options from saved item to disabled options
      Object.keys(this.data).filter((k: string) => k.endsWith('--disabled')).forEach(key => {
        this.disabled[key.split('--disabled')[0]] = this.data[key];
      });
      if (resetDisabledFieldsInOptions(this.data, this.disabled)) {
        this.emit(this.data);
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
    this.emit(this.data);
  }
  private emit(data) {
    this.onFormChange(data);
    this.dataChange.emit(data);
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
