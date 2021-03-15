import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from '../../services/ciqdashboard.service';
import { ActivatedRoute, Router, ActivationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { filter, map, distinctUntilChanged, take, tap } from 'rxjs/operators';
import { UserConfigService } from '../../services/user-config.service';
import { IGridConfig, IDashboard } from '../../model/data.model';
import { CreateItemComponent } from '../create-item/create-item.component';
import { DashboardItemsService } from '../../services/ciqdashboard-items.service';
import { DashboardProjectService } from '../../services/ciqdashboard-project.service';
import { ToastrService } from 'ngx-toastr';
import { cloneDeep } from 'lodash';
import { IDashBoard } from '../dashboard-home/idashboard';
import { CreateLabelComponent } from '../create-label/create-label.component';
import { parseApiError } from 'src/app/components/util/error.util';

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
  renamePage: any;
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
    this.managed(this.route.params.pipe(map(params => params.dashboardId), distinctUntilChanged()))
      .subscribe(dashboardId => {
        if (dashboardId) {
          if (!this.dashboard || this.dashboard.id !== dashboardId) {
            this.dashboardService.loadDashboard(dashboardId);
          }
        }
        this.params = this.route.snapshot.params;
        this.updateModal(this.route.snapshot.children);
      });
    this.managed(this.route.queryParams).pipe(map(params => params.page), filter(it => !!it), distinctUntilChanged())
      .subscribe(page => this.activePageIndex = +page);
    this.managed(this.route.params).pipe(map(params => params.page), filter(it => !!it), distinctUntilChanged())
      .subscribe(page => this.changePageQueryParam(page, true));

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
      this.currentGrid.gridConfig = { ...this.currentGrid.gridConfig };
    }, 50);
  }
  selectItem(item) {
    this.selected = item;
    const queryParams = { page: this.activePageIndex };
    if (item) {
      this.rtab = item.id ? 'edit' : 'new';
      const paramItem = this.route.snapshot.params.item;
      if (paramItem === '' || +paramItem !== item.index) {
        this.router.navigate(['../', item.index,], { relativeTo: this.route, queryParams });
      }
    } else {
      // unselect
      this.router.navigate(['../'], { relativeTo: this.route, queryParams });
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
    }, error => {
      const parsedError = parseApiError(error, 'error while saving dashboard');
      this.toastr.error(parsedError.message, parsedError.title);
    });
  }
  onItemOptionsChange(item) {
    if (item.options) {
      item.name = item.options.name;
      item.description = item.options.description;
      item.options = { ...item.options };
    }
    this.updateGrid();
  }
  onGridConfigChange(config: IGridConfig) {
    this.updateGrid();
  }
  onModalClosed() {
    this.router.navigate(['./'], { relativeTo: this.route });
  }
  closeRenamePage() {
    if (!this.renamePage.name || this.renamePage.name == '')
      this.renamePage.name = 'page-' + (this.dashboard.pages.indexOf(this.renamePage) + 1);
    this.renamePage = null;
  }
  showRenamePopup(page) {
    this.renamePage = page;
  }

  private changePageQueryParam(page: number, removeParam = false) {
    // use 'remove' param to remove existing page param in route
    this.router.navigate(removeParam ? [{}] : [], { relativeTo: this.route, queryParams: { page }, queryParamsHandling: 'merge' });
  }
  changeActivePage(page) {
    if (this.activePage !== page) {
      if (this.activePage) {
        this.activePage.active = false;
      }
      page.active = true;
      this.activePage = page;
      this.changePageQueryParam(this.dashboard.pages.indexOf(page));
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
      }, error => {
        const parsedError = parseApiError(error, 'error while deleting item');
        this.toastr.error(parsedError.message, parsedError.title);
      });
    }
  }
}
