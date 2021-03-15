import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "app-chart-bar-vertical-normalized",
  templateUrl: "./chart-bar-vertical-normalized.component.html",
  styleUrls: ['../base-chart.scss' , "./chart-bar-vertical-normalized.component.scss"],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartBarVerticalNormalizedComponent extends BaseChart implements OnInit {
  
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
