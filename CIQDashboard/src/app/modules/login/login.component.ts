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
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UnSubscribable } from 'src/app/components/unsub';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends UnSubscribable implements OnInit, AfterViewInit {

  form: any = {
    type: '',
    username: '',
    password: '',
    rememberMe: false,
    secretKey: 'CIQdashboardSCKey'
  };
  returnUrl = '';
  failedAttempt = 0;
  newSession: boolean = false;
  @Input() reloadWindow = true;
  constructor(
    private authService: AuthenticationService, private router: Router, private route: ActivatedRoute,
    private toastr: ToastrService) {
    super();

  }
  get prod() {
    return environment.production;
  }
  ngOnInit() {
    this.form.type="Native";
    this.managed(this.route.queryParams)
      .subscribe(params => this.returnUrl = params.returnUrl || '/home');
    this.managed(this.authService.user$).subscribe(this.success.bind(this));
    /**
     * force reload window to clear any state
     */
    if (this.authService.touched) {
      if (this.reloadWindow)
          window.location.reload();
    } else {
      this.newSession = true;
    }
  }
  ngAfterViewInit() {
  }
  login() {
    if (!this.form.username || !this.form.password) {
      this.toastr.warning('please provide valid inputs');
      return;
    }
    var encrypted = CryptoJS.AES.encrypt(this.form.password, this.form.secretKey).toString();
    this.authService.login(this.form.username, encrypted, this.form.type);
  }
  success(user: any) {
    this.toastr.success(`logged in as '${user.name || user.firstName}'`);
    if (this.reloadWindow)
      this.router.navigateByUrl(this.returnUrl);
  }
  failure(resp: any) {
    this.failedAttempt++;
    this.toastr.error('login error', `${resp.error}`);
  }
}
