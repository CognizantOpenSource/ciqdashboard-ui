import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drop-down-filter',
  templateUrl: './drop-down-filter.component.html',
  styleUrls: ['./drop-down-filter.component.css']
})
export class DropDownFilterComponent implements OnInit {

  @Input() options: string[];
  @Input() selected: string;
  openDropDown;

  @Output() selectedChange = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
    this.selected = this.selected || this.options[0];
  }

  select(option: string): void {
    this.selected = option;
    this.selectedChange.emit(option);
  }

}
