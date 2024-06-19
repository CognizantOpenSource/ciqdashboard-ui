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
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { GridsterConfig, GridType, DisplayGrid } from 'angular-gridster2';
import { IDashboard } from '../../model/data.model';
import { DashboardItemsService } from '../../services/ciqdashboard-items.service';
/**
* DashboardViewComponent
* @author Cognizant
*/
@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./../../components/idashboard.scss', './dashboard-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardViewComponent implements OnInit {
  dashboard: IDashboard;
  items;
  config;
  page: number = 0;

  openFiltersPopup: boolean = false;
  lastFilterItem: any;
  lastFilterDashItem: any;
  @Input('page') set setPage(page) {
    this.page = page;
    this.update(this.page, this.dashboard);
  }
  @Input('dashboard') set setDashboard(dashboard) {
    this.dashboard = dashboard;
    this.update(this.page, this.dashboard);
  }
  @Input('update') set setItemUpdate(spec) {
   
  }

  private update(pageIndex, dashboard) {
    if (pageIndex >= 0 && dashboard) {
      const page = dashboard.pages[pageIndex] || dashboard.pages[0];
      this.config = this.getOptions(page.gridConfig);
      this.items = page.items;
    }
  }
  private getOptions(config): GridsterConfig {
    return {
      gridType: GridType.ScrollVertical,
      displayGrid: DisplayGrid.Always,
      disableScrollHorizontal: true,
      enableEmptyCellDrop: false,
      resizable: { enabled: false },
      draggable: { enabled: false },
      pushItems: false,
      swap: false,
      setGridSize: false,
      mobileBreakpoint: 600,
      minRows: config.rows,
      maxRows: config.rows,
      minCols: config.columns,
      maxCols: config.columns,
    }
  };
  activeItem = -1;
  constructor() {

  }

  ngOnInit() {

  }

}
