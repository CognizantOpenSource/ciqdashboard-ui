import { UnSubscribable } from 'src/app/components/unsub';
import { Status, getIconType, buildInProgress, IBuildReport, Map, DefaultCharts, DefaultChartType } from 'src/app/model/report.model';
import { ChangeDetectorRef, ViewRef } from '@angular/core';

export const VIEWS = {
    grouped: '__all',
    percentage: '$percent'
};

export function padArray(arr: any[], n: number, entry: any) {
    while (arr.length < n) {
        arr.push(entry);
    }
    return arr;
}

export class Report extends UnSubscribable {

    static unit = 'minutes';
    static unitConversion = (1 / (1000 * 60));
    get unit() {
        return Report.unit;
    }
    get unitConversion() {
        return Report.unitConversion;
    }

    get charts() {
        return DefaultCharts;
    }
    get chartTypes() {
        return DefaultChartType;
    }
    getRand() {
        const num = Math.floor(Math.random() * 20) + 1;
        return num * (Math.floor(Math.random() * 2) === 1 ? 1 : -1);
    }
    getIconType(type: Status | string) {
        return getIconType(type);
    }
    getLabelType(status: Status) {
        switch (this.testStatus(status)) {
            case Status.passed: return 'success';
            case Status.failed: return 'error';
            case Status.skipped: return 'info';
            case Status.blocked: return 'warning';
        }
    }
    getStatusLabel(status: Status) {
        switch (status.toLowerCase()) {
            case Status.in_progress: return 'in progress';
            default: return status;
        }
    }
    date(time: number): string {
        const dateTime = new Date(time);
        return dateTime.toDateString() + ' ' + dateTime.toTimeString();
    }
    isInProgress(build: IBuildReport) {
        return buildInProgress(build);
    }
    detectChanges(cd: ChangeDetectorRef) {
        if (cd && !(cd as ViewRef).destroyed) {
            cd.detectChanges();
        }
    }
    calculateDuration(startTime: number) {
        return this.duration(new Date().getTime() - startTime);
    }
    duration(duration: number): string {
        // convert  to seconds
        duration = Math.ceil(duration / 1000);
        let hours: any = Math.floor(duration / 3600);
        let minutes: any = Math.floor((duration - (hours * 3600)) / 60);
        let seconds: any = duration - (hours * 3600) - (minutes * 60);

        let hourSeparator = ' h ';
        let minuteSeparator = ' m ';

        if (hours === 0) { hours = hourSeparator = ''; }
        if (minutes === 0) { minutes = minuteSeparator = ''; }

        if (seconds === 0) { seconds = '1s'; } else
            if (seconds < 10) { seconds = '0' + seconds + 's'; } else { seconds += 's'; }
        return hours + hourSeparator + minutes + minuteSeparator + seconds;
    }
    fill(array: any[], size: number): any[] {
        return padArray(array, size, { name: 'none' });
    }
    testStatus(status: string) {
        switch (status.toLowerCase()) {
            case 'pass':
            case 'passed':
            case 'success':
                return 'passed';
            case 'fail':
            case 'failed':
            case 'regression':
                return 'failed';
        }
        return status;
    }
    getStageReports(suites) {
        let stageReports = suites.flatMap(s => s.cases.map(c => ({ stages: s.enclosingBlockNames, ...c })))
            .reduce((res, e) => {
                /**
                 * group status stage wise
                 */
                e.stages.forEach(stage => res[stage] = [...(res[stage] || []), this.testStatus(e.status)]);
                return res;
            }, {});
        stageReports = Object.keys(stageReports).reduce((res, stage) => ({
            ...res, [stage]: stageReports[stage]
                /**
                 * count grouped status for each stage
                 */
                .reduce((r, s) => ({ ...r, [s]: ++r[s] || 1 }), {})
        }), {});
        return stageReports;
    }
    getSubGroupedChartData(list: Array<any>, groupId: string, keyId: string, valueFn: (any) => number, keyPrefix = '') {
        const grouped: Map<Array<any>> = list.reduce(
            (g, e) => ({ ...g, [e[groupId]]: [...(g[e[groupId]] || []), e] }), {} as any);
        return {
            [VIEWS.grouped]: Object.keys(grouped).map(name => ({ name, value: grouped[name].length })),
            [VIEWS.percentage]: this.calculatePercentage(grouped),
            ...Object.keys(grouped).map(name =>
                ({ name, data: grouped[name].map(e => ({ name: keyPrefix + e[keyId], value: valueFn(e) })) }))
                .reduce((g, e) => ({ ...g, [e.name]: e.data }), {})
        };
    }

    calculatePercentage(map: any) {
        const group = Object.keys(map).reduce((g, k) =>
            ({ ...g, [k]: map[k].length, total: g.total + map[k].length }), { total: 0 });
        return Object.keys(group).reduce((g, k) =>
            ({ ...g, [k]: Math.round((group[k] / group.total) * 100) }), {});
    }
    list(val: any) {
        if (!(val instanceof Array)) {
            return [val];
        }
        return val;
    }
    resolveContext(template = '', context = {}) {
        return (
            (template as any)
                .applyTemplateContext(context)
                /**
                 * match #function:arg and resolve it to output
                 */
                .replace(
                    /#(\w+):([+-]?\d+(\.\d+)?|\w+)/gi,
                    (match: string, action: string, arg: string) => {
                        return this.fn(action, arg, context) || match;
                    }
                )
        );
    }

    private fn(action: string, arg: string, context: any) {
        if (Math[action]) {
            return Math[action](arg);
        }
        switch (action) {
            case 'duration':
                return this.duration(+arg / this.unitConversion);
            case 'date':
                return this.date(+arg);
            case 'size':
                const obj = this[arg] || context[arg];
                return obj && obj.length;
            case 'length':
                return arg.length;
        }
        return undefined;
    }
}
