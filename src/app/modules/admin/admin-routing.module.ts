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
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminRolesComponent } from './admin-roles/admin-roles.component';
import { RoleManagerComponent } from './role-manager/role-manager.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AdminTeamsComponent } from './teams/teams.component';
import { TeamEditorComponent } from './teams/team-editor/team-editor.component';
import { MetricsComponent } from './metrics/metrics.component';
import { MetricEditorComponent } from './metrics/metric-editor/metric-editor.component';
import { TemplatesComponent } from './templates/templates.component';
import { AuthGuard } from 'src/app/services/auth/auth-guard.service';
import { AdminGuard } from 'src/app/services/auth/admin-guard.service';
/**
* AdminRoutingModule 
* @author Cognizant
*/
const routes: Routes = [
    {
        path: '', component: AdminSettingsComponent, canActivate: [AuthGuard, AdminGuard],
        children: [
            { path: 'users', component: AdminUsersComponent },
            { path: 'users/:userId/edit', component: UserManagerComponent },
            { path: 'roles', component: AdminRolesComponent },
            { path: 'roles/:roleId/edit', component: RoleManagerComponent },
            { path: 'teams', component: AdminTeamsComponent },
            { path: 'teams/:teamId/edit', component: TeamEditorComponent },
            { path: 'metrics', component: MetricsComponent },
            { path: 'metrics/:metricId/edit', component: MetricEditorComponent },
            { path: 'templates', component: TemplatesComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule { }
