import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "app-chart-combo-chart",
  templateUrl: "./chart-combo-chart.component.html",
  styleUrls: ["./chart-combo-chart.component.scss"],
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
