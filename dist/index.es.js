import ir, { useState as F, useRef as fe, useEffect as ur, useCallback as Dr } from "react";
const rr = (n) => typeof n == "function", Te = {}, tr = () => Te;
let Fr = 2e9;
const te = /* @__PURE__ */ new WeakMap(), Ir = (n) => {
  let t = te.get(n);
  return t || (t = (Fr++).toString(36), te.set(n, t)), t;
}, nr = (n) => {
  let t;
  if (n instanceof Set)
    t = /* @__PURE__ */ new Set([...n]);
  else {
    const u = Array.isArray(n);
    t = u ? [...n] : { ...n }, u && n.message && (t.message = n.message, t.type = n.type);
  }
  return te.has(n) && (te.set(t, te.get(n)), te.delete(n)), t;
}, $r = /\[([^\]]+)\]/g;
let We = /* @__PURE__ */ new Map();
const Le = (n) => {
  if (!n)
    return [];
  let t = We.get(n);
  return t || (t = n.replace($r, ".$1").split(".").map((u) => +u - +u < 1 ? +u : u), We.set(n, t), t);
}, Pr = () => {
  We = /* @__PURE__ */ new Map();
}, Be = (n, t) => {
  if (t !== void 0)
    return n.length === 0 ? t : Be(n.slice(1), t[n[0]]);
}, W = (n, t) => Be(Le(n), t), cr = (n, t, u) => {
  const { length: c } = n;
  if (c === 0)
    return;
  const d = n[0];
  if (c === 1) {
    t[d] = u;
    return;
  }
  const R = t[d] !== void 0, T = n[1], O = +T - +T < 1;
  t[d] = R ? nr(t[d]) : O ? [] : {}, O && (t[d][T] = t[d][T] === void 0 ? {} : nr(t[d][T])), cr(n.slice(1), t[d], u);
}, K = (n, t, u) => {
  const c = { ...t };
  return cr(Le(n), c, u), c;
}, we = (n, t) => {
  const { length: u } = n;
  if (u === 0 || t === void 0)
    return;
  const c = n[0];
  if (u === 1) {
    delete t[c];
    return;
  }
  we(n.slice(1), t[c]);
}, Ye = (n) => Object.keys(n || Te).length === 0, Nr = (n, t) => {
  we(n, t), n.map((c, d) => d === 0 ? [...n] : [...n].slice(0, -1 * d)).forEach((c) => {
    const d = Be(c, t);
    d !== void 0 && (Array.isArray(d) ? (d.length === 0 || d.every(Ye)) && !d.message && we(c, t) : Ye(d) && we(c, t));
  });
}, he = (n, t) => {
  const u = { ...t };
  return Nr(Le(n), u), u;
}, Mr = (n) => {
  const { value: t, type: u, checked: c, options: d, files: R, multiple: T, valueAsNumber: O, valueAsDate: b } = n.target;
  switch (u) {
    case "checkbox":
      return c;
    case "range":
      return O;
    case "date":
      return b;
    case "number": {
      if (t === "")
        return null;
      const _ = Number.parseFloat(t);
      return +_ - +_ < 1 ? +_ : void 0;
    }
    case "file":
      return T ? R : R.item(0);
    case "select-multiple":
      return [...d].filter((_) => _.selected).map((_) => _.value);
    default:
      return t;
  }
}, Wr = (n, t, u) => {
  const c = [...n];
  return [c[t], c[u]] = [c[u], c[t]], c;
}, sr = (n, t, u) => {
  const c = [...n];
  return c.splice(t, 0, u), c;
}, $e = (n, t, u) => [u, t, n].filter((c) => !!c).map((c) => `${c.type ? `error-${c.type}` : c}`).join(" "), Ur = (n) => (t) => {
  let u = {};
  try {
    n.validateSync(t, { abortEarly: !1 });
  } catch (c) {
    for (const d of c.inner) {
      const R = W(d.path, u) || {};
      R.message = d.message, R.type = d.type, u = K(d.path, u, R);
    }
  }
  return u;
}, Jr = (n) => (t) => {
  let u = {};
  const c = n.safeParse(t);
  return c.success || c.error.errors.forEach((d) => {
    const R = d.path.join("."), T = W(R, u) || {};
    T.message = d.message, T.type = d.type, u = K(R, u, T);
  }), u;
};
var Ve = { exports: {} }, le = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var or;
function Yr() {
  if (or)
    return le;
  or = 1;
  var n = ir, t = Symbol.for("react.element"), u = Symbol.for("react.fragment"), c = Object.prototype.hasOwnProperty, d = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, R = { key: !0, ref: !0, __self: !0, __source: !0 };
  function T(O, b, _) {
    var C, x = {}, I = null, P = null;
    _ !== void 0 && (I = "" + _), b.key !== void 0 && (I = "" + b.key), b.ref !== void 0 && (P = b.ref);
    for (C in b)
      c.call(b, C) && !R.hasOwnProperty(C) && (x[C] = b[C]);
    if (O && O.defaultProps)
      for (C in b = O.defaultProps, b)
        x[C] === void 0 && (x[C] = b[C]);
    return { $$typeof: t, type: O, key: I, ref: P, props: x, _owner: d.current };
  }
  return le.Fragment = u, le.jsx = T, le.jsxs = T, le;
}
var de = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ar;
function Vr() {
  return ar || (ar = 1, process.env.NODE_ENV !== "production" && function() {
    var n = ir, t = Symbol.for("react.element"), u = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), d = Symbol.for("react.strict_mode"), R = Symbol.for("react.profiler"), T = Symbol.for("react.provider"), O = Symbol.for("react.context"), b = Symbol.for("react.forward_ref"), _ = Symbol.for("react.suspense"), C = Symbol.for("react.suspense_list"), x = Symbol.for("react.memo"), I = Symbol.for("react.lazy"), P = Symbol.for("react.offscreen"), X = Symbol.iterator, ve = "@@iterator";
    function pe(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = X && e[X] || e[ve];
      return typeof r == "function" ? r : null;
    }
    var Y = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function S(e) {
      {
        for (var r = arguments.length, s = new Array(r > 1 ? r - 1 : 0), f = 1; f < r; f++)
          s[f - 1] = arguments[f];
        ye("error", e, s);
      }
    }
    function ye(e, r, s) {
      {
        var f = Y.ReactDebugCurrentFrame, g = f.getStackAddendum();
        g !== "" && (r += "%s", s = s.concat([g]));
        var E = s.map(function(y) {
          return String(y);
        });
        E.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, E);
      }
    }
    var Oe = !1, H = !1, ne = !1, se = !1, ge = !1, oe;
    oe = Symbol.for("react.module.reference");
    function Se(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === c || e === R || ge || e === d || e === _ || e === C || se || e === P || Oe || H || ne || typeof e == "object" && e !== null && (e.$$typeof === I || e.$$typeof === x || e.$$typeof === T || e.$$typeof === O || e.$$typeof === b || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === oe || e.getModuleId !== void 0));
    }
    function Ce(e, r, s) {
      var f = e.displayName;
      if (f)
        return f;
      var g = r.displayName || r.name || "";
      return g !== "" ? s + "(" + g + ")" : s;
    }
    function ae(e) {
      return e.displayName || "Context";
    }
    function N(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && S("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case c:
          return "Fragment";
        case u:
          return "Portal";
        case R:
          return "Profiler";
        case d:
          return "StrictMode";
        case _:
          return "Suspense";
        case C:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case O:
            var r = e;
            return ae(r) + ".Consumer";
          case T:
            var s = e;
            return ae(s._context) + ".Provider";
          case b:
            return Ce(e, e.render, "ForwardRef");
          case x:
            var f = e.displayName || null;
            return f !== null ? f : N(e.type) || "Memo";
          case I: {
            var g = e, E = g._payload, y = g._init;
            try {
              return N(y(E));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var U = Object.assign, J = 0, me, V, Z, q, L, ie, Ee;
    function Re() {
    }
    Re.__reactDisabledLog = !0;
    function ke() {
      {
        if (J === 0) {
          me = console.log, V = console.info, Z = console.warn, q = console.error, L = console.group, ie = console.groupCollapsed, Ee = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Re,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        J++;
      }
    }
    function be() {
      {
        if (J--, J === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: U({}, e, {
              value: me
            }),
            info: U({}, e, {
              value: V
            }),
            warn: U({}, e, {
              value: Z
            }),
            error: U({}, e, {
              value: q
            }),
            group: U({}, e, {
              value: L
            }),
            groupCollapsed: U({}, e, {
              value: ie
            }),
            groupEnd: U({}, e, {
              value: Ee
            })
          });
        }
        J < 0 && S("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ue = Y.ReactCurrentDispatcher, o;
    function i(e, r, s) {
      {
        if (o === void 0)
          try {
            throw Error();
          } catch (g) {
            var f = g.stack.trim().match(/\n( *(at )?)/);
            o = f && f[1] || "";
          }
        return `
` + o + e;
      }
    }
    var a = !1, l;
    {
      var p = typeof WeakMap == "function" ? WeakMap : Map;
      l = new p();
    }
    function m(e, r) {
      if (!e || a)
        return "";
      {
        var s = l.get(e);
        if (s !== void 0)
          return s;
      }
      var f;
      a = !0;
      var g = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var E;
      E = ue.current, ue.current = null, ke();
      try {
        if (r) {
          var y = function() {
            throw Error();
          };
          if (Object.defineProperty(y.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(y, []);
            } catch (D) {
              f = D;
            }
            Reflect.construct(e, [], y);
          } else {
            try {
              y.call();
            } catch (D) {
              f = D;
            }
            e.call(y.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (D) {
            f = D;
          }
          e();
        }
      } catch (D) {
        if (D && f && typeof D.stack == "string") {
          for (var v = D.stack.split(`
`), k = f.stack.split(`
`), h = v.length - 1, w = k.length - 1; h >= 1 && w >= 0 && v[h] !== k[w]; )
            w--;
          for (; h >= 1 && w >= 0; h--, w--)
            if (v[h] !== k[w]) {
              if (h !== 1 || w !== 1)
                do
                  if (h--, w--, w < 0 || v[h] !== k[w]) {
                    var M = `
` + v[h].replace(" at new ", " at ");
                    return e.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", e.displayName)), typeof e == "function" && l.set(e, M), M;
                  }
                while (h >= 1 && w >= 0);
              break;
            }
        }
      } finally {
        a = !1, ue.current = E, be(), Error.prepareStackTrace = g;
      }
      var re = e ? e.displayName || e.name : "", G = re ? i(re) : "";
      return typeof e == "function" && l.set(e, G), G;
    }
    function A(e, r, s) {
      return m(e, !1);
    }
    function j(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function B(e, r, s) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return m(e, j(e));
      if (typeof e == "string")
        return i(e);
      switch (e) {
        case _:
          return i("Suspense");
        case C:
          return i("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case b:
            return A(e.render);
          case x:
            return B(e.type, r, s);
          case I: {
            var f = e, g = f._payload, E = f._init;
            try {
              return B(E(g), r, s);
            } catch {
            }
          }
        }
      return "";
    }
    var $ = Object.prototype.hasOwnProperty, z = {}, Q = Y.ReactDebugCurrentFrame;
    function _e(e) {
      if (e) {
        var r = e._owner, s = B(e.type, e._source, r ? r.type : null);
        Q.setExtraStackFrame(s);
      } else
        Q.setExtraStackFrame(null);
    }
    function fr(e, r, s, f, g) {
      {
        var E = Function.call.bind($);
        for (var y in e)
          if (E(e, y)) {
            var v = void 0;
            try {
              if (typeof e[y] != "function") {
                var k = Error((f || "React class") + ": " + s + " type `" + y + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[y] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw k.name = "Invariant Violation", k;
              }
              v = e[y](r, y, f, s, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (h) {
              v = h;
            }
            v && !(v instanceof Error) && (_e(g), S("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", f || "React class", s, y, typeof v), _e(null)), v instanceof Error && !(v.message in z) && (z[v.message] = !0, _e(g), S("Failed %s type: %s", s, v.message), _e(null));
          }
      }
    }
    var lr = Array.isArray;
    function xe(e) {
      return lr(e);
    }
    function dr(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, s = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return s;
      }
    }
    function vr(e) {
      try {
        return Ue(e), !1;
      } catch {
        return !0;
      }
    }
    function Ue(e) {
      return "" + e;
    }
    function Je(e) {
      if (vr(e))
        return S("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", dr(e)), Ue(e);
    }
    var ce = Y.ReactCurrentOwner, pr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Ke, qe, Ae;
    Ae = {};
    function yr(e) {
      if ($.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function gr(e) {
      if ($.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function mr(e, r) {
      if (typeof e.ref == "string" && ce.current && r && ce.current.stateNode !== r) {
        var s = N(ce.current.type);
        Ae[s] || (S('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', N(ce.current.type), e.ref), Ae[s] = !0);
      }
    }
    function Er(e, r) {
      {
        var s = function() {
          Ke || (Ke = !0, S("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        s.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: s,
          configurable: !0
        });
      }
    }
    function Rr(e, r) {
      {
        var s = function() {
          qe || (qe = !0, S("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        s.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: s,
          configurable: !0
        });
      }
    }
    var br = function(e, r, s, f, g, E, y) {
      var v = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: t,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: s,
        props: y,
        // Record the component responsible for creating this element.
        _owner: E
      };
      return v._store = {}, Object.defineProperty(v._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(v, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: f
      }), Object.defineProperty(v, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: g
      }), Object.freeze && (Object.freeze(v.props), Object.freeze(v)), v;
    };
    function _r(e, r, s, f, g) {
      {
        var E, y = {}, v = null, k = null;
        s !== void 0 && (Je(s), v = "" + s), gr(r) && (Je(r.key), v = "" + r.key), yr(r) && (k = r.ref, mr(r, g));
        for (E in r)
          $.call(r, E) && !pr.hasOwnProperty(E) && (y[E] = r[E]);
        if (e && e.defaultProps) {
          var h = e.defaultProps;
          for (E in h)
            y[E] === void 0 && (y[E] = h[E]);
        }
        if (v || k) {
          var w = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          v && Er(y, w), k && Rr(y, w);
        }
        return br(e, v, k, g, f, ce.current, y);
      }
    }
    var je = Y.ReactCurrentOwner, ze = Y.ReactDebugCurrentFrame;
    function ee(e) {
      if (e) {
        var r = e._owner, s = B(e.type, e._source, r ? r.type : null);
        ze.setExtraStackFrame(s);
      } else
        ze.setExtraStackFrame(null);
    }
    var De;
    De = !1;
    function Fe(e) {
      return typeof e == "object" && e !== null && e.$$typeof === t;
    }
    function Ge() {
      {
        if (je.current) {
          var e = N(je.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function hr(e) {
      return "";
    }
    var Xe = {};
    function wr(e) {
      {
        var r = Ge();
        if (!r) {
          var s = typeof e == "string" ? e : e.displayName || e.name;
          s && (r = `

Check the top-level render call using <` + s + ">.");
        }
        return r;
      }
    }
    function He(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var s = wr(r);
        if (Xe[s])
          return;
        Xe[s] = !0;
        var f = "";
        e && e._owner && e._owner !== je.current && (f = " It was passed a child from " + N(e._owner.type) + "."), ee(e), S('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', s, f), ee(null);
      }
    }
    function Ze(e, r) {
      {
        if (typeof e != "object")
          return;
        if (xe(e))
          for (var s = 0; s < e.length; s++) {
            var f = e[s];
            Fe(f) && He(f, r);
          }
        else if (Fe(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var g = pe(e);
          if (typeof g == "function" && g !== e.entries)
            for (var E = g.call(e), y; !(y = E.next()).done; )
              Fe(y.value) && He(y.value, r);
        }
      }
    }
    function Tr(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var s;
        if (typeof r == "function")
          s = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === b || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === x))
          s = r.propTypes;
        else
          return;
        if (s) {
          var f = N(r);
          fr(s, e.props, "prop", f, e);
        } else if (r.PropTypes !== void 0 && !De) {
          De = !0;
          var g = N(r);
          S("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", g || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && S("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Or(e) {
      {
        for (var r = Object.keys(e.props), s = 0; s < r.length; s++) {
          var f = r[s];
          if (f !== "children" && f !== "key") {
            ee(e), S("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", f), ee(null);
            break;
          }
        }
        e.ref !== null && (ee(e), S("Invalid attribute `ref` supplied to `React.Fragment`."), ee(null));
      }
    }
    var Qe = {};
    function er(e, r, s, f, g, E) {
      {
        var y = Se(e);
        if (!y) {
          var v = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var k = hr();
          k ? v += k : v += Ge();
          var h;
          e === null ? h = "null" : xe(e) ? h = "array" : e !== void 0 && e.$$typeof === t ? (h = "<" + (N(e.type) || "Unknown") + " />", v = " Did you accidentally export a JSX literal instead of a component?") : h = typeof e, S("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", h, v);
        }
        var w = _r(e, r, s, g, E);
        if (w == null)
          return w;
        if (y) {
          var M = r.children;
          if (M !== void 0)
            if (f)
              if (xe(M)) {
                for (var re = 0; re < M.length; re++)
                  Ze(M[re], e);
                Object.freeze && Object.freeze(M);
              } else
                S("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Ze(M, e);
        }
        if ($.call(r, "key")) {
          var G = N(e), D = Object.keys(r).filter(function(jr) {
            return jr !== "key";
          }), Ie = D.length > 0 ? "{key: someKey, " + D.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Qe[G + Ie]) {
            var Ar = D.length > 0 ? "{" + D.join(": ..., ") + ": ...}" : "{}";
            S(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Ie, G, Ar, G), Qe[G + Ie] = !0;
          }
        }
        return e === c ? Or(w) : Tr(w), w;
      }
    }
    function Sr(e, r, s) {
      return er(e, r, s, !0);
    }
    function Cr(e, r, s) {
      return er(e, r, s, !1);
    }
    var kr = Cr, xr = Sr;
    de.Fragment = c, de.jsx = kr, de.jsxs = xr;
  }()), de;
}
process.env.NODE_ENV === "production" ? Ve.exports = Yr() : Ve.exports = Vr();
var Pe = Ve.exports;
const Ne = (n) => JSON.stringify(n, (t, u) => u instanceof Set ? [...u].sort() : u), Me = /* @__PURE__ */ new Map(), Lr = (n, t) => (Me.set(n, t), ur(() => () => Me.delete(n), [n]), Dr((...u) => Me.get(n)(...u), [n])), Kr = ({ id: n, defaultValues: t, mode: u, classNameError: c, shouldFocusError: d = !1, resolver: R = tr }) => {
  const [T, O] = F({
    values: t || Te,
    errors: {}
  }), { values: b, errors: _ } = T, C = fe(!1), x = fe(!1), I = fe(!1), P = fe(/* @__PURE__ */ new Map()), X = fe(), ve = u === "onSubmit", pe = u === "onBlur", Y = u === "onChange", S = !ve && !pe && !Y, [ye] = F(
    () => (o, i) => O((a) => {
      const l = K(o, a.values, i);
      C.current = !0, x.current = X.current !== Ne(l);
      let p = a.errors;
      if ((Y || I.current && S || L(o, p)) && (p = he(o, p), !ve)) {
        const m = W(o, R(l));
        m && (p = K(o, p, m));
      }
      return {
        values: l,
        errors: p
      };
    })
  ), [Oe] = F(() => {
    const o = (a, l, p) => {
      O((m) => {
        const A = K(a, m.values, l(W(a, m.values)));
        C.current = !0, x.current = X.current !== Ne(A);
        let j = m.errors;
        const B = W(a, j);
        let $ = [];
        if (Array.isArray(B) && ($ = p(B)), Y || I.current && S) {
          const z = W(a, R(A));
          if (z && z.message) {
            const Q = $.length > 0 ? $ : {};
            Q.message = z.message, Q.type = z.type, $ = Q;
          }
        }
        return j = he(a, j), ($.length > 0 || $.message) && (j = K(a, j, $)), {
          values: A,
          errors: j
        };
      });
    }, i = (a, l, p) => {
      o(
        a,
        (m) => sr(m, l, p),
        (m) => sr(m, l, void 0)
      );
    };
    return {
      insert: i,
      append: (a, l) => i(a, Z(a).length, l),
      prepend: (a, l) => i(a, 0, l),
      clear: (a) => {
        const l = () => [];
        o(a, l, l);
      },
      remove: (a, l) => {
        const p = (m) => [...m].filter((A, j) => j !== l);
        o(a, p, p);
      },
      swap: (a, l, p) => {
        const m = (A) => Wr(A, l, p);
        o(a, m, m);
      }
    };
  }), [H] = F(
    () => (o) => O((i) => ({
      ...i,
      errors: o
    }))
  ), [ne] = F(() => (o) => {
    const i = o || Te;
    X.current = Ne(i), O((a) => ({
      ...a,
      values: { ...i }
    }));
  }), [se] = F(() => (o) => {
    const i = P.current.get(o);
    return i && i.focus ? (i.focus(), !0) : !1;
  }), [ge] = F(
    () => (o = "") => new Promise((i = tr) => {
      O((a) => {
        let l = R(a.values);
        if (o !== "") {
          const m = Array.isArray(o) ? o : [o];
          let A = { ...a.errors };
          m.forEach((j) => {
            const B = W(j, l);
            A = he(j, A), B !== void 0 && (A = K(j, A, B));
          }), l = A;
        }
        const p = {
          ...a,
          errors: l
        };
        return i(p), p;
      });
    })
  ), [oe] = F(() => (o, i) => {
    let a = i;
    return L(o, i) && (a = he(o, i)), a;
  }), [Se] = F(
    () => (o) => O((i) => {
      const a = i.errors, l = oe(o, a);
      return l === a ? i : {
        ...i,
        errors: l
      };
    })
  ), [Ce] = F(() => (o) => P.current.get(o)), [ae] = F(() => (o, i) => {
    i && P.current.set(o, i);
  }), [N] = F(() => (o) => o && ae(o.name, o)), [U] = F(() => (o, i = !0) => {
    ne(o || t), C.current = !1, x.current = !1, i && ge("", o);
  }), [J] = F(() => (o) => ye(o.target.name, Mr(o)));
  let me = 1;
  const V = (o) => Lr(`${n}!${me++}`, o);
  ur(() => (ne(t), () => {
    Pr();
  }), [t, ne]);
  const Z = V((o = "") => (P.current.has(o) || P.current.set(o, null), W(o, b))), q = V((o = "", i = _) => W(o, i)), L = V(
    (o = "", i = _) => o === "" ? !Ye(i) : W(o, i) !== void 0
  ), ie = V((o) => {
    const { name: i } = o.target, a = W(i, R(b));
    a ? (H(K(i, _, a)), d && se(i)) : H(oe(i, _));
  }), Ee = V((o, i = "") => {
    const a = Z(o), l = q(o), p = a === !0 || a === !1;
    return {
      name: o,
      "aria-invalid": !!l,
      className: $e(l, l ? c : "", i),
      onChange: J,
      onBlur: pe ? ie : void 0,
      ref: N,
      value: p ? void 0 : `${a}` == "0" ? a : a || "",
      checked: p ? a : void 0
    };
  }), Re = (o) => (i) => {
    i && i.preventDefault();
    const a = R(b);
    if (H(a), L("", a)) {
      if (d) {
        let l = !1;
        P.current.forEach((p, m) => {
          !l && L(m, a) && (l = se(m));
        });
      }
      return I.current = !0, !1;
    }
    return o(b), !0;
  }, ke = V(({ for: o, children: i }) => {
    const a = q(o, _);
    return a != null && a.message ? rr(i) ? i(a) : /* @__PURE__ */ Pe.jsx("span", { className: $e(a, c), children: a.message }) : !1;
  }), be = !L(), ue = V(({ children: o, focusable: i = !1 }) => {
    if (be)
      return !1;
    const l = Array.from(P.current).map((p) => p[0]).filter((p) => p !== "").filter((p) => L(p, _)).sort().map((p) => {
      const m = q(p);
      return /* @__PURE__ */ Pe.jsx("li", { className: $e(m, c), children: i ? /* @__PURE__ */ Pe.jsx("a", { onClick: () => se(p), children: m.message }) : m.message }, p);
    });
    return rr(o) ? o(l) : l;
  });
  return {
    getValue: Z,
    setValue: ye,
    register: Ee,
    onChange: J,
    onBlur: ie,
    getRef: Ce,
    setRef: ae,
    trigger: ge,
    handleSubmit: Re,
    hasError: L,
    getError: q,
    clearError: Se,
    setErrors: (o) => {
      I.current = !0, H(o);
    },
    array: Oe,
    key: Ir,
    Error: ke,
    Errors: ue,
    formState: {
      errors: _,
      isValid: be,
      isTouched: C.current,
      isDirty: x.current,
      hadError: I.current,
      reset: U
    }
  };
};
export {
  Kr as default,
  Ur as yupResolver,
  Jr as zodResolver
};
