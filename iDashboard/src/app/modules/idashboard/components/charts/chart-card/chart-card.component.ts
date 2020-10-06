import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "leap-chart-card",
  templateUrl: "./chart-card.component.html",
  styleUrls: ["./chart-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartCardComponent extends BaseChart implements OnInit {

  @Input('data') data: any; 
  @Input('config') set config(config: any) {
    this.setConfig(config); 
  }
  constructor() {
    super();
  }

  ngOnInit() {}
}
