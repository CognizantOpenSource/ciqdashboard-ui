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
import { Component, OnInit } from '@angular/core';
import { UnSubscribable } from 'src/app/components/unsub';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordConstraints } from '../../sign-up/sign-up.component';

@Component({
  selector: 'app-changePassword',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends UnSubscribable implements OnInit {

  user: any;
  password: any = passwordConstraints();

  form = new FormGroup({
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.pattern(this.password.pattern)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  showPass = false;
  constructor(
    private authService: AuthenticationService, private toastr: ToastrService, private location: Location) {
    super();
  }
  ngOnInit() {
    this.managed(this.authService.user$).subscribe(user => this.user = user);
  }
  changePassword() {
   if (this.form.valid) {
    const formData = this.form.getRawValue();    
      if (formData.oldPassword !== formData.newPassword && formData.newPassword === formData.confirmPassword) {
        this.authService.updatePassword(formData.newPassword, formData.oldPassword);
        return;
      }
    }
    this.toastr.warning('please provide valid inputs');
  }
  close() {
    this.location.back();
  }
}
