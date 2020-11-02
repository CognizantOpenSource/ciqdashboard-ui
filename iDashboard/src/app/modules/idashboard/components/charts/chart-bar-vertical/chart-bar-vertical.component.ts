import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "app-chart-bar-vertical",
  templateUrl: "./chart-bar-vertical.component.html",
  styleUrls: ["../base-chart.scss" , "./chart-bar-vertical.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartBarVerticalComponent extends BaseChart implements OnInit {

  @Input('data') data: any; 
  @Input('config') set config(config: any) {
    this.setConfig(config); 
  }

  constructor() {
    super();
  }
  

  onSelect(event) {
    
  }

  ngOnInit() {}
}
