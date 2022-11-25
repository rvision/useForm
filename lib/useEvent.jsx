import { useCallback, useLayoutEffect, useRef } from 'react';

const throwReferenceError = () => {
	throw new ReferenceError('useEvent called while rendering.');
};

const useEvent = handler => {
	const handlerRef = useRef(throwReferenceError);
	useLayoutEffect(() => {
		handlerRef.current = handler;
	});

	return useCallback((...args) => handlerRef.current(...args), []);
};

export default useEvent;
