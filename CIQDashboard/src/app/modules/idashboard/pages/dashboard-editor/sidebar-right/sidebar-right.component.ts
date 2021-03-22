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
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { IGridConfig } from '../../../model/data.model';
import { getItemFields, clean } from '../../../services/idashboard-items.service';
import { UnSubscribable } from 'src/app/components/unsub';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./../../create-item/create-item.component.scss', './sidebar-right.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarRightComponent extends UnSubscribable implements OnInit {

  @Input() tab;
  data: any;
  @Input('data') set setData(data) {
    if (data && data.type) {
      this.params.options = getItemFields(data.type);
    }
    this.data = data;
    this.setFilteredCharts();
  }

  @Output() dataChange = new EventEmitter<any>();
  @Input() gridConfig: IGridConfig;
  @Output() gridConfigChange = new EventEmitter<IGridConfig>();
  @Output() itemSelect = new EventEmitter<any>();
  @Output() itemRemove = new EventEmitter<any>();
  @Output() itemEdit = new EventEmitter<any>();

  searchItemText;
  charts;
  filteredCharts;
  @Input('charts') set setCharts(charts) {
    this.charts = (charts || []).map(this.updateIcons.bind(this)).map(it => ({ ...it, group: it.sourceGroup }));
    this.setFilteredCharts();
  }

  gridConfigParams = [{ name: 'rows', label: 'Rows' }, { name: 'columns', label: 'Columns' }];
  params = {
    options: []
  };

  filterItemBy = (item) => (item.name || '') + (item.options && item.options.title || '')
  constructor(private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit() {

  }

  getItemGroupFilter() {
    const context = this;
    return (item: any) => (!context.data.itemGroup && item.itemGroup == 'datachart') || item.itemGroup == context.data.itemGroup;
  }
  setFilteredCharts() {
    if (this.data && this.charts) {
      this.filteredCharts = this.charts.filter(this.getItemGroupFilter());
    }
  }

  updateIcons(item) {
    return { ...item, iconType: getIconType(item.type) }
  }
  tabChange(view, state) {
    if (state) { this.tab = view; }
  }

  onGridConfigChange(param: any, value) {
    this.gridConfig[param.name] = value;
    this.gridConfigChange.emit(this.gridConfig);
  }
  onItemOptionsChange(value) {
    clean(value);
    this.data.options = value;
    this.dataChange.emit(this.data);
  }
  selectItem(item) {
    this.itemSelect.emit(item);
  }
  removeItem(item) {
    this.itemRemove.emit(item);
  }
  editItem(item) {
    this.itemEdit.emit(item);
    const { itemGroup, type, source } = item;
    const { projectId } = this.route.snapshot.params;
    const queryParams = {
      itemId: item.id, itemGroup, type, source, navs: ['Data Source', 'Item Type', 'Item Options']
      , returnUrl: this.router.routerState.snapshot.url
    }
    const component = itemGroup === 'dataimg' ? 'edit-img' : (itemGroup === 'datalabel' ? 'edit-label' : 'edit-chart');
    if (projectId) {
      this.router.navigate(['idashboard', projectId, component], { queryParams });
    } else
      this.router.navigate([component], { relativeTo: this.route, queryParams });
  }
}
function getIconType(type: string) {
  if (type.includes('bar')) {
    return 'bar-chart';
  }
  if (type.includes('line')) {
    return 'line-chart';
  }
  if (type.includes('map')) {
    return 'heat-map';
  }
  if (type.includes('area')) {
    return 'tick-chart';
  }
  if (type.includes('table')) {
    return 'table';
  }
  return 'pie-chart';
}