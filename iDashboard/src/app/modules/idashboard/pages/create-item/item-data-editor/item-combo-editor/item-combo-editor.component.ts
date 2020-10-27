import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ObjectUtil } from 'src/app/components/util/object.util';

@Component({
  selector: 'item-combo-editor',
  templateUrl: './item-combo-editor.component.html',
  styleUrls: ['./../item-aggregate-editor/item-aggregate-editor.component.scss', './item-combo-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ItemComboEditorComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComboEditorComponent implements OnInit, ControlValueAccessor {

  data: any = {};
  @Input('data') set setData(data) {
    this.data = data;
    this.updateFields();
  } 
  configs;
  @Input('configs') set setConfig(configs){
    this.configs = configs;
    this.updateFields();
  }
  @Input() fields;
  @Input() filterOptions;

  @Output() dataChange = new EventEmitter<any>();
  @Output() fieldChange = new EventEmitter<any>();
  onFormChange: any = () => undefined;
  groups: any[];
  groupState = { 0: true, 1: true } as any;

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
      // to avoid anular view update error
      setTimeout(() => {
        this.dataChange.emit({ group1: this.newGroup, group2: this.newGroup })
      }, 10)
    } else {
      if (this.configs) {
        if (!this.data[this.configs[0].type]) this.data[this.configs[0].type] = this.data.group1 || this.newGroup;
        if (!this.data[this.configs[1].type]) this.data[this.configs[1].type] = this.data.group2 || this.newGroup;
       delete  this.data.group1;
       delete  this.data.group2;
      }
      this.groups = Object.keys(this.data);
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

  onChange() { 
    this.groups.forEach(gn => this.data[gn].type = gn);
    this.dataChange.emit(this.data);
    this.onFormChange(this.data);
  }
  get newGroup() {
    return { filters: [], groupBy: [] }
  }
  remove(index, array) {
    array.splice(index, 1);
  }

}
