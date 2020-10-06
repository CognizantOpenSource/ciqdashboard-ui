import { GridsterItem } from 'angular-gridster2';

export enum Status {
    passed = 'passed', failed = 'failed', blocked = 'aborted', skipped = 'skipped', in_progress = 'in_progress', none = 'none'
}

export function buildInProgress(buildReport: IBuildReport) {
    return buildReport.status.toLowerCase() === Status.in_progress;
}
export function getIconType(type: Status | string) {
    switch (type.toLowerCase()) {
        case Status.passed: return 'check';
        case Status.failed: return 'times';
        case Status.skipped: return 'fast-forward';
        case Status.blocked: return 'ban';
        case Status.in_progress:
        default:
            return 'play';
    }
}
interface INode {
    id: string;
    displayName?: string;
    name: string;
    duration: number;
    status: string;
}
export interface IStageReport extends INode {
    nodes: Array<IStageReport>;
    parallel: boolean;
    edges: Array<any>;
    type?: string;
}
export interface IBuildReport {
    id: string;
    jobName?: string;
    status: Status;
    duration: number;
    time: Date;
    stages?: Array<IStageReport>;
    startTime: any;
}
export interface IJobReport {
    name: string;
    builds: Array<IBuildReport>;
}

export interface JobAnalysisReport {
    totalBuilds: number;
    todayBuilds: number;
    builds: Array<IBuildReport>;
    jobId: string;
    buildId?: string;
    status: { passed?: number; failed?: number; aborted?: number };
    duration: { min: number; max: number; avg: number };
    buildDuration: number;
}
export interface ITestReport {
    suites: Array<ISuite>;
}
export interface ISuite {
    enclosingBlockNames: string[];
    cases: Array<ICase>;
}
export interface ICase {
    stages: Array<string>;
    name?: string;
    duration?: string;
    status?: string;
}
export interface Map<V> {
    [key: string]: V;
}
export interface ChartProperties {
    x: string;
    y: string;
    isTimeSeries?: boolean;
    interactive?: boolean;
    pie?: boolean;
    showX?: boolean;
    showY?: boolean;
    [key: string]: string | number | boolean;
}
export interface TooltipTemplate {
    messages?: Array<string>;
    groupView?: Array<string>;
    view?: Array<string>;
}
export interface ChartTemplate {
    title: string;
    subTitle?: string;
    tooltip?: TooltipTemplate;
}
export interface IDashBoardItem extends GridsterItem {
    id: string;
    type: DefaultChartType | string;
    name: string;
    properties?: ChartProperties;
    template?: ChartTemplate;
}
export interface IChartLinks {
    id: string;
    name: string;
}
export interface IDashboardConfig {
    theme: string;
    links: Array<IChartLinks>;
    items: Array<IDashBoardItem | any>;
}

export enum DefaultChartType {
    verticalStakedBar = 'vertical-stacked-bar', lineSeries = 'line-series',
    pieGroup2 = 'grouped-pie', pieGroup = 'pie-chart', treeMap = 'tree-map',
    card = 'card', dataGrid = 'data-grid'
}
export enum DefaultCharts {
    buildDurationSeries = 'build-duration-series',
    buildStatusGroup = 'build-status-group',
    stageDurationSeries = 'stage-duration-series',
    stageStatusGroup = 'stage-status-group',
    sonarAnalysis = 'sonar-analysis',
    logAnalysis = 'log-analysis',
}
