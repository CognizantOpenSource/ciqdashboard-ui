
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
        "data": ["ddd Do MMM, YYYY", "dd-MMM-YYYY", "MMM YYYY", "YYYY"]
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
    { "name": "ImageSrc", "type": "image" }
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
    "group": "line chart", "image": "line-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimXAxisTicks", "maxXAxisTickLength", "trimYAxisTicks", "maxYAxisTickLength", "autoScale", "tooltipDisabled", "timeline", "xScaleMin", "xScaleMax", "yScaleMin", "yScaleMax", "rotateXAxisTicks"]
},
{
    "name": "area-chart",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 },
            { "name": "X Axis", "required": true, "gIndex": 1 },
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
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "dateSeries", "dateFormat", "dateGroup", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "xScaleMin", "xScaleMax", "rotateXAxisTicks", "roundEdges"]
},
{
    "name": "bar-horizontal-stacked",
    "groupBy": [{
        "minFields": 2, "maxFields": 2, "fields": [
            { "name": "Group", "required": true, "gIndex": 1 },
            { "name": "Y Axis", "required": true, "gIndex": 0 }
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
        "minFields": 2,
        "maxFields": 2,
        "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 }
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
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",

    "fields": ["title", "colors", "dateSeries", "dateFormat", "dateGroup", "cumulative", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "noBarWhenZero", "legend", "showDataLabel", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "trimXAxisTicks", "maxXAxisTickLength", "maxYAxisTickLength", "barPadding", "tooltipDisabled", "yScaleMax", "rotateXAxisTicks", "roundEdges", "groupPadding"]
},
{
    "name": "bar-chart-vertical-gauge",
    "groupBy": [],
    "group": "bar chart", "image": "bar-chart", "imageType": "clr-icon",
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
    "group": "pie chart", "image": "pie-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "scheme", "animations", "gradient", "legend", "legendPositionDown", "legendTitle", "tooltipDisabled", "showLabels", "trimLabels", "maxLabelLength", "doughnut", "explodeSlices"]
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
    "image": "cloud-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "scheme", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "trimYAxisTicks", "maxYAxisTickLength", "autoScale", "labelTrimSize", "labelTrim", "rangeFillOpacity"]
},
{
    "name": "tree-map-chart",
    "groupBy": [{
        "minFields": 1, "maxFields": 3, "fields": [
            { "name": "Group 1", "required": true, "gIndex": 0 },
            { "name": "Group 2", "gIndex": 1 },
            { "name": "Group 3", "gIndex": 2 }]
    }],
    "image": "grid-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "scheme", "animations", "gradient", "tooltipDisabled"]

},
{
    "name": "card-chart",
    "groupBy": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 }
        ]
    }],
    "aggregate": "true",
    "image": "grid-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "scheme", "animations", "innerPadding", "cardColor"]
},
{
    "name": "gauge-chart",
    "groupBy": [{
        "minFields": 1, "maxFields": 1, "fields": [
            { "name": "Group", "required": true, "gIndex": 0 }
        ]
    }],
    "group": "gauge chart", "image": "tick-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "scheme", "animations", "legend", "legendTitle", "legendPositionDown", "min", "max", "units", "bigSegments", "smallSegments", "showAxis", "angleSpan", "startAngle", "tooltipDisabled", "showText"]

},
{
    "name": "table",
    "group": "table", "image": "table", "imageType": "clr-icon",
    "fields": ["title", "colors", "hideHeader", "header", "compact", "maxRecords", "enablePagination"]
},
{
    "name": "combo",
    "groupBy": [{
        "type": "bar-chart", "minFields": 2, "maxFields": 3, "fields": [
            { "name": "Group", "required": false, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 },
            { "name": "Y Axis", "required": false, "gIndex": 2 }
        ]
    }, {
        "type": "line-chart", "minFields": 2, "maxFields": 3, "fields": [
            { "name": "Group", "required": true, "gIndex": 1 },
            { "name": "X Axis", "required": true, "gIndex": 0 },
            { "name": "Y Axis", "required": true, "gIndex": 2 }
        ]
    }],
    "group": "combo", "image": "line-chart", "imageType": "clr-icon",
    "fields": ["title", "colors", "animations", "xAxis", "yAxis", "showGridLines", "roundDomains", "gradient", "legend", "legendPositionDown", "legendTitle", "showXAxisLabel", "xAxisLabel", "showYAxisLabel", "yAxisLabel", "yAxisLabelRight", "tooltipDisabled"]
}
].filter(e => !e.disabled);
