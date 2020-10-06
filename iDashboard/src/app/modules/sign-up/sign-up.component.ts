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
export class SignUpComponent extends UnSubscribable implements OnInit, AfterViewInit {

  @ViewChild('googleBtn', { static: true }) googleSignin: ElementRef;
  form: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    org: 'Leap',
    type: 'native',
  };
  returnUrl = '';
  failedAttempt = 0;

  constructor(
    private authService: AuthenticationService, private router: Router, private route: ActivatedRoute,
    private ngZone: NgZone, private toastr: ToastrService) {
    super();
  }

  ngOnInit() {
    this.managed(this.route.queryParams)
      .subscribe(params => this.returnUrl = params.returnUrl || '/home');
    this.managed(this.authService.user$).subscribe(this.success.bind(this));
  }
  ngAfterViewInit() {

  }
  signUpWithGoogle() {
    this.authService.logInWithGoogle();
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
  failure(resp: any) {
    this.failedAttempt++;
    this.toastr.error('login error', `${resp.error}`);
  }
}
