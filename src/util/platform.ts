const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

/* not using the ismobilejs module for now
import isMobileJS from 'ismobilejs.js';
//const isMobile = _isMobile();
function _isMobile(): boolean {
    if (typeof window !== 'undefined') {
        const userAgent = window?.navigator?.userAgent
        if (userAgent) {
            return isMobileJS(userAgent).any
        }
    }
    return false;
}
*/
const isMobile = isBrowser && window.navigator.userAgent.toLowerCase().match(/mobile/i);

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

const isWebWorker = typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';

/**
 * @see https://github.com/jsdom/jsdom/releases/tag/12.0.0
 * @see https://github.com/jsdom/jsdom/issues/1537
 */
const isJsDom =
    (typeof window !== 'undefined' && window.name === 'nodejs') ||
    (typeof navigator !== 'undefined' && (navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom')));

const isDeno =
    //@ts-expect-error
    typeof Deno !== 'undefined' &&
    //@ts-expect-error
    typeof Deno.version !== 'undefined' &&
    //@ts-expect-error
    typeof Deno.version.deno !== 'undefined';

export { isMobile, isWebWorker, isNode, isJsDom, isDeno, isBrowser };
