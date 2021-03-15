import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: 'app-chart-pie-advanced',
  templateUrl: './chart-pie-advanced.component.html',
  styleUrls: ['./chart-pie-advanced.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartAdvancedPieChartComponent extends BaseChart implements OnInit {

  @Input('data') data: any; 

  @Input('config') set config(config: any) {
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
