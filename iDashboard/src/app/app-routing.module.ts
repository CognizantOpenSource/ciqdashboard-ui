import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { SignUpComponent } from './modules/sign-up/sign-up.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { AdminGuard } from 'src/app/services/auth/admin-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full', runGuardsAndResolvers: 'always', },
  { path: 'signUp', component: SignUpComponent, pathMatch: 'full' },
  // App views
  // Main redirect
  { path: '', redirectTo: 'idashboard', pathMatch: 'full' },
  { path: 'home',  redirectTo: 'idashboard' /*component: HomeComponent*/, pathMatch: 'full' },
  { path: 'idashboard', loadChildren: './modules/idashboard/idashboard.module#IDashBoardModule' },
  { path: 'user', loadChildren: './modules/user/user.module#UserModule' },
  { path: 'admin', loadChildren: './modules/admin/admin.module#AdminModule', canActivate: [AuthGuard, AdminGuard] },


  //{ path: 'attachments/:id', component: AttachmentModalComponent, outlet: 'modal' },
  // Handle all other routes
  { path: '**', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing : false, useHash: true, 
    paramsInheritanceStrategy: 'always',
    preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
