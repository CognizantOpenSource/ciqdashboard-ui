export class BaseChart {
    static customColors = [
        { name: 'passed', value: 'var(--green)' },
        { name: 'failed', value: 'var(--red)' },
        { name: 'skipped', value: 'var(--grey)' },
        { name: 'aborted', value: 'var(--orange)' }
    ];
    static colorScheme = {
        domain: [
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
    };

    get customColors() {
        return BaseChart.customColors;
    }

    chartconfig: any = {};
    colorScheme = BaseChart.colorScheme;
    setConfig(config: any) {
        this.chartconfig = config || {};
        if (config) {
            this.colorScheme = { domain: this.shuffleArray([...(config.domain || BaseChart.colorScheme.domain)]) };
        }
    }

    constructor() {

    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    ngAfterViewInit(): void {
      
    }
}