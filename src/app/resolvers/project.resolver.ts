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
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { DashboardProjectService } from '../modules/ciqdashboard/services/ciqdashboard-project.service';
/**
* ProjectResolver
* @author Cognizant
*/
@Injectable({
  providedIn: 'root'
})
export class ProjectResolver implements Resolve<any> {
  constructor(private projectService: DashboardProjectService) { }

  resolve(route: ActivatedRouteSnapshot) {
    var categoryType = '';
    switch (route.queryParams.get('category')) {
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
    return this.projectService.getProject(route.paramMap.get('id'), categoryType);
  }
}
