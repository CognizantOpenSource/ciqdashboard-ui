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
* ChartComboChartComponent
* @author Cognizant
*/
@Component({
  selector: "app-chart-combo-chart",
  templateUrl: "./chart-combo-chart.component.html",
  styleUrls: ["./chart-combo-chart.component.scss"],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartComboChartComponent extends BaseChart implements OnInit {

  barData: any[];
  lineData: any[];

  @Input('data') set setData(data: any[]) {
    if (data) {
      this.barData = this.clean(data[0].children);
      this.lineData = this.clean(data[1].children);
    }
  };
  @Input('config') set config(config: any) {
    this.setConfig(config);
  }

  constructor() {
    super();
  }


  onSelect(event) {

  }

  ngOnInit() { }

  private clean(data) {
    data && data.forEach(e => {
      if (e.children) {
        e.series = e.children;
        delete e.children;
      }
      e.name = e.name || 'unknown';
      e.series && e.series.forEach(se => {
        se.name = se.name || 'unknown';
        return se;
      })
    });
    return data;
  }
}
