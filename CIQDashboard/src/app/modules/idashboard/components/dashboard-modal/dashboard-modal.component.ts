import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-modal',
  templateUrl: './dashboard-modal.component.html',
  styleUrls: ['./dashboard-modal.component.scss']
})
export class DashboardModalComponent implements OnInit {

  @Input() open = false;
  @Input() native = false;
  @Input() size = 'md';
  @Output() openChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {

  }
  close(){
    this.open = false;
    this.openChange.emit(false);
  }

}
