import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "leap-chart-line-area-stacked",
  templateUrl: "./chart-line-area-stacked.component.html",
  styleUrls: ["./chart-line-area-stacked.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartLineAreaStackedComponent extends BaseChart implements OnInit {
  
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
