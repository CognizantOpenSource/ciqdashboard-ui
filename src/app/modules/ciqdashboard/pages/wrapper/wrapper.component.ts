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
import { DashboardProjectService } from '../../services/ciqdashboard-project.service';
import { Router, ActivatedRoute } from '@angular/router';
import { take, distinctUntilChanged, map, distinct } from 'rxjs/operators';
import { UnSubscribable } from 'src/app/components/unsub';
import { DashboardItemsService } from '../../services/ciqdashboard-items.service';
/**
* WrapperComponent
* @author Cognizant
*/
@Component({
  selector: 'app-wrapper',
  template: `<router-outlet></router-outlet>
  <router-outlet name="modal"></router-outlet>`,
  styles: []
})
export class WrapperComponent extends UnSubscribable implements OnInit {
  category: any;
  constructor(
    private projectService: DashboardProjectService, private dashItemService: DashboardItemsService, private router: Router,
    private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.managed(this.route.queryParams).pipe(map(p => {
      //console.log(p);
      return p.category
    }), distinct()).subscribe(category => {
      this.category = category;
      //console.log('category: ' + this.category);
      this.managed(this.route.params.pipe(map(p => p.projectId), distinctUntilChanged())).subscribe(projectId => {
        if (projectId) {
          var categoryType='';
          switch(this.category){
            case 'project':{
              categoryType="PRJ";
              break;
            }
            case 'lob':{
              categoryType="LOB";
              break;
            }
            case 'org':{
              categoryType="ORG";
              break;
            }
            default:{
              categoryType="";
              break;
            }
          }
          this.projectService.loadProject(projectId, categoryType);
        } else {
          this.projectService.projects$.pipe(take(1)).subscribe(projects => {
            this.router.navigate([projects[0].id], { relativeTo: this.route });
          });
        }
      });
    });
  }

}
