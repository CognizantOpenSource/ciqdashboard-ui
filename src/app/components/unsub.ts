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
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { ClrDatagridStringFilterInterface } from '@clr/angular';
/**
 * unsub
 * @author Cognizant
*/
export class EntityFilter implements ClrDatagridStringFilterInterface<any> {
    constructor(private fieldName: string) { }
    accepts(entity: any, search: string): boolean {
        const value = entity && entity[this.fieldName];
        return !search || search === '' || !value || (value + '').toLowerCase().includes(search.toLowerCase());
    }
}
export class EntityCallBackFilter implements ClrDatagridStringFilterInterface<any> {
    constructor(private fn: (any) => string) { }
    accepts(entity: any, search: string): boolean {
        const value = entity && this.fn(entity);
        return !search || search === '' || !value || (value + '').toLowerCase().includes(search.toLowerCase());
    }
}
export class UnSubscribable implements OnDestroy {
    private destroy$: Subject<boolean> = new Subject<boolean>();
    takeUntilDestroy = takeUntil(this.destroy$);
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
    /**
     * auto unsubscribe when component is destroyed
     * @param source observable to unsubscribe
     */
    managed<T>(source: Observable<T>): Observable<T> {
        return source.pipe(this.takeUntilDestroy) as Observable<T>;
    }
    consume($event: MouseEvent | TouchEvent) {
        let res = $event.preventDefault && $event.preventDefault();
        res = $event.stopPropagation && $event.stopPropagation();
        res = $event.stopImmediatePropagation && $event.stopImmediatePropagation();
    }
}
