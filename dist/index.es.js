var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import require$$0, { useState, useRef, useCallback, useEffect } from "react";
const isFunction = (obj) => typeof obj === "function";
const EMPTY_OBJECT = {};
const noOp = () => EMPTY_OBJECT;
let keySeed = 2e9;
const keysMap = /* @__PURE__ */ new WeakMap();
const key = (object) => {
  let result = keysMap.get(object);
  if (!result) {
    result = (keySeed++).toString(36);
    keysMap.set(object, result);
  }
  return result;
};
const backTrackKey = (object) => {
  let clone;
  if (object instanceof Set) {
    clone = /* @__PURE__ */ new Set([...object]);
  } else {
    const objIsArray = Array.isArray(object);
    clone = objIsArray ? [...object] : __spreadValues({}, object);
    if (objIsArray && object.message) {
      clone.message = object.message;
      clone.type = object.type;
    }
  }
  if (keysMap.has(object)) {
    keysMap.set(clone, keysMap.get(object));
    keysMap.delete(object);
  }
  return clone;
};
const _splitRegEx = /\[([^\]]+)\]/g;
let _splitCache = /* @__PURE__ */ new Map();
const extractPath = (path) => {
  if (!path) {
    return [];
  }
  let cached = _splitCache.get(path);
  if (cached) {
    return cached;
  }
  cached = path.replace(_splitRegEx, ".$1").split(".").map((pathPart) => +pathPart - +pathPart < 1 ? +pathPart : pathPart);
  _splitCache.set(path, cached);
  return cached;
};
const resetSplitCache = () => {
  _splitCache = /* @__PURE__ */ new Map();
};
const _getNested = (fullPath, source) => {
  if (source === void 0) {
    return void 0;
  }
  if (fullPath.length === 0) {
    return source;
  }
  return _getNested(fullPath.slice(1), source[fullPath[0]]);
};
const getNested = (fullPath, source) => _getNested(extractPath(fullPath), source);
const _setNested = (fullPath, target, value) => {
  const { length } = fullPath;
  if (length === 0) {
    return;
  }
  const path = fullPath[0];
  if (length === 1) {
    target[path] = value;
    return;
  }
  const hasNextProperty = target[path] !== void 0;
  const idx = fullPath[1];
  const isIndexANumber = +idx - +idx < 1;
  target[path] = hasNextProperty ? backTrackKey(target[path]) : isIndexANumber ? [] : {};
  if (isIndexANumber) {
    target[path][idx] = target[path][idx] === void 0 ? {} : backTrackKey(target[path][idx]);
  }
  _setNested(fullPath.slice(1), target[path], value);
};
const setNested = (fullPath, target, value) => {
  const clonedTarget = __spreadValues({}, target);
  _setNested(extractPath(fullPath), clonedTarget, value);
  return clonedTarget;
};
const _deleteNested = (fullPath, target) => {
  const { length } = fullPath;
  if (length === 0 || target === void 0) {
    return;
  }
  const path = fullPath[0];
  if (length === 1) {
    delete target[path];
    return;
  }
  _deleteNested(fullPath.slice(1), target[path]);
};
const isEmptyObjectOrFalsy = (item) => Object.keys(item || EMPTY_OBJECT).length === 0;
const _deleteNestedToRoot = (fullPath, target) => {
  _deleteNested(fullPath, target);
  const pathsToRoot = fullPath.map((part, idx) => idx === 0 ? [...fullPath] : [...fullPath].slice(0, -1 * idx));
  pathsToRoot.forEach((path) => {
    const value = _getNested(path, target);
    if (value !== void 0) {
      if (Array.isArray(value)) {
        if ((value.length === 0 || value.every(isEmptyObjectOrFalsy)) && !value.message) {
          _deleteNested(path, target);
        }
      } else if (isEmptyObjectOrFalsy(value)) {
        _deleteNested(path, target);
      }
    }
  });
};
const deleteNestedToRoot = (fullPath, target) => {
  const clonedTarget = __spreadValues({}, target);
  _deleteNestedToRoot(extractPath(fullPath), clonedTarget);
  return clonedTarget;
};
const getInputValue = (e) => {
  const { value, type, checked, options, files, multiple, valueAsNumber, valueAsDate } = e.target;
  switch (type) {
    case "checkbox":
      return checked;
    case "range":
      return valueAsNumber;
    case "date":
      return valueAsDate;
    case "number": {
      if (value === "") {
        return null;
      }
      const parsed = Number.parseFloat(value);
      return +parsed - +parsed < 1 ? +parsed : void 0;
    }
    case "file":
      return multiple ? files : files.item(0);
    case "select-multiple":
      return [...options].filter((o) => o.selected).map((o) => o.value);
    default:
      return value;
  }
};
const swap = (arr, idx1, idx2) => {
  const newArr = [...arr];
  while (newArr.length < Math.max(idx1, idx2)) {
    newArr.push(void 0);
  }
  [newArr[idx1], newArr[idx2]] = [newArr[idx2], newArr[idx1]];
  return newArr;
};
const insert = (arr, index, item) => {
  const newArr = [...arr];
  while (newArr.length < index) {
    newArr.push(void 0);
  }
  newArr.splice(index, 0, item);
  return newArr;
};
const getErrorClassName = (errorObject, classNameError, className) => `${className || ""} ${classNameError || ""} ${errorObject.type ? `error-${errorObject.type}` : ""}`.trim();
const yupResolver = (schema) => (formValues) => {
  let errors = {};
  try {
    schema.validateSync(formValues, { abortEarly: false });
  } catch (validationError) {
    for (const error of validationError.inner) {
      const newOrExistingError = getNested(error.path, errors) || {};
      newOrExistingError.message = error.message;
      newOrExistingError.type = error.type;
      errors = setNested(error.path, errors, newOrExistingError);
    }
  }
  return errors;
};
const zodResolver = (schema) => (formValues) => {
  let errors = {};
  const parsed = schema.safeParse(formValues);
  if (!parsed.success) {
    parsed.error.errors.forEach((error) => {
      const path = error.path.join(".");
      const newOrExistingError = getNested(path, errors) || {};
      newOrExistingError.message = error.message;
      newOrExistingError.type = error.type;
      errors = setNested(path, errors, newOrExistingError);
    });
  }
  return errors;
};
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  g !== void 0 && (e = "" + g);
  a.key !== void 0 && (e = "" + a.key);
  a.ref !== void 0 && (h = a.ref);
  for (b in a)
    m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps)
    for (b in a = c.defaultProps, a)
      d[b] === void 0 && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
