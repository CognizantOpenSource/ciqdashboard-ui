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
