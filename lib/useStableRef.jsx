import { useCallback, useRef } from 'react';

const useStableRef = callback => {
	const handlerRef = useRef(callback);
	handlerRef.current = callback;
	return useCallback((...args) => handlerRef.current(...args), []);
	// return useRef((...args) => handlerRef.current(...args)).current;
};

export default useStableRef;
