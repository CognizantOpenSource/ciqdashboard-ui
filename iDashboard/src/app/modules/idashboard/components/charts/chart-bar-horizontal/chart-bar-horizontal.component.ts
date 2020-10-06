import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "leap-chart-bar-horizontal",
  templateUrl: "./chart-bar-horizontal.component.html",
  styleUrls: ["./chart-bar-horizontal.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartBarHorizontalComponent extends BaseChart implements OnInit {

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