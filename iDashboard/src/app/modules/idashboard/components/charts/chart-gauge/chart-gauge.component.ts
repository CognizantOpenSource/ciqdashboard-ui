import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "leap-chart-gauge",
  templateUrl: "./chart-gauge.component.html",
  styleUrls: ["./chart-gauge.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartGaugeComponent extends BaseChart implements OnInit {
  

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
