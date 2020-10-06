import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { Dashboard } from '../../dashboard/Dashboard';


@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.css']
})

export class AdvancedFilterComponent extends Dashboard implements OnInit {

  @Input() filterObject: any;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();

  statusCheckedList = [];

  isToDuration = false;

  ngOnInit() {
    this.isToDuration = this.filterObject.rangeSelect === 'btw' || false;
  }

  onChange(selection) {
    if (selection === 'btw') {
      this.isToDuration = true;
    } else {
      this.isToDuration = false;
    }
  }

  onCheckboxChange(statusObject, event) {
    this.statusCheckedList = [];
    this.filterObject.statusList.map(statusObj => {
      if (statusObj.id === statusObject.id) {
        if (event.target.checked) {
          statusObj.checked = true;
        } else {
          statusObj.checked = false;
        }
      }
      this.statusCheckedList.push(statusObj);
    });
    this.filterObject.statusList = this.statusCheckedList;
  }

  onReset() {
    this.filterObject = {
      rangeSelect: 'gt', durationFrom: '', durationTo: '', statusList: this.getStatusList()
    };
    this.onSubmit.emit(this.filterObject);
  }
}
