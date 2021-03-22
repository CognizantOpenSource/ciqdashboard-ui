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
import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, useAnimation } from "@angular/animations";
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { UserConfigService } from '../../services/user-config.service';
import { DashboardService } from '../../services/ciqdashboard.service';
import { UnSubscribable } from 'src/app/components/unsub';

import {
  AnimationType,
  scaleIn,
  scaleOut,
  fadeIn,
  fadeOut,
  flipIn,
  flipOut,
  jackIn, jackOut
} from "./slideshow-animation"
import { map, distinctUntilChanged, take, filter } from 'rxjs/operators';
import { DashboardItemsService } from '../../services/ciqdashboard-items.service';
import { DashboardProjectService } from '../../services/ciqdashboard-project.service';
import { IDashBoard } from '../dashboard-home/idashboard';

@Component({
  selector: 'app-dashboard-slideshow',
  templateUrl: './dashboard-slideshow.component.html',
  styleUrls: ['./dashboard-slideshow.component.scss'],
  animations: [
    trigger("slideAnimation", [
      /* scale */
      transition("void => scale", [
        useAnimation(scaleIn, { params: { time: "500ms" } })
      ]),
      transition("scale => void", [
        useAnimation(scaleOut, { params: { time: "500ms" } })
      ]),

      /* fade */
      transition("void => fade", [
        useAnimation(fadeIn, { params: { time: "500ms" } })
      ]),
      transition("fade => void", [
        useAnimation(fadeOut, { params: { time: "500ms" } })
      ]),

      /* flip */
      transition("void => flip", [
        useAnimation(flipIn, { params: { time: "500ms" } })
      ]),
      transition("flip => void", [
        useAnimation(flipOut, { params: { time: "500ms" } })
      ]),

      /* JackInTheBox */
      transition("void => jackInTheBox", [
        useAnimation(jackIn, { params: { time: "700ms" } })
      ]),
      transition("jackInTheBox => void", [
        useAnimation(jackOut, { params: { time: "700ms" } })
      ])
    ])
  ]
})
export class DashboardSlideshowComponent extends IDashBoard implements OnInit {

  dashboard;

  slides: any[];

  currentSlide = 0;

  animationType: AnimationType.Fade;
  isFullScreen = false;
  animationTypes = [
    {
      name: "Scale",
      value: AnimationType.Scale
    },
    {
      name: "Fade",
      value: AnimationType.Fade
    },
    {
      name: "Flip",
      value: AnimationType.Flip
    },
    {
      name: "Jack In The Box",
      value: AnimationType.JackInTheBox
    }
  ];
  page;
  theme$
  constructor(
    private route: ActivatedRoute, private router: Router, private config: UserConfigService,
    private projectService: DashboardProjectService, dashItemService: DashboardItemsService,
    private dashboardService: DashboardService,) {
    super(dashItemService);
  }

  ngOnInit() {
    this.theme$ = this.config.theme$;
    this.managed(this.route.params.pipe(map(params => params.dashboardId), distinctUntilChanged()))
      .subscribe(id => this.dashboardService.loadDashboard(id));
    this.managed(combineLatest(this.dashboardService.dashboard$,
      this.route.params.pipe(map(params => params.page), distinctUntilChanged()))).subscribe(([dashboard, page]) => {
        page = page >= 0 ? page : 0;
        this.dashboard = dashboard;
        this.loadItems(dashboard, page);
      });
  }

  private loadItems(dashboard, page = 0) {
    let itemList= [];
    if (page >= 0 && dashboard) {
      this.page = page;
      dashboard.pages[page].active = true;
      itemList = dashboard.pages[page].items.filter(it => !!it.id);
      this.slides = itemList.filter(it => it.itemGroup === 'datachart' || it.itemGroup === 'datatable');
      this.currentSlide = 0;
      this.updateItemData(this.slides[this.currentSlide], this.page, this.currentSlide);
    }
  }
  private navChange() {
    const item = this.slides[this.currentSlide];
    if (item && !item.data) {
      this.updateItemData(item, this.page, this.currentSlide);
    }
  }
  previous() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
    this.navChange();
  }

  next() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
    this.navChange();
  }

  setAnimationType(type) {
    this.animationType = type.value;
    setTimeout(() => {
      this.next();
    });
  }

}