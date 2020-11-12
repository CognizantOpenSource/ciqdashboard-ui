import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from "@angular/core";
import { BaseChart } from '../base-chart'


@Component({
  selector: "app-chart-tree-map",
  templateUrl: "./chart-tree-map.component.html",
  styleUrls: ["./chart-tree-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartTreeMapComponent extends BaseChart implements OnInit {

  public IsChartInteractive: boolean;

  public paths: Array<any> = [];

  @Input('path') set setPath(path:any[]){
    if(path){
      this.changePath(path);
    }
  }

  private _viewData: Array<any>;

 data: any;
  @Input('data') set setData(data: any) {
    this.data = data;
    if (this.paths && this.paths.length)
      this.changePath([]);
      this.pathChange.emit(this.paths); 
  }
  public get viewData() {
    return this._viewData || this.data;
  }
  
  @Input() set config(config: any) {
    this.setConfig(config);
  }
  @Output() pathChange = new EventEmitter<any[]>();

  labelFormatting(c) {
    return `${c.label}`;
  }

  constructor() {
    super();
  }

  selected(node) {
    if (this.viewData.find((e) => e.name === node.name).children) {
      this.changePath([...this.paths, node]);      
      this.pathChange.emit(this.paths); 
    }
  }

  changePath(paths: any[]) {
    this.paths = [...paths];   
    this.updateChartData();
  }

  updateChartData() { 
    if(this.data){
      this._viewData = this.paths.reduce(
        (view, path) => {
          return view.find((e) => e.name === path.name).children;
        },
        [...this.data]
      );
    }
  }

  ngOnInit() {
   
  }
}
