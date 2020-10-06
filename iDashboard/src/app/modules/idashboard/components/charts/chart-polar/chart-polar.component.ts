import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: 'leap-chart-polar',
  templateUrl: './chart-polar.component.html',
  styleUrls: ['./chart-polar.component.scss'],
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
