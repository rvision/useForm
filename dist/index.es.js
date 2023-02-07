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
const isNumber = (num) => !Number.isNaN(num);
const parseI = (num) => parseInt(num, 10);
const isFunction = (obj) => typeof obj === "function";
const { isArray: isArray$1 } = Array;
const toJSON = (obj) => JSON.stringify(obj, (key2, value) => value instanceof Set ? [...value] : value);
const objectKeys = Object.keys;
const EMPTY_OBJECT = {};
const noOp = () => EMPTY_OBJECT;
let keySeed = 9999;
const keysMap = /* @__PURE__ */ new WeakMap();
const key = (object) => {
  let result = keysMap.get(object);
  if (!result) {
    result = (++keySeed).toString(36).split("").reduce((reversed, character) => character + reversed, "");
    keysMap.set(object, result);
  }
  return result;
};
const backTrackKey = (object) => {
  let clone;
  if (object instanceof Set) {
    clone = /* @__PURE__ */ new Set([...object]);
  } else {
    clone = isArray$1(object) ? [...object] : __spreadValues({}, object);
  }
  if (keysMap.has(object)) {
    keysMap.set(clone, keysMap.get(object));
    keysMap.delete(object);
  }
  return clone;
};
const _splitRegEx = /\[([^\]]+)\]/g;
let _splitCache = /* @__PURE__ */ new Map();
const extractPath = (string) => {
  if (!string) {
    return [];
  }
  let cached = _splitCache.get(string);
  if (cached) {
    return cached;
  }
  cached = string.replace(_splitRegEx, ".$1").split(".");
  _splitCache.set(string, cached);
  return cached;
};
const resetSplitCache = () => {
  _splitCache = /* @__PURE__ */ new Map();
};
const __getNested = (fullPath, source) => {
  if (source === void 0) {
    return void 0;
  }
  if (fullPath.length === 0) {
    return source;
  }
  return __getNested(fullPath.slice(1), source[fullPath[0]]);
};
const getNested = (fullPath, source) => __getNested(extractPath(fullPath), source);
const __setNested = (fullPath, target, value) => {
  const { length } = fullPath;
  if (length > 0) {
    const path = fullPath[0];
    if (length === 1) {
      target[path] = value;
      return;
    }
    const hasTargetProperty = target[path] === void 0;
    const idx = parseI(fullPath[1]);
    if (isNumber(idx)) {
      target[path] = hasTargetProperty ? [] : backTrackKey(target[path]);
      target[path][idx] = target[path][idx] === void 0 ? {} : backTrackKey(target[path][idx]);
      return __setNested(fullPath.slice(2), target[path][idx], value);
    }
    target[path] = hasTargetProperty ? {} : backTrackKey(target[path]);
    __setNested(fullPath.slice(1), target[path], value);
  }
};
const setNested = (fullPath, target, value) => {
  const clonedTarget = __spreadValues({}, target);
  __setNested(extractPath(fullPath), clonedTarget, value);
  return clonedTarget;
};
const __deleteNested = (fullPath, target) => {
  const { length } = fullPath;
  if (length === 0 || target === void 0) {
    return;
  }
  const path = fullPath[0];
  if (length === 1) {
    delete target[path];
    return;
  }
  __deleteNested(fullPath.slice(1), target[path]);
};
const _isEmptyObjectOrFalsy = (item) => objectKeys(item || EMPTY_OBJECT).length === 0;
const __deleteNestedToRoot = (fullPath, target) => {
  __deleteNested(fullPath, target);
  const pathsToRoot = fullPath.map((part, idx) => idx === 0 ? [...fullPath] : [...fullPath].slice(0, -1 * idx));
  pathsToRoot.forEach((path) => {
    const value = __getNested(path, target);
    if (value !== void 0) {
      if (isArray$1(value)) {
        if (value.length === 0 || value.every(_isEmptyObjectOrFalsy)) {
          if (!value.message) {
            __deleteNested(path, target);
          }
        }
      } else if (_isEmptyObjectOrFalsy(value)) {
        __deleteNested(path, target);
      }
    }
  });
};
const deleteNestedToRoot = (fullPath, target) => {
  const clonedTarget = __spreadValues({}, target);
  __deleteNestedToRoot(extractPath(fullPath), clonedTarget);
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
      if (!isNumber(parsed)) {
        return void 0;
      }
      return parsed;
    }
    case "file":
      return multiple ? files : files.item(0);
    case "select-multiple":
      return [...options].filter((o) => o.selected).map((o) => o.value);
    default:
      return value;
  }
};
const shiftErrors = (fullPath, targetErrors, callback) => {
  const errorsArray = getNested(fullPath, targetErrors);
  if (isArray$1(errorsArray)) {
    return setNested(fullPath, targetErrors, callback(errorsArray));
  }
  return targetErrors;
};
const swap = (arr, idx1, idx2) => {
  if (isArray$1(arr)) {
    const newArr = [...arr];
    [newArr[idx1], newArr[idx2]] = [newArr[idx2], newArr[idx1]];
    return newArr;
  }
  return arr;
};
const getErrorClassName = (errorObject, classNameError, className) => `${className || ""} ${classNameError || ""} ${errorObject.type ? `error-${errorObject.type}` : ""}`.trim();
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
const useStableRef = (callback) => {
  const handlerRef = useRef(callback);
  handlerRef.current = callback;
  return useCallback((...args) => handlerRef.current(...args), []);
};
const registerProps = {
  key: "",
  name: "",
  "aria-invalid": false,
  className: "",
  onChange: noOp,
  onBlur: noOp,
  ref: noOp,
  value: "",
  checked: false
};
const useForm = ({
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
    return resetSplitCache;
  }, [defaultValues, init]);
  const focus = (fullPath) => {
    const element = refsMap.current.get(fullPath);
    if (element && element.focus) {
      element.focus();
      return true;
    }
    return false;
  };
  const getValue = useStableRef((fullPath = "") => {
    if (!refsMap.current.has(fullPath)) {
      refsMap.current.set(fullPath, null);
    }
    return getNested(fullPath, values);
  });
  const getError = useStableRef((fullPath = "", targetErrors = errors) => getNested(fullPath, targetErrors));
  const hasError = useStableRef((fullPath = "", targetErrors = errors) => {
    return fullPath === "" ? objectKeys(targetErrors).length > 0 : getNested(fullPath, targetErrors) !== void 0;
  });
  const clearError = useStableRef((fullPath, targetErrors = errors) => {
    let newErrors = targetErrors;
    if (hasError(fullPath, targetErrors)) {
      newErrors = deleteNestedToRoot(fullPath, targetErrors);
    }
    return newErrors;
  });
  const trigger = useStableRef((fullPath = "", newValues = values) => new Promise((resolve = noOp) => {
    const newErrors = resolver(newValues);
    if (fullPath === "") {
      setErrors(newErrors);
      resolve(newErrors);
      return;
    }
    const paths = isArray(fullPath) ? fullPath : [fullPath];
    let updatedErrors = __spreadValues({}, errors);
    paths.forEach((fullPath2) => {
      const error = getNested(fullPath2, newErrors);
      updatedErrors = deleteNestedToRoot(fullPath2, updatedErrors);
      if (error !== void 0) {
        updatedErrors = setNested(fullPath2, updatedErrors, error);
      }
    });
    setErrors(updatedErrors);
    resolve(updatedErrors);
  }));
  const shouldRevalidate = isOnChangeMode || formHadError.current && isDefaultMode;
  const shouldRevalidateArray = shouldRevalidate && !isOnSubmitMode;
  const _resolveErrors = useStableRef((fullPath, newValues) => {
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
    return newErrors;
  });
  const _remapArrayErrors = useStableRef((fullPath, newErrors, newValues) => {
    const newError = getNested(fullPath, resolver(newValues));
    const existing = getNested(fullPath, newErrors);
    if (existing) {
      delete existing.message;
      delete existing.type;
      if (newError == null ? void 0 : newError.message) {
        existing.message = newError.message;
        existing.type = newError.type;
      }
    }
    return newErrors;
  });
  const setValue = useStableRef((fullPath, value, resolveErrors = _resolveErrors) => new Promise((resolve = noOp) => {
    setState((prevState) => {
      const newValues = setNested(fullPath, __spreadValues({}, fullPath === "" ? value : values), value);
      isTouched.current = true;
      isDirty.current = defaultValuesJSON.current !== toJSON(newValues);
      const newErrors = resolveErrors(fullPath, newValues);
      const newState = {
        values: newValues,
        errors: newErrors
      };
      resolve(newState);
      return newState;
    });
  }));
  const clear = useStableRef((fullPath) => setValue(fullPath, [], shouldRevalidateArray ? _resolveErrors : () => []));
  const append = useStableRef((fullPath, object) => {
    const resolve = shouldRevalidateArray ? _resolveErrors : () => errors;
    return setValue(fullPath, [...getNested(fullPath, values), object], resolve);
  });
  const prepend = useStableRef((fullPath, object) => {
    const resolve = shouldRevalidateArray ? _resolveErrors : (_, newValues) => {
      let newErrors = shiftErrors(fullPath, errors, (arrErrors) => [void 0, ...arrErrors]);
      return _remapArrayErrors(fullPath, newErrors, newValues);
    };
    return setValue(fullPath, [object, ...getNested(fullPath, values)], resolve);
  });
  const remove = useStableRef((fullPath, idx) => {
    const resolve = shouldRevalidateArray ? _resolveErrors : (_, newValues) => {
      let newErrors = clearError(`${fullPath}.${idx}`, __spreadValues({}, errors));
      newErrors = shiftErrors(fullPath, newErrors, (arrErrors) => {
        arrErrors.splice(idx, 1);
        return arrErrors;
      });
      return _remapArrayErrors(fullPath, newErrors, newValues);
    };
    return setValue(fullPath, getNested(fullPath, values).filter((item, i) => i !== idx), resolve);
  });
  const _swap = useStableRef((fullPath, index1, index2) => {
    const resolve = shouldRevalidateArray ? _resolveErrors : (_, newValues) => {
      let newErrors = swap(getNested(fullPath, errors), index1, index2);
      newErrors = newErrors ? setNested(fullPath, errors, newErrors) : errors;
      return _remapArrayErrors(fullPath, newErrors, newValues);
    };
    return setValue(fullPath, swap(getValue(fullPath), index1, index2), resolve);
  });
  const getRef = useStableRef((fullPath) => refsMap.current.get(fullPath));
  const setRef = useStableRef((fullPath, element) => {
    if (element) {
      refsMap.current.set(fullPath, element);
    }
  });
  const ref = useStableRef((element) => element && setRef(element.name, element));
  const onChange = useStableRef((e) => setValue(e.target.name, getInputValue(e)));
  const onBlur = useStableRef((e) => {
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
  const register = useStableRef((fullPath, className = "") => {
    const value = getValue(fullPath);
    const hasFieldError = hasError(fullPath);
    registerProps.name = fullPath;
    registerProps["aria-invalid"] = hasFieldError;
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
  const handleSubmit = (handler) => (e) => {
    e && (e == null ? void 0 : e.preventDefault());
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
  const reset = useStableRef((values2 = defaultValues, validate = true) => {
    init(values2);
    isTouched.current = false;
    isDirty.current = false;
    validate && trigger("", values2);
  });
  const Error2 = useStableRef(({
    for: fullPath,
    children
  }) => {
    const error = getError(fullPath, errors);
    if (!(error == null ? void 0 : error.message)) {
      return false;
    }
    return isFunction(children) ? children(error) : /* @__PURE__ */ jsx("span", {
      className: getErrorClassName(error, classNameError),
      children: error.message
    });
  });
  const isValid = !hasError();
  const Errors = useStableRef(({
    children,
    focusable = false
  }) => {
    if (isValid) {
      return false;
    }
    const errorPaths = Array.from(refsMap.current).filter((entry) => !!entry[1]).map((entry) => entry[0]).filter((entry) => hasError(entry, errors)).sort();
    const result = errorPaths.map((fullPath) => {
      const error = getNested(fullPath, errors);
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
      append,
      prepend,
      remove,
      swap: _swap,
      clear
    },
    key,
    reset,
    Error: Error2,
    Errors,
    formState: {
      errors,
      isValid,
      isTouched: isTouched.current,
      isDirty: isDirty.current
    }
  };
};
const yupResolver = (schema) => (formValues) => {
  let errors = {};
  try {
    schema.validateSync(formValues, {
      abortEarly: false
    });
  } catch (validationError) {
    for (const error of validationError.inner) {
      const errorToEdit = getNested(error.path, errors) || {};
      errorToEdit.message = error.message;
      errorToEdit.type = error.type;
      errors = setNested(error.path, errors, errorToEdit);
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
      const existingError = getNested(path, errors) || {};
      existingError.message = error.message;
      existingError.type = error.type;
      errors = setNested(path, errors, existingError);
    });
  }
  return errors;
};
export { useForm as default, yupResolver, zodResolver };
