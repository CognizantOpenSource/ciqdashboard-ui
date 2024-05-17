import { Component, OnInit,NgZone,Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'


@Component({
  selector: 'app-chart-fusion-gauge',
  templateUrl: './chart-fusion-gauge.component.html',
  styleUrls: ['../base-chart.scss' ,'./chart-fusion-gauge.component.scss'],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartFusionGaugeComponent extends BaseChart implements OnInit {

  data:any;
  data1:any;
  dataSource:any;
  minvalueSet:any;
  maxvalueSet:any;
  dataSource1:any;
  datavalue:any;
  type = "angulargauge";
  dataFormat = "json";
  @Input('data') set setData(data: any) {
    //console.log('Gauagedata',data);
    this.datavalue = data[0].value;
  }
  @Input() set config(config: any) {
    this.setConfig(config);
    //console.log('confiGaugedetails',config);
    //this.dataSource1 = this.data;
    //this.minvalueSet = config.minvalue;
    //this.maxvalueSet = config.minvalue;
    //console.log('GaugeChartconfigValue',config.caption,config.subcaption,config.minvalue.config.maxvalue,config.actualdescription,config.plannedvalue,config.plannedvaluedescription);
    this.data1 = {
      chart: {
        "caption": config.caption,
        "subcaption": config.subcaption,
        "lowerlimit": "0",
        "upperlimit": "100",
        "showvalue": "1",
        "showLegend": "1",
        "numbersuffix": config.numberSuffix,
        "chartBottomMargin": "100",
        "theme": "fusion"
      },
      colorrange: {
        color:[
          {
            minvalue: config.minvalue,
            maxvalue: config.maxvalue,
            code: config.colors
          }
        ]
        // color: [
        //   {
        //     minvalue: "0",
        //     maxvalue: "50",
        //     code: "#AA0000"
        //   },
        //   {
        //     minvalue: "50",
        //     maxvalue: "75",
        //     code: "#FFC533"
        //   },
        //   {
        //     minvalue: "75",
        //     maxvalue: "100",
        //     code: "#00AA00"
        //   }
        // ]
      },
      dials: {
        dial: [
          {
            value:this.datavalue,
            tooltext: config.actualdescription
          }
        ]
      },
      trendpoints: {
        point: [
          {
            startvalue: config.plannedvalue,
            displayvalue: config.plannedvaluedescription,
            thickness: "2",
            color: config.color,
            usemarker: "1",
            markerbordercolor: "#E15A26",
            markertooltext: config.plannedvalue + config.numberSuffix
          }
        ]
      },
      "annotations": {
        "origw": "450",
        "origh": "300",
        "autoscale": "1",
        "showBelow": "2",
        "groups": [{
          "id": "arcs",
          "items": [{
              "id": "national-cs-bg",
              "type": "rectangle",
              "x": "$chartCenterX+2",
              "y": "$chartEndY - 45",
              "tox": "$chartCenterX + 130",
              "toy": "$chartEndY - 25",
              "fillcolor": "#ffffff"
            },
            {
              "id": "national-cs-text",
              "type": "Text",
              "color": "#ffffff",
              "label": "Actual : " + this.datavalue + config.numberSuffix,
              "fontSize": "12",
              "align": "left",
              "x": "$chartCenterX + 7",
              "y": "$chartEndY - 35"
            },
            {
              "id": "state-cs-bg",
              "type": "rectangle",
              "x": "$chartCenterX-2",
              "y": "$chartEndY - 45",
              "tox": "$chartCenterX - 103",
              "toy": "$chartEndY - 25",
              "fillcolor": "#ffffff"
            },
            {
              "id": "state-cs-text",
              "type": "Text",
              "color": "#ffffff",
              "label": config.plannedvaluedescription +" : "+config.plannedvalue + config.numberSuffix,
              "fontSize": "12",
              "align": "right",
              "x": "$chartCenterX - 7",
              "y": "$chartEndY - 35"
            }
            // {
            //   "id": "store-cs-bg",
            //   "type": "rectangle",
            //   "x": "$chartCenterX-130",
            //   "y": "$chartEndY - 22",
            //   "tox": "$chartCenterX + 150",
            //   "toy": "$chartEndY - 2",
            //   "fillcolor": "#62B58F"
            // },
            // {
            //   "id": "state-cs-text",
            //   "type": "Text",
            //   "color": "#ffffff",
            //   "label": "Store's Customer Satisfaction Range: 6.8 to 9.5",
            //   "fontSize": "12",
            //   "align": "center",
            //   "x": "$chartCenterX + 10",
            //   "y": "$chartEndY - 12"
            // }
          ]
        }]
      }
    };
    this.dataSource = this.data1;
    
  }
  constructor(private zone: NgZone) { 
    super();
  }
  width: string="";
  height: string="";  
  ngOnInit() {
    this.width= "100%";
    this.height= "100%";
  }

}
