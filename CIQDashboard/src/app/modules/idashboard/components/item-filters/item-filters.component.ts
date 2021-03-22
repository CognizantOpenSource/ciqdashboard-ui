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
import { ViewChild } from '@angular/core';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ClrDropdownMenu } from '@clr/angular';
import { IFilterData, IFilterConfig } from '../../model/data.model';
import { datePeriodNames } from '../../services/filter-ops';
import { getType } from '../filter-dropdown/filter-dropdown.component';

@Component({
  selector: 'app-item-filters',
  templateUrl: './item-filters.component.html',
  styleUrls: ['./item-filters.component.scss']
})
export class ItemFiltersComponent implements OnInit {

  @Input() filters: IFilterData[] = [];

  options;
  @Input('options') set setOptions(options: any) {
    if (options && options.fields && options.typeMap) {
      options.types = {};
      options.fields.forEach(field => {
        options.types[field.name] = getType(field.type);
      });
    }
    this.options = options;
  }

  @Output() fieldChange = new EventEmitter<string>();
  @Output() filtersChange = new EventEmitter<any[]>();

  @ViewChild(ClrDropdownMenu, { static: false }) set datePicker(dp: any) {
    if (dp) {
      const element = dp.el.nativeElement;
      element.eventListeners().map(ev => element.removeEventListener('keydown', ev))
    }
  };
  open = false;
  filterForm: FormGroup;
  selectedFilter = -1;
  dropdownSide = 'bottom-left';

  datePeriods = datePeriodNames.map(name => ({ name, label: name.split('lastN')[1] }));

  constructor(private fb: FormBuilder) { }

  get newFilter() {
    return { name: 'myFilter', configs: [], active: true }
  }
  ngOnInit() {
    this.setSelectedFilter(this.newFilter);
  }
  hasActiveFilter(filters) {
    return filters && filters.some(f => f.active);
  }
  openFilter(trigger, event) {
    const rect = trigger.getBoundingClientRect();
    const dropDownEnd = rect.left + (24 * 18) + 10;
    if (dropDownEnd < window.innerWidth) {
      this.dropdownSide = 'bottom-left';
    } else {
      this.dropdownSide = 'bottom-right';
    }
    this.open = true;
  }

  onFilterSelect(index, filter) {
    if (this.selectedFilter == index) {
      filter.active = false;
      this.selectedFilter = -1;
      this.setSelectedFilter(this.newFilter);
    } else {
      filter.active = true;
      this.selectedFilter = index;
      this.setSelectedFilter(filter);
    }
    this.filtersChange.emit(this.filters);
  }
  onOperatorSelect(config: FormControl, op: string, field: string) {
    if (this.options.types[field] === 'date') {
      if (op && op.startsWith('this')) {
        config.get('value').setValue(0);
        config.get('maxValue').setValue('');
      }
      if (op === 'last') {
        config.get('value').setValue(1);
        config.get('period').setValue(datePeriodNames[0]);
      }
    }
  }
  setSelectedFilter(filter = {} as any) {
    let configs;
    if (filter.configs && filter.configs.length > 0) {
      configs = this.fb.array(filter.configs.map(c => this.createConfigGroup(c)));
    } else {
      configs = this.fb.array([this.createConfigGroup({} as IFilterConfig)]);
    }
    this.filterForm = this.fb.group({
      name: new FormControl(filter.name, Validators.required),
      configs,
      logicalOperator: new FormControl(filter.logicalOperator || 'AND', Validators.required),
    });
  }

  createConfigGroup(c: IFilterConfig): FormGroup {
    return this.fb.group({
      field: [c.field || '', Validators.required],
      op: [(datePeriodNames.includes(c.op) ? 'last' : (c.op || '')), Validators.required],
      value: [c.value, Validators.required],
      maxValue: [c.maxValue, Validators.required],
      period: [c.period || c.op, Validators.required],
    });
  }
  addConfig(index) {
    const config = this.filterForm.get('configs') as FormArray;
    config.controls.push(this.createConfigGroup({} as IFilterConfig));
  }
  removeConfig(index) {
    const config = this.filterForm.get('configs') as FormArray;
    config.controls.splice(index, 1);
  }
  onSave() {
    if (this.selectedFilter >= 0) {
      this.filters[this.selectedFilter] = this.getFormData();
    } else {
      this.filters.push(this.getFormData());
    }
    this.filtersChange.emit(this.filters);
  }
  onClone() {
    const cloned = this.getFormData();;
    cloned.name = cloned.name + '-copy';
    this.filters.push(cloned);
    this.filtersChange.emit(this.filters);
  }
  private processed(fd: IFilterData) {
    fd.configs.forEach(c => {
      if (c.op == 'last') {
        c.op = c.period;
      }
    });
    return fd;
  }
  getFormData(): IFilterData {
    return this.processed({
      ...this.filterForm.getRawValue()
    });
  }
  clear() {
    this.filters.splice(0, this.filters.length);
    this.filtersChange.emit(this.filters);
    this.open = false;
  }
  remove(index, filter) {
    this.filters.splice(index, 1);
    this.filtersChange.emit(this.filters);
  }
  reset() {
    this.filterForm.reset();
  }
  onFieldSelect(config: FormControl, value) {
    this.fieldChange.emit(value);
    config.get('value').setValue('');
    config.get('maxValue').setValue('');
  }
  updateDate(config: FormControl, event) {
    config.get('value').setValue(event.value);
    config.get('maxValue').setValue(event.maxValue);
  }

}
