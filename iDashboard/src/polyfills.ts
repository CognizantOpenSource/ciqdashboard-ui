/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.

/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags.ts';
 *
 * The flags allowed in zone-flags.ts are listed here.
 *
 * The following flags will work for all browsers.
 *
 * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
 * (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
 *
 *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 *  with the following flag, it will bypass `zone.js` patch for IE/Edge
 *
 *  (window as any).__Zone_enable_cross_context_check = true;
 *
 */

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js/dist/zone';  // Included with Angular CLI.


/***************************************************************************************************
 * APPLICATION IMPORTS
 */

import 'intersection-observer';

import { isObject, isArray, map, flow, omitBy, mapValues } from 'lodash';

if (!Array.prototype.flatMap) {
    Object.defineProperty(Array.prototype, 'flatMap', {
        configurable: true,
        value: function flatMap(callback) {
            return Array.prototype.map.apply(this, arguments).flat();
        },
        writable: true
    });
}
if (!Array.prototype.flat) {
    Object.defineProperty(Array.prototype, 'flat', {
        configurable: true,
        value: function flat() {
            const depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);
            return depth ? Array.prototype.reduce.call(this, (acc, cur) => {
                if (Array.isArray(cur)) {
                    acc.push.apply(acc, flat.call(cur, depth - 1));
                } else {
                    acc.push(cur);
                }
                return acc;
            }, []) : Array.prototype.slice.call(this);
        },
        writable: true
    });
}
if (!(String.prototype as any).applyTemplateContext) {
    (String.prototype as any).applyTemplateContext = function(context) {
        return this.replace(/\${(.*?)}/g, (x, g) => context[g]);
    };
}
const deepOmitByConfig = {
    configurable: true,
    value: function deepOmitBy() {
        const func = arguments && arguments[0];
        if (!func || typeof func !== 'function') {
            throw new Error('requried function(argument) for omit check');
        }
        const rFn = v => v.deepOmitBy(func);
        return isObject(this)
            ? isArray(this)
                ? map(this, rFn)
                : flow(obj => omitBy(obj, func), obj => mapValues(obj, rFn))(this)
            : this;
    },
    writable: true
};
Object.defineProperty(Object.prototype, 'deepOmitBy', deepOmitByConfig);
Object.defineProperty(Array.prototype, 'deepOmitBy', deepOmitByConfig);
