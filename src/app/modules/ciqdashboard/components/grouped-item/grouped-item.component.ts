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
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ViewRef } from '@angular/core';
import { UnSubscribable } from 'src/app/components/unsub';
import { cut } from 'src/app/modules/home/home.component';
import { groupBy } from 'lodash';
/**
* GroupedItemComponent
* @author Cognizant
*/
@Component({
  selector: 'app-grouped-item',
  templateUrl: './grouped-item.component.html',
  styleUrls: ['./grouped-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupedItemComponent extends UnSubscribable implements OnInit {

  links: Array<any> = [];
  data: any[] = [];
  @Input() set items(data: Array<any>) {
    this.data = data;
    this.updateLinks();
  }
  filterValue;
  @Input('filterValue') set setFilter(val: string) {
    this.filterValue = val;
    this.updateLinks();
  }
  @Input('filterBy') filterBy: Function;
  @Input('groupBy') groupbyKey;
  @Input() sidebarView = false;

  @Output() itemSelect = new EventEmitter<any>();
  @Input() canRemove;
  @Input() canEdit;
  @Output() itemRemove = new EventEmitter<any>();
  @Output() itemEdit = new EventEmitter<any>();

  expanded: any = { others: false };
  loading = false;
  private updateLinks() {
    this.loading = true;
    setTimeout(() => {
      let list = this.data || [];
      if (this.filterValue && this.filterValue !== '') {
        list = this.data.filter(link =>
          ((this.filterBy ? this.filterBy(link) : link.name) || '').toLowerCase().includes(this.filterValue.toLowerCase())
        );
      }
      this.links = this.grouped(list).sort((a, b) => a.name.localeCompare(b.name));
      if (this.links.length == 1) {
        this.expanded = { [this.links[0].name]: true };
      }
      this.loading = false;
      if (this.cdr && !(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    });
  }
  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
  }
  grouped(links: Array<any>, groupByField = this.groupbyKey || 'group') {
    const group = groupBy(links, link => (link[groupByField] || 'others').toLowerCase());
    return Object.keys(group).map(name => ({ name, links: group[name] }));
  }

  getIcon(link: any): any {
    return { type: link.imageType || 'image', name: link.name, data: link.image, desc: link.name };
  }
  getImageText(name: string) {
    return name.includes(' ') ? cut(name.split(' ', 2)[0], 1) + cut(name.split(' ', 2)[1], 1) : cut(name, 2);
  }
  onSelectItem(item) {
    this.itemSelect.emit(item);
  }
  removeItem(item, event) {
    this.itemRemove.emit(item);
    if (event) {
      super.consume(event);
    }
  }
  editItem(item, event) {
    this.itemEdit.emit(item);
    if (event) {
      super.consume(event);
    }
  }
}
