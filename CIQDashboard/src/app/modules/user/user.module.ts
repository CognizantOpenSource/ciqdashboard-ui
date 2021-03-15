import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { UserRoutingModule } from './user-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { OptionsManagerComponent } from './user-settings/options-manager/options-manager.component';
@NgModule({
  declarations: [
    UserProfileComponent,
    UserSettingsComponent,
    ChangePasswordComponent,
    OptionsManagerComponent,
  ],
  imports: [
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
