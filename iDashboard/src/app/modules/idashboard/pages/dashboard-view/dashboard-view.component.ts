import { Component, OnInit, Input, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { GridsterConfig, GridType, DisplayGrid } from 'angular-gridster2';
import { IDashboard } from '../../model/data.model';
import { jsPDF } from "jspdf";
import DOM_TO_IMAGE from "dom-to-image";

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

  exportAsPdf () {
  
  setTimeout(() => {
  document.getElementById("gridcharts").classList.add("no-scroll");
  const node = document.getElementById("gridcharts");
  let pdf = new jsPDF('p', 'mm', 'a4');
  //    html2canvas(content, { scrollX: 0, scrollY: 0}).then(canvas => {
  DOM_TO_IMAGE.toPng(node).then(dataUrl => {
  // Few necessary setting options  
  let imgWidth = 210;
  const imgHeight = 230;
  let position = 2;
  pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
  pdf.save('MYPdf.pdf');

  var element = document.getElementById("gridcharts");
  element.classList.remove("no-scroll");
  });

  }, 2000);
}

}
