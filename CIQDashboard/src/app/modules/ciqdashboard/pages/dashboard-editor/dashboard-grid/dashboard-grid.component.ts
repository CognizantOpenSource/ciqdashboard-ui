import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { GridsterConfig, DisplayGrid, GridType, CompactType } from 'angular-gridster2';
import { IGridConfig } from '../../../model/data.model';
import { UnSubscribable } from 'src/app/components/unsub';
interface IDashBoardItem {
  [key: string]: any;
}
@Component({
  selector: 'app-dashboard-grid',
  templateUrl: './dashboard-grid.component.html',
  styleUrls: ['./dashboard-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardGridComponent extends UnSubscribable implements OnInit, OnChanges {

  // TODO: match max used rows/cols to min rows/cols to the editor
  @Input() set config(config: IGridConfig) {
    this.setConfig(config);
  }

  @Input() items: Array<IDashBoardItem> = [];
  @Output() itemsChange = new EventEmitter<Array<IDashBoardItem>>();
  selected = null;
  @Input('selected') set setSelected(item) {
    this.selected = item && item.index;
  }
  @Input() pageIndex;
  @Input('update') set setItemUpdate(spec) {
    if (spec && spec.page === this.pageIndex
      && spec.item && this.items && this.items.length > spec.item) {
      this.items[spec.item] = { ...spec.value || this.items[spec.item] };
    }
  }
  @Output() selectedChange = new EventEmitter<IDashBoardItem>();

  margin = 5;

  options: GridsterConfig = {
    gridType: GridType.ScrollVertical,
    compactType: CompactType.None,
    displayGrid: DisplayGrid.Always,
    disableScrollHorizontal: true,
    pushItems: true,
    swap: true,
    margin: this.margin,
    ...this.getOuterMargin(this.margin),
    minCols: 12,
    maxCols: 100,
    minRows: 6,
    maxRows: 100,
    fixedRowHeight: 120,
    fixedColWidth: 120,
    setGridSize: false,
    mobileBreakpoint: 480,
    enableEmptyCellDrop: true,
    resizable: {
      enabled: true
    },
    draggable: {
      enabled: true
    },
    emptyCellDropCallback: this.onItemDropEmptyCell.bind(this),
    itemChangeCallback: this.onItemsChange.bind(this),
  };

  constructor() {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit() {
  }

  getOuterMargin(margin) {
    const outerMarigin = margin <= 0 ? 2 : 2;
    return {
      outerMargin: outerMarigin > 0,
      outerMarginTop: outerMarigin,
      outerMarginRight: outerMarigin,
      outerMarginBottom: outerMarigin,
      outerMarginLeft: outerMarigin
    }
  }
  private setConfig(config: IGridConfig) {

    this.options.minRows = config.rows;
    this.options.maxRows = config.rows;
    this.options.minCols = config.columns;
    this.options.maxCols = config.columns;
    this.options = { ...this.options };
    if (this.options.api) {
      this.options.api.optionsChanged();
      this.options.api.resize();
    }
  }
  onItemDropEmptyCell(event: DragEvent, item: any) {
    //console.info(event);
    const itemGroup = event.dataTransfer.getData('widgetIdentifier');
    const type = itemGroup;
    item = { ...item, rows: 1, cols: 1, type, itemGroup, id: null };
    this.items.push(item);
    this.itemsChange.emit(this.items);
  }
  onItemsChange(item, itemComponent) {
    // trigger chart resize
    item.data = item.data && [...item.data];
    this.itemsChange.emit(this.items);
    // trigger resize for combo chart
    setTimeout(_ => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  }
  removeItem($event: MouseEvent | TouchEvent, index: number) {
    super.consume($event);
    this.items.splice(index, 1);
  }
  selectItem(item, index) {
    item.index = index;
    this.selected = (this.selected == index) ? null : index;
    this.selectedChange.emit(this.selected !== null ? item : null);
  }
  getImageIcon(imgItem: any) {
    return { type: imgItem.type || 'image', name: imgItem.name, data: imgItem.options.ImageSrc, desc: imgItem.description };
  }
  pick(item = {} as any) {
    const { id, type, source, options, index } = item;
    return { index, item: { id, type, source }, options };
  }
}
