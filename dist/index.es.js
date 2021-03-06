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
import require$$0, { useRef, useEffect, useCallback, useState } from "react";
const compatibleKeyTypes = ["object", "function"];
let now = Date.now();
const useKey = () => {
  const map = useRef(/* @__PURE__ */ new WeakMap());
  useEffect(() => {
    return () => {
      if (map && map.current) {
        map.current = /* @__PURE__ */ new WeakMap();
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
    const key = (++now).toString(36);
    c.set(object, key);
    return key;
  }, [map]);
  return keyFn;
};
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
  if (val === null || val === void 0) {
    throw new TypeError("Object.assign cannot be called with null or undefined");
  }
  return Object(val);
}
function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    }
    var test1 = new String("abc");
    test1[5] = "de";
    if (Object.getOwnPropertyNames(test1)[0] === "5") {
      return false;
    }
    var test2 = {};
    for (var i = 0; i < 10; i++) {
      test2["_" + String.fromCharCode(i)] = i;
    }
    var order2 = Object.getOwnPropertyNames(test2).map(function(n2) {
      return test2[n2];
    });
    if (order2.join("") !== "0123456789") {
      return false;
    }
    var test3 = {};
    "abcdefghijklmnopqrst".split("").forEach(function(letter) {
      test3[letter] = letter;
    });
    if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}
