import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IGridConfig } from '../../../model/data.model';
import { getItemFields, clean } from '../../../services/idashboard-items.service';
import { UnSubscribable } from 'src/app/components/unsub';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'leap-sidebar-right',
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

  filterChartItemsBy;
  charts;
  filteredCharts;
  @Input('charts') set setCharts(charts) {
    this.charts = (charts || []).map(this.updateIcons.bind(this)).map(it => ({ ...it, group: it.sourceGroup }));
    this.setFilteredCharts();
  }
  formOptions;
  gridConfigForm: FormGroup;
  gridConfigParams = [{ name: 'rows', label: 'Rows' }, { name: 'columns', label: 'Columns' }];
  params = {
    options: []
  };
  constructor(
    private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit() {
    this.formOptions = this.formBuilder.group({
      options: [this.data && this.data.options || {}, [Validators.required]]
    });
  }
  getChartItemsFilter() {
    return this.getItemsFilter('filterChartItemsBy');
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
  getItemsFilter(searchBy) {
    const context = this;
    return (item: any) => !context[searchBy] ? true : item.name.includes(context[searchBy]);
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
    this.data.options = { ...(this.data.options || {}), ...value };
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
    if (projectId) { 
      this.router.navigate(['idashboard', projectId, 'edit-chart'], { queryParams });
    } else
      this.router.navigate(['edit-chart'], { relativeTo: this.route, queryParams });
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