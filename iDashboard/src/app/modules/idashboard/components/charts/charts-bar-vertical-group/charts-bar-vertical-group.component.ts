import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "leap-charts-bar-vertical-group",
  templateUrl: "./charts-bar-vertical-group.component.html",
  styleUrls: ["./charts-bar-vertical-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartsBarVerticalGroupComponent extends BaseChart implements OnInit {
  @Input("data") data: any;
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
