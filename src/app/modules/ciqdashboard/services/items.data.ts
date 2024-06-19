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

/**
* items.data - Includes all the chart types and its axis mandatory fields are updated
* @author Cognizant
*/
export function getItemGroupByConfig(type) {
    const map = itemTypes.find(f => f.name == type);
    return map && map.groupBy;
}
export function getItemFieldsConfig(type) {
    const map = itemTypes.find(f => f.name == type);
    const params = map && map.fields ? fieldTypes.filter(ft => map.fields.includes(ft.name)) : fieldTypes;
    return params;
}
export function getItemAggregateConfig(type) {
    const map = itemTypes.find(f => f.name == type);
    return ['true', true].includes(map && map.aggregate);
}
export function getItemMetricConfig(type) {

    //const map = itemTypes.find(f => ((f.name == "card-chart") || (f.name == "line-chart-series") || (f.name == "bar-chart-horizontal") || (f.name == "bar-chart-vertical") || (f.name == "bar-horizontal-stacked") || (f.name == "bar-vertical-stacked")|| (f.name == "gauge-chart") || (f.name == "bar-vertical-chart-fusion")  || (f.name == "bar-vertical-group-fusion")  || (f.name == "bar-vertical-stacked-fusion") || (f.name == "chart-gauge-fusion") || (f.name == "hundred-percent-stackedbar-fusion") || (f.name == "chart-linearscale-fusion") || (f.name == "pie-chart-advanced") || (f.name == "drilldown-bar-vertical-pie-chart-fusion") || (f.name == "area-chart")));
    const map = itemTypes.find(f => ((f.name == "card-chart") || (f.name == "line-chart-series") || (f.name == "bar-chart-horizontal") || (f.name == "bar-chart-vertical") || (f.name == "bar-horizontal-stacked") || (f.name == "bar-vertical-stacked")|| (f.name == "gauge-chart") || (f.name == "bar-vertical-chart-fusion")  || (f.name == "bar-vertical-group-fusion")  || (f.name == "bar-vertical-stacked-fusion") || (f.name == "chart-gauge-fusion") || (f.name == "hundred-percent-stackedbar-fusion") || (f.name == "chart-linearscale-fusion") || (f.name == "pie-chart-advanced") || (f.name == "drilldown-bar-vertical-pie-chart-fusion") || (f.name == "area-chart") || (f.name == "area-chart-normalized") || (f.name == "bar-horizontal-normalized") || (f.name == "bar-vertical-normalized") || (f.name == "bar-horizontal-group") || (f.name == "bar-vertical-group") || (f.name == "bar-chart-vertical-gauge") || (f.name == "combo") || (f.name == "chart-heat") || (f.name == "line-chart-area-stacked") || (f.name == "polar-chart") || (f.name == "tree-map-chart") || (f.name == "tree-map-interactive-chart") || (f.name == "pie-chart") || (f.name == "pie-chart-grid") || (f.name == "area2d-chart-fusion") || (f.name == "bar2d-chart-fusion") || (f.name == "bar3d-chart-fusion") || (f.name == "column3d-chart-fusion") || (f.name == "doughnut2d-chart-fusion") || (f.name == "doughnut3d-chart-fusion")|| (f.name == "funnel-chart-fusion") || (f.name == "pie2d-chart-fusion") || (f.name == "pie3d-chart-fusion") || (f.name == "line2d-chart-fusion") || (f.name == "data-grid")));

    // const map = itemTypes.find(f => f.name == "card-chart");
    // return ['true', true].includes(map && map.metricName);
    return map && map.metricName;
}
export const htmlColorNames = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"];
export function chartColors() {
    return [
        '#C44136',
        '#C46536',
        '#C48836',
        '#C4AB36',
        '#69D791',
        '#82DDA3',
        '#369AC4',
        '#36C4A7',
        '#36C484',
        '#36BDC4',
        '#365EC4',
        '#36C4C0',
        '#366DC4',
        '#364AC4',
        '#C43667',
        '#C44C36',
        '#D06250',
        '#C47036',
        '#C43644',
        '#C43668',
        '#C49236',
        '#C38849',
        '#7F36C4',
        '#5B36C4',
        '#63CC98',
        '#C95837',
        '#D0505B',
        '#A369D7',
        '#B282DD',
        '#D76973',
        '#91949C',
        '#4B505B',
        '#2A69E6',
        '#4F4E73',
        '#DE5076',
        '#BD572F',
        '#47C99E',
        '#4B573F',
        '#57332C',
        '#4E3C25',
        '#3D2B57',
        '#C7BC97',
        '#573345',
        '#573B30',
        '#313A57'

    ]
}
export function suffledColors(colors = chartColors()): string[] {
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    return shuffleArray(colors);
}
export const fieldTypes = [
    { "name": "title", "type": "string" },
    { "name": "colors", "type": "string" },
    { "name": "dateSeries", "type": "boolean" },
    {
        "name": "dateFormat", "type": "select", "dependsOn": "dateSeries",
        "data": ["ddd Do MMM, YYYY", "DD-MMM-YYYY", "MM-DD-YYYY", "DD-MM-YYYY", "MMM YYYY", "YYYY"]
    },
    {
        "name": "dateGroup", "type": "select", "dependsOn": "dateSeries",
        "data": ["startOf_year", "startOf_quarter", "startOf_month", "startOf_week", "startOf_isoweek", "startOf_day", "endOf_year", "endOf_quarter", "endOf_month", "endOf_week", "endOf_isoweek", "endOf_day"]
    },
    { "name": "cumulative", "type": "boolean", "dependsOn": "dateSeries" },
    { "name": "gradient", "type": "boolean" },
    { "name": "xAxis", "type": "boolean" },
    { "name": "yAxis", "type": "boolean" },
    { "name": "legend", "type": "boolean" },
    { "name": "legendPositionDown", "type": "boolean" },
    { "name": "showXAxisLabel", "type": "boolean" },
    { "name": "showYAxisLabel", "type": "boolean" },
    { "name": "xAxisLabel", "type": "string" },
    { "name": "yAxisLabel", "type": "string" },
    { "name": "yAxisLabelRight", "type": "string" },
    { "name": "autoScale", "type": "boolean" },
    { "name": "yScaleMin", "type": "number" },
    { "name": "yScaleMax", "type": "number" },
    { "name": "xScaleMin", "type": "any" },
    { "name": "xScaleMax", "type": "any" },
    { "name": "roundDomains", "type": "boolean" },
    { "name": "animations", "type": "boolean" },
    { "name": "showGridLines", "type": "boolean" },
    { "name": "legendTitle", "type": "string" },
    { "name": "tooltipDisabled", "type": "boolean" },
    { "name": "trimXAxisTicks", "type": "boolean" },
    { "name": "maxXAxisTickLength", "type": "number" },
    { "name": "trimYAxisTicks", "type": "boolean" },
    { "name": "maxYAxisTickLength", "type": "number" },
    { "name": "timeline", "type": "boolean" },
    { "name": "rotateXAxisTicks", "type": "boolean" },
    { "name": "noBarWhenZero", "type": "boolean" },
    { "name": "showDataLabel", "type": "boolean" },
    { "name": "barPadding", "type": "number" },
    { "name": "roundEdges", "type": "boolean" },
    { "name": "groupPadding", "type": "number" },
    { "name": "showLabels", "type": "boolean" },
    { "name": "trimLabels", "type": "boolean" },
    { "name": "maxLabelLength", "type": "number" },
    { "name": "doughnut", "type": "boolean" },
    { "name": "explodeSlices", "type": "boolean" },
    { "name": "label", "type": "string" },
    { "name": "minWidth", "type": "number" },
    { "name": "labelTrimSize", "type": "number" },
    { "name": "labelTrim", "type": "boolean" },
    { "name": "rangeFillOpacity", "type": "number" },
    { "name": "minRadius", "type": "number" },
    { "name": "maxRadius", "type": "number" },
    { "name": "innerPadding", "type": "number" },
    { "name": "cardColor", "type": "string" },
    { "name": "textColor", "type": "string" },
    { "name": "min", "type": "number" },
    { "name": "max", "type": "number" },
    { "name": "units", "type": "string" },
    { "name": "bigSegments", "type": "number" },
    { "name": "smallSegments", "type": "number" },
    { "name": "showAxis", "type": "boolean" },
    { "name": "angleSpan", "type": "number" },
    { "name": "startAngle", "type": "number" },
    { "name": "showText", "type": "boolean" },
    { "name": "value", "type": "number" },
    { "name": "previousValue", "type": "number" },
    { "name": "hideHeader", "type": "boolean" },
    { "name": "header", "type": "string" },
    { "name": "compact", "type": "boolean" },
    { "name": "maxRecords", "type": "number" },
    { "name": "enablePagination", "type": "boolean" },
    { "name": "paginationSize", "type": "number" },
    { "name": "paginationMessage", "type": "string" },
    { "name": "LabelText", "type": "textarea" },
    { "name": "TextStyle", "type": "boolean" },
    { "name": "TextBold", "type": "boolean" },
    { "name": "TextItalic", "type": "boolean" },
    { "name": "FontSize", "type": "number" },
    { "name": "TextColor", "type": "color" },
    { "name": "BackgroundColor", "type": "color" },
    { "name": "PaddingLeft", "type": "arrowbuttons" },
    { "name": "PaddingTop", "type": "arrowbuttons" },
    { "name": "ImageSrc", "type": "image" },
    {"name":"caption","type":"string"},
    {"name":"subcaption","type":"string"},
    {"name":"xaxisname","type":"string"},
    {"name":"yaxisname","type":"string"},
    {"name":"fusionlegend","type": "boolean"},
    {"name":"palettecolors","type": "string"},
    {"name":"hyperlinks","type": "string"},
    { "name": "percentage", "type": "boolean" },
    {"name":"legendPostion","type": "select",
    "data": ["bottom", "top", "top-left","top-right", "bottom-left", "bottom-right", "left", "left-top", "left-bottom", "right", "right-top", "right-bottom","absolute"] 
    },
    {"name":"subtitle","type":"string"},
    {"name":"minvalue","type":"number"},
    {"name":"maxvalue","type":"number"},
    {"name":"actualdescription","type":"string"},
    {"name":"plannedvalue","type":"number"},
    {"name":"plannedvaluedescription","type":"string"},
    {"name":"numberPrefix","type":"string"},
    {"name":"numberSuffix","type":"string"},
    {"name":"navigatelink","type":"string"},
    
];


