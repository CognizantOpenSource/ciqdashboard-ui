import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'leap-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.scss']
})
export class SidebarLeftComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
  dragStartHandler(ev: DragEvent, widgetIdentifier : string) {
    ev.dataTransfer.setData('widgetIdentifier', widgetIdentifier);
    ev.dataTransfer.dropEffect = 'copy';
  }

}
