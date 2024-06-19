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
import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, ViewRef } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
/**
* DataTableComponent
* @author Cognizant
*/
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})

export class DataTableComponent implements OnInit, OnChanges {

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
  constructor(private cdr: ChangeDetectorRef) { }
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
  refresh(state: ClrDatagridStateInterface) {
    //console.log('refressh', state);
    this.loading = true;
    const filters: { [prop: string]: any[] } = {};
    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = <{ property: string; value: string }>filter;
        filters[property] = [value];
      }
    }
    if (!state.page) {
      state.page = {
        from: 0,
        to: 9,
        size: 10,
      };
    }
    //this.sortorder(<{ by: string; reverse: boolean }>state.sort);
    this.loading = false;
    //console.log('finalresultset',this.rows);
  }
  // sortorder(sort: { by: string; reverse: boolean }){
  //   console.log('rows',this.rows);
  //   console.log('reverse',sort.by,typeof(sort.by),sort.reverse,this.rows);
  //   if(typeof(sort.by)=='string' && sort.reverse == false){
  //     console.log('stringggreversefalse');
  //     let columnname = sort.by;
  //     this.rows.sort((a, b) => {
  //       console.log('a',a,b,columnname);
  //       let fa = a.columnname,
  //           fb = b.columnname;
  //       if (fa < fb) {
  //           return -1;
  //       }
  //       if (fa > fb) {
  //           return 1;
  //       }
  //       return 0;
  //      });
  //      console.log('rowsss',this.rows);
  //   }
  //   else if(typeof(sort.by)=='string' && sort.reverse == true){
  //     this.rows.reverse();
  //   }
  //   this.loading = false;
  //   return this;
  //   // if(reverse==true){
  //   //   this.rows.reverse();
  //   // }
  // }
  ngOnInit() {
    //console.log('cloumnDatatable',this.columns,this.rows);
  }
}


