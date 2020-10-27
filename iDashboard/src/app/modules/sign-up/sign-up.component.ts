import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UnSubscribable } from 'src/app/components/unsub';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signUp',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent extends UnSubscribable implements OnInit {

  form: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    org: 'Leap',
    type: 'native',
  };
  returnUrl = ''
  constructor(
    private authService: AuthenticationService, private router: Router, private toastr: ToastrService) {
    super();
  }
  ngOnInit(): void {
   
  }
 
  createAccount() {
    if (!this.form.password || this.form.password !== this.form.confirmPassword) {
      this.toastr.warning('please provide valid inputs');
      return;
    }
    this.authService.createUser(this.form, this.returnUrl);
  }
  success(user: any) {
    this.toastr.success(`logged in as '${user.username}'`);
    this.router.navigateByUrl(this.returnUrl);
  }
}
