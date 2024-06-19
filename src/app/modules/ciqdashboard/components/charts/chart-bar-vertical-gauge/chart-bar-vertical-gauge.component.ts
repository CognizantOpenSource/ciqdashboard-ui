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
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'
/**
* ChartBarVerticalGaugeComponent
* @author Cognizant
*/
@Component({
  selector: "app-chart-bar-vertical-gauge",
  templateUrl: "./chart-bar-vertical-gauge.component.html",
  styleUrls: ['../base-chart.scss', "./chart-bar-vertical-gauge.component.scss"],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartBarVerticalGaugeComponent extends BaseChart implements OnInit {

  yScaleMax: number;

  @Input('config') set config(config: any) {
    this.setConfig(config);
  }
  data: any;
  @Input('data') set setData(data: any) {
    if (data) {
      this.yScaleMax = 0;
      data.forEach(e => {
        e.value = +(e.value || e.actual);
        e.extra = e.extra || { target: +(e.target || 0) };
        this.yScaleMax = Math.max(this.yScaleMax, e.value, e.target);
      });
      this.data = data;
    }
  }


  constructor() {
    super();
  }


  onSelect(event) {

  }

  ngOnInit() { }
}
