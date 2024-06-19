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
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UnSubscribable } from 'src/app/components/unsub';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
/**
* SignUpComponent
* @author Cognizant
*/
export function passwordConstraints(min = 8, max = 20, symbols = '$_@!%*#?&') {
  const pattern = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${symbols}])[A-Za-z\\d${symbols}]{8,20}$`;
  const message = `minimum ${min} and maximum ${max} characters, at least one uppercase letter, one lowercase letter, one number and one special character from ${symbols}`;
  return {
    min, max, symbols, pattern, message, regex: new RegExp(pattern)
  }
}
@Component({
  selector: 'app-signUp',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent extends UnSubscribable implements OnInit {

  password: any = passwordConstraints();

  signupForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.password.pattern)]),
    confirmPassword: new FormControl('', [Validators.required]),
    org: new FormControl('ciqdashboard', Validators.required),
    type: new FormControl({ value: 'Native', disabled: true }, Validators.required)
  });
  returnUrl: any;
  showPass = false;
  constructor(
    private authService: AuthenticationService, private toastr: ToastrService) {
    super();
  }
  ngOnInit(): void {

  }

  createAccount() {
    if (this.signupForm.invalid) {
      this.toastr.warning('please provide valid inputs');
      return;
    }
    this.authService.createUser(this.signupForm.getRawValue());
  }
}
