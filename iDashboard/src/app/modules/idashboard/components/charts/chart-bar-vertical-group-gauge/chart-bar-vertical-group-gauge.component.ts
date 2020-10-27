import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BaseChart } from '../base-chart';

@Component({
  selector: 'leap-chart-bar-vertical-group-gauge',
  templateUrl: './chart-bar-vertical-group-gauge.component.html',
  styleUrls: ["../base-chart.scss", "./chart-bar-vertical-group-gauge.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartBarVerticalGroupGaugeComponent extends BaseChart implements OnInit {

  yScaleMax: number;

  @Input('config') set config(config: any) {
    this.setConfig(config);
  }
  data: any;
  @Input('data') set setData(data: any) {
    if (data) {
      this.yScaleMax = 0;
      data.forEach(d => {
        d.series && d.series.forEach(e => {
          e.value = +(e.value || e.actual);
          e.extra = e.extra || { target: +(e.target ||  e.value) };
          this.yScaleMax = Math.max(this.yScaleMax, e.value, e.target);
        })
      });
      this.data = data;
    }
  }
  constructor() {
    super();
  }

  ngOnInit() { }

  onSelect(event) {

  }
}
