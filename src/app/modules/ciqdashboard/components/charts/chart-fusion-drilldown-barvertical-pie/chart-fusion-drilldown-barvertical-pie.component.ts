import { Component, OnInit,NgZone,Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: 'app-chart-fusion-drilldown-barvertical-pie',
  templateUrl: './chart-fusion-drilldown-barvertical-pie.component.html',
  styleUrls: ['../base-chart.scss' ,'./chart-fusion-drilldown-barvertical-pie.component.scss'],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartFusionDrilldownBarverticalPieComponent extends BaseChart implements OnInit {

  chartInstance: any = {};
  data: any;
  dataSource:any;
  dataSource1:any;
  // Callback to get chart instance
  initialized(e) {
    this.chartInstance = e.chart; // Save it for further use

    // Configure Drilldown attributes
    this.chartInstance.configureLink({
        type: "pie2d",
        width:"100%",
        height:"100%",
        overlayButton: {
            message: 'close',
            fontColor: '880000',
            bgColor: 'FFEEEE',
            borderColor: '660000'
        }
    }, 0)
}
@Input('data') set setData(data: any) {
  this.data = data;
  this.setupdataconfig(data);
}
@Input() set config(config: any) {
    this.setConfig(config);
    this.setupdataconfig(config);
  }
// dataSource = {
//     "chart": {
//         "caption": "Top 3 Juice Flavors",
//         "subcaption": "Last year",
//         "xaxisname": "Flavor",
//         "yaxisname": "Amount (In USD)",
//         "numberprefix": "$",
//         "theme": "fusion",
//         "rotateValues": "0"
//     },
//     "data": [{
//             "label": "Apple",
//             "value": "810000",
//             "link": "newchart-xml-apple"
//         },
//         {
//             "label": "Cranberry",
//             "value": "620000",
//             "link": "newchart-xml-cranberry"
//         },
//         {
//             "label": "Grapes",
//             "value": "350000",
//             "link": "newchart-xml-grapes"
//         }
//     ],
//     "linkeddata": [{
//             "id": "apple",
//             "linkedchart": {
//                 "chart": {
//                     "caption": "Apple Juice - Quarterly Sales",
//                     "subcaption": "Last year",
//                     "numberprefix": "$",
//                     "theme": "fusion",
//                     "rotateValues": "0",
//                     "plottooltext": "$label, $dataValue,  $percentValue"
//                 },
//                 "data": [{
//                     "label": "Q1",
//                     "value": "157000"
//                 }, {
//                     "label": "Q2",
//                     "value": "172000"
//                 }, {
//                     "label": "Q3",
//                     "value": "206000"
//                 }, {
//                     "label": "Q4",
//                     "value": "275000"
//                 }]
//             }
//         },
//         {
//             "id": "cranberry",
//             "linkedchart": {
//                 "chart": {
//                     "caption": "Cranberry Juice - Quarterly Sales",
//                     "subcaption": "Last year",
//                     "numberprefix": "$",
//                     "theme": "fusion",
//                     "plottooltext": "$label, $dataValue,  $percentValue"
//                 },
//                 "data": [{
//                         "label": "Q1",
//                         "value": "102000"
//                     },
//                     {
//                         "label": "Q2",
//                         "value": "142000"
//                     },
//                     {
//                         "label": "Q3",
//                         "value": "187000"
//                     },
//                     {
//                         "label": "Q4",
//                         "value": "189000"
//                     }
//                 ]
//             }
//         },
//         {
//             "id": "grapes",
//             "linkedchart": {
//                 "chart": {
//                     "caption": "Grapes Juice - Quarterly Sales",
//                     "subcaption": "Last year",
//                     "numberprefix": "$",
//                     "theme": "fusion",
//                     "rotateValues": "0",
//                     "plottooltext": "$label, $dataValue,  $percentValue"
//                 },
//                 "data": [{
//                     "label": "Q1",
//                     "value": "45000"
//                 }, {
//                     "label": "Q2",
//                     "value": "72000"
//                 }, {
//                     "label": "Q3",
//                     "value": "95000"
//                 }, {
//                     "label": "Q4",
//                     "value": "108000"
//                 }]
//             }
//         }
//     ]
// };
width: string="";
height: string="";
constructor(private zone: NgZone) { 
  super();
}

  ngOnInit() {
    this.width= "100%";
    this.height= "100%";
  }
  setupdataconfig(config){
    this.dataSource1 = this.data;
    //console.log(this.dataSource1);
   // this.datasourceFinal = Object.assign({}, this.dataSource1);
    this.dataSource = { "chart": {
      "caption": config.caption,
      "subcaption": config.subcaption,
      "xaxisname": config.xaxisname,
      "yaxisname": config.yaxisname,
      "showLegend": "1",
      "plotHighlightEffect": "fadeout",
      //"numberprefix": "$",
      "theme": "fusion",
      "rotateValues": "0",
      "palettecolors": config.colors,
      //"legendPosition": config.fusionlegendPosition,
      "legendAllowDrag": "1"
  },"data":this.dataSource1[0].data,
  "linkeddata":this.dataSource1[0].linkeddata
    
    };
    //console.log(this.dataSource);
  }
}