const jsx = jsxRuntime.exports.jsx;
const ARIA_INVALID = "aria-invalid";
const toJSON = (obj) => JSON.stringify(obj, (key2, value) => value instanceof Set ? [...value].sort() : value);
const functions = /* @__PURE__ */ new Map();
const useStableReference = (hash, callback) => {
  functions.set(hash, callback);
  useEffect(() => {
    return () => functions.delete(hash);
  }, [hash]);
  return useCallback((...args) => functions.get(hash)(...args), [hash]);
};
const registerProps = {
  name: "",
  [ARIA_INVALID]: false,
  className: "",
  onChange: noOp,
  onBlur: noOp,
  ref: noOp,
  value: "",
  checked: false
};
const useForm = ({
  id = "",
  defaultValues,
  mode,
  classNameError,
  shouldFocusError = false,
  resolver = noOp
}) => {
  const [state, setState] = useState({
    values: defaultValues || EMPTY_OBJECT,
    errors: {}
  });
  const {
    values,
    errors
  } = state;
  const isTouched = useRef(false);
  const isDirty = useRef(false);
  const formHadError = useRef(false);
  const refsMap = useRef(/* @__PURE__ */ new Map());
  const defaultValuesJSON = useRef();
  const isOnSubmitMode = mode === "onSubmit";
  const isOnBlurMode = mode === "onBlur";
  const isOnChangeMode = mode === "onChange";
  const isDefaultMode = !isOnSubmitMode && !isOnBlurMode && !isOnChangeMode;
  let callbackId = 1;
  const useStable = (handler) => useStableReference(id + callbackId++, handler);
  const setErrors = (newErrors) => setState((prev) => __spreadProps(__spreadValues({}, prev), {
    errors: newErrors
  }));
  const init = useCallback((initValues) => {
    const vals = initValues || EMPTY_OBJECT;
    defaultValuesJSON.current = toJSON(vals);
    setState((prev) => __spreadProps(__spreadValues({}, prev), {
      values: __spreadValues({}, vals)
    }));
  }, []);
  useEffect(() => {
    init(defaultValues);
    return () => {
      resetSplitCache();
    };
  }, [defaultValues, init]);
  const focus = useCallback((fullPath) => {
    const element = refsMap.current.get(fullPath);
    if (element && element.focus) {
      element.focus();
      return true;
    }
    return false;
  }, []);
  const getValue = useStable((fullPath = "") => {
    if (!refsMap.current.has(fullPath)) {
      refsMap.current.set(fullPath, null);
    }
    return getNested(fullPath, values);
  });
  const getError = useStable((fullPath = "", targetErrors = errors) => getNested(fullPath, targetErrors));
  const hasError = useStable((fullPath = "", targetErrors = errors) => fullPath === "" ? !isEmptyObjectOrFalsy(targetErrors) : getNested(fullPath, targetErrors) !== void 0);
  const clearError = useStable((fullPath, targetErrors = errors) => {
    let newErrors = targetErrors;
    if (hasError(fullPath, targetErrors)) {
      newErrors = deleteNestedToRoot(fullPath, targetErrors);
    }
    return newErrors;
  });
  const trigger = useStable((fullPath = "") => new Promise((resolve = noOp) => {
    setState((prevState) => {
      let newErrors = resolver(prevState.values);
      if (fullPath !== "") {
        const paths = Array.isArray(fullPath) ? fullPath : [fullPath];
        let pathsErrors = __spreadValues({}, prevState.errors);
        paths.forEach((fullPath2) => {
          const error = getNested(fullPath2, newErrors);
          pathsErrors = deleteNestedToRoot(fullPath2, pathsErrors);
          if (error !== void 0) {
            pathsErrors = setNested(fullPath2, pathsErrors, error);
          }
        });
        newErrors = pathsErrors;
      }
      const newState = __spreadProps(__spreadValues({}, prevState), {
        errors: newErrors
      });
      resolve(newState);
      return newState;
    });
  }));
  const shouldRevalidate = isOnChangeMode || formHadError.current && isDefaultMode;
  const setValue = useStable((fullPath, value) => setState((prevState) => {
    const newValues = setNested(fullPath, prevState.values, value);
    isTouched.current = true;
    isDirty.current = defaultValuesJSON.current !== toJSON(newValues);
    let newErrors = errors;
    if (shouldRevalidate || hasError(fullPath)) {
      newErrors = deleteNestedToRoot(fullPath, newErrors);
      if (!isOnSubmitMode) {
        const newError = getNested(fullPath, resolver(newValues));
        if (newError) {
          newErrors = setNested(fullPath, newErrors, newError);
        }
      }
    }
    return {
      values: newValues,
      errors: newErrors
    };
  }));
  const _setArrayValue = useStable((fullPath, getArray, getArrayErrors) => {
    setState((prevState) => {
      const newValues = setNested(fullPath, prevState.values, getArray(getNested(fullPath, prevState.values)));
      isTouched.current = true;
      isDirty.current = defaultValuesJSON.current !== toJSON(newValues);
      let newErrors = prevState.errors;
      const existingArrayErrors = getNested(fullPath, newErrors);
      let newArrayErrors = [];
      if (Array.isArray(existingArrayErrors)) {
        newArrayErrors = getArrayErrors(existingArrayErrors);
      }
      if (shouldRevalidate) {
        const resolved = getNested(fullPath, resolver(newValues));
        if (resolved && resolved.message) {
          const target = newArrayErrors.length > 0 ? newArrayErrors : {};
          target.message = resolved.message;
          target.type = resolved.type;
          newArrayErrors = target;
        }
      }
      newErrors = deleteNestedToRoot(fullPath, newErrors);
      if (newArrayErrors.length > 0 || newArrayErrors.message) {
        newErrors = setNested(fullPath, newErrors, newArrayErrors);
      }
      return {
        values: newValues,
        errors: newErrors
      };
    });
  });
  const append = useStable((fullPath, item) => {
    _setArrayValue(fullPath, (arr) => [...arr, item], (errors2) => errors2);
  });
  const prepend = useStable((fullPath, item) => {
    _setArrayValue(fullPath, (arr) => [item, ...arr], (errors2) => [void 0, ...errors2]);
  });
  const clear = useStable((fullPath) => {
    const clearArr = () => [];
    _setArrayValue(fullPath, clearArr, clearArr);
  });
  const remove = useStable((fullPath, idx) => {
    const removeByIdx = (arr) => [...arr].filter((_, i) => i !== idx);
    _setArrayValue(fullPath, removeByIdx, removeByIdx);
  });
  const swap$1 = useStable((fullPath, index1, index2) => {
    const swapByIdx = (arr) => swap(arr, index1, index2);
    _setArrayValue(fullPath, swapByIdx, swapByIdx);
  });
  const insert$1 = useStable((fullPath, index, item) => {
    const insertItem = (arr) => insert(arr, index, item);
    const insertError = (arr) => insert(arr, index, void 0);
    _setArrayValue(fullPath, insertItem, insertError);
  });
  const getRef = useStable((fullPath) => refsMap.current.get(fullPath));
  const setRef = useStable((fullPath, element) => {
    if (element) {
      refsMap.current.set(fullPath, element);
    }
  });
  const ref = (element) => element && setRef(element.name, element);
  const onChange = useStable((e) => setValue(e.target.name, getInputValue(e)));
  const onBlur = useStable((e) => {
    const {
      name
    } = e.target;
    const newError = getNested(name, resolver(values));
    if (newError) {
      setErrors(setNested(name, errors, newError));
      if (shouldFocusError) {
        focus(name);
      }
    } else {
      setErrors(clearError(name));
    }
  });
  const register = useStable((fullPath, className = "") => {
    const value = getValue(fullPath);
    const hasFieldError = hasError(fullPath);
    registerProps.name = fullPath;
    registerProps[ARIA_INVALID] = hasFieldError;
    registerProps.className = getErrorClassName(EMPTY_OBJECT, hasFieldError ? classNameError : "", className);
    registerProps.onChange = onChange;
    registerProps.ref = ref;
    registerProps.onBlur = isOnBlurMode ? onBlur : void 0;
    if (value === true || value === false) {
      registerProps.checked = value;
      registerProps.value = void 0;
    } else {
      registerProps.value = `${value}` === "0" ? value : value || "";
      registerProps.checked = void 0;
    }
    return registerProps;
  });
  const reset = useStable((values2 = defaultValues, reValidate = true) => {
    init(values2);
    isTouched.current = false;
    isDirty.current = false;
    if (reValidate) {
      trigger("", values2);
    }
  });
  const handleSubmit = (handler) => (e) => {
    e && e.preventDefault();
    const newErrors = resolver(values);
    setErrors(newErrors);
    if (hasError("", newErrors)) {
      if (shouldFocusError) {
        let isFocused = false;
        refsMap.current.forEach((element, fullPath) => {
          if (!isFocused && hasError(fullPath, newErrors)) {
            isFocused = focus(fullPath);
          }
        });
      }
      formHadError.current = true;
      return false;
    }
    handler(values);
    return true;
  };
  const Error2 = useStable(({
    for: fullPath,
    children
  }) => {
    const error = getError(fullPath, errors);
    if (error == null ? void 0 : error.message) {
      return isFunction(children) ? children(error) : /* @__PURE__ */ jsx("span", {
        className: getErrorClassName(error, classNameError),
        children: error.message
      });
    }
    return false;
  });
  const isValid = !hasError();
  const Errors = useStable(({
    children,
    focusable = false
  }) => {
    if (isValid) {
      return false;
    }
    const errorPaths = Array.from(refsMap.current).map((entry) => entry[0]).filter((entry) => hasError(entry, errors)).sort();
    const result = errorPaths.map((fullPath) => {
      const error = getError(fullPath);
      return /* @__PURE__ */ jsx("li", {
        className: getErrorClassName(error, classNameError),
        children: focusable ? /* @__PURE__ */ jsx("a", {
          onClick: () => focus(fullPath),
          children: error.message
        }) : error.message
      }, fullPath);
    });
    return isFunction(children) ? children(result) : result;
  });
  return {
    getValue,
    setValue,
    register,
    onChange,
    onBlur,
    getRef,
    setRef,
    trigger,
    handleSubmit,
    hasError,
    getError,
    clearError: (fullPath) => setErrors(clearError(fullPath)),
    setErrors: (newErrors) => {
      formHadError.current = true;
      setErrors(newErrors);
    },
    array: {
      clear,
      append,
      prepend,
      remove,
      swap: swap$1,
      insert: insert$1
    },
    key,
    Error: Error2,
    Errors,
    formState: {
      errors,
      isValid,
      isTouched: isTouched.current,
      isDirty: isDirty.current,
      hadError: formHadError.current,
      reset
    }
  };
};
export { useForm as default, yupResolver, zodResolver };
