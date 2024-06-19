import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BaseChart } from '../base-chart';
import { treemap } from '../../../services/items.data';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-tree-map-interactive',
  templateUrl: './chart-tree-map-interactive.component.html',
  styleUrls: ['./chart-tree-map-interactive.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartTreeMapInteractiveComponent extends BaseChart implements OnInit {

  data: any;
  _viewData: Array<any>;
  sumBy: string = 'Size';
  treemap: any[];
  treemapPath: any[] = [];
  view = [700, 300];

  @Input('data') set setData(data: any) {
    this.data = data;
  }
  @Input() set config(config: any) {
    this.setConfig(config);
  }

  constructor() {
    super();
    this.treemapProcess();
  }

  ngOnInit() {
  }

  public get viewData() {
    return this._viewData || this.data;
  }

  treemapProcess(sumBy = this.sumBy) {
    this.sumBy = sumBy;
    const children = treemap[0];
    const value = sumBy === 'Size' ? sumChildren(children) : countChildren(children);
    this.treemap = [children];
    this.treemapPath = [{ name: '>>', children: [children], value }];

    function sumChildren(node) {
      return (node.value = node.size || d3.sum(node.children, sumChildren));
    }

    function countChildren(node) {
      return (node.value = node.children ? d3.sum(node.children, countChildren) : 1);
    }
  }

  treemapSelect(item) {

    if (item.children) {
      const idx = this.treemapPath.indexOf(item);
      this.treemapPath.splice(idx + 1);
      this.treemap = this.treemapPath[idx].children;
      return;
    }
    const node = this.treemap.find(d => d.name === item.name);
    if (node.children) {
      this.treemapPath.push(node);
      this.treemap = node.children;
    }
  }

}
