import { Component, OnInit,NgZone,Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

const dataset = [{
  "data": [{
  "rowid": "BAT Progress",
  "columnid": "CE-O2C",
  "value": "80",
  "link":"http://localhost:4200/#/ciqdashboard/64787b5b2be27c5f6a6cdb17/dashboards/64787b712be27c5f6a6cdb18;page=0?category=project"
  },
  {
  "rowid": "BAT Progress",
  "columnid": "CE-ABC",
  "value": "50"
  },
  {
  "rowid": "BAT Progress",
  "columnid": "CE-XYZ",
  "value": "20"
  },
  {
  "rowid": "BAT Progress",
  "columnid": "CE-O2D",
  "value": "80"
  },
  {
  "rowid": "BAT Progress",
  "columnid": "CE-ABD",
  "value": "50"
  },
  {
    "rowid": "BAT Progress",
    "columnid": "CE-XYA",
    "value": "40"
  },
  {
  "rowid": "Automation Coverage",
  "columnid": "CE-O2C",
  "value": "50"
  },
  {
  "rowid": "Automation Coverage",
  "columnid": "CE-ABC",
  "value": "20"
  },
  {
  "rowid": "Automation Coverage",
  "columnid": "CE-XYZ",
  "value": "70"
  },
  {
  "rowid": "Automation Coverage",
  "columnid": "CE-O2D",
  "value": "50"
  },
  {
  "rowid": "Automation Coverage",
  "columnid": "CE-ABD",
  "value": "80"
  },
  {
    "rowid": "Automation Coverage",
    "columnid": "CE-XYA",
    "value": "70"
  },
  {
  "rowid": "TC Failure Rate",
  "columnid": "CE-O2C",
  "value": "80"
  },
  {
  "rowid": "TC Failure Rate",
  "columnid": "CE-ABC",
  "value": "50"
  },
  {
  "rowid": "TC Failure Rate",
  "columnid": "CE-XYZ",
  "value": "40"
  },
  {
  "rowid": "TC Failure Rate",
  "columnid": "CE-O2D",
  "value": "20"
  },
  {
  "rowid": "TC Failure Rate",
  "columnid": "CE-ABD",
  "value": "80"
  },
  {
    "rowid": "TC Failure Rate",
    "columnid": "CE-XYA",
    "value": "40"
  },
  {
  "rowid": "SIT Progress",
  "columnid": "CE-O2C",
  "value": "90"
  },
  {
  "rowid": "SIT Progress",
  "columnid": "CE-ABC",
  "value": "20"
  },
  {
  "rowid": "SIT Progress",
  "columnid": "CE-XYZ",
  "value": "78"
  },
  {
  "rowid": "SIT Progress",
  "columnid": "CE-O2D",
  "value": "90"
  },
  {
  "rowid": "SIT Progress",
  "columnid": "CE-ABD",
  "value": "78"
  },
  {
    "rowid": "SIT Progress",
    "columnid": "CE-XYA",
    "value": "20"
  },
  ]
  }];
  
  const colorrange = {
  "gradient": "0",
  "minvalue": "0",
  "code": "E24B1A",
  "startlabel": "Poor",
  "endlabel": "Good",
  "color": [{
  "code": "E24B1A",
  "minvalue": "0",
  "maxvalue": "39",
  "label": "Bad"
  },
  {
  "code": "F6BC33",
  "minvalue": "40",
  "maxvalue": "79",
  "label": "Average"
  },
  {
  "code": "6DA81E",
  "minvalue": "80",
  "maxvalue": "100",
  "label": "Good"
  }
  ]
  };
  
@Component({
  selector: 'app-chart-fusion-heatmap',
  templateUrl: './chart-fusion-heatmap.component.html',
  styleUrls: ['../base-chart.scss' ,'./chart-fusion-heatmap.component.scss'],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartFusionHeatmapComponent extends BaseChart implements OnInit {

  width: string="";
  height: string="";
  type:any;
  dataFormat:any;
  dataSource:any;
  dataSource1:any;
  data;
  @Input('data') set setData(data: any) {
    this.data = data;
  }
  @Input() set config(config: any) {
    this.setConfig(config);
    //console.log('configgg',config);
    this.dataSource1 = this.data;
    this.dataSource = {
      "chart": {
      //"caption": "Top Smartphone Ratings",
      //"subcaption": "By Features",
      //"xAxisName": "Features",
      //"yAxisName": "Model",
      "showPlotBorder": "1",
      "xAxisLabelsOnTop": "1",
      "plottooltext": "$rowLabel :{br}Rating : $dataValue{br}$columnLabel : $tlLabel{br}\$trLabel",
      //Cosmetics
      "showValues": "1",
      "showBorder": "0",
      "bgColor": "#ffffff",
      "showShadow": "0",
      "usePlotGradientColor": "0",
      "toolTipColor": "#ffffff",
      "toolTipBorderThickness": "0",
      "toolTipBgColor": "#000000",
      "toolTipBgAlpha": "80",
      "toolTipBorderRadius": "2",
      "toolTipPadding": "5",
      "theme": "fusion"
      },
      "dataset": dataset,
      "colorrange": colorrange
      
          }// end of this.dataSource
  }
  constructor(private zone: NgZone) { 
    super();
  }

  ngOnInit() {
    this.width= "100%";
    this.height= "100%";
  }

}
