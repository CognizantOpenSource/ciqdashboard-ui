import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/idashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { UserConfigService } from '../../services/user-config.service';

import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { DashboardProjectService } from '../../services/idashboard-project.service';
import { take, filter, map, distinctUntilChanged, distinct, switchMap, debounceTime } from 'rxjs/operators';
import { DashboardItemsService } from '../../services/idashboard-items.service';
import { getEmptyPage } from '../dashboard-editor/dashboard-editor.component';
import { ToastrService } from 'ngx-toastr';
import { IDashBoard } from './idashboard';
import { parseApiError } from 'src/app/components/util/error.util';
import { DashboardViewComponent } from '../dashboard-view/dashboard-view.component';

@Component({
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./../../components/idashboard.scss', './dashboard-home.component.scss']
})
export class DashboardHomeComponent extends IDashBoard implements OnInit {

  exportconfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'dashboardview',
    options: {
      jsPDF: {
        unit: 'in', format: 'a2', orientation: 'portrait',
        putOnlyUsedFonts: false, floatPrecision: 16
      },
      pdfCallbackFn: this.pdfCallbackFn
    }
  };
  @ViewChild(DashboardViewComponent, {static: false}) dashboardView: DashboardViewComponent;
  
  activePage = 0;
  dashboards: any[];
  theme$
  loadedItem: any;
  projectId;
  dashboardId;
  newDashboardModal: boolean;
  newDashBoardName: string;
  constructor(
    private route: ActivatedRoute, private router: Router, private config: UserConfigService,
    private projectService: DashboardProjectService, dashItemService: DashboardItemsService,
    private dashboardService: DashboardService, private exportAsService: ExportAsService, private toastr: ToastrService
  ) {
    super(dashItemService);
  }

  ngOnInit() {
    this.theme$ = this.config.theme$;
    this.managed(this.route.params).pipe(map(p => p.projectId), distinct()).subscribe(id => {
      this.projectId = id;
      this.dashboardService.loadDashboards(id);
    });
    this.managed(this.route.params).pipe(map(p => p.dashboardId), distinct()).subscribe(id => {
      this.dashboardId = id;
    });
    this.managed(this.route.params).pipe(map(params => params.page), distinctUntilChanged()).subscribe(page => this.activePage = +page);
    this.managed(combineLatest(
      this.dashboardService.dashboards$.pipe(filter(ds => (ds && ds.project) === this.projectId),
        map(ds => ds.data)),
      this.route.params.pipe(map(params => params.dashboardId), distinctUntilChanged()))).pipe(debounceTime(50)).subscribe(([dashboards, dashboardId]) => {
        if (dashboardId) {
          this.dashboards = dashboards.map(dash => ({ ...dash, active: dash.id === dashboardId }));
          if (!this.dashboards[0]) {
            this.showCreateDashPopup();
          } else {
            const dash = dashboards.find(d => d.id === dashboardId) || dashboards.find(d => d.active) || dashboards[0];
            if (dash.id === dashboardId) {
              const page = this.activePage >= 0 && dash.pages[this.activePage] ? this.activePage
                : dash.pages.indexOf(dash.pages.find(p => p.active) || dash.pages[0]);
              this.selectPage(page, dash);
              this.updateDashBoardData(dash);
            } else {
              this.router.navigate(['../', dash.id, { page: 0 }], { relativeTo: this.route });
            }
          }
        } else {
          const dash = dashboards.find(d => d.active) || dashboards[0];
          if (dash) {
            this.router.navigate([dash.id], { relativeTo: this.route });
          } else {
            this.showCreateDashPopup();
          }
        }
      });

  }
  private createNewDash(name: string) {
    return this.projectService.project$.pipe(filter(p => p.id === this.projectId), take(1), switchMap(project => {
      return this.dashboardService.createDashboard({
        name, projectName: project.name,
        pages: [getEmptyPage('default')]
      })
    }));
  }
  toggleLock(dashboard) {
    dashboard.openAccess = !dashboard.openAccess;
    const action = dashboard.openAccess ? 'unlock' : 'lock';
    this.dashboardService.save(dashboard).subscribe(res => {
      if (res) {
        this.toastr.success(`dashboard ${action}ed successfully`);
      } else {
        dashboard.openAccess = !dashboard.openAccess
        this.toastr.error(`error while ${action}ing dashboard!`);
      }
    },
      error => {
        dashboard.openAccess = !dashboard.openAccess;
        const parsedError = parseApiError(error, `error while ${action}ing dashboard!`);
        this.toastr.error(parsedError.message, parsedError.title);
      });
  }

  exportAs(dashboard) {
    //this.exportAsService.save(this.exportconfig, dashboard.name).subscribe();
    this.dashboardView.exportAsPdf();
  }

  pdfCallbackFn(pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
    }
  }
  reloadDashBoard(dashboard) {
    this.updateDashBoardData(dashboard, true);
  }
  deleteDashboard(dashboard) {
    this.dashboardService.removeDashboard(dashboard);
  }
  saveDashboard(dashboard) {
    this.dashboardService.save(dashboard).subscribe(() => {
      this.toastr.success('dashboard saved successfully');
    }, () => this.toastr.error('error while saving dashboard'));
  }
  selectPage(index, dashboard) {
    if (!dashboard) return;
    if (this.activePage >= 0 && index !== this.activePage && dashboard.pages[this.activePage]) {
      dashboard.pages[this.activePage].active = false;
    }
    dashboard.pages[index].active = true;
    this.router.navigate([{ page: index }], { relativeTo: this.route });
  }
  doCreateDashboard(name: string) {
    this.createNewDash(name).subscribe(dash => {
      this.newDashboardModal = false;
      this.router.navigate([this.dashboardId ? '../' : './', dash.id, 'edit', { page: 0 }], { relativeTo: this.route });
    }, (error) => {
      const parsedError = parseApiError(error, `error while creating dashboard!`);
      this.toastr.error(parsedError.message, parsedError.title);
    });
  }
  showCreateDashPopup(event: MouseEvent | false = false) {
    if (event) {
      this.consume(event as MouseEvent);
    }
    this.newDashboardModal = true;
  }
  cancelCreateDashboard() {
    if (this.dashboardId) {
      this.newDashboardModal = false;
    } else
      this.router.navigate(['../../../projects'], { relativeTo: this.route });

  }
}
