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
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { AppComponent } from './app.component';
import { TopNavComponent } from './modules/nav/top-nav/top-nav.component';
import { LoginComponent } from './modules/login/login.component';
import { SignUpComponent } from './modules/sign-up/sign-up.component';
import { UserMenuComponent } from './modules/user/user-menu/user-menu.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './modules/shared.module';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationComponent } from './components/notification/notification.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth/auth-interceptor.service';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { AppErrorHandler } from './services/app-error.service';
import { HomeComponent } from './modules/home/home.component';
import { AppFooterComponent } from './modules/footer/app-footer/app-footer.component';
import { ExportAsModule } from 'ngx-export-as';


@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    pan: {
      direction: 6
    }, swipe: { direction: Hammer.DIRECTION_ALL },
  };
}
@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    LoginComponent,
    SignUpComponent,
    UserMenuComponent,
    NotificationComponent,
    HomeComponent,
    AppFooterComponent
   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    NgProgressModule.withConfig({
      spinner: false,
      spinnerPosition: 'left',
      color: '#1B95E0',
      meteor: true
    }),
    NgProgressHttpModule,
    SharedModule,
    ExportAsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig, }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
