import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule } from 'angular-gridster2';
import { ExecutionRoutingModule } from './idashboard-routing.module';
import { SharedModule } from '../shared.module';
import { FilterDropdownComponent } from './components/filter-dropdown/filter-dropdown.component';
import { InfoBarReportComponent } from './components/info-bar/info-bar.component';
import { WrapperComponent } from './pages/wrapper/wrapper.component';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { ProjectHomeComponent } from './pages/project-home/project-home.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { DashboardEditorComponent } from './pages/dashboard-editor/dashboard-editor.component';
import { DashboardViewComponent } from './pages/dashboard-view/dashboard-view.component';
import { SidebarLeftComponent } from './pages/dashboard-editor/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from './pages/dashboard-editor/sidebar-right/sidebar-right.component';
import { DashboardGridComponent } from './pages/dashboard-editor/dashboard-grid/dashboard-grid.component';
import { DashboardModalComponent } from './components/dashboard-modal/dashboard-modal.component';
import { CreateItemComponent } from './pages/create-item/create-item.component';
import { GroupedItemComponent } from './components/grouped-item/grouped-item.component';
import { ChartLineSeriesComponent } from './components/charts/chart-line-series/chart-line-series.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartPieComponent } from './components/charts/chart-pie/chart-pie.component';
import { DisplayChartComponent } from './pages/display-chart/display-chart.component';
import { ChartBarVerticalComponent } from './components/charts/chart-bar-vertical/chart-bar-vertical.component';
import { ChartBarHorizontalComponent } from './components/charts/chart-bar-horizontal/chart-bar-horizontal.component';
import { ChartBarNormalizedComponent } from './components/charts/chart-bar-horizontal-normalized/chart-bar-horizontal-normalized.component';
import { ChartBarVerticalStackedComponent } from './components/charts/chart-bar-vertical-stacked/chart-bar-vertical-stacked.component';
import { ChartBarHorizontalStackedComponent } from './components/charts/chart-bar-horizontal-stacked/chart-bar-horizontal-stacked.component';
import { ChartsBarHorizontalGroupComponent } from './components/charts/charts-bar-horizontal-group/charts-bar-horizontal-group.component';
import { ChartsBarVerticalGroupComponent } from './components/charts/charts-bar-vertical-group/charts-bar-vertical-group.component';
import { ChartBarVerticalNormalizedComponent } from './components/charts/chart-bar-vertical-normalized/chart-bar-vertical-normalized.component';
import { ChartAdvancedPieChartComponent } from './components/charts/chart-pie-advanced/chart-pie-advanced.component';
import { ChartPieGridComponent } from './components/charts/chart-pie-grid/chart-pie-grid.component';
import { ChartLineAreaStackedComponent } from './components/charts/chart-line-area-stacked/chart-line-area-stacked.component';
import { ChartAreaComponent } from './components/charts/chart-area/chart-area.component';
import { ChartAreaNormalizedComponent } from './components/charts/chart-area-normalized/chart-area-normalized.component';
import { ChartTreeMapComponent } from './components/charts/chart-tree-map/chart-tree-map.component';
import { ChartBubbleComponent } from './components/charts/chart-bubble/chart-bubble.component';
import { ChartCardComponent } from './components/charts/chart-card/chart-card.component';
import { ChartGaugeComponent } from './components/charts/chart-gauge/chart-gauge.component';
import { ChartPolarComponent } from './components/charts/chart-polar/chart-polar.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ItemOptionsEditorComponent } from './components/item-options-editor/item-options-editor.component';
import { DashboardSlideshowComponent } from './pages/dashboard-slideshow/dashboard-slideshow.component';
import { DisplayLabelComponent } from './pages/display-label/display-label.component';
import { CreateLabelComponent } from './pages/create-label/create-label.component';
import { ItemFiltersComponent } from './components/item-filters/item-filters.component';
import { CreateImageComponent } from './pages/create-image/create-image.component';
import { DisplayImageComponent } from './pages/display-image/display-image.component';
import { ItemDataEditorComponent } from './pages/create-item/item-data-editor/item-data-editor.component';
import { SearchChartComponent } from './pages/search-chart/search-chart.component';
import { ItemAggregateEditorComponent } from './pages/create-item/item-data-editor/item-aggregate-editor/item-aggregate-editor.component';
import { NgDateRangePickerModule } from 'ng-daterangepicker';
import { DatePickerInputComponent } from './components/date-picker-input/date-picker-input.component';
import { ItemComboEditorComponent } from './pages/create-item/item-data-editor/item-combo-editor/item-combo-editor.component';
import { ComboChartComponent, ComboSeriesVerticalComponent } from './components/charts/combo-chart';
import { ChartComboChartComponent } from './components/charts/chart-combo-chart/chart-combo-chart.component'; 
import { CustomChartsModule } from './components/charts/custom/custom-charts.module';
import { ChartBarVerticalGroupGaugeComponent } from './components/charts/chart-bar-vertical-group-gauge/chart-bar-vertical-group-gauge.component';
import { ChartBarVerticalGaugeComponent } from './components/charts/chart-bar-vertical-gauge/chart-bar-vertical-gauge.component';

@NgModule({
  declarations: [
    ProjectHomeComponent,
    NewProjectComponent,
    InfoBarReportComponent,
    FilterDropdownComponent,
    WrapperComponent,
    DashboardHomeComponent,
    DashboardEditorComponent,
    DashboardViewComponent,
    SidebarLeftComponent,
    SidebarRightComponent,
    DashboardGridComponent,
    DashboardModalComponent,
    CreateItemComponent,
    GroupedItemComponent,
    ChartLineSeriesComponent,
    ChartPieComponent,
    DisplayChartComponent,
    ChartBarVerticalComponent,
    ChartBarHorizontalComponent,
    ChartBarNormalizedComponent,
    ChartBarVerticalStackedComponent,
    ChartBarHorizontalStackedComponent,
    ChartsBarHorizontalGroupComponent,
    ChartsBarVerticalGroupComponent,
    ChartBarVerticalNormalizedComponent,
    ChartAdvancedPieChartComponent,
    ChartPieGridComponent,
    ChartLineAreaStackedComponent,
    ChartAreaComponent,
    ChartAreaNormalizedComponent,
    ChartTreeMapComponent,
    ChartBubbleComponent,
    ChartCardComponent,
    ChartGaugeComponent,
    ChartPolarComponent, 
    DataTableComponent,
    ItemOptionsEditorComponent,
    DashboardSlideshowComponent,
    DisplayLabelComponent,
    CreateLabelComponent,
    ItemFiltersComponent,
    CreateImageComponent,
    DisplayImageComponent,
    ItemDataEditorComponent,
    SearchChartComponent,
    ItemAggregateEditorComponent,
    DatePickerInputComponent,
    ItemComboEditorComponent,
    ComboChartComponent,
    ComboSeriesVerticalComponent,
    ChartComboChartComponent,
    ChartBarVerticalGroupGaugeComponent,
    ChartBarVerticalGaugeComponent,
  ],
  imports: [
    CommonModule,
    ExecutionRoutingModule,
    SharedModule,
    GridsterModule,
    NgxChartsModule,
    NgDateRangePickerModule,
    CustomChartsModule
  ],
  entryComponents: [DashboardGridComponent]
})
export class IDashBoardModule { }
