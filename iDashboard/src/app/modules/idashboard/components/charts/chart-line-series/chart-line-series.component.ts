import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: 'leap-chart-line-series',
  templateUrl: './chart-line-series.component.html',
  styleUrls: ["../base-chart.scss" , './chart-line-series.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class ChartLineSeriesComponent extends BaseChart implements OnInit {

 
  @Input('data') data: any; 
  @Input('config') set config(config: any) {
    this.setConfig(config); 
  }
  constructor() {
    super();
  }
  onSelect(event) {
    
  }

  ngOnInit() {

  }


}
