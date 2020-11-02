import { Component, OnInit, Input, ChangeDetectionStrategy } from "@angular/core";
import { BaseChart } from '../base-chart'

@Component({
  selector: "app-chart-pie",
  templateUrl: "./chart-pie.component.html",
  styleUrls: ["./chart-pie.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartPieComponent extends BaseChart implements OnInit {

  @Input('data') data: any; 
  @Input('config') set config(config: any) {
    this.setConfig(config); 
  }
  constructor() {
    super();
  }

  ngOnInit() { }

  onSelect(event) {
    
  }
}
