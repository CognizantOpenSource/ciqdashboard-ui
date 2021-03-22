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
import { Component, OnInit } from '@angular/core';
import { IDashBoard } from '../dashboard-home/idashboard';
import { ActivatedRoute, Router } from '@angular/router';
import { UserConfigService } from '../../services/user-config.service';
import { DashboardItemsService } from '../../services/ciqdashboard-items.service';
import { DashboardService } from '../../services/ciqdashboard.service';
import { ExportAsService } from 'ngx-export-as';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { DashboardProjectService } from '../../services/ciqdashboard-project.service';
import { parseApiError } from 'src/app/components/util/error.util';
/**
* SearchChartComponent
* @author Cognizant
*/
@Component({
  templateUrl: './search-chart.component.html',
  styleUrls: ['./../../components/idashboard.scss', './search-chart.component.scss']
})
export class SearchChartComponent extends IDashBoard implements OnInit {


  dashboard;
  activePage;
  filterDataby;
  allItems;
  showSaveModal = false;
  projectId;
  dashboardName;
  projects: any[];
  private readonly maxResults = 10;
  private readonly itemsPerRow = 2;
  private readonly gridCols = 12;
  private readonly itemCols = this.gridCols / this.itemsPerRow;
  private readonly itemRows = 3;

  private readonly getGrixX = (index) => [...Array(this.itemCols - 1).keys()][index % this.itemsPerRow] * this.itemCols;
  private readonly getGridY = (index) => (Math.floor(index / this.itemsPerRow) * this.itemRows);
  lastSearch: any;

  constructor(
    private route: ActivatedRoute, private router: Router, private config: UserConfigService,
    dashItemService: DashboardItemsService, private location: Location, private projectsService: DashboardProjectService,
    private dashboardService: DashboardService, private exportAsService: ExportAsService, private toastr: ToastrService
  ) {
    super(dashItemService);
  }


  ngOnInit() {
    this.dashItemService.loadItems();
    this.managed(this.dashItemService.items$).subscribe(items => this.allItems = items);
    this.projectsService.loadProjects();
    this.managed(this.projectsService.projects$).subscribe(projects => this.projects = projects);
  }
  toGridItem(item, index) {
    const it = {
      ...item,
      rows: this.itemRows, cols: this.itemCols,
      x: this.getGrixX(index),
      y: this.getGridY(index),
      index,
    }
    return it;
  }
  updateSearchKeyword(keyword) {
    this.dashboard = null;
    if (!this.allItems || this.lastSearch == keyword || (!keyword || keyword === '')) {
      this.lastSearch = null;
    } else {
      this.lastSearch = keyword;
      this.searchItems(keyword);
    }
  }
  searchItems(keywords) {
    this.dashItemService.search(keywords).subscribe(items => {
      items = items.slice(0, Math.min(items.length, this.maxResults));
      const reqRows = (Math.ceil(Math.max(items.length, 4) / this.itemsPerRow) * 3);
      const page = {
        name: keywords,
        gridConfig: {
          rows: reqRows,
          columns: this.gridCols,
        },
        items: items.map((e, i) => this.toGridItem(e, i)),
        active: true
      }
      this.dashboard = {
        pages: [page]
      }
      this.activePage = 0;
      this.updateDashBoardData(this.dashboard);
    });
  }
  saveDashboard() {
    const projectName = this.projects.find(p => p.id == this.projectId).name;
    this.dashboardService.createDashboard({
      name: this.dashboardName , projectName,
      pages: this.dashboard.pages
    }).subscribe(dash => {
      this.projectsService.loadProject(this.projectId);
      this.router.navigate(['../', this.projectId, 'dashboards', dash.id, 'edit', { page: 0 }], { relativeTo: this.route });
    },error => {
      const parsedError = parseApiError(error, 'error while saving dashboard!');
      this.toastr.error(parsedError.message, parsedError.title);
    });
  }
  close() {
    this.location.back();
  }
}
