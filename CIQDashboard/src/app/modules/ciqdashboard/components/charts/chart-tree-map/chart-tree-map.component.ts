// © [2021] Cognizant. All rights reserved.
 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
 
//     http://www.apache.org/licenses/LICENSE-2.0
 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from "@angular/core";
import { BaseChart } from '../base-chart'
/**
* ChartTreeMapComponent
* @author Cognizant
*/

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
