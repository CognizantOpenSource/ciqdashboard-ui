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
import { DashboardService } from '../../services/ciqdashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { UserConfigService } from '../../services/user-config.service';

import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { DashboardProjectService } from '../../services/ciqdashboard-project.service';
import { take, filter, map, distinctUntilChanged, distinct, switchMap, debounceTime } from 'rxjs/operators';
import { DashboardItemsService } from '../../services/ciqdashboard-items.service';
import { getEmptyPage } from '../dashboard-editor/dashboard-editor.component';
import { ToastrService } from 'ngx-toastr';
import { IDashBoard } from './idashboard';
import { parseApiError } from 'src/app/components/util/error.util';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { element } from 'protractor';
/**
* DashboardHomeComponent
* @author Cognizant 
*/
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
  item;
  rawItems;
  filters;
  projectName;
  success;
  activePage = 0;
  dashboards: any[];
  dashboard;
  theme$
  loadedItem: any;
  projectId;
  dashboardId;
  newDashboardModal: boolean;
  newTemplateModal : boolean;
  infoDashBoardModal: boolean;
  newDashBoardName: string;
  newTemplateName: string;
  dashboardTemplates: any[] = [];
  newDashBoardTemplateID: any = "";
  newDashBoardTemplate: any = "";
  importTemplate: boolean = false;
  cDashboard = "";
  cPage = "";
  cProject = "";
  cMetricsLastCalculated = "";
  cMetricsLastUpdated = "";
  category: any = "";
  orgId = "";
  orgName = "";
  lobId = "";
  lobName = "";
  listingNoofDashboard=6; // to show default dashboard list others dashboard to be minimized 

  constructor(private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private config: UserConfigService,
    private projectService: DashboardProjectService, dashItemService: DashboardItemsService,
    private dashboardService: DashboardService, private exportAsService: ExportAsService, private toastr: ToastrService
  ) {
    super(dashItemService, route);
  }

  ngOnInit() {
    this.theme$ = this.config.theme$;
    this.managed(this.route.queryParams).pipe(map(p => {
      //console.log(p);
      return p.category
    }), distinct()).subscribe(category => {
      this.category = category;
      //console.log('category: ' + this.category);
      this.addImportDashboard(this.category);
      this.managed(this.route.params).pipe(map(p => p.projectId), distinct()).subscribe(id => {
        this.projectId = id;
        this.projectService.lobs$.subscribe(lobs => {
          //console.log('lobs',lobs);
          // console.log(this.projectId);
          this.lobName = lobs.filter(p => p.id === this.projectId)[0].lobName;
          // console.log("lobName: " + this.lobName);
        });
        this.projectService.orgs$.subscribe(orgs => {
           //console.log('org',orgs);
          // console.log(this.projectId);
          this.orgName = orgs.filter(p => p.id === this.projectId)[0].organizationName;
          // console.log("lobName: " + this.lobName);
        });
        var categoryType = '';
        switch (this.category) {
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
        this.dashboardService.loadDashboards(id, categoryType);
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
            //console.log('dashboardssss',this.dashboards);
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
                this.router.navigate(['../', dash.id, { page: 0 }], { queryParams: { category: this.category }, relativeTo: this.route });
              }
              // console.log(dash);
              this.getLastUpdatedMetricTimestamp(dash);
            }
          } else {
            const dash = dashboards.find(d => d.active) || dashboards[0];
            if (dash) {
              this.router.navigate([dash.id], { queryParams: { category: this.category }, relativeTo: this.route });
            } else {
              this.showCreateDashPopup();
            }
          }
        });
    });

    let paramMap;
    this.route.queryParamMap.subscribe(queryparams => {
      paramMap = queryparams;
      if (paramMap.hasOwnProperty('params')) {
        //console.log(paramMap.params);
        if (paramMap.params.hasOwnProperty('category')) {
          this.category = paramMap.params.category;
        }
      }
    });

  }
  private createNewDash(name: string, category: string) {
    //console.log("createNewDash1: " + name);

    let pages: any;
    if (this.newDashBoardTemplateID == "") {
      pages = [getEmptyPage('default')];
    } else {
      this.newDashBoardTemplate = this.dashboardTemplates.filter((obj) => {
        return obj.id === this.newDashBoardTemplateID;
      });
      pages = this.newDashBoardTemplate[0].pages;
    }

    //console.log("createNewDash2: " + name);
    switch (category) {
      case "PRJ": {
        return this.projectService.project$.pipe(filter(p => p.id === this.projectId), take(1), switchMap(project => {
          return this.dashboardService.createDashboard({
            name,projectId:this.projectId,projectName: project.name,
            pages: pages, category: category
          })
        }));
      }
      case "LOB": {

        // console.log(this.lobId);
        //console.log("createNewDash3: " + name);
        // this.projectService.lobs$.subscribe((lob) => {
        //   console.log('lobdata',lob);
        // });
        //console.log(this.lobName);
        return this.projectService.project$.pipe(filter(p => p.id === this.projectId), take(1), switchMap(project => {
          return this.dashboardService.createDashboard({
            name,projectId:this.projectId,projectName: project.name,
            pages: pages, category: category
          })
        }));
        // return this.projectService.project$.pipe(filter(p => p.id === this.lobId), take(1), switchMap(project => {
        //   return this.dashboardService.createDashboard({
        //     name,projectId:this.projectId,projectName: project.name,
        //     pages: pages, category: category
        //   })
        // }));
      }
      case "ORG": {

        //console.log("createNewDash3: " + name);
        // this.projectService.orgs$.subscribe((org) => {
        //   console.log('orgdata',org);
        // });
        // //console.log(this.lobId);
        //console.log(this.orgName);
        /* 
        return this.projectService.lob$.pipe(filter(p => p.id === this.lobId), take(1), switchMap(lob => { */
        //console.log("createNewDash4: " + name);
        return this.projectService.project$.pipe(filter(p => p.id === this.projectId), take(1), switchMap(project => {
          return this.dashboardService.createDashboard({
            name,projectId:this.projectId,projectName: project.name,
            pages: pages, category: category
          })
        }));
        // return this.dashboardService.createDashboard({
        //   name,projectId:this.projectId,projectName: this.orgName,
        //   pages: pages, category: category
        // })
        /* })); */
      }
      default: {
        return this.projectService.project$.pipe(filter(p => p.id === this.projectId), take(1), switchMap(project => {
          return this.dashboardService.createDashboard({
            name, projectName: project.name,
            pages: pages
          })
        }));
      }
    }
    /*  }
   } */
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
    this.exportAsService.save(this.exportconfig, dashboard.name).subscribe();
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
    var categoryType = '';
    switch (this.category) {
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
    this.dashboardService.removeDashboard(dashboard, categoryType);
  }
  saveDashboard(dashboard) {
    //console.log('savedashboardDetails',dashboard);
    this.dashboardService.save(dashboard).subscribe((item) => {
      //console.log('itemSaveDashboard',item);
      this.toastr.success('dashboard saved successfully');
      this.success = true;
      if(this.success = true){
        this.calldirectChartdata(dashboard);
      }
    }, () => this.toastr.error('error while saving dashboard'));
  }
  calldirectChartdata(dashboard){
    //console.log('dashboarddd',dashboard.pages,dashboard,this.dashboardId,this.projectId,this.category);
    //const filters = (this.item.filters || []).filter(f => f.active);
    this.filters = dashboard.pages;
    this.item = dashboard.pages;
    this.projectName = 'projectName';
    this.dashItemService.getdirectchartdata(this.item,this.filters,this.dashboardId,dashboard.dashboardName,this.projectName,dashboard.category, dashboard.projectId).subscribe(item => {
    });
  }
  selectPage(index, dashboard) {
    if (!dashboard) return;
    if (this.activePage >= 0 && index !== this.activePage && dashboard.pages[this.activePage]) {
      dashboard.pages[this.activePage].active = false;
    }
    dashboard.pages[index].active = true;
    this.router.navigate([{ page: index }], { queryParams: { category: this.category }, relativeTo: this.route });
  }
  doCreateDashboard(name: string) {
    //console.log("doCreateDashboard: " + name);
    var categoryType = '';
    switch (this.category) {
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
    this.createNewDash(name, categoryType).subscribe(dash => {
      this.newDashboardModal = false;
      this.router.navigate([this.dashboardId ? '../' : './', dash.id, 'edit', { page: 0 }], { queryParams: { category: this.category }, relativeTo: this.route });
    }, (error) => {
      const parsedError = parseApiError(error, `error while creating dashboard!`);
      this.toastr.error(parsedError.message, parsedError.title);
    });
  }
  doCreateTemplate(templatename: string) {
    //console.log("TemplateName: " + templatename,this.dashboards);
    let newtemplateArray =[];
    //let newtemplateArray = this.dashboards.filter((element) => element.active === true);
    for(let i = 0; i < this.dashboards.length; i++) {
      if(this.dashboards[i].active === true){
        //console.log('dashboardactive',this.dashboards);
        newtemplateArray.push(this.dashboards[i]);
      }
    }
   //console.log('newArray',newtemplateArray);
    newtemplateArray.forEach(element => {
      element.name = templatename;
      delete element.projectId;
      delete element.projectName;
      delete element.id;
    });
    //console.log('afteraddingTemplateName',newtemplateArray);
    this.dashboardService.addtemplate(newtemplateArray[0]).subscribe((item) => {
      //console.log('itemSaveDashboard',item);
      this.newTemplateModal = false;
      this.newTemplateName ="";
      this.toastr.success('template added successfully');
      this.success = true;
    }, () => this.toastr.error('error while adding template'));
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
  showCreateTemplatePopup(event: MouseEvent | false = false){
    if (event) {
      this.consume(event as MouseEvent);
    }
    this.newTemplateModal = true;
  }
  cancelCreateTemplate() {
    if (this.dashboardId) {
      this.newTemplateModal = false;
    } else
      this.router.navigate(['../../../projects'], { relativeTo: this.route });

  }
  addDataSource(name: string) {

  }
  addImportDashboard(category?: string) {
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
    this.dashboardService.getDashboardTemplates(categoryType).subscribe(templates => {
      this.dashboardTemplates = templates;
      this.importTemplate = true;
    }, (error) => {
    });
    /* this.http.get<any[]>('http://localhost:8092/dashboard-template/get-all-templates/' + categoryType).subscribe(templates => {
      this.dashboardTemplates = templates;
      this.importTemplate = true;
    }, (error) => {
    }); */
  }

  importDashboard(name?: string) {
    //console.log("importDashboard: " + name);
    this.doCreateDashboard(name);
  }
  infoDashBoard(dashboard) {
    this.infoDashBoardModal = true;
    this.getLastUpdatedMetricTimestamp(dashboard);
  }
  infoDashBoardClose() {
    this.infoDashBoardModal = false;
  }

  calculateMetrics(dashboard) {
    let requestbody = {};
    //console.log('dashboard',dashboard);
    switch (this.category) {
      case 'lob': {
        requestbody = {
          //"dashboardName": dashboard.name,
          "dashboardId" : dashboard.id,
          "layerId" : this.projectId,
          "category" : dashboard.category
          //"projectName": dashboard.projectName,
          //"pageName": dashboard.pages[this.activePage].name,
          //"lobId": this.lobId,
          //"orgId": this.orgId
        };
        break;
      }
      case 'project': {
        requestbody = {
          "dashboardId" : dashboard.id,
          "layerId" : this.projectId,
          "category" : dashboard.category
          // "dashboardName": dashboard.name,
          // "dashboardId" : dashboard.dashboardId,
          // "projectName": dashboard.projectName,
          // "pageName": dashboard.pages[this.activePage].name
        };
        break;
      }
      case 'org': {
        requestbody = {
          "dashboardId" : dashboard.id,
          "layerId" : this.projectId,
          "category" : dashboard.category
          // "dashboardName": dashboard.name,
          // "dashboardId" : dashboard.dashboardId,
          // "projectName": dashboard.projectName,
          // "pageName": dashboard.pages[this.activePage].name
        };
        break;
      }
      default: {
        requestbody = {
          "dashboardId" : dashboard.id,
          "layerId" : this.projectId,
          "category" : dashboard.category
          // "dashboardName": dashboard.name,
          // "dashboardId" : dashboard.dashboardId,
          // "projectName": dashboard.projectName,
          // "pageName": dashboard.pages[this.activePage].name
        };
        break;
      }
    }
    this.http.post<any[]>(this.dashboardService.apiHosts.metric+'api/metrics/calculate-metrics', requestbody).subscribe((response: any) => {
      // console.log(response);
      if (response.data != null) {
        if (response.data.metrics.length > 0) {
          if (response.data.metrics[0].hasOwnProperty("lastCalculatedDate")) {
            this.cMetricsLastCalculated = response.data.metrics[0].lastCalculatedDate;
          }
        }
      }
    }, (error) => {
    });
  }

  getLastUpdatedMetricTimestamp(dashboard) {
    //console.log('dashbaordinfooo',dashboard);
    this.cDashboard = dashboard.name;
    this.cProject = dashboard.projectName;
    if (Number.isNaN(this.activePage)) {
      this.cPage = dashboard.pages[0].name;
      this.activePage = 0;
    } else {
      this.cPage = dashboard.pages[this.activePage].name;
    }
    var categoryType = '';
    switch (this.category) {
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
    //this.http.get<any[]>(this.dashboardService.apiHosts.metric+'api/metrics/get-last-calculated-metrics/' + dashboard.projectName + '/dashboard/' + dashboard.name + '/page/' + dashboard.pages[this.activePage].name + '?category=' + categoryType).subscribe((response: any) => {
      this.http.get<any[]>(this.dashboardService.apiHosts.metric+'api/metrics/get-last-calculated-metrics/' + dashboard.projectId + '/dashboard/' + dashboard.id + '/page/' + dashboard.pages[this.activePage].name + '?category=' + categoryType).subscribe((response: any) => {
      // console.log(response);
      if (response.hasOwnProperty("toolTypes")) {
        this.cMetricsLastUpdated = response.toolTypes[0].lastUpdatedDate;
        const lastUpdatedDate = new Date(response.toolTypes[0].lastUpdatedDate).valueOf();
        if (response.hasOwnProperty("lastCalculatedDate")) {
          const lastCalculatedDate = new Date(response.lastCalculatedDate[0].lastCalculated).valueOf();
          // if (lastUpdatedDate > lastCalculatedDate) {
          // console.log('need to update');
          this.calculateMetrics(dashboard);
          /* } else {
            // console.log('not need to update');
             this.cMetricsLastCalculated = response.lastCalculatedDate[0].lastCalculated;
           }*/
        } else {
          this.calculateMetrics(dashboard);
        }
      }
    }, (error) => {
    });
  }

  getdMetricsConfig() {
    var categoryType = '';
    switch (this.category) {
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
    this.http.get<any[]>(this.dashboardService.apiHosts.metric+'api/metrics/metric-config?category=' + categoryType).subscribe(response => {
      // console.log(response);
    }, (error) => {
    });
  }

}
