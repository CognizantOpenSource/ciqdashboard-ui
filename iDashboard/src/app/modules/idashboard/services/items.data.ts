export const fieldTypes = [
    { "name": "title", "type": "string" },
    { "name": "sortSeries",  "type": "string" },
    { "name": "dateSeries", "type": "boolean" },
    { "name": "gradient", "type": "boolean" },
    { "name": "xAxis", "type": "boolean" },
    { "name": "yAxis", "type": "boolean" },
    { "name": "legend", "type": "boolean" },
    { "name": "legendPositionDown", "type": "boolean" },
    { "name": "showXAxisLabel", "type": "boolean" },
    { "name": "showYAxisLabel", "type": "boolean" },
    { "name": "xAxisLabel", "type": "string" },
    { "name": "yAxisLabel", "type": "string" },
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
    { "name": "maxXAxisTickLength", "type": "number" },
    { "name": "maxYAxisTickLength", "type": "number" },
    { "name": "timeline", "type": "boolean" },
    { "name": "rotateXAxisTicks", "type": "boolean" },
    { "name": "trimYAxisTicks", "type": "boolean" },
    { "name": "trimXAxisTicks", "type": "boolean" },
    { "name": "noBarWhenZero", "type": "boolean" },
    { "name": "showDataLabel", "type": "boolean" },
    { "name": "barPadding", "type": "number" },
    { "name": "roundEdges", "type": "number" },
    { "name": "groupPadding", "type": "number" },
    { "name": "labels", "type": "boolean" },
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
    { "name": "ImageSrc",  "type": "image" }
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
    "groupBy": { "minFields": 2, "maxFields": 3, "fields": [
            { "name": "Group", "required": true, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 },
            { "name": "Y Axis", "required": true, "gIndex": 2 }
        ]
    },
    "group": "line chart", "image": "line-chart", "imageType": "clr-icon",
    "fields": ["title", "dateSeries", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimXAxisTicks", "maxXAxisTickLength", "trimYAxisTicks", "maxYAxisTickLength", "autoScale", "tooltipDisabled", "timeline", "xScaleMin", "xScaleMax", "yScaleMin", "yScaleMax", "rotateXAxisTicks" ]
},
{
    "name": "area-chart",
    "groupBy": { "minFields": 2, "maxFields": 3, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 2 }, 
            { "name": "Y Axis", "required": true, "gIndex": 0 }
        ]
    },
    "group": "area chart", "image": "axis-chart", "imageType": "clr-icon",
    "fields": ["title", "dateSeries","scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "maxXAxisTickLength", "maxYAxisTickLength", "autoScale", "tooltipDisabled", "timeline", "xScaleMin", "xScaleMax", "yScaleMin", "yScaleMax", "rotateXAxisTicks", "trimYAxisTicks", "trimXAxisTicks"]
},
{
    "name": "area-chart-normalized",
    "groupBy": { "minFields": 2, "maxFields": 3, "fields": [
			{ "name": "Group", "required": false, "gIndex": 1 },
			{ "name": "X Axis", "required": true, "gIndex": 2 },
			{ "name": "Y Axis", "required": true, "gIndex": 0 }
        ]
    },
    "group": "area chart", "image": "axis-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "maxXAxisTickLength", "maxYAxisTickLength", "autoScale", "tooltipDisabled", "timeline", "rotateXAxisTicks", "trimYAxisTicks", "trimXAxisTicks"]
},
{
    "name": "line-chart-area-stacked",
    "groupBy": { "minFields": 3, "maxFields": 3, "fields": [
			{ "name": "Group", "required": true, "gIndex": 2 },
			{ "name": "X Axis", "required": true, "gIndex": 1 },
			{ "name": "Y Axis", "required": true, "gIndex": 0 },
        ]
    },
    "group": "line chart", "image": "line-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "maxXAxisTickLength", "maxYAxisTickLength", "autoScale", "tooltipDisabled", "timeline", "xScaleMin", "xScaleMax", "yScaleMin", "yScaleMax", "rotateXAxisTicks", "trimYAxisTicks", "trimXAxisTicks"]
},
{
    "name": "bar-chart-horizontal",
    "groupBy": { "minFields": 1, "maxFields": 3, "fields": [
			{ "name": "Group", "required": false, "gIndex": 1 },
			{ "name": "X Axis", "required": false, "gIndex": 2 },
			{ "name": "Y Axis", "required": true, "gIndex": 0 }
        ]
    },
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "xScaleMin", "xScaleMax", "rotateXAxisTicks", "roundEdges"]
},
{
    "name": "bar-horizontal-stacked",
    "groupBy": { "minFields": 2, "maxFields": 3, "fields": [
			{ "name": "Group", "required": false, "gIndex": 1 },
			{ "name": "X Axis", "required": true, "gIndex": 2 },
			{ "name": "Y Axis", "required": true, "gIndex": 0 }
        ]
    },
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "xScaleMax", "rotateXAxisTicks"]
},
{
    "name": "bar-horizontal-normalized",
    "groupBy": { "minFields": 2, "maxFields": 3, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 2 }, 
            { "name": "Y Axis", "required": true, "gIndex": 0 }
        ]
    },
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "xScaleMax", "rotateXAxisTicks"]
},
{
    "name": "bar-vertical-normalized",
    "groupBy": { "minFields": 2, "maxFields": 3, "fields": [
            { "name": "Group", "required": false, "gIndex": 2 },
            { "name": "X Axis", "required": true, "gIndex": 0 },
            { "name": "Y Axis", "required": true, "gIndex": 1 }
        ]
    },
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "rotateXAxisTicks"]
},
{
    "name": "bar-vertical-stacked",
    "groupBy": { "minFields": 2,
        "maxFields": 3,
        "fields": [
            { "name": "Group", "required": false, "gIndex": 2 },
            { "name": "X Axis", "required": true, "gIndex": 0 },
            { "name": "Y Axis", "required": true, "gIndex":  1}
        ]
    },
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "yScaleMax", "rotateXAxisTicks"]
},
{
    "name": "bar-chart-vertical",
    "groupBy": { "minFields": 2, "maxFields": 3, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 },
            { "name": "Y Axis", "required": false, "gIndex": 2 }
        ]
    },
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "yScaleMin", "yScaleMax", "rotateXAxisTicks", "roundEdges"]
},
{
    "name": "bar-horizontal-group",
    "groupBy": { "minFields": 3, "maxFields": 3, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 },
            { "name": "X Axis", "required": true, "gIndex": 1 },
            { "name": "Y Axis", "required": true, "gIndex": 2 }
        ]
    },
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "xScaleMax", "rotateXAxisTicks", "roundEdges", "groupPadding"]
},
{
    "name": "bar-vertical-group",
    "groupBy": { "minFields": 3, "maxFields": 3, "fields": [
			{ "name": "Group", "required": true, "gIndex": 0 },
			{ "name": "X Axis", "required": true, "gIndex": 1 },
			{ "name": "Y Axis", "required": true, "gIndex": 2 }
    ]
    },
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",

    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "yScaleMax", "rotateXAxisTicks", "roundEdges", "groupPadding"]
},
{
    "name": "pie-chart",
    "groupBy": { "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group-1", "required": true, "gIndex": 0 },
            { "name": "Group-2", "gIndex": 1 },
            { "name": "Group-3", "gIndex": 2 }
        ]
    },
    "group": "pie chart", "image": "pie-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "gradient", "legend", "legendPositionDown", "legendTitle", "tooltipDisabled", "labels", "trimLabels", "maxLabelLength", "doughnut", "explodeSlices"]
},
{
    "name": "pie-chart-advanced",
    "groupBy": { "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 }
        ]
    },
    "group": "pie chart", "image": "pie-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "gradient", "tooltipDisabled", "label"]
},
{
    "name": "pie-chart-grid",
    "groupBy": { "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group-1", "required": true, "gIndex": 0 },
            { "name": "Group-2", "gIndex": 1 },
            { "name": "Group-3", "gIndex": 2 }
        ]
    },
    "group": "pie chart", "image": "pie-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "gradient", "tooltipDisabled", "label", "minWidth"]
},
{
    "name": "polar-chart",
    "groupBy": { "minFields": 3, "maxFields": 3, "fields": [
            { "name": "Group", "required": true, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 2 }, 
			{ "name": "Y Axis", "required": true, "gIndex": 0 }
        ]
    },
    "image": "cloud-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "maxYAxisTickLength", "autoScale", "labelTrimSize", "labelTrim", "rangeFillOpacity"]
},
{
    "name": "bubble-chart",
    "group": "bubble chart", "image": "bubble-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "legend", "legendPositionDown", "legendTitle", "tooltipDisabled", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "autoscale", "minRadius", "maxRadius", "xScaleMin", "xScaleMax", "yScaleMin", "yScaleMax"]

},
{
    "name": "heatmap-chart",
    "image": "grid-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "xAxis", "yAxis", "gradient", "showGridLines", "roundDomains", "legend", "legendPositionDown", "legendTitle", "tooltipDisabled", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "innerPadding"]

},
{
    "name": "tree-map-chart",
    "groupBy": { "minFields": 1, "maxFields": 3, "fields": [
            { "name": "Group 1", "required": true, "gIndex": 0 }, 
			{ "name": "Group 2", "gIndex": 1 }, 
			{ "name": "Group 3", "gIndex": 2 }]
    },
    "image": "grid-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "gradient", "tooltipDisabled"]

},
{
    "name": "card-chart",
    "groupBy": { "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 }
        ]
    },
    "image": "grid-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "innerPadding", "cardColor"]
},
{
    "name": "gauge-chart",
    "groupBy": { "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 }
        ]
    },
    "group": "gauge chart", "image": "tick-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "legend", "legendTitle", "legendPositionDown", "min", "max", "units", "bigSegments", "smallSegments", "showAxis", "angleSpan", "startAngle", "tooltipDisabled", "showText"]

},
{
    "name": "liner-gauge-chart",
    "group": "gauge chart", "image": "tick-chart", "imageType": "clr-icon",
    "fields": ["title", "scheme", "animations", "min", "max", "value", "previousValue", "units"]

},
{
    "name": "table",
    "group": "table", "image": "table", "imageType": "clr-icon",
    "fields": ["title", "hideHeader", "header", "compact" , "maxRecords" , "enablePagination"  ]
}
];
