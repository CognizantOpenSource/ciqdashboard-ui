import { Component, OnInit,NgZone,Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseChart } from '../base-chart'


@Component({
  selector: 'app-chart-fusion-linearscale',
  templateUrl: './chart-fusion-linearscale.component.html',
  styleUrls: ['../base-chart.scss' ,'./chart-fusion-linearscale.component.scss'],
  host:{
    '[class.legend-down]' : 'chartconfig?.legend && chartconfig.legendPositionDown'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartFusionLinearscaleComponent extends BaseChart implements OnInit {

  data:any;
  data1:any;
  dataSource:any;
  minvalueSet:any;
  maxvalueSet:any;
  dataSource1:any;
  datavalue:any;
  type = "hlineargauge";
  dataFormat = "json";
  @Input('data') set setData(data: any) {
    //console.log('lineardata',data);
    this.datavalue = data[0].value;
    this.setupdataconfig(data);
  }
  @Input() set config(config: any) {
    this.setConfig(config);
    this.setupdataconfig(config);
    //console.log('confilineardatadetails',config);
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
  setupdataconfig(config){
    this.data1 ={
      chart: {
        caption: config.caption,
        subcaption: config.subcaption,
        numberSuffix: config.numberSuffix,
        //gaugefillmix: "{dark-20},{light+70},{dark-10}",
        chartBottomMargin: "50",
        theme: "fusion"
      },
      colorrange: {
        color: [
          {
            minvalue: config.minvalue,          
            maxvalue: config.maxvalue,
            //label: "<b>Actual: 65 % Vs. Planned: 80%</b>",
            label: "<b>" + config.actualdescription + ":"+ this.datavalue + config.numberSuffix + " Vs."+ config.plannedvaluedescription+":"+config.plannedvalue + config.numberSuffix + "</b>",
            code: config.colors
          }
        ]
      },
      pointers: {
        pointer: [
          {
            value: this.datavalue
          }
        ]
      },
      "annotations": {
        "origw": "450",
        "origh": "300",
        "autoscale": "1",
        "groups": [{
          "id": "arcs",
          "items": [
            {
               "id": "rangeBg",
               "type": "rectangle",
               "x": "$chartCenterX-115",
               "y": "$chartEndY-35",
               "tox": "$chartCenterX +115",
               "toy": "$chartEndY-15",
               "fillcolor": "#D6EAF8"
            },
            {
               "id": "rangeText",
               "type": "Text",
               "fontSize": "11",
               "fillcolor": "#ffffff",
               "text": config.navigatelink,
               "x": "$chartCenterX",
               "y": "$chartEndY-25"
            }
         ]
        }]
      }
    };
    this.dataSource = this.data1;
  }

}