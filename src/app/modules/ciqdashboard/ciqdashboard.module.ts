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
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule } from 'angular-gridster2';
import { ExecutionRoutingModule } from './ciqdashboard-routing.module';
import { SharedModule } from '../shared.module';
import { FilterDropdownComponent } from './components/filter-dropdown/filter-dropdown.component';
import { WrapperComponent } from './pages/wrapper/wrapper.component';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { ProjectHomeComponent } from './pages/project-home/project-home.component';
import { NewLOBComponent } from './pages/new-lob/new-lob.component';
import { LOBHomeComponent } from './pages/lob-home/lob-home.component';
import { NewORGComponent } from './pages/new-org/new-org.component';
import { ORGHomeComponent } from './pages/org-home/org-home.component';
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
import { ChartTreeMapInteractiveComponent } from './components/charts/chart-tree-map-interactive/chart-tree-map-interactive.component';
import { MatSelectModule, MatFormFieldModule } from '@angular/material';
import { FusionChartsModule } from "angular-fusioncharts";

// Import FusionCharts library and chart modules
import * as FusionCharts from "fusioncharts";
import * as charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import * as PowerCharts from 'fusioncharts/fusioncharts.powercharts';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import { ChartFusionColumn2dComponent } from './components/charts/chart-fusion-column2d/chart-fusion-column2d.component';
import { ChartFusionDrilldownBarverticalPieComponent } from './components/charts/chart-fusion-drilldown-barvertical-pie/chart-fusion-drilldown-barvertical-pie.component';
import { ChartFusionBarVerticalGroupComponent } from './components/charts/chart-fusion-bar-vertical-group/chart-fusion-bar-vertical-group.component';
import { ChartFusionBarVerticalStackedComponent } from './components/charts/chart-fusion-bar-vertical-stacked/chart-fusion-bar-vertical-stacked.component';
import { ChartFusionHeatmapComponent } from './components/charts/chart-fusion-heatmap/chart-fusion-heatmap.component';
import { ChartFusionGaugeComponent } from './components/charts/chart-fusion-gauge/chart-fusion-gauge.component';
import { ChartFusionScrollstackedcolumn2dComponent } from './components/charts/chart-fusion-scrollstackedcolumn2d/chart-fusion-scrollstackedcolumn2d.component';
import { ChartFusionLinearscaleComponent } from './components/charts/chart-fusion-linearscale/chart-fusion-linearscale.component';
import { ChartFusionArea2dComponent } from './components/charts/chart-fusion-area2d/chart-fusion-area2d.component';
import { ChartFusionBar2dComponent } from './components/charts/chart-fusion-bar2d/chart-fusion-bar2d.component';
import { ChartFusionBar3dComponent } from './components/charts/chart-fusion-bar3d/chart-fusion-bar3d.component';
import { ChartFusionColumn3dComponent } from './components/charts/chart-fusion-column3d/chart-fusion-column3d.component';
import { ChartFusionDoughnut2dComponent } from './components/charts/chart-fusion-doughnut2d/chart-fusion-doughnut2d.component';
import { ChartFusionDoughnut3dComponent } from './components/charts/chart-fusion-doughnut3d/chart-fusion-doughnut3d.component';
import { ChartFusionFunnelComponent } from './components/charts/chart-fusion-funnel/chart-fusion-funnel.component';
import { ChartFusionPie2dComponent } from './components/charts/chart-fusion-pie2d/chart-fusion-pie2d.component';
import { ChartFusionPie3dComponent } from './components/charts/chart-fusion-pie3d/chart-fusion-pie3d.component';
import { ChartFusionLine2dComponent } from './components/charts/chart-fusion-line2d/chart-fusion-line2d.component';
import { ChartDataGridComponent } from './components/charts/chart-data-grid/chart-data-grid.component';
/**
* IDashBoardModule
* @author Cognizant
*/
FusionCharts.options['license']({
  key: '',
  creditLabel: false
});
// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme,PowerCharts,Widgets);
@NgModule({
  declarations: [
    NewORGComponent,
    ORGHomeComponent,
    NewLOBComponent,
    LOBHomeComponent,
    ProjectHomeComponent,
    NewProjectComponent,
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
    ChartTreeMapInteractiveComponent,
    ChartFusionColumn2dComponent,
    ChartFusionDrilldownBarverticalPieComponent,
    ChartFusionBarVerticalGroupComponent,
    ChartFusionBarVerticalStackedComponent,
    ChartFusionHeatmapComponent,
    ChartFusionGaugeComponent,
    ChartFusionScrollstackedcolumn2dComponent,
    ChartFusionLinearscaleComponent,
    ChartFusionArea2dComponent,
    ChartFusionBar2dComponent,
    ChartFusionBar3dComponent,
    ChartFusionColumn3dComponent,
    ChartFusionDoughnut2dComponent,
    ChartFusionDoughnut3dComponent,
    ChartFusionFunnelComponent,
    ChartFusionPie2dComponent,
    ChartFusionPie3dComponent,
    ChartFusionLine2dComponent,
    ChartDataGridComponent
  ],
  imports: [
    CommonModule,
    ExecutionRoutingModule,
    SharedModule,
    GridsterModule,
    NgxChartsModule,
    NgDateRangePickerModule,
    CustomChartsModule,
    MatSelectModule, 
    MatFormFieldModule,
    FusionChartsModule
  ],
  entryComponents: [DashboardGridComponent],
})
export class IDashBoardModule { }
