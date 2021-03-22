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
