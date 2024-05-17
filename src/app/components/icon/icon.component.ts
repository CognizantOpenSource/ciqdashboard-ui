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
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
/**
 * IconComponent
 * @author Cognizant
*/
type IconType = 'image' | 'clr-icon' | 'fa-icon';
interface Icon {
  type: IconType;
  data: string;
  name?: string;
  desc?: string;
}
interface IconConfig extends Icon {
  icons?: Array<Icon>;
}
const getTitle = (icon: Icon) => icon.desc || icon.name;

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements OnInit {

  @Input() icon: IconConfig;
  constructor() { }

  @Input() round = false;
  @Input() size = '2rem';
  get icon1(): Icon {
    return this.icon && this.icon.icons && this.icon.icons[0];
  }
  get icon2(): Icon {
    return this.icon && this.icon.icons && this.icon.icons[1];
  }
  ngOnInit() {
  }
  isImage(icon: Icon): boolean {
    return 'image' === icon.type;
  }
  isClrIcon(icon: Icon): boolean {
    return 'clr-icon' === icon.type;
  }
  isFaIcon(icon: Icon): boolean {
    return 'fa-icon' === icon.type;
  }
  getTitle(icon: IconConfig): string {
    if (icon.icons) {
      return `${getTitle(icon)} ${getTitle(icon.icons[0])} ${getTitle(icon.icons[1])}`;
    }
    return getTitle(icon);
  }
}
