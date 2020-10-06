import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: "leap-chart-bubble",
  templateUrl: "./chart-bubble.component.html",
  styleUrls: ["./chart-bubble.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartBubbleComponent extends BaseChart implements OnInit {

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
