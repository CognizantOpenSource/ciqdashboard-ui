import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, ViewRef } from '@angular/core';

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
  constructor(private cdr: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.gridDataLoaded = false;
    setTimeout(() => {
      this.gridDataLoaded = this.columns && this.rows && true;
      if (this.cdr && !(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit() {
  }

}
