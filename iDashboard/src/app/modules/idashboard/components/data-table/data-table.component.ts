import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'leap-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input('columns') columns: any[];
  @Input('data') rows: any[];
  @Input('config') options:any; 
  constructor() { }

  ngOnInit() {

  }

}
