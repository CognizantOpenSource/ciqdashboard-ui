import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'leap-active-fab',
  templateUrl: './active-fab.component.html',
  styleUrls: ['./active-fab.component.css']
})
export class ActiveFabComponent implements OnInit {

  @Input() dir = 'top-right-vertical';
  @Input() type = 'button';

  constructor() { }

  ngOnInit() {
  }

}
