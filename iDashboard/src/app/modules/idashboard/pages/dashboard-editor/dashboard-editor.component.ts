import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from '../../services/idashboard.service';
import { UnSubscribable } from 'src/app/components/unsub';
import { ActivatedRoute, Router, ActivationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { filter, map, distinctUntilChanged, take, tap } from 'rxjs/operators';
import { UserConfigService } from '../../services/user-config.service';
import { IGridConfig, IDashboard } from '../../model/data.model';
import { CreateItemComponent } from '../create-item/create-item.component';
import { DashboardGridComponent } from '../dashboard-editor/dashboard-grid/dashboard-grid.component';
import { DashboardItemsService } from '../../services/idashboard-items.service';
import { DashboardProjectService } from '../../services/idashboard-project.service';
import { combineLatest } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { cloneDeep } from 'lodash';
import { IDashBoard } from '../dashboard-home/idashboard';
import { CreateLabelComponent } from '../create-label/create-label.component';

export function getEmptyPage(name) {
  return { name, gridConfig: { rows: 8, columns: 8 }, items: [] }
}
@Component({
  templateUrl: './dashboard-editor.component.html',
  styleUrls: ['./../../components/idashboard.scss', './dashboard-editor.component.scss']
})
export class DashboardEditorComponent extends IDashBoard implements OnInit {

  preview = false;
  rigntSidebarCollapsed = false;
  showModal = false;
  rtab;
  dashboard: IDashboard;
  selected: any;
  theme$;
  allItems$;
  params = {} as any;

  opened: boolean = false;
  activePage: any;
  activePageIndex: number;
  loadedItem: any;
  constructor(
    private route: ActivatedRoute, private router: Router, private config: UserConfigService,
    private toastr: ToastrService, private projectService: DashboardProjectService,
    private dashboardService: DashboardService, dashItemService: DashboardItemsService
  ) {
    super(dashItemService);
  }

  get currentGrid() {
    return this.activePage;
  }
  ngOnInit() {
    this.allItems$ = this.dashItemService.items$;
    this.theme$ = this.config.theme$;
    this.managed(this.route.params.pipe(map(params => params.dashboardId), distinctUntilChanged(), tap(console.log)))
      .subscribe(id => {
        const dashboardId = id;
        if (dashboardId) {
          if (!this.dashboard || this.dashboard.id !== dashboardId) {
            this.dashboardService.loadDashboard(dashboardId);
          }
        }
        this.params = this.route.snapshot.params;
        this.updateModal(this.route.snapshot.children);
        console.log({ ...this.params })
      });
    this.managed(this.route.params).pipe(map(params => params.page), distinctUntilChanged()).subscribe(page => this.activePageIndex = +page);

    this.managed(this.dashboardService.dashboard$)
      .pipe(filter(d => d.id === this.params.dashboardId), distinctUntilChanged())
      .subscribe(dash => {
        this.dashboard = dash;
        //set active page
        const page = this.activePageIndex >= 0 && dash.pages[this.activePageIndex] ? dash.pages[this.activePageIndex]
          : (dash.pages.find(p => p.active) || dash.pages[0]);
        this.changeActivePage(page);
        this.updateDashBoardData(dash);
        if (this.params.item >= 0) {
          const selected = this.currentGrid.items[this.params.item];
          if (selected) {
            selected.index = +this.params.item;
            if (!this.selected || this.selected.index !== this.params.item)
              this.selectItem(selected);
          }
        }
      });
    this.managed(this.router.events).pipe(
      filter(event => event instanceof ActivationEnd),
      filter(event => (event as ActivationEnd).snapshot.component === DashboardEditorComponent),
      map(event => (event as ActivationEnd).snapshot.children),
      distinctUntilChanged()
    ).subscribe(children => this.updateModal(children));

    this.dashItemService.itemsWizardEvent$.subscribe(event => {
      if (this.selected && event.type == 'created') {
        this.updateSelectedItem(event.data, true);
        this.dashItemService.loadItems();
      }
    });
  }

  private updateModal(children: ActivatedRouteSnapshot[]) {
    this.showModal = children.some(c => c.component === CreateItemComponent || CreateLabelComponent);
  }
  private updateGrid() {
    // trigger update grid
    setTimeout(() => {
      console.log('updating grid', this.currentGrid.gridConfig);
      this.currentGrid.gridConfig = { ...this.currentGrid.gridConfig };
    }, 50);
  }
  selectItem(item) {
    this.selected = item;
    if (item) {
      this.rtab = item.id ? 'edit' : 'new';
      const paramItem = this.route.snapshot.params.item;
      if (paramItem === '' || +paramItem !== item.index) {
        this.router.navigate(['../', item.index], { relativeTo: this.route });
      }
    } else {
      // unselect
      this.router.navigate(['../'], { relativeTo: this.route });
    }

  }
  updateSelectedItem(item, forceUpdate = false) {
    item = { ...this.selected, ...item };
    if (!item.data || forceUpdate) {
      this.updateItemData(item, this.activePageIndex, item.index);
    }
    this.currentGrid.items[this.selected.index] = item;
    this.selectItem(item);
  }
  togglePreview() {
    this.preview = !this.preview;
    this.updateGrid();
  }
  toggleRightSidebarState() {
    this.rigntSidebarCollapsed = !this.rigntSidebarCollapsed;
    this.updateGrid();
  }
  saveDashboard() {
    this.dashboardService.save(this.dashboard).subscribe(res => {
      this.toastr.success('dashboard saved successfully');
      this.projectService.project$.pipe(take(1)).subscribe(p => this.dashboardService.loadDashboards(p.id));
    }, error => this.toastr.error('error while saving dashboard'));
  }
  onItemOptionsChange(item) {
    console.log('opt change', item.options)
    if (item.options) {
      item.name = item.options.name;
      item.description = item.options.description;
      item.options = { ...item.options };
    }
    this.updateGrid();
    // TODO : fix label options live update issue on first edit
    // TODO : fix label properties not passed on
  }
  onGridConfigChange(config: IGridConfig) {
    this.updateGrid();
  }
  onModalClosed() {
    this.router.navigate(['./'], { relativeTo: this.route });
  }
  changeActivePage(page) {
    if (this.activePage !== page) {
      if (this.activePage) {
        this.activePage.active = false;
      }
      page.active = true;
      this.activePage = page;
      this.activePageIndex = this.dashboard.pages.indexOf(page);
    }
  }
  createNewPage() {
    const page = getEmptyPage('New Page');
    this.dashboard.pages.push(page);
    this.changeActivePage(page);
  }
  clonePage(page, pages) {
    const clonePage = cloneDeep(page);
    pages.push({ ...clonePage, name: page.name + ' - copy' });
  }
  deletePage(page, pages) {
    const index = pages.indexOf(page);
    pages.splice(index, 1);
    if (pages[index - 1])
      this.changeActivePage(pages[index - 1]);
  }
  removeItem(item) {
    if (confirm(`Are you sure to delete ${item.name}?`)) {
      item.disabled = true;
      this.dashItemService.deleteItem(item.id).subscribe(res => {
        this.toastr.success('item deleted successfully');
      }, error => this.toastr.error('error while deleting item'));
    }
  }
}