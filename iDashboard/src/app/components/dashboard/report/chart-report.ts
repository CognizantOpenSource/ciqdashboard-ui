import { Report, VIEWS } from './report';
import { DefaultCharts, IDashBoardItem } from 'src/app/model/report.model';
import { Output, EventEmitter, Input } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';

export class ChartReport extends Report {
  static customColors = [
    { name: 'passed', value: 'var(--green)' },
    { name: 'failed', value: 'var(--red)' },
    { name: 'skipped', value: 'var(--grey)' },
    { name: 'aborted', value: 'var(--orange)' }
  ];
  static colorScheme = {
    domain: [
      'rgb(0%, 58.8%, 53.3%)',
      'rgb(168, 56, 93)',
      '#673ab7',
      '#607d8b',
      'rgb(122, 163, 229)',
      '#ff7f50',
      '#8df08c',
      '#936cde',
      '#84cdfc',
      '#4779b9',
      '#54d2b4',
      '#fab26d',
      '#e67098'
    ]
  };

  public paths: Array<any> = [];
  private _viewData: Array<any>;

  private _data: any;
  @Input() set data(data: any) {
    this._data = data;
  }
  get data() {
    return this._data;
  }
  _config: IDashBoardItem;
  @Input() set config(config: IDashBoardItem) {
    if (!config.template || !config.template.title) {
      if (!config.template) {
        config.template = {} as any;
      }
      config.template.title = config.name;
    }
    this._config = config;
  }
  get config() {
    return this._config;
  }

  _context = {} as any;
  @Input() set context(c: any) {
    this._context = { ...this._context, ...c };
  }
  get context() {
    return this._context;
  }

  @Output() select = new EventEmitter<any>();
  @Output() remove = new EventEmitter<GridsterItem>();
  @Output() bookmark = new EventEmitter<GridsterItem>();

  public get viewData() {
    return this._viewData || this.data;
  }
  get groupView() {
    return VIEWS.grouped;
  }
  get percentView() {
    return VIEWS.percentage;
  }
  get colorScheme() {
    return ChartReport.colorScheme;
  }
  get customColors() {
    return ChartReport.customColors;
  }
  get isInteractive() {
    return this.config.properties && this.config.properties.interactive;
  }
  selected(node) {
    this.select.emit(node);
    if (this.isInteractive) {
      if (this.viewData.find(e => e.name === node.name).children) {
        this.changePath([...this.paths, node]);
        this.updateChartData();
      }
    }
  }
  changePath(paths: any[]) {
    this.paths = [...paths];
    this.updateChartData();
  }
  private updateChartData() {
    this._viewData = this.paths.reduce(
      (view, path) => {
        return view.find(e => e.name === path.name).children;
      }, [...this.data]
    );
  }
  resolve(template = '', context = {}) {
    context = { ...this.context, ...context };
    return this.resolveContext(template, context);
  }
  consume($event: MouseEvent) {
    let res = $event.preventDefault && $event.preventDefault();
    res = $event.stopPropagation && $event.stopPropagation();
    res = $event.stopImmediatePropagation && $event.stopImmediatePropagation();
  }
}
