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
* ChartsBarVerticalGroupComponent
* @author Cognizant
*/
@Component({
  selector: "app-charts-bar-vertical-group",
  templateUrl: "./charts-bar-vertical-group.component.html",
  styleUrls: ['../base-chart.scss' , "./charts-bar-vertical-group.component.scss"],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartsBarVerticalGroupComponent extends BaseChart implements OnInit {

  @Input('config') set config(config: any) {
    this.setConfig(config);
  }
  @Input('data') data: any;
  constructor() {
    super();
  }

  ngOnInit() {}

  onSelect(event) {
    
  }
}
