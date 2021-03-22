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
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { filter, take, tap, map } from 'rxjs/operators';
import { UserConfigService } from 'src/app/modules/ciqdashboard/services/user-config.service';
import { Theme } from 'src/app/model/types.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DashboardProjectService } from '../../ciqdashboard/services/ciqdashboard-project.service';
/**
* TopNavComponent
* @author Cognizant
*/

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TopNavComponent implements OnInit {

  projects$: Observable<any[]>;
  project: any;
  loggedIn = false;
  theme$: Observable<Theme>;
  projectLoaded: boolean = false;
  constructor(
    private projectService: DashboardProjectService, private auth: AuthenticationService,
    private config: UserConfigService, private router: Router, private route: ActivatedRoute) {
    this.projects$ = projectService.projects$;
  }

  ngOnInit() {
    this.auth.state$.pipe(filter(auth => !!auth), tap(() => this.loggedIn = true)).subscribe(() => this.projectService.loadProjects());
    this.theme$ = this.config.userSettings$.pipe(map(it => (it.theme) || Theme.default));
    this.projectService.project$.subscribe(project => {
      this.project = project;
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), map(() => this.route.snapshot))
      .subscribe((state) => {
        while (state.firstChild) {
          state = state.firstChild;
        }
        this.projectLoaded = !!state.params.projectId;
      }
      );
  }
  get showFullHeader$() {
    return of(true);
  }
  openHelp() {

  }
}
