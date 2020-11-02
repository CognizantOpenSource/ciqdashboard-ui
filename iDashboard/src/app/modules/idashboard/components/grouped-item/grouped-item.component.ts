import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { UnSubscribable } from 'src/app/components/unsub';
import { cut } from 'src/app/modules/home/home.component';
import { groupBy } from 'lodash';
import { DashboardDataSourceService } from '../../services/idashboard-datasource.service';
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
    this.updateLinks(data || []);
  }
  @Input('filterValue') set setFilter(val: string) {
    if (this.data) {
      if (val && val !== '') {
        this.updateLinks(this.data.filter(link =>
          ((this.filterBy ? this.filterBy(link) : link.name) || '').toLowerCase().includes(val.toLowerCase())
        ));
      } else {
        this.updateLinks(this.data);
      }
    }
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
  private updateLinks(list) {
    this.links = this.grouped(list).sort((a, b) => a.name.localeCompare(b.name));
    if (this.links.length == 1) {
      this.expanded = { [this.links[0].name]: true };
    }
  }
  constructor() {
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
    //TODO: fix first click issue when search is active
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