export const itemTypes = [{
    "name": "label",
    "fields": ["LabelText", "TextStyle", "TextBold", "TextItalic", "FontSize", "TextColor", "BackgroundColor", "PaddingLeft", "PaddingTop"]
},
{
    "name": "image",
    "fields": ["ImageSrc"]
},
{
    "name": "line-chart-series",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 },
            { "name": "X Axis", "required": true, "gIndex": 1 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "line chart", "image": "line-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries","dateFormat", "dateGroup","cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimXAxisTicks", "maxXAxisTickLength", "trimYAxisTicks", "maxYAxisTickLength", "autoScale", "tooltipDisabled", "timeline", "xScaleMin", "xScaleMax", "yScaleMin", "yScaleMax", "rotateXAxisTicks"]
},
{
    "name": "area-chart",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 },
            { "name": "X Axis", "required": true, "gIndex": 1 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "area chart", "image": "axis-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "maxXAxisTickLength", "maxYAxisTickLength", "autoScale", "tooltipDisabled", "timeline", "xScaleMin", "xScaleMax", "yScaleMin", "yScaleMax", "rotateXAxisTicks", "trimYAxisTicks", "trimXAxisTicks"]
},
{
    "name": "area-chart-normalized",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 },
            { "name": "X Axis", "required": true, "gIndex": 1 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "area chart", "image": "axis-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "maxXAxisTickLength", "maxYAxisTickLength", "tooltipDisabled", "timeline", "rotateXAxisTicks", "trimYAxisTicks", "trimXAxisTicks"]
},
{
    "name": "line-chart-area-stacked",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 },
            { "name": "X Axis", "required": true, "gIndex": 1 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "line chart", "image": "line-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "maxXAxisTickLength", "maxYAxisTickLength", "autoScale", "tooltipDisabled", "timeline", "xScaleMin", "xScaleMax", "yScaleMin", "yScaleMax", "rotateXAxisTicks", "trimYAxisTicks", "trimXAxisTicks"]
},
{
    "name": "bar-chart-horizontal",
    "groupBy": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries", "dateFormat", "dateGroup", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "xScaleMin", "xScaleMax", "rotateXAxisTicks", "roundEdges"]
},
{
    "name": "bar-horizontal-stacked",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries", "dateFormat", "dateGroup", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "xScaleMax", "rotateXAxisTicks"]
},
{
    "name": "bar-horizontal-normalized",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": true, "gIndex": 1 },
            { "name": "Y Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries", "dateFormat", "dateGroup", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "rotateXAxisTicks"]
},
{
    "name": "bar-vertical-normalized",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries", "dateFormat", "dateGroup", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "rotateXAxisTicks"]
},
{
    "name": "bar-vertical-stacked",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries", "dateFormat", "dateGroup", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "yScaleMax", "rotateXAxisTicks"]
},
{
    "name": "bar-chart-vertical",
    "groupBy": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": false, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries", "dateFormat", "dateGroup", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "yScaleMin", "yScaleMax", "rotateXAxisTicks", "roundEdges"]
},
{
    "name": "bar-horizontal-group",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": true, "gIndex": 1 },
            { "name": "Y Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries", "dateFormat", "dateGroup", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "xScaleMax", "rotateXAxisTicks", "roundEdges", "groupPadding"]
},
{
    "name": "bar-vertical-group",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": true, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",

    "fields": ["title", "colors", "dateSeries", "dateFormat", "dateGroup", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "yScaleMax", "rotateXAxisTicks", "roundEdges", "groupPadding"]
},
{
    "name": "bar-chart-vertical-gauge",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": true, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "disabled": "true",
    "fields": ["title", "colors", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "yScaleMin", "yScaleMax", "rotateXAxisTicks", "roundEdges"]
}, {
    "name": "bar-vertical-group-gauge",
    "groupBy": [],
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "disabled": "true",
    "fields": ["title", "colors", "dateSeries", "dateFormat", "dateGroup", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "yScaleMax", "rotateXAxisTicks", "roundEdges", "groupPadding"]
},
{
    "name": "pie-chart",
    "groupBy": [{
        "minFields": 1, "maxFields": 3, "fields": [
            { "name": "Group-1", "required": true, "gIndex": 0 },
            { "name": "Group-2", "gIndex": 1 },
            { "name": "Group-3", "gIndex": 2 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "pie chart", "image": "pie-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "scheme", "animations", "gradient", "legend", "legendPositionDown", "legendTitle", "tooltipDisabled", "showLabels", "trimLabels","maxLabelLength", "doughnut", "explodeSlices"]
},
{
    "name": "pie-chart-advanced",
    "groupBy": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 }
        ]
    }],
    "group": "pie chart", "image": "pie-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "scheme", "animations", "gradient", "tooltipDisabled", "label"]
},
{
    "name": "pie-chart-grid",
    "groupBy": [{
        "minFields": 1, "maxFields": 3, "fields": [
            { "name": "Group-1", "required": true, "gIndex": 0 },
            { "name": "Group-2", "gIndex": 1 },
            { "name": "Group-3", "gIndex": 2 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "pie chart", "image": "pie-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "scheme", "animations", "gradient", "tooltipDisabled", "label", "minWidth"]
},
{
    "name": "polar-chart",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 },
            { "name": "X Axis", "required": true, "gIndex": 1 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "polar chart","image": "cloud-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "maxYAxisTickLength", "autoScale", "labelTrimSize", "labelTrim", "rangeFillOpacity"]
},
{
    "name": "tree-map-chart",
    "groupBy": [{
        "minFields": 1, "maxFields": 5, "fields": [
            { "name": "Group 1", "required": true, "gIndex": 0 },
            { "name": "Group 2", "gIndex": 1 },
            { "name": "Group 3", "gIndex": 2 },
            { "name": "Group 4", "gIndex": 3 },
            { "name": "Group 5", "gIndex": 4 }]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "treemap chart","image": "grid-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "scheme", "animations", "gradient", "tooltipDisabled"]

},
{
    "name": "card-chart",
    "groupBy": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "aggregate": "true",
    "group": "card chart","image": "grid-chart", "imageType": "clr-icon",
    "fields": ["title","caption","colors", "scheme", "animations", "innerPadding", "cardColor", "textColor","percentage"]
},
{
    "name": "gauge-chart",
    "groupBy": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "gauge chart", "image": "tick-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "scheme", "animations", "legend", "legendTitle", "legendPositionDown", "min", "max", "units", "bigSegments", "smallSegments", "showAxis", "tooltipDisabled", "showText"]

},
{
    "name": "table",
    "group": "table", "image": "table", "imageType": "clr-icon",
    "fields": ["title", "colors", "hideHeader", "header", "compact", "maxRecords", "enablePagination"]
},
{
    "name": "combo",
    "groupBy": [{
        "type": "bar-chart", "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": false, "gIndex": 0 }
        ]
    }, {
        "type": "line-chart", "minFields": 2, "maxFields": 3, "fields": [
            { "name": "Group", "required": true, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "combo", "image": "line-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "yAxisLabelRight", "tooltipDisabled"]
},
{
    "name": "tree-map-interactive-chart",
    "groupBy": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group 1", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "treemap chart","image": "grid-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "scheme", "animations", "gradient", "tooltipDisabled"]

},
{
    "name": "bar-vertical-chart-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title","caption","subcaption","colors","xaxisname","yaxisname","hyperlinks","plotHighlightEffect"]
},
{
    "name": "drilldown-bar-vertical-pie-chart-fusion",
    "groupBy": [{
        "minFields": 1, "maxFields": 2, "fields": [
            { "name": "Group-1", "required": true, "gIndex": 0 },
            { "name": "Group-2", "gIndex": 1 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title","caption","subcaption","colors","xaxisname","yaxisname","plotHighlightEffect"]
},
{
    "name": "bar-vertical-group-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title","caption","subcaption","colors","xaxisname","yaxisname","numberSuffix","hyperlinks","plotHighlightEffect"]
},
{
    "name": "bar-vertical-stacked-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title","caption","subcaption","colors","xaxisname","yaxisname","numberSuffix","hyperlinks","plotHighlightEffect"]
},
{
    "name": "chart-heatmap-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title","caption","subcaption","colors","xaxisname","yaxisname","numberSuffix","hyperlinks","plotHighlightEffect"]
},
{
    "name": "chart-gauge-fusion",
    "groupBy": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title","caption","subcaption","minvalue","maxvalue","colors","numberSuffix","actualdescription","plannedvalue","plannedvaluedescription","xaxisname","yaxisname"]
},
{
    "name": "hundred-percent-stackedbar-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title","caption","subcaption","colors","xaxisname","yaxisname","numberPrefix","numberSuffix","hyperlinks","plotHighlightEffect"]
},
{
    "name": "chart-linearscale-fusion",
    "groupBy": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "line-chart", "imageType": "clr-icon",
    "fields": ["title","caption","subcaption","minvalue","maxvalue","colors","numberSuffix","actualdescription","plannedvalue","plannedvaluedescription","navigatelink","xaxisname","yaxisname"]
},
{
    "name": "area2d-chart-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "axis-chart", "imageType": "clr-icon",
    "fields": ["title","caption", "subcaption", "xaxisname", "yaxisname","colors","numberprefix", "theme", "showValues"]
},
{
    "name": "bar2d-chart-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title","caption", "subcaption", "xaxisname", "yaxisname","colors","numberprefix", "theme", "showValues"]
},
{
    "name": "bar3d-chart-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title","caption", "subcaption", "xaxisname", "yaxisname","colors","numberprefix", "theme", "showValues"]
},
{
    "name": "column3d-chart-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title","caption", "subcaption", "xaxisname", "yaxisname","colors","numberprefix", "theme", "showValues"]
},
{
    "name": "doughnut2d-chart-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "cloud-chart", "imageType": "clr-icon",
    "fields": ["title","caption", "subcaption","colors","theme", "showValues"]
},
{
    "name": "doughnut3d-chart-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "cloud-chart", "imageType": "clr-icon",
    "fields": ["title","caption", "subcaption","colors","theme", "showValues"]
},
{
    "name": "funnel-chart-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "pie-chart", "imageType": "clr-icon",
    "fields": ["title","caption", "subcaption", "colors", "showpercentvalues", "theme"]
},
{
    "name": "pie2d-chart-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "pie-chart", "imageType": "clr-icon",
    "fields": ["title","caption", "subcaption", "colors", "showpercentvalues", "theme"]
},
{
    "name": "pie3d-chart-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "pie-chart", "imageType": "clr-icon",
    "fields": ["title","caption", "subcaption", "colors", "showpercentvalues", "theme"]
},
{
    "name": "line2d-chart-fusion",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "fusion chart [Licensed]", "image": "line-chart", "imageType": "clr-icon",
    "fields": ["title","caption", "subcaption", "colors","xaxisname", "yaxisname", "palettecolors", "theme"]
},
{
    "name": "data-grid",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
        ]
    }],
    "metricName": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Metric", "required": false, "gIndex": 0 }
        ]
    }],
    "group": "table", "image": "table", "imageType": "clr-icon",
    "fields": ["title", "colors", "hideHeader", "header", "compact", "maxRecords", "enablePagination"]
}     
// {
//     "name": "chart-card-rag-main",
//     "groupBy": [{
//         "minFields": 1, "maxFields": 1, "fields": [
//             { "name": "Group", "required": true, "gIndex": 0 }
//         ]
//     }],
//     "metricName": [{
//         "minFields": 1, "maxFields": 1, "fields": [
//             { "name": "Metric", "required": false, "gIndex": 0 }
//         ]
//     }],
//     "aggregate": "true",
//     "image": "fusion chart", "imageType": "clr-icon",
//     "fields": ["title","caption","colors", "scheme", "animations", "innerPadding", "cardColor", "textColor","percentage"]
// }
].filter(e => !e.disabled);



