import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

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
