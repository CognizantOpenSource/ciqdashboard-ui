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