export const treemap: any = [
    {
        name: 'Defects',
        children: [
            {
                name: 'QA',
                children: [
                    {
                        name: 'Critical',
                        children: [
                            { name: 'Opened', size: 15 },
                            { name: 'Closed', size: 20 },
                            { name: 'Rejected', size: 5 },
                            { name: 'Deferred', size: 2 }
                        ]
                    },
                    {
                        name: 'High',
                        children: [
                            { name: 'Opened', size: 35 },
                            { name: 'Closed', size: 55 },
                            { name: 'Rejected', size: 9 },
                            { name: 'Deferred', size: 3 }
                        ]
                    },
                    {
                        name: 'Medium',
                        children: [
                            { name: 'Opened', size: 50 },
                            { name: 'Closed', size: 75 },
                            { name: 'Rejected', size: 15 },
                            { name: 'Deferred', size: 7 }
                        ]
                    },
                    {
                        name: 'Low',
                        children: [
                            { name: 'Opened', size: 82 },
                            { name: 'Closed', size: 125 },
                            { name: 'Rejected', size: 30 },
                            { name: 'Deferred', size: 10 }
                        ]
                    }
                ]
            },
            {
                name: 'PROD',
                children: [
                    {
                        name: 'Critical',
                        children: [
                            { name: 'Opened', size: 4 },
                            { name: 'Closed', size: 12 },
                            { name: 'Rejected', size: 4 },
                            { name: 'Deferred', size: 2 }
                        ]
                    },
                    {
                        name: 'High',
                        children: [
                            { name: 'Opened', size: 15 },
                            { name: 'Closed', size: 29 },
                            { name: 'Rejected', size: 5 },
                            { name: 'Deferred', size: 3 }
                        ]
                    },
                    {
                        name: 'Medium',
                        children: [
                            { name: 'Opened', size: 33 },
                            { name: 'Closed', size: 63 },
                            { name: 'Rejected', size: 6 },
                            { name: 'Deferred', size: 2 }
                        ]
                    },
                    {
                        name: 'Low',
                        children: [
                            { name: 'Opened', size: 32 },
                            { name: 'Closed', size: 55 },
                            { name: 'Rejected', size: 22 },
                            { name: 'Deferred', size: 12 }
                        ]
                    }
                ]
            },
            {
                name: 'DEV',
                children: [
                    {
                        name: 'Critical',
                        children: [
                            { name: 'Opened', size: 18 },
                            { name: 'Closed', size: 20 },
                            { name: 'Rejected', size: 5 },
                            { name: 'Deferred', size: 2 }
                        ]
                    },
                    {
                        name: 'High',
                        children: [
                            { name: 'Opened', size: 44 },
                            { name: 'Closed', size: 65 },
                            { name: 'Rejected', size: 19 },
                            { name: 'Deferred', size: 3 }
                        ]
                    },
                    {
                        name: 'Medium',
                        children: [
                            { name: 'Opened', size: 72 },
                            { name: 'Closed', size: 122 },
                            { name: 'Rejected', size: 20 },
                            { name: 'Deferred', size: 12 }
                        ]
                    },
                    {
                        name: 'Low',
                        children: [
                            { name: 'Opened', size: 65 },
                            { name: 'Closed', size: 134 },
                            { name: 'Rejected', size: 22 },
                            { name: 'Deferred', size: 7 }
                        ]
                    }
                ]
            }

        ]
    }
];

