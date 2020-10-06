import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-fab-item',
    template: `
    <li class="fab-item">
        <a class="fab-item-link">
            <ng-content select=".item"></ng-content>
        </a>
    </li>
  `,
    styles: []
})
export class FabItemComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
