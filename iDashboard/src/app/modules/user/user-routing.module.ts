import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth/auth-guard.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { OptionsManagerComponent } from './user-settings/options-manager/options-manager.component';


const routes: Routes = [
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'profile/changePassword', component: ChangePasswordComponent, canActivate: [AuthGuard] },
    {
        path: 'settings', component: UserSettingsComponent, canActivate: [AuthGuard],
        children: [
             { path: 'options/:id/edit', component: OptionsManagerComponent, canActivate: [AuthGuard] },
           { path: '**' , redirectTo: 'jenkins'}
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