shouldUseNative() ? Object.assign : function(target, source) {
  var from;
  var to = toObject(target);
  var symbols;
  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);
    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);
      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }
  return to;
};
/** @license React v17.0.2
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = require$$0, g = 60103;
reactJsxRuntime_production_min.Fragment = 60107;
if (typeof Symbol === "function" && Symbol.for) {
  var h = Symbol.for;
  g = h("react.element");
  reactJsxRuntime_production_min.Fragment = h("react.fragment");
}
var m = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n = Object.prototype.hasOwnProperty, p = { key: true, ref: true, __self: true, __source: true };
function q(c, a, k) {
  var b, d = {}, e = null, l = null;
  k !== void 0 && (e = "" + k);
  a.key !== void 0 && (e = "" + a.key);
  a.ref !== void 0 && (l = a.ref);
  for (b in a)
    n.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps)
    for (b in a = c.defaultProps, a)
      d[b] === void 0 && (d[b] = a[b]);
  return { $$typeof: g, type: c, key: e, ref: l, props: d, _owner: m.current };
}
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
const sTrue = "true";
const sFalse = "false";
const registerProps = {
  key: "",
  name: "",
  "aria-invalid": "",
  className: "",
  onChange: () => {
  },
  onBlur: () => {
  },
  ref: () => {
  },
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
  if (typeof obj !== "object" || obj === null) {
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
  return obj;
};
const _getNested = (fullPath, source) => {
  if (!isArray(fullPath)) {
    return _getNested(_extractPath(fullPath), source);
  }
  if (source === void 0) {
    return void 0;
  }
  switch (fullPath.length) {
    case 0:
      return source;
    case 1:
      return source[fullPath[0]];
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
  const next = fullPath[1];
  const idx = parseI(next);
  if (isNumber(idx)) {
    if (fullPath.length === 2) {
      delete target[path][idx];
    } else {
      _deleteNested(fullPath.slice(2), target[path][idx]);
    }
  } else {
    _deleteNested(fullPath.slice(1), target[path][idx]);
  }
};
const _deleteNestedToRoot = (fullPath, target) => {
  if (!isArray(fullPath)) {
    _deleteNestedToRoot(_extractPath(fullPath), target);
    return;
  }
  _deleteNested(fullPath, target);
  const pathsToRoot = fullPath.map((part, idx) => {
    return idx === 0 ? [...fullPath] : [...fullPath].slice(0, -1 * idx);
  });
  for (const path of pathsToRoot) {
    const value = _getNested(path, target);
    if (value !== void 0) {
      if (isArray(value)) {
        if (value.length === 0 || value.every((item) => objectKeys(item || {}).length === 0)) {
          _deleteNested(path, target);
        }
      } else if (objectKeys(value || {}).length === 0) {
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
    default:
      return value;
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
const _focus = (element) => {
  if (element && element.focus) {
    element.focus();
    return true;
  }
  return false;
};
const useForm = ({
  defaultValues = {},
  mode = "onSubmit",
  classNameError = null,
  shouldFocusError = false,
  resolver = (foo) => ({})
}) => {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const isTouched = useRef(false);
  const isDirty = useRef(false);
  const refsMap = useRef(/* @__PURE__ */ new Map());
  const defaultValuesJSON = useRef("");
  const key = useKey();
  const isOnBlurMode = mode === "onBlur";
  const isOnChangeMode = mode === "onChange";
  const init = useCallback((initValues) => {
    defaultValuesJSON.current = toJSON(initValues);
    setValues(_clone(initValues));
  }, []);
  useEffect(() => {
    init(defaultValues);
    return () => {
      splitCache = {};
    };
  }, [defaultValues, init]);
  const hasError = useCallback((fullPath = null, targetErrors = errors) => {
    if (fullPath === null) {
      return objectKeys(targetErrors || {}).length > 0;
    }
    return _getNested(fullPath, targetErrors) !== void 0;
  }, [errors]);
  const clearError = useCallback((fullPath, targetErrors = errors) => {
    if (hasError(fullPath)) {
      const newErrors = __spreadValues({}, targetErrors);
      _deleteNestedToRoot(fullPath, newErrors);
      setErrors(newErrors);
      return newErrors;
    }
    return targetErrors;
  }, [errors, hasError]);
  const setCustomErrors = useCallback((errorsObj) => {
    const newErrors = __spreadValues({}, errors);
    for (const fullPath of objectKeys(errorsObj)) {
      if (hasError(fullPath)) {
        _deleteNestedToRoot(fullPath, newErrors);
      }
      _setNested(fullPath, newErrors, errorsObj[fullPath]);
    }
    setErrors(newErrors);
    return newErrors;
  }, [errors, hasError]);
  const trigger = (fullPath = "", newValues = values) => {
    const newValidation = resolver(newValues);
    const error = _getNested(fullPath, newValidation);
    const newErrors = __spreadValues({}, newValidation);
    _deleteNestedToRoot(fullPath, newErrors);
    if (error !== void 0) {
      _setNested(fullPath, newErrors, error);
    }
    setErrors(newErrors);
    return newErrors;
  };
  const getValue = (fullPath = "") => {
    return _getNested(fullPath, values);
  };
  const setValue = (fullPath, value, validate = true) => {
    setValues((values2) => {
      const newValues = __spreadValues({}, fullPath === "" ? value : values2);
      _setNested(fullPath, newValues, value);
      isDirty.current = defaultValuesJSON.current !== toJSON(newValues);
      if (validate && (hasError(fullPath) || isOnChangeMode)) {
        const newErrors = clearError(fullPath);
        const newError = _getNested(fullPath, resolver(newValues));
        if (newError) {
          _setNested(fullPath, newErrors, newError);
          setErrors(newErrors);
        }
      }
      return newValues;
    });
    isTouched.current = true;
  };
  const append = (fullPath, object) => {
    const newArr = [..._getNested(fullPath, values), object];
    setValue(fullPath, newArr, false);
    const newErrors = _clearObjectError(fullPath, errors);
    setErrors(newErrors);
    return newArr;
  };
  const prepend = (fullPath, object) => {
    const newArr = [object, ..._getNested(fullPath, values)];
    setValue(fullPath, newArr, false);
    let newErrors = _clearObjectError(fullPath, errors);
    newErrors = _shiftErrors(fullPath, newErrors, (arrErrors) => [void 0, ...arrErrors]);
    setErrors(newErrors);
    return newArr;
  };
  const remove = (fullPath, idx) => {
    const newArr = _getNested(fullPath, values).filter((item, i) => idx !== i);
    setValue(fullPath, newArr, false);
    let newErrors = _clearObjectError(fullPath, errors);
    newErrors = clearError(`${fullPath}.${idx}`, newErrors);
    newErrors = _shiftErrors(fullPath, newErrors, (arrErrors) => {
      arrErrors.splice(idx, 1);
      return arrErrors;
    });
    setErrors(newErrors);
    return newArr;
  };
  const swap = (fullPath, index1, index2) => {
    const newArr = _swap(values, fullPath, index1, index2);
    setValue(fullPath, newArr);
    const newErr = _swap(errors, fullPath, index1, index2);
    const newErrors = __spreadValues({}, errors);
    _setNested(fullPath, newErrors, newErr);
    setErrors(newErrors);
    return newArr;
  };
  const ref = useCallback((element) => {
    if (element) {
      refsMap.current.set(element.name, element);
    }
  }, [refsMap]);
  const getRef = useCallback((fullPath) => {
    return refsMap.current.get(fullPath);
  }, [refsMap]);
  const setRef = useCallback((fullPath, element) => {
    if (element) {
      refsMap.current.set(fullPath, element);
    }
  }, [refsMap]);
  const onChange = (e) => {
    setValue(e.target.name, _getInputValue(e));
  };
  const onBlur = (e) => {
    const {
      name
    } = e.target;
    const newError = _getNested(name, resolver(values));
    if (newError) {
      const newErrors = __spreadValues({}, errors);
      _setNested(name, newErrors, newError);
      setErrors(newErrors);
      if (shouldFocusError) {
        _focus(refsMap.current.get(name));
      }
    } else {
      clearError(name);
    }
  };
  const register = (fullPath, className = "") => {
    const value = getValue(fullPath);
    const hasFieldError = hasError(fullPath);
    registerProps.key = registerProps.name = fullPath;
    registerProps["aria-invalid"] = hasFieldError ? sTrue : sFalse;
    registerProps.className = _errClassName({}, hasFieldError ? classNameError : false, className);
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
  const handleSubmit = (handler) => {
    return (e) => {
      e && e.preventDefault && e.preventDefault();
      const newErrors = resolver(values);
      setErrors(newErrors);
      if (hasError(null, newErrors)) {
        if (shouldFocusError) {
          let isFocused = false;
          refsMap.current.forEach((value, key2) => {
            if (!isFocused && hasError(key2, newErrors)) {
              isFocused = _focus(value);
            }
          });
        }
        return false;
      }
      handler(values);
      return true;
    };
  };
  const reset = useCallback((values2 = defaultValues, validate = true) => {
    init(values2);
    isTouched.current = false;
    isDirty.current = false;
    if (validate) {
      setErrors(resolver(values2));
    }
  }, [defaultValues, init, resolver]);
  const Error2 = useCallback(({
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
  }, [errors, classNameError]);
  const Errors = useCallback(({
    children,
    focusable = false
  }) => {
    if (!hasError()) {
      return false;
    }
    const errorElements = Array.from(refsMap.current).filter((entry) => hasError(entry[0])).map((entry) => {
      const [fullPath, element] = entry;
      return {
        error: _getNested(fullPath, errors),
        element
      };
    });
    if (errorElements.length === 0) {
      return false;
    }
    const result = errorElements.map(({
      error,
      element
    }) => /* @__PURE__ */ jsx("li", {
      className: _errClassName(error, classNameError),
      children: focusable ? /* @__PURE__ */ jsx("a", {
        onClick: () => _focus(element),
        children: error.message
      }) : error.message
    }, key(error)));
    return isFunction(children) ? children(result) : result;
  }, [errors, hasError, classNameError, key]);
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
export { useForm as default };
