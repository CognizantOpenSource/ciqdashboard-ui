import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "leap-chart-bar-horizontal-normalized",
  templateUrl: "./chart-bar-horizontal-normalized.component.html",
  styleUrls: ["./chart-bar-horizontal-normalized.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartBarNormalizedComponent extends BaseChart implements OnInit {

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
