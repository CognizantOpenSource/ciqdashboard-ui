import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "app-charts-bar-horizontal-group",
  templateUrl: "./charts-bar-horizontal-group.component.html",
  styleUrls: ["../base-chart.scss" , "./charts-bar-horizontal-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartsBarHorizontalGroupComponent extends BaseChart implements OnInit {
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
