import { UnSubscribable } from 'src/app/components/unsub';
import { FilterOps } from '../services/filter-ops';
import { HostListener } from '@angular/core';
import { IFilterData, IFieldDef, IFilterOptions } from '../model/data.model';
import { FormControl, Validators } from '@angular/forms';
import { ObjectUtil } from 'src/app/components/util/object.util';

export class FilterableDashboardComponent<T> extends UnSubscribable {

  // tslint:disable-next-line:member-ordering
  options: any = {};
  // tslint:disable-next-line:member-ordering
  filterOptions = {
    fields: this.options.columns,
    typeMap: this.filterOps.actions,
    valueMap: this.options.valueMap || {}
  };
  get filters() {
    return this.options.filters;
  }
  set filters(filters: Array<IFilterData>) {
    this.options.filters = filters;
  }
  setColumns(columns: Array<IFieldDef>) {
    this.options.columns = columns;
    this.options.columnMap = this.options.columns.reduce((map, col) => ({ ...map, [col.name]: col }), {});
  }
  get columns() {
    return this.options.columns;
  }
  setOptions(options: IFilterOptions) {
    this.setColumns(options.columns);
    this.filters = options.filters;
    this.filterOptions = {
      fields: this.options.columns,
      typeMap: this.filterOps.actions,
      valueMap: this.options.valueMap || {}
    }
  }
  constructor(public filterOps: FilterOps) {
    super();
  }
  getType(column: IFieldDef) {
    const type = (column.type || 'string');
    return type === 'date' ? 'number' : type;
  }
  get newFilterOptions() {
    return { name: 'myFilter', configs: [] };
  }

  addFilter(data: any) {
     this.filters.push(data);
  }
  setFilter(data: any, index, state) {
    data.active = state == true;
  }
  removeFilter(data: any, index) {
    this.filters.splice(index, 1);
  }
  saveFilter(data: any, index) {
    this.filters[index] = data;
  }

  first(array) {
    return array && array[0];
  }
  last(array) {
    return array && array[0] && array[array.length - 1];
  }
  min(array, field) {
    return array && array[0] && array.reduce((s, e) =>
      s < e[field] ? s : e[field], array[0][field]);
  }
  max(array, field) {
    return array && array[0] && array.reduce((s, e) =>
      s > e[field] ? s : e[field], array[0][field]);
  }
  sum(array, field) {
    return array.reduce((s, e) => s + (e[field] || 0), 0)
  }
  count(array, field, value?) {
    if (typeof field === 'string') {
      return array.filter(e => e[field].toLowerCase().includes(value)).length || 0;
    }
    return array.filter(e => field(e)).length || 0;
  }

  toDate(time) {
    if (time instanceof Date) {
      return time;
    }
    return new Date(time);
  }
  byStartTime(a: any, b: any) {
    a = new Date(a.startTime).getTime();
    b = new Date(b.startTime).getTime();
    return a - b;
  }
  add(index, controls :any[] , ...args) {
    if (index == controls.length - 1) {
      controls.push(new FormControl(''));
    } else
      ObjectUtil.insert(controls, new FormControl('' , Validators.minLength(1)), index + 1);
  }
  remove(index, controls) {
    controls.splice(index, 1);
  }
}
