import { useCallback, useLayoutEffect, useRef } from 'react';

const throwReferenceError = () => {
	throw new ReferenceError('Callback was called directly while rendering, pass it as a callback prop instead.');
};

const useEvent = handler => {
	const handlerRef = useRef(throwReferenceError);
	useLayoutEffect(() => {
		handlerRef.current = handler;
	});

	return useCallback((...args) => {
		return handlerRef.current(...args);
	}, []);
};

export default useEvent;
