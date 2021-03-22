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
import { DashboardProjectService } from '../services/idashboard-project.service';

@Injectable({
  providedIn: 'root'
})
export class TestReportResolver implements Resolve<any> {
  constructor(private service: DashboardProjectService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.service.getProject(route.paramMap.get('projectId'));
  }
}
