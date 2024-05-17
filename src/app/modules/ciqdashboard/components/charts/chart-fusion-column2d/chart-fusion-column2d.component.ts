import { Component, OnInit,NgZone,Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'

@Component({
  selector: 'app-chart-fusion-column2d',
  templateUrl: './chart-fusion-column2d.component.html',
  styleUrls: ['../base-chart.scss' , "./chart-fusion-column2d.component.scss"],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartFusionColumn2dComponent extends BaseChart implements OnInit {

  chartInstance: any = {};
  data: any;
  dataSource: any;4
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
// @Input() set config(config: any) {
//   this.setConfig(config);
// }
@Input() set config(config: any) {
    this.setConfig(config);
    this.setupdataconfig(config);
  }
// dataSource = {
//     "chart": {
//         "caption": "Top 4 Projects",
//         "subcaption": "Last year",
//         "xaxisname": "Projects",
//         "yaxisname": "Amount (In USD)",
//         "numberprefix": "$",
//         "theme": "fusion",
//         "rotateValues": "0"
//     },
//     "data": [{
//             "label": "idashboard",
//             "value": "810000",
//             "link": "/#/ciqdashboard/6413088b6d3c127a0a86d32a/dashboards/64130af7421d287ba6034d40;page=0?category=project"
//         },
//         {
//             "label": "cloud assurance",
//             "value": "620000",
//             "link": "http://localhost:4200/#/ciqdashboard/641309d65859211ecb10c073/dashboards/64130b95421d287ba6034d42;page=0?category=project"
//         },
//         {
//             "label": "NFT assure",
//             "value": "350000",
//             "link": "http://localhost:4200/#/ciqdashboard/64130aa1a5bc6353af8dbc4a/dashboards/64130c94421d287ba6034d45;page=0?category=project"
//         },
//         {
//             "label": "Sample Test",
//             "value": "350000",
//             "link": "http://localhost:4200/#/ciqdashboard"
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
    //"link": "/#/ciqdashboard/6413088b6d3c127a0a86d32a/dashboards/64130af7421d287ba6034d40;page=0?category=project"
    const host = `http://${window.location.hostname}:${window.location.port}/ciqdashboard/#/ciqdashboard/`;
    // console.log('hostname',host);
    // console.log('datasourcedata',this.dataSource1);
    this.dataSource1.forEach((element,index) => {
      element.link = host + element.link;
      //console.log('elementlink',element.link);
    });
   // this.datasourceFinal = Object.assign({}, this.dataSource1);
   //console.log('dataSource1',this.dataSource1);
    this.dataSource = { "chart": {
      "caption": config.caption,
      "subcaption": config.subcaption,
      "xaxisname": config.xaxisname,
      "yaxisname": config.yaxisname,
      "showLegend": "1",
      "plotHighlightEffect": "fadeout",
      //"numberprefix": "$",
      "numberSuffix": "%",
      "theme": "fusion",
      "rotateValues": "0",
      "palettecolors": config.colors,
      //"legendPosition": config.fusionlegendPosition,
      "legendAllowDrag": "1",
      "showValues" : "1",
      "Hyperlink": config.Hyperlinks
  },"data":this.dataSource1,
  //"linkeddata":this.dataSource1[0].linkeddata
    
    };
    //console.log(this.dataSource);
  }

}
