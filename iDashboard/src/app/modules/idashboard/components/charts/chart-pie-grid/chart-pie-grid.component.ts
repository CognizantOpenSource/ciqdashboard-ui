import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "app-chart-pie-grid",
  templateUrl: "./chart-pie-grid.component.html",
  styleUrls: ["./chart-pie-grid.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartPieGridComponent extends BaseChart implements OnInit {
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
