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
import { UnSubscribable } from 'src/app/components/unsub';
import { DashboardItemsService } from '../../services/ciqdashboard-items.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinct, map } from 'rxjs/operators';

/**
* IDashBoard
* @author Cognizant 
*/
export class IDashBoard extends UnSubscribable implements OnInit {
    loadedItem;
    category;
    id;
    constructor(public dashItemService: DashboardItemsService,
        public routes: ActivatedRoute) {
        super()
        /* var categoryType = '';
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
        } */
        // setTimeout(() => this.dashItemService.loadItems(categoryType), 100);

        this.managed(this.routes.queryParams).pipe(map(p => {
            //console.log(p);
            return p.category
        }), distinct()).subscribe(category => {
            //console.log('category1234: ' + category);
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
                /* default: {
                    categoryType = "";
                    break;
                } */
            }
            this.category = categoryType;
            this.managed(this.routes.params).pipe(map(p => {
                //console.log(p);
                return p.projectId
            }), distinct()).subscribe(projectId => {
                this.id = projectId;
                this.dashItemService.loadItems(categoryType);
            });

        });

    }
    ngOnInit() {
    }
    updateDashBoardData(dash: any, force = false) {
        //update dashboardData
        dash.pages.forEach((page, pi) => {
            page.items.filter(it => it && (!it.data || force) && it.id).forEach((it, i) => this.updateItemData(it, pi, i,dash.pages[pi].pageId,dash.id,dash.name, dash.projectName));
        });
        var id = this.id, categoryType = this.category;
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
                /* default: {
                    id = this.projectId;
                    categoryType = "";
                    break;
                } */
            }
        //console.log('dashboard123');
        this.dashItemService.getdirectchartdata(dash,dash.pages,dash.id,dash.name, dash.projectName, categoryType, id).subscribe(itd => {
            //console.log('directchartsdata',itd);
        });
        setTimeout(_ => {
            window.dispatchEvent(new Event('resize'));
        }, 1500);
    }

    updateItemData(it, page, item,pageId?,dashboardId?,dashboardName?, projectName?) {
        const filters = (it.filters || []).filter(f => f.active);
        if (it.itemGroup == 'datalabel' || it.type == 'label' || it.itemGroup == 'dataimg' || it.type == 'img') {
            this.dashItemService.getItem(it.id).subscribe(itd => {
                //console.log('itdid',itd,itd.data);
                it.data = itd.data;
                // if (itd.source == "metrics") {
                //     it.data = this.dashItemService.getMetricsData(dashboardName, projectName, itd.id);
                //     this.cdRef.markForCheck();
                // }
                it.options = { ...itd.options, ...(it.options || {}) };
                this.loadedItem = { page, item, value: it };
            });
        } else {
            var id = this.id, categoryType = this.category;
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
                /* default: {
                    id = this.projectId;
                    categoryType = "";
                    break;
                } */
            }
            this.dashItemService.getItemData(it, filters,pageId,dashboardId,dashboardName, projectName, categoryType, id).subscribe(itd => {
                //console.log('itddata',itd.data);
                it.data = itd.data;
                // if (itd.source == "metrics") {
                //     it.data = this.dashItemService.getMetricsData(dashboardName, projectName, itd.id);
                //     this.cdRef.markForCheck();
                // }
                if (it.type === 'table') {
                    it.projection = itd.projection;
                }
                it.options = { ...itd.options, ...(it.options || {}) };
                this.loadedItem = { page, item, value: it };
            });
        }

    }

}