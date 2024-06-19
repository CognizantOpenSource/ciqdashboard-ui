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
import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, from } from 'rxjs';
import { IDashBoardApiService } from './ciqdashboard-api.service';
import { LocalStorage } from 'src/app/services/local-storage.service';
import { tap, map, distinct } from 'rxjs/operators';
import { createCachableResource } from './ciqdashboard-project.service';
import { getItemFieldsConfig, getItemGroupByConfig, getItemAggregateConfig, getItemMetricConfig } from './items.data';
import { isObject, isArray, map as _map, flow, omitBy, mapValues } from 'lodash';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { UnSubscribable } from 'src/app/components/unsub';
import { ActivatedRoute } from '@angular/router';
/**
* DashboardItemsService
* @author Cognizant
*/
export function deepOmitBy(root, func) {
  if (!func || typeof func !== 'function') {
    throw new Error('requried function(argument) for omit check');
  }
  const rFn = v => deepOmitBy(v, func);
  return isObject(root)
    ? isArray(root)
      ? _map(root, rFn)
      : flow(obj => omitBy(obj, func), obj => mapValues(obj, rFn))(root)
    : root;
}
interface ItemWizardEvent {
  type: 'created' | 'updated';
  template?: 'new';
  data: any;
}
@Injectable({
  providedIn: 'root'
})
export class DashboardItemsService extends UnSubscribable {

  private _itemsSource = new ReplaySubject<any[]>(1);
  private _items$ = this._itemsSource.asObservable();

  private _itemsWizardSource = new ReplaySubject<ItemWizardEvent>(1);
  private _itemsWizardEvent$ = this._itemsWizardSource.asObservable();

  private cachableItemType = createCachableResource(this.db, 'dashboardItemTypes');
  private cachableDataSources = createCachableResource(this.db, 'dashboardDataSources');

  private category;
  private cachableDashboardItem = createCachableResource(this.db, 'dashboardItem');
  constructor(
    private api: IDashBoardApiService, private db: LocalStorage, private http: HttpClient,
    private route: ActivatedRoute) {
    super();
    /* 
  setTimeout(() => {
    this.loadItems(this.category);
  }, 50); */
    // setTimeout(() => {
    this.managed(this.route.queryParams).pipe(map(p => {
      //console.log(p);
      return p.category
    }), distinct()).subscribe(category => {
      //console.log('category: ' + category);
      var categoryType = '';
      switch (category) {
        case 'project': {
          categoryType = "PRJ";
          break;
        }
        case 'lob': {
          categoryType = "LOB";
          break;
        }
        case 'org': {
          categoryType = "ORG";
          break;
        }
        default: {
          categoryType = "";
          break;
        }
      }
      this.category = categoryType;
      this.loadItems(this.category);
    });
    // }, 50);

  }

  ngOnInit() {
    /* this.managed(this.route.queryParams).pipe(map(p => {
      //console.log(p);
      return p.category
    }), distinct()).subscribe(category => {
      //console.log('category: ' + category);
      var categoryType = '';
      switch (category) {
        case 'project': {
          categoryType = "PRJ";
          break;
        }
        case 'lob': {
          categoryType = "LOB";
          break;
        }
        case 'org': {
          categoryType = "ORG";
          break;
        }
        default: {
          categoryType = "";
          break;
        }
      }
      this.category = categoryType;
      // this.loadItems(this.category);
    }); */

  }
  public loadItems(category) {
    this.getItems(category).subscribe(ls => this._itemsSource.next(ls), error => this._itemsSource.next([]));
  }
  public getItems(category) {
    return this.cachableDashboardItem('all', this.api.getDashboardsItems(category));
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
    return this.api.deleteItem(id).pipe(tap(it => this.loadItems(this.category)));
  }
  search(keywords: any): Observable<any[]> {
    return this.api.searchItem(keywords);
  }

  public getItem(id) {
    return this.api.getItem(id);
  }
  public getItemWithData(id, category, categoryID) {
    return this.cachableDashboardItem(id, this.api.getItemData(id, [], undefined, undefined, category, categoryID));
  }
  getItemTypes() {
    return this.cachableItemType('all', this.api.getItemTypes());
  }
  getDataSources() {
    return this.cachableDataSources('all', this.api.getDataSources());
  }
  getSourceInfo(source: any) {
    return this.cachableDataSources(source, this.api.getSourceInfo(source)).pipe(map(src => {
      (src.fields as any[]).sort((a, b) => a.name.localeCompare(b.name));
      return src;
    }));
  }
  getFieldValues(source, field): Observable<any> {
    return this.cachableDataSources(`fields.${source}.${field}`, this.api.getFieldValues(source, field));
  }
  previewChartItem(item: any): Observable<any> {
    delete item._data;
    return this.api.previewItem(item).pipe(map(fixNullChartData));
  }
  getItemData(item: any, options = [],pageId:any,dashboardId?:any,dashboardName?: any, projectName?: any, category?: any, id?: any): Observable<any> {
    delete item._data;
    return this.api.getItemData(item.id, options,pageId,dashboardId,dashboardName, projectName, category, id).pipe(map(fixNullChartData), map(sortNonSeries));
  }
  getdirectchartdata(item: any,options = [],dashboardId?:any,dashboardName?: any, projectName?: any, category?: any, id?: any): Observable<any> {
    delete item._data;
    return this.api.getdirectchartData(item.id,options,dashboardId,dashboardName, projectName, category, id).pipe(map(fixNullChartData), map(sortNonSeries));
  }
  getMetricsData(dashboardName, projectName, itemId) {
    return this.api.getMetricsData(dashboardName, projectName, itemId);
  }
}

export function sortNonSeries(item) {
  const sortData = (data) => {
    if (data && data instanceof Array) {
      data.sort((a, b) => a.name && a.name.localeCompare(b.name));
      data.forEach(d => sortData(d.children));
    }
  };
  if (!item.data.some(d => d.series)) {
    sortData(item.data);
  }
  return item;
}
export const fixNullChartData = (item) => {
  const fixNullName = (array, name) => {
    array && array.forEach(e => {
      if (!e.name && e.name !== 0) {
        e.name = name;
      }
      if (e.series === null) {
        delete e.series;
      }
      if (e.children == null) {
        delete e.children;
      }
      if (e.value === 0 && e.series) {
        e.value = e.series.reduce((a, e) => a + e.value, 0)
      }
      fixNullName(e.children, name);
      fixNullName(e.series, name);
    });
  };
  if (item.itemGroup == 'datachart' || !item.itemGroup) {
    fixNullName(item.data, 'unknown');
  }
  return item;
};
export function clean(val) {
  return val && deepOmitBy(val, (e) => e === undefined || e === null || e === "");
}
export function getItemGroupBy(type) {
  return getItemGroupByConfig(type);
}
export function getItemAggregate(type) {
  return getItemAggregateConfig(type);
}
export function getItemFields(type) {
  return getItemFieldsConfig(type);
}
export function getItemMetric(type) {
  return getItemMetricConfig(type);
}
