import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, ViewRef } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { USERS } from './user';


@Component({
  selector: 'app-chart-data-grid',
  templateUrl: './chart-data-grid.component.html',
  styleUrls: ['./chart-data-grid.component.scss']
})
export class ChartDataGridComponent implements OnInit {

  users = USERS;

  gridDataLoaded = false;
  loading: boolean = true;
  total: number;
  //rows:any;
  @Input('columns') columns: any[];
  @Input('config') options: any;
  @Input('data') rows: any;
  // @Input('data') setData(rows: any) {
  //   this.rows = rows;
  //   console.log('rowssss',this.rows);
  // }
  constructor(private cdr: ChangeDetectorRef) {
   }
  getHeaders() {
    let headers: string[] = [];
    //console.log('thisrowss',this.rows);
    if(this.rows) {
      this.rows.forEach((value) => {
        Object.keys(value).forEach((key) => {
          if(!headers.find((header) => header == key)){
            if(key != 'name' && key!='value'){
              headers.push(key)
            }
          }
        })
      })
    }
    //console.log('headers',headers);
    return headers;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.gridDataLoaded = false;
    setTimeout(() => {
      //console.log('rowsss',typeof(this.rows));
      this.gridDataLoaded = this.columns && this.rows && true;
      if (this.cdr && !(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit() {
    
  }

}
