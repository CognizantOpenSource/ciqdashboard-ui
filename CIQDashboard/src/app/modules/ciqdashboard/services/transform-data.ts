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
import * as MOMENT from 'moment';
import { getItemGroupByConfig } from './items.data';
/**
* Transform data
* @author Cognizant
*/
interface IChartEntry {
    name: string;
    value: number;
    series?: IChartEntry[];
    _name?: string;
    _value?: number;
    _series?: IChartEntry[];
}

enum MutationPeriod {
    startOf  , endOf
}
enum MutaionGroup {
    year  ,  quarter , month , week , isoweek , day 
}
const mmGroups = Object.keys(MutaionGroup).filter(k => isNaN(Number(k)));
const mmPeriods = Object.keys(MutationPeriod).filter(k => isNaN(Number(k)));

interface IDateOptions {
    dateSeries: boolean;
    cumulative: boolean;
    dateGroup: string;
    dateFormat: string;
}

function mutateMoment(moment: MOMENT.Moment, mutation: string) {
    if (mutation) {
        const [period, group] = mutation.split('_');
        if (mmPeriods.includes(period) && mmGroups.includes(group)) {
            moment[period](group);
        }
    }
}
function toDate(dateStr, mutation: string) {
    const moment = MOMENT(dateStr, ['ddd MMM DD hh:mm:ss z YYYY']);
    // set null to invalid date to filter the entry
    if (moment.isValid()) {
        mutateMoment(moment, mutation)
        return moment.toDate()
    }
    return null;
};

const toChartEntry = (name: string) => ({ name, value: 0 } as any);
const sortItemByDate = (a: any, b: any) => a.name.getTime() - b.name.getTime();

function getValue(e) {
    return e._value == null || e._value == undefined ? (e.value || 0) : e._value;
}

function transformName(options: IDateOptions) {
    return es => {
        const _name = es._name || es.name;
        // take backup of name into _name before date-transform to revert when `dataSeries` flag changes                   
        if (options.dateSeries) {
            const name = toDate(_name, options.dateGroup);
            return { ...es, _name, name };
        } else {
            return { ...es, name: _name };
        }
    };
}
function transformCumulativeValueInASeries(series: IChartEntry[]) {
    if (series && series.length) {
        series.sort(sortItemByDate);
        let accumulator = 0;
        series && series.forEach(e => {
            e._value = getValue(e);
            e.value = accumulator = (e._value + accumulator);
        });
    }
    return series;
}
function transformCumulativeValueInData(data: IChartEntry[]) {
    let accumulator = {};
    data.forEach(e => {
        e && e.series && e.series.forEach(es => {
            es._value = getValue(es);
            es.value = accumulator[es.name] = (es._value + (accumulator[es.name] || 0));
        });
    });
    return data;
}

function resetSeries(data: IChartEntry[], resetName: boolean) {
    data.forEach(e => {
        e.value = getValue(e);
        e.name = (resetName && e._name) || e.name;
        e.series && e.series.forEach(es => {
            es.value = getValue(es);
            es.name = (resetName && es._name) || es.name;
        });
    });
}

function fillMissingSeries(data: IChartEntry[], sortSeries = false) {
    const allSeriesNames = [...new Set(data.flatMap(e => e.series || []).map(e => e.name))];
    data.forEach(e => {
        if (e.series && e.series.length) {
            const seriesNames = e.series.map(se => se.name);
            const misssingNames = allSeriesNames.filter(name => !seriesNames.includes(name));
            e.series = [...e.series, ...misssingNames.map(toChartEntry)];
            e.series.forEach(s => {
                if ((s.name as any).constructor.name == 'Object')
                    s.name = s._name;
            });
            if (sortSeries)
                e.series.sort((a, b) => a.name.localeCompare(b.name));
        }
    });
}
function transFormSeries(data: IChartEntry[], options: IDateOptions) {
    fillMissingSeries(data);
    data && data.forEach(e => {
        // keep series data backup
        e._series = e._series || e.series;
        // transform name and filter null values (invalid date)
        e.series = e._series && e._series.map(transformName(options)).filter(es => es.name !== null);
        if (options.dateSeries && options.cumulative) {
            transformCumulativeValueInASeries(e.series);
        }
    });
    return data;
}
function transFormRootDate(item, options: IDateOptions) {
    // transform name and filter null values (invalid date)
    item.data = item._data && item._data.map(transformName(options)).filter(es => es.name !== null);
    if (options.cumulative) {
        fillMissingSeries(item.data, true);
        transformCumulativeValueInASeries(item.data);
        transformCumulativeValueInData(item.data);
    } else {
        resetSeries(item.data, false);
        item.data.sort(sortItemByDate);
    }
}
export function transFormData(item) {
    if (item.data && item.data.length) {
        const options: IDateOptions = item && item.options && item.options || {} as any;
        const groupByConfig = getItemGroupByConfig(item.type);
        if (groupByConfig && options.dateSeries) {
            item._data = item._data || item.data;
            const seriesIndex = groupByConfig[0] && groupByConfig[0].fields.find(f => f.name === 'X Axis' || f.name === 'Y Axis');
            const isTransformSeries = seriesIndex && seriesIndex.gIndex == 1;
            if (isTransformSeries) {
                item.data = transFormSeries(item.data, options);
            } else {
                transFormRootDate(item, options);
            }
        } else {
            item.data = item._data || item.data;
            resetSeries(item.data, true);
        }
    }
    return item;
}

export function formatDate(date: Date, format: string) {
    return MOMENT(date).format(format);
}
