/**
 * WordPress dependencies
 */
import { __experimentalResolveSelect } from '@wordpress/data';

/**
 * Waits for the resolution of a selector before returning the selector's value.
 *
 * @param {string} namespace    Store namespace.
 * @param {string} selectorName Selector name.
 * @param {Array} args          Selector args.
 *
 * @return {Promise} Selector result.
 */
export function resolveSelector( namespace, selectorName, ...args ) {
	return __experimentalResolveSelect( namespace )[ selectorName ]( ...args );
}
