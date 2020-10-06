import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { IFilterData, IFilterConfig } from '../../model/data.model';

@Component({
  selector: 'leap-item-filters',
  templateUrl: './item-filters.component.html',
  styleUrls: ['./item-filters.component.scss']
})
export class ItemFiltersComponent implements OnInit {

  @Input() filters: IFilterData[] = [];

  options;
  @Input('options') set setOptions(options: any) {
    if (options && options.fields && options.typeMap) {
      options.actions = {};
      options.types = {};
      options.fields.forEach(field => {
        field.actions = this.getActions(field.type, options.typeMap);
        options.actions[field.name] = field.actions;
        options.types[field.name] = field.type;
      });
    }
    this.options = options;
  }

  @Output() fieldChange = new EventEmitter<string>();
  @Output() filtersChange = new EventEmitter<any[]>();

  open = false;
  filterForm: FormGroup;
  selectedFilter = -1;
  dropdownSide = 'bottom-left';

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
  openFilter(trigger) {
    // TODO : fix transparent dropdown issue
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
  setSelectedFilter(filter = {} as any) {
    let configs ;
    if (filter.configs && filter.configs.length > 0) {
      configs =  this.fb.array(filter.configs.map(c => this.createConfigGroup(c)));
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
      op: [c.op || '', Validators.required],
      value: [c.value, Validators.required],
      maxValue: [c.maxValue, Validators.required],
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
  getFormData(): IFilterData {
    return {
      ...this.filterForm.getRawValue()
    }
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
  private getActions(type = 'string', map) {
    switch (type.toLowerCase()) {
      case 'integer':
      case 'int':
      case 'float':
      case 'double':
        return map.number;
      case 'date':
      case 'time':
        return map.date;
      case 'boolean':
        return map.boolean;
      default:
        return map.string;
    }
  }
}
