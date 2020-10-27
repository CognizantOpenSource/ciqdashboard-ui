import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminRolesComponent } from './admin-roles/admin-roles.component';
import { RoleManagerComponent } from './role-manager/role-manager.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AdminTeamsComponent } from './teams/teams.component';
import { TeamEditorComponent } from './teams/team-editor/team-editor.component';

const routes: Routes = [
    {
        path: '', component: AdminSettingsComponent,
        children: [
            { path: 'users', component: AdminUsersComponent },
            { path: 'users/:userId/edit', component: UserManagerComponent },
            { path: 'roles', component: AdminRolesComponent },
            { path: 'roles/:roleId/edit', component: RoleManagerComponent },
            { path: 'teams', component: AdminTeamsComponent },
            { path: 'teams/:teamId/edit', component: TeamEditorComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule { }
