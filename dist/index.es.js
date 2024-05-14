import ir, { useState as I, useRef as ue, useEffect as ur, useCallback as Dr } from "react";
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
    const i = Array.isArray(n);
    t = i ? [...n] : { ...n }, i && n.message && (t.message = n.message, t.type = n.type);
  }
  return te.has(n) && (te.set(t, te.get(n)), te.delete(n)), t;
}, $r = /\[([^\]]+)\]/g;
let Me = /* @__PURE__ */ new Map();
const Ve = (n) => {
  if (!n)
    return [];
  let t = Me.get(n);
  return t || (t = n.replace($r, ".$1").split(".").map((i) => +i - +i < 1 ? +i : i), Me.set(n, t), t);
}, Pr = () => {
  Me = /* @__PURE__ */ new Map();
}, Le = (n, t) => {
  if (t !== void 0)
    return n.length === 0 ? t : Le(n.slice(1), t[n[0]]);
}, W = (n, t) => Le(Ve(n), t), cr = (n, t, i) => {
  const { length: c } = n;
  if (c === 0)
    return;
  const l = n[0];
  if (c === 1) {
    t[l] = i;
    return;
  }
  const b = t[l] !== void 0, T = n[1], S = +T - +T < 1;
  t[l] = b ? nr(t[l]) : S ? [] : {}, S && (t[l][T] = t[l][T] === void 0 ? {} : nr(t[l][T])), cr(n.slice(1), t[l], i);
}, J = (n, t, i) => {
  const c = { ...t };
  return cr(Ve(n), c, i), c;
}, we = (n, t) => {
  const { length: i } = n;
  if (i === 0 || t === void 0)
    return;
  const c = n[0];
  if (i === 1) {
    delete t[c];
    return;
  }
  we(n.slice(1), t[c]);
}, We = (n) => Object.keys(n || Te).length === 0, Nr = (n, t) => {
  we(n, t), n.map((c, l) => l === 0 ? [...n] : [...n].slice(0, -1 * l)).forEach((c) => {
    const l = Le(c, t);
    l !== void 0 && (Array.isArray(l) ? (l.length === 0 || l.every(We)) && !l.message && we(c, t) : We(l) && we(c, t));
  });
}, he = (n, t) => {
  const i = { ...t };
  return Nr(Ve(n), i), i;
}, Mr = (n) => {
  const { value: t, type: i, checked: c, options: l, files: b, multiple: T, valueAsNumber: S, valueAsDate: _ } = n.target;
  switch (i) {
    case "checkbox":
      return c;
    case "range":
      return S;
    case "date":
      return _;
    case "number": {
      if (t === "")
        return null;
      const R = Number.parseFloat(t);
      return +R - +R < 1 ? +R : void 0;
    }
    case "file":
      return T ? b : b.item(0);
    case "select-multiple":
      return [...l].filter((R) => R.selected).map((R) => R.value);
    default:
      return t;
  }
}, Wr = (n, t, i) => {
  const c = [...n];
  return [c[t], c[i]] = [c[i], c[t]], c;
}, ar = (n, t, i) => {
  const c = [...n];
  return c.splice(t, 0, i), c;
}, Ie = (n, t, i) => [i, t, n].filter((c) => !!c).map((c) => `${c.type ? `error-${c.type}` : c}`).join(" "), Ur = (n) => (t) => {
  let i = {};
  try {
    n.validateSync(t, { abortEarly: !1 });
  } catch (c) {
    for (const l of c.inner) {
      const b = W(l.path, i) || {};
      b.message = l.message, b.type = l.type, i = J(l.path, i, b);
    }
  }
  return i;
}, Jr = (n) => (t) => {
  let i = {};
  const c = n.safeParse(t);
  return c.success || c.error.errors.forEach((l) => {
    const b = l.path.join("."), T = W(b, i) || {};
    T.message = l.message, T.type = l.type, i = J(b, i, T);
  }), i;
};
var Ye = { exports: {} }, ce = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sr;
function Yr() {
  if (sr)
    return ce;
  sr = 1;
  var n = ir, t = Symbol.for("react.element"), i = Symbol.for("react.fragment"), c = Object.prototype.hasOwnProperty, l = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, b = { key: !0, ref: !0, __self: !0, __source: !0 };
  function T(S, _, R) {
    var C, A = {}, F = null, $ = null;
    R !== void 0 && (F = "" + R), _.key !== void 0 && (F = "" + _.key), _.ref !== void 0 && ($ = _.ref);
    for (C in _)
      c.call(_, C) && !b.hasOwnProperty(C) && (A[C] = _[C]);
    if (S && S.defaultProps)
      for (C in _ = S.defaultProps, _)
        A[C] === void 0 && (A[C] = _[C]);
    return { $$typeof: t, type: S, key: F, ref: $, props: A, _owner: l.current };
  }
  return ce.Fragment = i, ce.jsx = T, ce.jsxs = T, ce;
}
var fe = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var or;
function Vr() {
  return or || (or = 1, process.env.NODE_ENV !== "production" && function() {
    var n = ir, t = Symbol.for("react.element"), i = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), l = Symbol.for("react.strict_mode"), b = Symbol.for("react.profiler"), T = Symbol.for("react.provider"), S = Symbol.for("react.context"), _ = Symbol.for("react.forward_ref"), R = Symbol.for("react.suspense"), C = Symbol.for("react.suspense_list"), A = Symbol.for("react.memo"), F = Symbol.for("react.lazy"), $ = Symbol.for("react.offscreen"), H = Symbol.iterator, le = "@@iterator";
    function de(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = H && e[H] || e[le];
      return typeof r == "function" ? r : null;
    }
    var Y = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function O(e) {
      {
        for (var r = arguments.length, a = new Array(r > 1 ? r - 1 : 0), f = 1; f < r; f++)
          a[f - 1] = arguments[f];
        ve("error", e, a);
      }
    }
    function ve(e, r, a) {
      {
        var f = Y.ReactDebugCurrentFrame, g = f.getStackAddendum();
        g !== "" && (r += "%s", a = a.concat([g]));
        var m = a.map(function(y) {
          return String(y);
        });
        m.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, m);
      }
    }
    var Oe = !1, K = !1, ne = !1, ae = !1, pe = !1, se;
    se = Symbol.for("react.module.reference");
    function Se(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === c || e === b || pe || e === l || e === R || e === C || ae || e === $ || Oe || K || ne || typeof e == "object" && e !== null && (e.$$typeof === F || e.$$typeof === A || e.$$typeof === T || e.$$typeof === S || e.$$typeof === _ || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === se || e.getModuleId !== void 0));
    }
    function ye(e, r, a) {
      var f = e.displayName;
      if (f)
        return f;
      var g = r.displayName || r.name || "";
      return g !== "" ? a + "(" + g + ")" : a;
    }
    function ge(e) {
      return e.displayName || "Context";
    }
    function P(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && O("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case c:
          return "Fragment";
        case i:
          return "Portal";
        case b:
          return "Profiler";
        case l:
          return "StrictMode";
        case R:
          return "Suspense";
        case C:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case S:
            var r = e;
            return ge(r) + ".Consumer";
          case T:
            var a = e;
            return ge(a._context) + ".Provider";
          case _:
            return ye(e, e.render, "ForwardRef");
          case A:
            var f = e.displayName || null;
            return f !== null ? f : P(e.type) || "Memo";
          case F: {
            var g = e, m = g._payload, y = g._init;
            try {
              return P(y(m));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var V = Object.assign, q = 0, L, Z, z, B, oe, me, Ee;
    function Re() {
    }
    Re.__reactDisabledLog = !0;
    function be() {
      {
        if (q === 0) {
          L = console.log, Z = console.info, z = console.warn, B = console.error, oe = console.group, me = console.groupCollapsed, Ee = console.groupEnd;
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
        q++;
      }
    }
    function Ce() {
      {
        if (q--, q === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: V({}, e, {
              value: L
            }),
            info: V({}, e, {
              value: Z
            }),
            warn: V({}, e, {
              value: z
            }),
            error: V({}, e, {
              value: B
            }),
            group: V({}, e, {
              value: oe
            }),
            groupCollapsed: V({}, e, {
              value: me
            }),
            groupEnd: V({}, e, {
              value: Ee
            })
          });
        }
        q < 0 && O("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var s = Y.ReactCurrentDispatcher, u;
    function o(e, r, a) {
      {
        if (u === void 0)
          try {
            throw Error();
          } catch (g) {
            var f = g.stack.trim().match(/\n( *(at )?)/);
            u = f && f[1] || "";
          }
        return `
` + u + e;
      }
    }
    var d = !1, v;
    {
      var E = typeof WeakMap == "function" ? WeakMap : Map;
      v = new E();
    }
    function k(e, r) {
      if (!e || d)
        return "";
      {
        var a = v.get(e);
        if (a !== void 0)
          return a;
      }
      var f;
      d = !0;
      var g = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var m;
      m = s.current, s.current = null, be();
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
          for (var p = D.stack.split(`
`), x = f.stack.split(`
`), h = p.length - 1, w = x.length - 1; h >= 1 && w >= 0 && p[h] !== x[w]; )
            w--;
          for (; h >= 1 && w >= 0; h--, w--)
            if (p[h] !== x[w]) {
              if (h !== 1 || w !== 1)
                do
                  if (h--, w--, w < 0 || p[h] !== x[w]) {
                    var M = `
` + p[h].replace(" at new ", " at ");
                    return e.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", e.displayName)), typeof e == "function" && v.set(e, M), M;
                  }
                while (h >= 1 && w >= 0);
              break;
            }
        }
      } finally {
        d = !1, s.current = m, Ce(), Error.prepareStackTrace = g;
      }
      var re = e ? e.displayName || e.name : "", X = re ? o(re) : "";
      return typeof e == "function" && v.set(e, X), X;
    }
    function j(e, r, a) {
      return k(e, !1);
    }
    function G(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function N(e, r, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return k(e, G(e));
      if (typeof e == "string")
        return o(e);
      switch (e) {
        case R:
          return o("Suspense");
        case C:
          return o("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case _:
            return j(e.render);
          case A:
            return N(e.type, r, a);
          case F: {
            var f = e, g = f._payload, m = f._init;
            try {
              return N(m(g), r, a);
            } catch {
            }
          }
        }
      return "";
    }
    var U = Object.prototype.hasOwnProperty, Q = {}, Be = Y.ReactDebugCurrentFrame;
    function _e(e) {
      if (e) {
        var r = e._owner, a = N(e.type, e._source, r ? r.type : null);
        Be.setExtraStackFrame(a);
      } else
        Be.setExtraStackFrame(null);
    }
    function fr(e, r, a, f, g) {
      {
        var m = Function.call.bind(U);
        for (var y in e)
          if (m(e, y)) {
            var p = void 0;
            try {
              if (typeof e[y] != "function") {
                var x = Error((f || "React class") + ": " + a + " type `" + y + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[y] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw x.name = "Invariant Violation", x;
              }
              p = e[y](r, y, f, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (h) {
              p = h;
            }
            p && !(p instanceof Error) && (_e(g), O("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", f || "React class", a, y, typeof p), _e(null)), p instanceof Error && !(p.message in Q) && (Q[p.message] = !0, _e(g), O("Failed %s type: %s", a, p.message), _e(null));
          }
      }
    }
    var lr = Array.isArray;
    function ke(e) {
      return lr(e);
    }
    function dr(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, a = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
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
        return O("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", dr(e)), Ue(e);
    }
    var ie = Y.ReactCurrentOwner, pr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Ke, qe, xe;
    xe = {};
    function yr(e) {
      if (U.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function gr(e) {
      if (U.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function mr(e, r) {
      if (typeof e.ref == "string" && ie.current && r && ie.current.stateNode !== r) {
        var a = P(ie.current.type);
        xe[a] || (O('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', P(ie.current.type), e.ref), xe[a] = !0);
      }
    }
    function Er(e, r) {
      {
        var a = function() {
          Ke || (Ke = !0, O("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        a.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: a,
          configurable: !0
        });
      }
    }
    function Rr(e, r) {
      {
        var a = function() {
          qe || (qe = !0, O("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        a.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: a,
          configurable: !0
        });
      }
    }
    var br = function(e, r, a, f, g, m, y) {
      var p = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: t,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: a,
        props: y,
        // Record the component responsible for creating this element.
        _owner: m
      };
      return p._store = {}, Object.defineProperty(p._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(p, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: f
      }), Object.defineProperty(p, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: g
      }), Object.freeze && (Object.freeze(p.props), Object.freeze(p)), p;
    };
    function _r(e, r, a, f, g) {
      {
        var m, y = {}, p = null, x = null;
        a !== void 0 && (Je(a), p = "" + a), gr(r) && (Je(r.key), p = "" + r.key), yr(r) && (x = r.ref, mr(r, g));
        for (m in r)
          U.call(r, m) && !pr.hasOwnProperty(m) && (y[m] = r[m]);
        if (e && e.defaultProps) {
          var h = e.defaultProps;
          for (m in h)
            y[m] === void 0 && (y[m] = h[m]);
        }
        if (p || x) {
          var w = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          p && Er(y, w), x && Rr(y, w);
        }
        return br(e, p, x, g, f, ie.current, y);
      }
    }
    var Ae = Y.ReactCurrentOwner, ze = Y.ReactDebugCurrentFrame;
    function ee(e) {
      if (e) {
        var r = e._owner, a = N(e.type, e._source, r ? r.type : null);
        ze.setExtraStackFrame(a);
      } else
        ze.setExtraStackFrame(null);
    }
    var je;
    je = !1;
    function De(e) {
      return typeof e == "object" && e !== null && e.$$typeof === t;
    }
    function Ge() {
      {
        if (Ae.current) {
          var e = P(Ae.current.type);
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
          var a = typeof e == "string" ? e : e.displayName || e.name;
          a && (r = `

Check the top-level render call using <` + a + ">.");
        }
        return r;
      }
    }
    function He(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var a = wr(r);
        if (Xe[a])
          return;
        Xe[a] = !0;
        var f = "";
        e && e._owner && e._owner !== Ae.current && (f = " It was passed a child from " + P(e._owner.type) + "."), ee(e), O('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', a, f), ee(null);
      }
    }
    function Ze(e, r) {
      {
        if (typeof e != "object")
          return;
        if (ke(e))
          for (var a = 0; a < e.length; a++) {
            var f = e[a];
            De(f) && He(f, r);
          }
        else if (De(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var g = de(e);
          if (typeof g == "function" && g !== e.entries)
            for (var m = g.call(e), y; !(y = m.next()).done; )
              De(y.value) && He(y.value, r);
        }
      }
    }
    function Tr(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var a;
        if (typeof r == "function")
          a = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === _ || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === A))
          a = r.propTypes;
        else
          return;
        if (a) {
          var f = P(r);
          fr(a, e.props, "prop", f, e);
        } else if (r.PropTypes !== void 0 && !je) {
          je = !0;
          var g = P(r);
          O("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", g || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && O("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Or(e) {
      {
        for (var r = Object.keys(e.props), a = 0; a < r.length; a++) {
          var f = r[a];
          if (f !== "children" && f !== "key") {
            ee(e), O("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", f), ee(null);
            break;
          }
        }
        e.ref !== null && (ee(e), O("Invalid attribute `ref` supplied to `React.Fragment`."), ee(null));
      }
    }
    var Qe = {};
    function er(e, r, a, f, g, m) {
      {
        var y = Se(e);
        if (!y) {
          var p = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (p += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var x = hr();
          x ? p += x : p += Ge();
          var h;
          e === null ? h = "null" : ke(e) ? h = "array" : e !== void 0 && e.$$typeof === t ? (h = "<" + (P(e.type) || "Unknown") + " />", p = " Did you accidentally export a JSX literal instead of a component?") : h = typeof e, O("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", h, p);
        }
        var w = _r(e, r, a, g, m);
        if (w == null)
          return w;
        if (y) {
          var M = r.children;
          if (M !== void 0)
            if (f)
              if (ke(M)) {
                for (var re = 0; re < M.length; re++)
                  Ze(M[re], e);
                Object.freeze && Object.freeze(M);
              } else
                O("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Ze(M, e);
        }
        if (U.call(r, "key")) {
          var X = P(e), D = Object.keys(r).filter(function(jr) {
            return jr !== "key";
          }), Fe = D.length > 0 ? "{key: someKey, " + D.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Qe[X + Fe]) {
            var Ar = D.length > 0 ? "{" + D.join(": ..., ") + ": ...}" : "{}";
            O(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Fe, X, Ar, X), Qe[X + Fe] = !0;
          }
        }
        return e === c ? Or(w) : Tr(w), w;
      }
    }
    function Sr(e, r, a) {
      return er(e, r, a, !0);
    }
    function Cr(e, r, a) {
      return er(e, r, a, !1);
    }
    var kr = Cr, xr = Sr;
    fe.Fragment = c, fe.jsx = kr, fe.jsxs = xr;
  }()), fe;
}
process.env.NODE_ENV === "production" ? Ye.exports = Yr() : Ye.exports = Vr();
var $e = Ye.exports;
const Pe = (n) => JSON.stringify(n, (t, i) => i instanceof Set ? [...i].sort() : i), Ne = /* @__PURE__ */ new Map(), Lr = (n, t) => (Ne.set(n, t), ur(() => () => Ne.delete(n), [n]), Dr((...i) => Ne.get(n)(...i), [n])), Kr = ({ id: n, defaultValues: t, mode: i, classNameError: c, shouldFocusError: l = !1, resolver: b = tr }) => {
  const [T, S] = I({
    values: t || Te,
    errors: {}
  }), { values: _, errors: R } = T, C = ue(!1), A = ue(!1), F = ue(!1), $ = ue(/* @__PURE__ */ new Map()), H = ue(), le = i === "onSubmit", de = i === "onBlur", Y = i === "onChange", O = !le && !de && !Y, [ve] = I(
    () => (s, u) => S((o) => {
      const d = J(s, o.values, u);
      C.current = !0, A.current = H.current !== Pe(d);
      let v = o.errors;
      if ((Y || F.current && O || B(s, v)) && (v = he(s, v), !le)) {
        const E = W(s, b(d));
        E && (v = J(s, v, E));
      }
      return {
        values: d,
        errors: v
      };
    })
  ), [Oe] = I(() => {
    const s = (o, d, v) => {
      S((E) => {
        const k = J(o, E.values, d(W(o, E.values)));
        C.current = !0, A.current = H.current !== Pe(k);
        let j = E.errors;
        const G = W(o, j);
        let N = [];
        if (Array.isArray(G) && (N = v(G)), Y || F.current && O) {
          const U = W(o, b(k));
          if (U && U.message) {
            const Q = N.length > 0 ? N : {};
            Q.message = U.message, Q.type = U.type, N = Q;
          }
        }
        return j = he(o, j), (N.length > 0 || N.message) && (j = J(o, j, N)), {
          values: k,
          errors: j
        };
      });
    }, u = (o, d, v) => {
      s(
        o,
        (E) => ar(E, d, v),
        (E) => ar(E, d, void 0)
      );
    };
    return {
      insert: u,
      append: (o, d) => u(o, Z(o).length, d),
      prepend: (o, d) => u(o, 0, d),
      clear: (o) => {
        const d = () => [];
        s(o, d, d);
      },
      remove: (o, d) => {
        const v = (E) => [...E].filter((k, j) => j !== d);
        s(o, v, v);
      },
      swap: (o, d, v) => {
        const E = (k) => Wr(k, d, v);
        s(o, E, E);
      }
    };
  }), [K] = I(
    () => (s) => S((u) => ({
      ...u,
      errors: s
    }))
  ), [ne] = I(() => (s) => {
    const u = s || Te;
    H.current = Pe(u), S((o) => ({
      ...o,
      values: { ...u }
    }));
  }), [ae] = I(() => (s) => {
    const u = $.current.get(s);
    return u && u.focus ? (u.focus(), !0) : !1;
  }), [pe] = I(
    () => (s = "") => new Promise((u = tr) => {
      S((o) => {
        let d = b(o.values);
        if (s !== "") {
          const E = Array.isArray(s) ? s : [s];
          let k = { ...o.errors };
          E.forEach((j) => {
            const G = W(j, d);
            k = he(j, k), G !== void 0 && (k = J(j, k, G));
          }), d = k;
        }
        const v = {
          ...o,
          errors: d
        };
        return u(v), v;
      });
    })
  ), [se] = I(() => (s, u) => {
    let o = u;
    return B(s, u) && (o = he(s, u)), o;
  }), [Se] = I(() => (s) => $.current.get(s)), [ye] = I(() => (s, u) => {
    u && $.current.set(s, u);
  }), [ge] = I(() => (s) => s && ye(s.name, s)), [P] = I(() => (s, u = !0) => {
    ne(s || t), C.current = !1, A.current = !1, u && pe("", s);
  }), [V] = I(() => (s) => ve(s.target.name, Mr(s)));
  let q = 1;
  const L = (s) => Lr(`${n}!${q++}`, s);
  ur(() => (ne(t), () => {
    Pr();
  }), [t, ne]);
  const Z = L((s = "") => ($.current.has(s) || $.current.set(s, null), W(s, _))), z = L((s = "", u = R) => W(s, u)), B = L(
    (s = "", u = R) => s === "" ? !We(u) : W(s, u) !== void 0
  ), oe = L((s) => {
    const { name: u } = s.target, o = W(u, b(_));
    o ? (K(J(u, R, o)), l && ae(u)) : K(se(u, R));
  }), me = L((s, u = "") => {
    const o = Z(s), d = z(s), v = o === !0 || o === !1;
    return {
      name: s,
      "aria-invalid": !!d,
      className: Ie(d, d ? c : "", u),
      onChange: V,
      onBlur: de ? oe : void 0,
      ref: ge,
      value: v ? void 0 : `${o}` == "0" ? o : o || "",
      checked: v ? o : void 0
    };
  }), Ee = (s) => (u) => {
    u && u.preventDefault();
    const o = b(_);
    if (K(o), B("", o)) {
      if (l) {
        let d = !1;
        $.current.forEach((v, E) => {
          !d && B(E, o) && (d = ae(E));
        });
      }
      return F.current = !0, !1;
    }
    return s(_), !0;
  }, Re = L(({ for: s, children: u }) => {
    const o = z(s, R);
    return o != null && o.message ? rr(u) ? u(o) : /* @__PURE__ */ $e.jsx("span", { className: Ie(o, c), children: o.message }) : !1;
  }), be = !B(), Ce = L(({ children: s, focusable: u = !1 }) => {
    if (be)
      return !1;
    const d = Array.from($.current).map((v) => v[0]).filter((v) => v !== "").filter((v) => B(v, R)).sort().map((v) => {
      const E = z(v);
      return /* @__PURE__ */ $e.jsx("li", { className: Ie(E, c), children: u ? /* @__PURE__ */ $e.jsx("a", { onClick: () => ae(v), children: E.message }) : E.message }, v);
    });
    return rr(s) ? s(d) : d;
  });
  return {
    getValue: Z,
    setValue: ve,
    register: me,
    onChange: V,
    onBlur: oe,
    getRef: Se,
    setRef: ye,
    trigger: pe,
    handleSubmit: Ee,
    hasError: B,
    getError: z,
    clearError: (s) => K(se(s, R)),
    setErrors: (s) => {
      F.current = !0, K(s);
    },
    array: Oe,
    key: Ir,
    Error: Re,
    Errors: Ce,
    formState: {
      errors: R,
      isValid: be,
      isTouched: C.current,
      isDirty: A.current,
      hadError: F.current,
      reset: P
    }
  };
};
export {
  Kr as default,
  Ur as yupResolver,
  Jr as zodResolver
};
