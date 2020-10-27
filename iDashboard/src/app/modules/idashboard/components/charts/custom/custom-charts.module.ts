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