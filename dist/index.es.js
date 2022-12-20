var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
import require$$0, { useCallback, useRef, useLayoutEffect, useEffect, useState } from "react";
const throwReferenceError = () => {
  throw new ReferenceError("useEvent called while rendering.");
};
const useEvent = (handler) => {
  const handlerRef = useRef(throwReferenceError);
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });
  return useCallback((...args) => handlerRef.current(...args), []);
};
const compatibleKeyTypes = ["object", "function"];
let now = Date.now();
const useKey = () => {
  const map = useRef(/* @__PURE__ */ new WeakMap());
  useEffect(() => () => {
    if (map == null ? void 0 : map.current) {
      map.current = /* @__PURE__ */ new WeakMap();
    }
  }, []);
  return useCallback((object = {}) => {
    const c = map.current;
    if (c.has(object)) {
      return c.get(object);
    }
    if (!compatibleKeyTypes.includes(typeof object)) {
      return `key-${object}`;
    }
    const key = (++now).toString(36);
    c.set(object, key);
    return key;
  }, [map]);
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
const isNumber = (num) => !Number.isNaN(num);
const parseI = (num) => parseInt(num, 10);
const isFunction = (obj) => typeof obj === "function";
const {
  isArray
} = Array;
const toJSON = JSON.stringify;
const objectKeys = Object.keys;
const EMPTY = {};
const noOp = () => EMPTY;
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
const splitRegEx = /\[([^\]]+)\]/g;
let splitCache = {};
const _extractPath = (string) => {
  if (!string) {
    return [];
  }
  if (splitCache[string]) {
    return splitCache[string];
  }
  const split = string.replace(splitRegEx, ".$1").split(".");
  splitCache[string] = split;
  return split;
};
const _clone = (obj) => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (isArray(obj)) {
    return obj.reduce((arr, item, i) => {
      arr[i] = _clone(item);
      return arr;
    }, []);
  }
  if (obj instanceof Object) {
    return objectKeys(obj).reduce((newObj, key) => {
      newObj[key] = _clone(obj[key]);
      return newObj;
    }, {});
  }
  if (obj instanceof Set) {
    return new Set(_clone([...obj]));
  }
  return obj;
};
const _getNested = (fullPath, source) => {
  if (source === void 0) {
    return void 0;
  }
  if (!isArray(fullPath)) {
    return _getNested(_extractPath(fullPath), source);
  }
  switch (fullPath.length) {
    case 0:
      return source;
    default:
      return _getNested(fullPath.slice(1), source[fullPath[0]]);
  }
};
const _setNested = (fullPath, target, value) => {
  if (!isArray(fullPath)) {
    _setNested(_extractPath(fullPath), target, value);
    return;
  }
  if (fullPath.length === 0) {
    return;
  }
  const path = fullPath[0];
  if (fullPath.length === 1) {
    target[path] = value;
    return;
  }
  const idx = parseI(fullPath[1]);
  if (isNumber(idx)) {
    target[path] = target[path] === void 0 ? [] : target[path];
    target[path][idx] = target[path][idx] === void 0 ? {} : target[path][idx];
    if (fullPath.length === 2) {
      target[path][idx] = value;
    } else {
      _setNested(fullPath.slice(2), target[path][idx], value);
    }
  } else {
    target[path] = target[path] === void 0 ? {} : __spreadValues({}, target[path]);
    _setNested(fullPath.slice(1), target[path], value);
  }
};
const _deleteNested = (fullPath, target) => {
  if (!isArray(fullPath)) {
    _deleteNested(_extractPath(fullPath), target);
    return;
  }
  if (fullPath.length === 0 || target === void 0) {
    return;
  }
  const path = fullPath[0];
  if (fullPath.length === 1) {
    delete target[path];
    return;
  }
  if (target[path] === void 0) {
    return;
  }
  const idx = parseI(fullPath[1]);
  if (isNumber(idx)) {
    if (fullPath.length === 2) {
      delete target[path][idx];
    } else {
      _deleteNested(fullPath.slice(2), target[path][idx]);
    }
  } else {
    _deleteNested(fullPath.slice(1), target[path]);
  }
};
const _deleteNestedToRoot = (fullPath, target) => {
  if (!isArray(fullPath)) {
    _deleteNestedToRoot(_extractPath(fullPath), target);
    return;
  }
  _deleteNested(fullPath, target);
  const pathsToRoot = fullPath.map((part, idx) => idx === 0 ? [...fullPath] : [...fullPath].slice(0, -1 * idx));
  for (const path of pathsToRoot) {
    const value = _getNested(path, target);
    if (value !== void 0) {
      if (isArray(value)) {
        if (value.length === 0 || value.every((item) => objectKeys(item || EMPTY).length === 0)) {
          _deleteNested(path, target);
        }
      } else if (objectKeys(value || EMPTY).length === 0) {
        _deleteNested(path, target);
      }
    }
  }
};
const _getInputValue = (e) => {
  const {
    value,
    type,
    checked,
    options,
    files,
    multiple,
    valueAsNumber
  } = e.target;
  switch (type) {
    case "checkbox":
      return checked;
    case "range":
      return valueAsNumber;
    case "number":
      if (value === "") {
        return null;
      }
      const parsed = Number.parseFloat(value);
      if (!isNumber(parsed)) {
        return void 0;
      }
      return parsed;
    case "file":
      return multiple ? files : files.item(0);
    case "select-multiple":
      return [...options].filter((o) => o.selected).map((o) => o.value);
    default:
      return value;
  }
};
const _clearObjectError = (fullPath, targetErrors) => {
  const arrError = _getNested(fullPath, targetErrors);
  if (arrError && !isArray(arrError)) {
    const newErrors = __spreadValues({}, targetErrors);
    _deleteNestedToRoot(fullPath, newErrors);
    return newErrors;
  }
  return targetErrors;
};
const _shiftErrors = (fullPath, targetErrors, callback) => {
  const arrError = _getNested(fullPath, targetErrors);
  if (arrError && isArray(arrError)) {
    const newErrors = __spreadValues({}, targetErrors);
    const newArrErrrors = callback([...arrError]);
    _setNested(fullPath, newErrors, newArrErrrors);
    return newErrors;
  }
  return targetErrors;
};
const _swap = (target, fullPath, idx1, idx2) => {
  const arr = _getNested(fullPath, target);
  if (isArray(arr)) {
    const newArr = [...arr];
    const el = newArr[idx1];
    newArr[idx1] = newArr[idx2];
    newArr[idx2] = el;
    return newArr;
  }
  return arr;
};
const _errClassName = (error, classNameError, className) => `${className || ""} ${classNameError || ""} ${error.type ? `error-${error.type}` : ""}`.trim();
const useForm = ({
  defaultValues,
  mode = "onSubmit",
  classNameError = null,
  shouldFocusError = false,
  resolver = noOp
}) => {
  const [values, setValues] = useState(defaultValues || EMPTY);
  const [errors, setErrors] = useState({});
  const isTouched = useRef(false);
  const isDirty = useRef(false);
  const refsMap = useRef(/* @__PURE__ */ new Map());
  const defaultValuesJSON = useRef("");
  const key = useKey();
  const isOnBlurMode = mode === "onBlur";
  const isOnChangeMode = mode === "onChange";
  const init = useCallback((initValues) => {
    const vals = initValues || EMPTY;
    defaultValuesJSON.current = toJSON(vals);
    setValues(_clone(vals));
  }, []);
  useEffect(() => {
    init(defaultValues);
    return () => {
      splitCache = {};
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
  const getValue = (fullPath = "") => _getNested(fullPath, values);
  const getError = (fullPath = "", targetErrors = errors) => _getNested(fullPath, targetErrors);
  const hasError = (fullPath = "", targetErrors = errors) => {
    if (fullPath === "") {
      return objectKeys(targetErrors).length > 0;
    }
    return _getNested(fullPath, targetErrors) !== void 0;
  };
  const clearError = useEvent((fullPath, targetErrors = errors) => {
    if (hasError(fullPath, targetErrors)) {
      const newErrors = __spreadValues({}, targetErrors);
      _deleteNestedToRoot(fullPath, newErrors);
      setErrors(newErrors);
      return newErrors;
    }
    return targetErrors;
  });
  const setCustomErrors = useEvent((customErrors) => {
    const newErrors = __spreadValues({}, errors);
    for (const fullPath of objectKeys(customErrors)) {
      if (hasError(fullPath)) {
        _deleteNestedToRoot(fullPath, newErrors);
      }
      _setNested(fullPath, newErrors, customErrors[fullPath]);
    }
    setErrors(newErrors);
    return newErrors;
  });
  const trigger = useEvent((fullPath = "", newValues = values) => new Promise((resolve = noOp) => {
    const newErrors = resolver(newValues);
    if (fullPath === "") {
      setErrors(newErrors);
      resolve(newErrors);
    }
    const paths = isArray(fullPath) ? fullPath : [fullPath];
    const updatedErrors = __spreadValues({}, errors);
    paths.forEach((fullPath2) => {
      const error = _getNested(fullPath2, newErrors);
      _deleteNestedToRoot(fullPath2, updatedErrors);
      if (error !== void 0) {
        _setNested(fullPath2, updatedErrors, error);
      }
    });
    setErrors(updatedErrors);
    resolve(updatedErrors);
  }));
  const setValue = useEvent((fullPath, value, validate = true) => new Promise((resolve = noOp) => {
    setValues((values2) => {
      isTouched.current = true;
      const newValues = __spreadValues({}, fullPath === "" ? value : values2);
      _setNested(fullPath, newValues, value);
      isDirty.current = defaultValuesJSON.current !== toJSON(newValues);
      let newErrors = errors;
      if (validate && (hasError(fullPath) || isOnChangeMode)) {
        newErrors = clearError(fullPath);
        const newError = _getNested(fullPath, resolver(newValues));
        if (newError) {
          _setNested(fullPath, newErrors, newError);
          setErrors(newErrors);
        }
      }
      resolve({
        values: newValues,
        errors: newErrors
      });
      return newValues;
    });
  }));
  const _updateArray = (fullPath, newArr, transformErrorsCallback) => {
    return new Promise((resolve = noOp) => {
      Promise.resolve(setValue(fullPath, newArr, false)).then(({
        values: values2
      }) => {
        const newErrors = transformErrorsCallback(_clearObjectError(fullPath, errors));
        setErrors(newErrors);
        resolve({
          values: values2,
          errors: newErrors
        });
      });
    });
  };
  const append = useEvent((fullPath, object) => _updateArray(fullPath, [..._getNested(fullPath, values), object], (newErrors) => newErrors));
  const prepend = useEvent((fullPath, object) => _updateArray(fullPath, [object, ..._getNested(fullPath, values)], (newErrors) => _shiftErrors(fullPath, newErrors, (arrErrors) => [void 0, ...arrErrors])));
  const remove = useEvent((fullPath, idx) => _updateArray(fullPath, _getNested(fullPath, values).filter((item, i) => idx !== i), (newErrors) => {
    newErrors = clearError(`${fullPath}.${idx}`, newErrors);
    return _shiftErrors(fullPath, newErrors, (arrErrors) => {
      arrErrors.splice(idx, 1);
      return arrErrors;
    });
  }));
  const swap = useEvent((fullPath, index1, index2) => _updateArray(fullPath, _swap(values, fullPath, index1, index2), (newErrors) => {
    const newErr = _swap(newErrors, fullPath, index1, index2);
    const swappedErrors = __spreadValues({}, errors);
    _setNested(fullPath, swappedErrors, newErr);
    return swappedErrors;
  }));
  const getRef = useCallback((fullPath) => refsMap.current.get(fullPath), []);
  const setRef = useCallback((fullPath, element) => {
    if (element) {
      refsMap.current.set(fullPath, element);
    }
  }, []);
  const ref = useCallback((element) => element && setRef(element.name, element), []);
  const onChange = useEvent((e) => {
    setValue(e.target.name, _getInputValue(e));
  });
  const onBlur = useEvent((e) => {
    const {
      name
    } = e.target;
    const newError = _getNested(name, resolver(values));
    if (newError) {
      const newErrors = __spreadValues({}, errors);
      _setNested(name, newErrors, newError);
      setErrors(newErrors);
      if (shouldFocusError) {
        focus(name);
      }
    } else {
      clearError(name);
    }
  });
  const register = (fullPath, className = "") => {
    const value = getValue(fullPath);
    const hasFieldError = hasError(fullPath);
    registerProps.key = registerProps.name = fullPath;
    registerProps["aria-invalid"] = hasFieldError;
    registerProps.className = _errClassName(EMPTY, hasFieldError ? classNameError : false, className);
    registerProps.onChange = onChange;
    registerProps.onBlur = isOnBlurMode ? onBlur : void 0;
    registerProps.ref = ref;
    if (value === true || value === false) {
      registerProps.checked = value;
      registerProps.value = void 0;
    } else {
      registerProps.value = `${value}` === "0" ? value : value || "";
      registerProps.checked = void 0;
    }
    return registerProps;
  };
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
      return false;
    }
    handler(values);
    return true;
  };
  const reset = useEvent((values2 = defaultValues, validate = true) => {
    init(values2);
    isTouched.current = false;
    isDirty.current = false;
    validate && trigger("", values2);
  });
  const Error2 = ({
    for: fullPath,
    children
  }) => {
    const error = _getNested(fullPath, errors);
    if (!error || isArray(error)) {
      return false;
    }
    return isFunction(children) ? children(error) : /* @__PURE__ */ jsx("span", {
      className: _errClassName(error, classNameError),
      children: error.message
    });
  };
  const Errors = ({
    children,
    focusable = false
  }) => {
    if (!hasError()) {
      return false;
    }
    const errorPaths = Array.from(refsMap.current).map((entry) => entry[0]).filter((entry) => hasError(entry)).sort();
    const result = errorPaths.map((fullPath) => {
      const error = _getNested(fullPath, errors);
      return /* @__PURE__ */ jsx("li", {
        className: _errClassName(error, classNameError),
        children: focusable ? /* @__PURE__ */ jsx("a", {
          onClick: () => focus(fullPath),
          children: error.message
        }) : error.message
      }, key(error));
    });
    return isFunction(children) ? children(result) : result;
  };
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
    clearError,
    setErrors: setCustomErrors,
    append,
    prepend,
    remove,
    swap,
    key,
    reset,
    Error: Error2,
    Errors,
    formState: {
      errors,
      isValid: !hasError(),
      isTouched: isTouched.current,
      isDirty: isDirty.current
    }
  };
};
const yupResolver = (schema) => (fields) => {
  const errors = {};
  try {
    schema.validateSync(fields, {
      abortEarly: false
    });
  } catch (validationError) {
    for (const error of validationError.inner) {
      _setNested(error.path, errors, {
        message: error.message,
        type: error.type
      });
    }
  }
  return errors;
};
export { useForm as default, yupResolver };
