import { chartColors, htmlColorNames, suffledColors } from '../../services/items.data';
import { formatDate } from '../../services/transform-data';

export class BaseChart {
    static customColors = [
        { name: 'passed', value: 'var(--green)' },
        { name: 'failed', value: 'var(--red)' },
        { name: 'skipped', value: 'var(--grey)' },
        { name: 'aborted', value: 'var(--orange)' }
    ];
    static colorScheme = {
        domain: chartColors()
    };

    get customColors() {
        return BaseChart.customColors;
    }

    chartconfig: any = {};
    colorScheme = BaseChart.colorScheme;
    setConfig(config: any) {
        this.chartconfig = config || {};
        if (config) {
            let domain = config.colors && config.colors.split(',').filter(BaseChart.isColor); 
            domain = (domain && domain.length && domain) || this.getCachedColors(config.title);
            this.colorScheme = { domain };
        }
    }

    constructor() {

    }

    private getCachedColors(title) {
        const key = `idashboard.${this.constructor.name}.${title}.colors`;
        if (localStorage.getItem(key)) {
            return JSON.parse(localStorage.getItem(key))
        }
        let colors = suffledColors();
        localStorage.setItem(key, JSON.stringify(colors))
        return colors;
    }
    static isColor(strColor:string) {
        if(htmlColorNames.includes(strColor.toLowerCase())) return true;
        const match = strColor && strColor.toLowerCase().match(/(#([\da-f]{3}){1,2}|(rgb|hsl)a\((\d{1,3}%?,\s?){3}(1|0?\.\d+)\)|(rgb|hsl)\(\d{1,3}%?(,\s?\d{1,3}%?){2}\))/);
        return match && match[0] == strColor.toLowerCase();
    }


    ngAfterViewInit(): void {

    }


    private formatter(data) {
        if (this.chartconfig && this.chartconfig.dateSeries) {
            return formatDate(new Date(data), this.chartconfig.dateFormat || 'ddd Do MMM, YYYY')
        }
        return data;
    };
    public seriesFormatter = this.formatter.bind(this);
}
