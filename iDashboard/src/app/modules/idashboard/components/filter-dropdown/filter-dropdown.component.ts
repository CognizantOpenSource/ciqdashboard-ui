import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { config } from 'process';
import { IFilterData, IFilterConfig } from '../../model/data.model';

@Component({
  selector: 'leap-dash-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss']
})
export class FilterDropdownComponent implements OnInit {

  @Input() data: IFilterData = {} as any;

  @Input() edit = false;

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

  @Output() save = new EventEmitter<IFilterData>();
  @Output() clone = new EventEmitter<IFilterData>();
  @Output() remove = new EventEmitter<void>();
  @Output() select = new EventEmitter<boolean>();

  @Output() fieldChange = new EventEmitter<string>();

  open = false;
  filterForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    let configs ;
    if (this.data.configs && this.data.configs.length > 0) {
      configs =  this.fb.array(this.data.configs.map(c => this.createConfigGroup(c)));
    } else {
      configs = this.fb.array([this.createConfigGroup({} as IFilterConfig)]);
    }
    this.filterForm = this.fb.group({
      name: new FormControl(this.data.name, Validators.required),
      configs,
      logicalOperator: new FormControl(this.data.logicalOperator || 'AND', Validators.required),
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
    const data = this.getFormData();
    this.data = { ...data };
    this.save.emit(data);
  }
  onClone() {
    const cloned = this.getFormData();;
    cloned.name = cloned.name + '-copy';
    this.clone.emit(cloned);
  }
  getFormData(): IFilterData {
    return {
      ...this.data,
      ...this.filterForm.getRawValue()
    }
  }
  onSelect() {
    if (this.data) {
      this.data.active = !this.data.active;
      this.select.emit(this.data.active);
    }
  }
  reset() {
    this.filterForm.reset();
  }
  onFieldSelect(config: FormControl,value ) {
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
