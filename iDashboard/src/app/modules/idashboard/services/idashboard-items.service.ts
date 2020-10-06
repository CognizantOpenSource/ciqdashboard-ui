import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, from } from 'rxjs';
import { IDashBoardApiService } from './idashboard-api.service';
import { LocalStorage } from 'src/app/services/local-storage.service';
import { tap, map } from 'rxjs/operators';
import { createCachableResource } from './idashboard-project.service';
import { fieldTypes, itemTypes } from './items.data';
import { orderBy } from 'lodash';
import * as moment from 'moment';

interface ItemWizardEvent {
  type: 'created' | 'updated';
  template?: 'new';
  data: any;
}
@Injectable({
  providedIn: 'root'
})
export class DashboardItemsService {

  private _itemsSource = new ReplaySubject<any[]>(1);
  private _items$ = this._itemsSource.asObservable();

  private _itemsWizardSource = new ReplaySubject<ItemWizardEvent>(1);
  private _itemsWizardEvent$ = this._itemsWizardSource.asObservable();

  private cachableItemType = createCachableResource(this.db, 'dashboardItemTypes');
  private cachableDataSources = createCachableResource(this.db, 'dashboardDataSources');


  private cachableDashboardItem = createCachableResource(this.db, 'dashboardItem');
  constructor(
    private api: IDashBoardApiService, private db: LocalStorage) {

  }

  public loadItems() {
    this.getItems().subscribe(ls => this._itemsSource.next(ls), error => this._itemsSource.next([]));
  }
  public getItems() {
    return this.cachableDashboardItem('all', this.api.getDashboardsItems());
  }
  public get items$() {
    return this._items$;
  }
  public get itemsWizardEvent$() {
    return this._itemsWizardEvent$;
  }
  createItem(item) {
    return this.api.createItem(item).pipe(tap(data => {
      this._itemsWizardSource.next({ data, type: 'created' });
    }));
  }
  saveItem(item) {
    return this.api.putItem(item).pipe(tap(data => {
      this._itemsWizardSource.next({ data, type: 'updated' });
    }));
  }
  deleteItem(id) {
    return this.api.deleteItem(id).pipe(tap(it => this.loadItems()));
  }
  search(keywords: any): Observable<any[]> {
    return this.api.searchItem(keywords);
  }


  public getItem(id) {
    return this.api.getItem(id);
  }
  public getItemWithData(id) {
    return this.cachableDashboardItem(id, this.api.getItemData(id, []));
  }
  getItemTypes() {
    return this.cachableItemType('all', this.api.getItemTypes());
  }
  getDataSources() {
    return this.cachableDataSources('all', this.api.getDataSources());
  }
  getSourceInfo(source: any) {
    return this.cachableDataSources(source, this.api.getSourceInfo(source));
  }
  getFieldValues(source, field): Observable<any> {
    return this.cachableDataSources(`fields.${source}.${field}`, this.api.getFieldValues(source, field));
  }
  previewChartItem(item: any): Observable<any> {
    return this.api.previewItem(item).pipe(map(fixNullChartData));
  }
  getItemData(item: any, options = []): Observable<any> {
    return this.api.getItemData(item.id, options).pipe(map(fixNullChartData), this.transFormSeries, this.sortItemByDate);
  }
  private get transFormSeries() {
    return map((item: any) => {
      if (item && item.options && item.options.dateSeries) {
        item.data = transFormSeries(item.data, true);
      }
      return item;
    });
  }
  private get sortItemByDate() {
    return map((item: any) => {
      if (item.options && item.options.dateSeries)
        item.data = sortSeries(item.data, item.options && item.options.sortSeries);
      return item;
    });
  }

}
export function transFormSeries(data, dateSeries = false) {
  const toDate = (s): any => moment(s, ['ddd MMM DD  hh:mm:ss z YYYY']);
  data && data.forEach(e => {
    e.series = e.series && e.series.map(es => {
      if (dateSeries) {
        return { ...es, _name: es._name || es.name, name: es.name instanceof Date ? es.name : toDate(es.name).toDate() };
      } else {
        return { ...es, name: es._name || es.name };
      }
    });
  });
  return data;
}
export function sortSeries(data: any[], sortOpt = 'none') {
  if (sortOpt === 'asc' || sortOpt === 'desc') {
    const compareStr = (a, b) => a.name - b.name;
    data && data.forEach(e => {
      e.series.sort((a, b) => {
        return sortOpt === 'asc' ? compareStr(a, b) : compareStr(b, a);
      });
    });
  }
  return data;
}
export const fixNullChartData = (item) => {
  if (item.itemGroup == 'datachart' || !item.itemGroup) {
    item.data.forEach(e => {
      e.name = e.name || 'unknown';
    });
  }
  return item;
};
export function clean(val) {
  return val && val.deepOmitBy((e) => e === undefined || e === null || e === "");
}
export function getItemGroupBy(type) {
  const map = itemTypes.find(f => f.name == type);
  return map && map.groupBy;
}
export function getItemFields(type) {
  const map = itemTypes.find(f => f.name == type);
  const params = map && map.fields ? fieldTypes.filter(ft => map.fields.includes(ft.name)) : fieldTypes;
  return params;
}