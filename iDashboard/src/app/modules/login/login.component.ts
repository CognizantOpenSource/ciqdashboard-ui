import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UnSubscribable } from 'src/app/components/unsub';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends UnSubscribable implements OnInit, AfterViewInit {

  @ViewChild('googleBtn', { static: true }) googleSignin: ElementRef;

  form: any = {
    type: 'local',
    username: '',
    password: '',
    rememberMe: false
  };
  returnUrl = '';
  failedAttempt = 0;
  newSession: boolean = false;
  constructor(
    private authService: AuthenticationService, private router: Router, private route: ActivatedRoute,
    private toastr: ToastrService) {
    super();
    /**
     * force reload window to clear any state
     */
    if (this.authService.touched) {
      window.location.reload();
    } else {
      this.newSession = true;
    }
  }
  get prod() {
    return environment.production;
  }
  ngOnInit() {
    this.managed(this.route.queryParams)
      .subscribe(params => this.returnUrl = params.returnUrl || '/home');
    this.managed(this.authService.user$).subscribe(this.success.bind(this));
  }
  ngAfterViewInit() {
  }
  login() {
    if (!this.form.username || !this.form.password) {
      this.toastr.warning('please provide valid inputs');
      return;
    }
    this.authService.login(this.form.username, this.form.password);
  }
  loginWithGoogle() {
    this.authService.logInWithGoogle();
  }
  success(user: any) {
    this.toastr.success(`logged in as '${user.name || user.firstName}'`);
    this.router.navigateByUrl(this.returnUrl);
  }
  failure(resp: any) {
    this.failedAttempt++;
    this.toastr.error('login error', `${resp.error}`);
  }
}
