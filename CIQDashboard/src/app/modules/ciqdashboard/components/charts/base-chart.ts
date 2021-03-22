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
