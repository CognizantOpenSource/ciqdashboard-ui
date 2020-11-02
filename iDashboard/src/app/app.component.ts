import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Theme } from './model/types.model';
import { UserConfigService } from './modules/idashboard/services/user-config.service';
import { map, filter, mergeMap } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd, ActivationEnd, Route } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { AuthenticationService } from './services/auth/authentication.service';
import { AuthGuard } from './services/auth/auth-guard.service';
import { NoAuthGuard } from './services/auth/no-auth-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'idashboard';
  theme$: Observable<Theme>;
  authenticated = false;
  loaded = false;
  openRoute = false;
  constructor(
    private location: Location, private router: Router, private activatedRoute: ActivatedRoute,
    private titleService: Title, private config: UserConfigService, private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.updateTitle();
    this.theme$ = this.config.theme$;
    this.auth.state$.subscribe(state => { this.authenticated = state; this.loaded = true; });
    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.openRoute = this.hasNoAuthGaurd(event.snapshot && event.snapshot.routeConfig);
      }
    });
  }
  get showFullHeader$() {
    return of(true);
  }
  onBack() {
    this.location.back();
  }
  private hasNoAuthGaurd(routerConfig: Route) {
    return routerConfig && routerConfig.canActivate 
    && routerConfig.canActivate[0] && routerConfig.canActivate.some(guard => guard.name === NoAuthGuard.name);
  }
  updateTitle() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
      map((data) =>
        data.title || this.router.url.split(/[?/=&]/).reduce((acc, next) => {
          if (acc && next) { acc += ' '; }
          return acc + toTitleCase(next);
        }))
    ).subscribe((data) => this.titleService.setTitle(`iDashboard - ${data}`));
  }
}
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}
