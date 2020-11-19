import { Component, OnInit, Input, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: 'app-chart-area',
  templateUrl: './chart-area.component.html',
  styleUrls: ['../base-chart.scss', './chart-area.component.scss'],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default,
})

export class ChartAreaComponent extends BaseChart implements OnInit {

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
