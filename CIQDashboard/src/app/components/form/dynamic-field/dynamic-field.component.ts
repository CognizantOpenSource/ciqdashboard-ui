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
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroupDirective } from '@angular/forms';

export enum FieldType { 'text', 'multilineText', 'date', 'boolean', 'secretText', 'select',  'selectObject', 'multiSelect', 'inputLabel' }
export interface StageParams {
  readonly name: string;
  readonly type: FieldType;
  readonly label: string;
  readonly optional: boolean;
  readonly disabled?: boolean;
  readonly data?: Array<any>;
  readonly desc?: string;
  value?:any;
  readonly groupBy? : string;
}

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: DynamicFieldComponent,
    multi: true
  }]
})
export class DynamicFieldComponent implements OnInit, ControlValueAccessor {


  @Input() field: StageParams;
  @Input() value: string;
  @Input() bindValue = 'id';
  @Input() splitLine = true;
  @Input() search: any = [];

  @Output() valueChange = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();

  onChange: any = () => undefined;

  get types() {
    return FieldType;
  }
  writeValue(obj: any): void {

  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {

  }
  setDisabledState?(isDisabled: boolean): void {

  }

  isText(type: FieldType | string) {
    return type === FieldType.text || FieldType[type] === FieldType.text;
  }
  isTextArea(type: FieldType | string) {
    return type === FieldType.multilineText || FieldType[type] === FieldType.multilineText;
  }
  isPassword(type: FieldType | string) {
    return type === FieldType.secretText || FieldType[type] === FieldType.secretText;
  }
  isDate(type: FieldType | string) {
    return type === FieldType.date || FieldType[type] === FieldType.date;
  }
  isSelect(type: FieldType | string) {
    return type === FieldType.select || FieldType[type] === FieldType.select;
  }
  isSelectObject(type: FieldType | string) {
    return type === FieldType.selectObject || FieldType[type] === FieldType.selectObject;
  }
  isBoolean(type: FieldType | string) {
    return type === FieldType.boolean || FieldType[type] === FieldType.boolean;
  }
  isInputLabel(type: FieldType | string) {
    return type === FieldType.inputLabel || FieldType[type] === FieldType.inputLabel;
  }
  isMultiSelect(type: FieldType | string){
    return type === FieldType.multiSelect || FieldType[type] === FieldType.multiSelect;
  }
  constructor() { }

  ngOnInit() {
  }
  update(val: string) {
    let value: any = val;
    if (this.isTextArea(this.field.type) && this.splitLine) {
      value = val.split('\n');
    } else if (this.isBoolean(this.field.type)) {
      value = val || val === 'ON';
    }
    this.valueChange.emit(value);
    this.onChange(value);
  }
}
