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
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import DOM_TO_IMAGE from "dom-to-image";
import { saveAs } from "file-saver";
import { ToastrService } from 'ngx-toastr';
import { ExportToCsv } from 'export-to-csv';
import { DashboardItemsService } from '../../services/ciqdashboard-items.service';
import { FilterableDashboardComponent } from '../../components/filterable-dash-component';
import { FilterOps } from '../../services/filter-ops';
import { omit } from 'lodash';
import { transFormData } from '../../services/transform-data';

/**
* DisplayChartComponent
* @author Cognizant
*/
export enum KEY_CODE {
  ENTER = 13
}

const options = {
  fieldSeparator: ',',
  filename: "test",
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: false,
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
  title: "",
  headers: []
};
@Component({
  selector: 'app-display-chart',
  templateUrl: './display-chart.component.html',
  styleUrls: ['./display-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DisplayChartComponent extends FilterableDashboardComponent<any> implements OnInit {

  chartType: string;
  @Input('chartType') set setChartType(type) {
    this.chartType = type;
    if (type === 'tree-map-chart') {
      this.isInteractive = true;
    }
  }

  itemData: any;
  itemColumns: any[];
  @Input('dashboardData') set setData(data) {
    this.itemData = data;
    this.doUpdateData(this.itemData, this.itemConfig);
  }
  itemConfig: any;
  @Input('dashboardConfig') set config(config) {
    this.itemConfig = config;
    this.doUpdateData(this.itemData, this.itemConfig);
  }
  @Input('chartTitle') chartTitle: any;

  isInteractive = false;
  isExporting = false;
  paths: any = [];
  item: any;
  @Input('item') set setItem(item) {
    this.item = item;
    this.checkAndUpdateDataTable();
  }
  @Output() filtersChange = new EventEmitter<any>();
  options = { filters: [], columns: [], valueMap: {} };
  rawItems: any[] = [];
  constructor(private toastr: ToastrService, private changeDetectRef: ChangeDetectorRef,
    spec: FilterOps, private dashItemService: DashboardItemsService) {
    super(spec);
  }

  ngOnInit() {
    super.setOptions(this.options);
    this.managed(this.dashItemService.items$).subscribe(items => this.rawItems = items);
  }
  private doUpdateData(data, options) {
    if (data && options) {
      const dataItem = { ...(this.item || { type: this.chartType }) };
      if (!this.isDataTable(dataItem)) {
        this.itemData = [...transFormData({ ...dataItem, data, options }).data];
      }
    }
    this.checkAndUpdateDataTable();
  }
  private checkAndUpdateDataTable() {
    if (this.item && this.isDataTable(this.item)) {
      this.itemColumns = this.getItemColums(this.item.projection, this.item);
    }
  }

  downloadPng(ele: any) {
    this.isExporting = true;
    setTimeout(() => {
      var node = ele;
      if (node != null) {
        DOM_TO_IMAGE.toPng(node).then(
          (dataUrl) => { this.isExporting = false; saveAs(dataUrl, (this.chartTitle || 'chart-image') + '.png') }
        ).catch((error) => { this.isExporting = false; this.toastr.error('error exporting image') });
      }
    }, 100);
  }
  downloadCSV() {
    const csvExporter = new ExportToCsv(options);
    csvExporter.options.filename = this.chartTitle || 'data-table';
    csvExporter.options.headers = [];
    var csvheading;
    this.itemColumns.forEach(h => csvExporter.options.headers.push(h.label));
    csvExporter.generateCsv(this.itemData.map(r => omit(r, ['_id'])));
  }

  selectedPath(item) {
    const index = this.paths.indexOf(item);
    this.paths.splice(index + 1);
    this.paths = [...this.paths];
  }
  clearPaths() {
    this.paths = [];
  }
  onFiledSelected(field) {
    if (!this.options.valueMap[field]) {
      const itemDetails = this.rawItems.find(it => it.id === this.item.id);
      this.dashItemService.getFieldValues(itemDetails.source, field).subscribe(values => {
        this.options.valueMap[field] = values;
      });
    }
  }
  updateFilterConfig() {
    const itemDetail = this.rawItems.find(it => it.id === this.item.id);
    if (itemDetail && itemDetail.source) {
      this.dashItemService.getSourceInfo(itemDetail.source).subscribe(info => {
        this.options.columns = info.fields.filter(f => f.name[0] !== '_').
          map(f => ({ ...f, label: f.label || f.name }));
        this.options.valueMap = this.options.valueMap || {};
        this.item.filters = this.item.filters || [];
        this.options.filters = this.item.filters;
        super.setOptions(this.options);
      });
    }
  }

  updateChartData() {
    const filters = (this.item.filters || []).filter(f => f.active);
    this.dashItemService.getItemData(this.item, filters).subscribe(item => {
      this.item.data = item.data;
      if (this.isDataTable(item)) {
        this.itemColumns = this.getItemColums(item.projection, this.item);
      }
      this.changeDetectRef.markForCheck();
    });
  }
  getItemColums(projections, dashItem) {
    if (projections && dashItem) {
      const columns = [];
      const colNames = dashItem.options && dashItem.options.header ?
        dashItem.options.header.split(',') : projections;
      colNames.forEach((label, i) => {
        columns.push({ label, name: projections[i] });
      });
      return columns;
    }
    return null;
  }

  isDataTable(item) {
    return item.type === 'table';
  }
}
