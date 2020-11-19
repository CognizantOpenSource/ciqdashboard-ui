import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "app-chart-bar-vertical-stacked",
  templateUrl: "./chart-bar-vertical-stacked.component.html",
  styleUrls: ['../base-chart.scss' , "./chart-bar-vertical-stacked.component.scss"],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default
})

export class ChartBarVerticalStackedComponent extends BaseChart implements OnInit {

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
