import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {

  gridDataLoaded = false;
  @Input('columns') columns: any[];
  @Input('data') rows;
  @Input('config') options: any;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.gridDataLoaded = false;
    setTimeout(() => {
      this.gridDataLoaded = this.columns && this.rows && true;
    });
  }

  ngOnInit() {

  }

}
