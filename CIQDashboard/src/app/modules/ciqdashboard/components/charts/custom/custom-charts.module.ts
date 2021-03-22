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
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BarGaugeComponent } from './bar-chart/bar-gauge.component';
import { BarVerticalGaugeComponent } from './bar-chart/bar-vertical-gauge.component';
import { BarVerticalGroupedGaugeComponent } from './bar-chart/bar-vertical-grouped-gauge.component';
import { SeriesVerticalComponent2 } from './bar-chart/series-vertical.component';
const CUSTOM_CHARTS = [
    BarVerticalGroupedGaugeComponent,
    BarVerticalGaugeComponent,
    SeriesVerticalComponent2,
    BarGaugeComponent
];
@NgModule({
    declarations: [
        ...CUSTOM_CHARTS
    ],
    imports: [
        NgxChartsModule,
    ],
    exports: [
        ...CUSTOM_CHARTS
    ]
})

export class CustomChartsModule {

}