import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Theme } from './model/types.model';
import { UserConfigService } from './modules/idashboard/services/user-config.service';
import { map, filter, mergeMap } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'idashboard';
  theme$: Observable<Theme>;
  constructor(
    private location: Location, private router: Router, private activatedRoute: ActivatedRoute,
    private titleService: Title,private config: UserConfigService) {
  }

  ngOnInit() {
    this.updateTitle();
    this.theme$ = this.config.theme$;
  }
  get showFullHeader$() {
    return of(true);
  }
  onBack($event) {
    this.location.back();
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
