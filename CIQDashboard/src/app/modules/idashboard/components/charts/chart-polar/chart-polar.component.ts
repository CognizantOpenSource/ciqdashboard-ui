import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: 'app-chart-polar',
  templateUrl: './chart-polar.component.html',
  styleUrls: ['../base-chart.scss','./chart-polar.component.scss'],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartPolarComponent extends BaseChart implements OnInit {

  @Input('data') data: any;

  @Input() set config(config: any) {
    this.setConfig(config); 
  }

  constructor() {
    super();
  }
  

  ngOnInit() {
  }
  onSelect(event) {
    
  }


}
