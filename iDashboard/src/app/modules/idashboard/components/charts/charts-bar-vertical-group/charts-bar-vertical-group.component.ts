import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "leap-charts-bar-vertical-group",
  templateUrl: "./charts-bar-vertical-group.component.html",
  styleUrls: ["../base-chart.scss" , "./charts-bar-vertical-group.component.scss"],
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
