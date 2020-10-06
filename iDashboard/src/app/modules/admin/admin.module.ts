import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { AdminRolesComponent } from './admin-roles/admin-roles.component';
import { RoleManagerComponent } from './role-manager/role-manager.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';

@NgModule({
  declarations: [
    AdminUsersComponent,
    UserManagerComponent,
    AdminRolesComponent,
    RoleManagerComponent,
    AdminSettingsComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
