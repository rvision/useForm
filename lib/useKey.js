/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useRef } from 'react';

// https://github.com/Poyoman39/react-key-from-object/blob/main/src/index.js
const compatibleKeyTypes = ['object', 'function'];

let now = Date.now();

const useKey = () => {
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
	const map = useRef(new WeakMap());
	useEffect(() => {
		return () => {
			if (map && map.current) {
				map.current = new WeakMap();
			}
		};
	}, []);

	const keyFn = useCallback((object = {}) => {
		const c = map.current;
		if (c.has(object)) {
			return c.get(object);
		}

		if (!compatibleKeyTypes.includes(typeof object)) {
			return `key-${object}`;
		}
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString
		const key = (++now).toString(36);
		c.set(object, key);
		return key;
	}, [map]);

	return keyFn;
};

export default useKey;