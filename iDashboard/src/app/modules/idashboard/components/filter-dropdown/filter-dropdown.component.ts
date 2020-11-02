import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ClrDropdownMenu } from '@clr/angular';
import { IFilterData, IFilterConfig } from '../../model/data.model';
import { datePeriodNames } from '../../services/filter-ops';

@Component({
  selector: 'app-dash-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss']
})
export class FilterDropdownComponent implements OnInit {

  @Input() data: IFilterData = {} as any;

  @Input() edit = false;

  @ViewChild(ClrDropdownMenu, { static: false }) set datePicker(dp: any) {
    if (dp) {
      const element = dp.el.nativeElement;
      element.eventListeners().map(ev => element.removeEventListener('keydown', ev))
    }
  };
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

  @Output() save = new EventEmitter<IFilterData>();
  @Output() clone = new EventEmitter<IFilterData>();
  @Output() remove = new EventEmitter<void>();
  @Output() select = new EventEmitter<boolean>();

  @Output() fieldChange = new EventEmitter<string>();
  datePeriods = datePeriodNames.map(name => ({ name, label: name.split('lastN')[1] }));
  open = false;
  filterForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    let configs;
    if (this.data.configs && this.data.configs.length > 0) {
      configs = this.fb.array(this.data.configs.map(c => this.createConfigGroup(c)));
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
    const data = this.getFormData();
    this.data = { ...data };
    this.save.emit(data);
  }
  onClone() {
    const cloned = this.getFormData();;
    cloned.name = cloned.name + '-copy';
    this.clone.emit(cloned);
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
      ...this.data,
      ...this.filterForm.getRawValue()
    });
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
  onFieldSelect(config: FormControl, value) {
    this.fieldChange.emit(value);
    config.get('value').setValue('');
    config.get('maxValue').setValue('');
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
  updateDate(config: FormControl, event) {
    config.get('value').setValue(event.value);
    config.get('maxValue').setValue(event.maxValue);
  }
 
}
export function getType(type = 'string') {
  switch (type.toLowerCase()) {
    case 'integer':
    case 'int':
    case 'float':
    case 'double':
      return 'number';
    case 'date':
    case 'time':
      return 'date';
    case 'boolean':
      return 'boolean';
    default:
      return 'string';
  }
}