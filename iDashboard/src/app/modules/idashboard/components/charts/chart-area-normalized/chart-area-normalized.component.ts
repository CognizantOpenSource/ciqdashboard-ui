import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'


@Component({
  selector: "leap-chart-area-normalized",
  templateUrl: "./chart-area-normalized.component.html",
  styleUrls: ["../base-chart.scss" , "./chart-area-normalized.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartAreaNormalizedComponent extends BaseChart implements OnInit {

  @Input('data') data: any; 
  @Input('config') set config(config: any) {
    this.setConfig(config); 
  }
  constructor() {
    super();
  }

  ngOnInit() {}

  onSelect(event) {
    
  }
}
