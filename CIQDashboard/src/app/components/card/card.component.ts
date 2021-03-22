// © [2021] Cognizant. All rights reserved.
 
//     Licensed under the Apache License, Version 2.0 (the "License");
//     you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
 
//         http://www.apache.org/licenses/LICENSE-2.0
 
//     Unless required by applicable law or agreed to in writing, software
//     distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
//     limitations under the License.
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  animations: [
    trigger(
      'root', [
        transition(':enter', [
          style({ transform: 'scale(.9,.9)', opacity: .9 }),
          animate('100ms', style({ transform: 'scale(1,1)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('300ms', style({ transform: 'scale(.5,.5)', opacity: 0 }))
        ])
      ]
    )
  ]
})
export class CardComponent implements OnInit {

  @Input() title: string;
  @Input() closable = false;

  @Input() option: string;
  @Input() options: string[];

  @Input() draggableStep: any;

  @Output() close = new EventEmitter<MouseEvent>();
  @Output() optionChange = new EventEmitter<string>();
  @Output() dragged = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  selectOption(option: string) {
    this.option = option;
    this.optionChange.emit(option);
  }

  onDragged(item: any): void {
    this.dragged.emit(item);
  }
}
