import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ChangeDetectionStrategy,
    ElementRef,
    Output,
    EventEmitter
} from '@angular/core';
import { formatLabel } from '@swimlane/ngx-charts';

enum Color {
    gauge, surplus, deficit
}
@Component({
    selector: 'g[ngx-charts-bar-gauge]',
    template: `  
<svg:g  *ngIf="target != undefined" class="bar-gauage-group"  
 ngx-tooltip [tooltipDisabled]="tooltipDisabled" [tooltipPlacement]="tooltipPlacement" [tooltipType]="tooltipType"
[tooltipTemplate]="tooltipTemplate" 
 [attr.transform]="transform">    
<svg:rect class="diff-rect" *ngIf="diff!==0" x="0" [attr.y]="diffBarY"  [attr.width]="barWidth" [attr.height]="diffBarHeight" 
 [attr.fill]="diffColor" [attr.transform]="transformDiff"/>
 <svg:rect class="gauge-line" [attr.x]="-gaugeEdge" [attr.y]="target>=gaugeHeight ? 0:-gaugeHeight"  [attr.width]="gaugeWidth" [attr.height]="gaugeHeight" 
 [attr.fill]="colors[color.gauge]"/> 
 <svg:g *ngIf="showDataLabel" ngx-charts-bar-label
        barX="0" [barY]="diff>0?diffBarY:0" [barWidth]="barWidth" barHeight="0"
        [value]="value" [valueFormatting]="valueFormatting"
        [orientation]="orientation"
        (dimensionsChanged)="dimensionsChanged.emit($event)"
      />
</svg:g>
<ng-template #tooltipTemplate>
    <div class="gauge-tooltip flex-col">
     <span class="gauge-title flex-row">{{this.name || ''}} {{this.name && this.series ? '&emsp;' : ''}} {{this.series || ''}}</span>
     <span class="gauge-title flex-row">Actual&ensp;<div class="label-icon" [ngStyle]="{ 'color': barColor }">●</div><div class="value">{{value}}</div></span>
     <span class="gauge-title flex-row">Target&ensp;<div class="label-icon" [ngStyle]="{ 'color': colors[color.gauge] }">●</div><div class="value">{{target}}</div></span>
     <span class="gauge-title flex-row" *ngIf="diff!==0">{{diff > 0 ? 'Surplus' : 'Deficit'}}&ensp;<div class="label-icon" [ngStyle]="{ 'color': diffColor }">●</div><div class="value">{{diff>0?diff:-diff}}</div></span>
    </div>
</ng-template>
  `,
    styles: ['.label-icon{font-size:24px;padding:0 6px;}', '.gauge-title{margin:auto;}', '.gauge-tooltip .value{min-width:1.5rem}'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BarGaugeComponent implements OnChanges {
    @Input() series;
    @Input() name;
    @Input() value;
    @Input() target;
    @Input() valueFormatting: any;
    @Input() barX;
    @Input() barY;
    @Input() barWidth;
    @Input() barHeight;
    @Input() barColor;
    @Input() orientation;
    @Input() tooltipDisabled = false;
    @Input() tooltipPlacement;
    @Input() tooltipType;
    @Input() gaugeEdge = 0;
    @Input() gaugeHeight = 6;
    @Input() showDataLabel;

    color = Color;
    colors = ['yellow', 'var(--green-chart)', 'var(--red-chart)']
    @Input('colors') set setColors(colors) {
        if (colors) {
            if (colors.length == 3) {
                this.colors = colors;
            }
        }
    }
    @Output() dimensionsChanged: EventEmitter<any> = new EventEmitter();   
    element: any;
    x: number;
    y: number;
    formatedValue: string;
    transform: string;
    transformDiff: string;
    textAnchor: string;

    gaugeWidth: number;
    diff;
    diffColor: string;
    diffBarHeight: number;
    diffBarY = this.gaugeHeight;
    constructor(element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.update();
    }
 
    update(): void {
        if (this.orientation === 'horizontal') {
            this.x = this.barX + this.barWidth;
            this.y = this.barY + this.barHeight / 2;
            this.transform = `rotate(-45, ${this.x} , ${this.y})`;
        } else {
            // orientation must be "vertical" 
            this.diff = this.value - this.target;
            let diffHeight = this.barHeight * (this.diff / this.value);
            diffHeight = diffHeight == NaN ? this.barHeight : diffHeight;
            this.x = this.barX;
            this.y = this.barY + this.barHeight - diffHeight;
            this.gaugeWidth = this.barWidth + (this.gaugeEdge * 2);
            this.diffBarHeight = Math.abs(diffHeight);
            this.transform = `translate(${this.x} ${this.y})`;
            if (this.diff > 0) {
                this.diffColor = this.colors[Color.surplus];
                this.diffBarY = -this.diffBarHeight
            } else {
                this.diffColor = this.colors[Color.deficit];
                this.diffBarY = this.gaugeHeight;
            }
        }
    }
}