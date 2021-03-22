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
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { SignUpComponent } from './modules/sign-up/sign-up.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { AdminGuard } from 'src/app/services/auth/admin-guard.service';
import { NoAuthGuard } from './services/auth/no-auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full', canActivate: [NoAuthGuard] },
  { path: 'signUp', component: SignUpComponent, pathMatch: 'full', canActivate: [NoAuthGuard] },
  // App views
  // Main redirect
  { path: '', redirectTo: 'ciqdashboard', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'home', redirectTo: 'ciqdashboard', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'ciqdashboard', loadChildren: './modules/ciqdashboard/ciqdashboard.module#IDashBoardModule', canActivate: [AuthGuard], },
  { path: 'user', loadChildren: './modules/user/user.module#UserModule', canLoad: [AuthGuard] },
  { path: 'admin', loadChildren: './modules/admin/admin.module#AdminModule', canLoad: [AuthGuard, AdminGuard] },

  // Handle all other routes
  { path: '**', redirectTo: 'ciqdashboard', pathMatch: 'full', canActivate: [AuthGuard] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false, useHash: true,
    paramsInheritanceStrategy: 'always',
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
