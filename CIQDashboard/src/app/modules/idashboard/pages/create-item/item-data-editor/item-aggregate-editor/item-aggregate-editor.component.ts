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
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ItemOptionsEditorComponent } from 'src/app/modules/idashboard/components/item-options-editor/item-options-editor.component';
import { ObjectUtil } from 'src/app/components/util/object.util';

@Component({
  selector: 'item-aggregate-editor',
  templateUrl: './item-aggregate-editor.component.html',
  styleUrls: ['./item-aggregate-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ItemOptionsEditorComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemAggregateEditorComponent implements OnInit, ControlValueAccessor {

  data: any = {};
  @Input('data') set setData(data) {
    this.data = data;
    this.updateFields();
  }

  @Input() fields;
  @Input() filterOptions;

  @Output() dataChange = new EventEmitter<any>();
  @Output() fieldChange = new EventEmitter<any>();
  onFormChange: any = () => undefined;

  operators = ['add', 'sub', 'mul', 'div'];
  aggTypes = ['COUNT', 'DISTINCT_COUNT', 'SUM', 'AVG', 'CONSTANT', 'MIN', 'MAX']
  constructor() { }

  ngOnInit() {
  }
  get newFilterOptions() {
    return { name: 'myFilter', configs: [] };
  }
  onFiledSelected(field) {
    this.fieldChange.emit(field);
  }
  addFilter(data: any, filters) {
    filters.push(data);
  }
  setFilter(data: any, index, state) {
    data.active = state == true;
  }
  removeFilter(data: any, index, filters) {
    filters.splice(index, 1);
  }
  saveFilter(data: any, index, filters) {
    filters[index] = data;
  }

  private updateFields() {
    if (!this.data) {
      // to avoid angular view update error
      setTimeout(() => {
        this.dataChange.emit({ groups: [this.newGroup], name: 'aggregate' })
      }, 10)
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
    this.data.name = this.data.name || 'aggregate';
    this.dataChange.emit(this.data);
    this.onFormChange(this.data);
  }

  get newAggragate() {
    return {
      field: '', type: 'COUNT', operator: 'add', filters: []
    }
  }
  get newGroup() {
    return {
      name: 'group',
      aggregates: [this.newAggragate],
      operator: 'add'
    }
  }
  addField(index, array) {
    ObjectUtil.insert(array, this.newAggragate, index + 1);
  }
  addGroup(index, array) {
    ObjectUtil.insert(array, this.newGroup, index + 1);
  }
  remove(index, array) {
    array.splice(index, 1);
  }

}
