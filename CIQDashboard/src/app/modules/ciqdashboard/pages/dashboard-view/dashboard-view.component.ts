import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { GridsterConfig, GridType, DisplayGrid } from 'angular-gridster2';
import { IDashboard } from '../../model/data.model';
import { DashboardItemsService } from '../../services/ciqdashboard-items.service';

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
