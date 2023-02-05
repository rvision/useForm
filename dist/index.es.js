import cr, { useState as Dr, useRef as Q, useCallback as ur, useEffect as Fr } from "react";
const fr = (n) => !Number.isNaN(n), Nr = (n) => parseInt(n, 10), rr = (n) => typeof n == "function", { isArray: ke } = Array, tr = (n) => JSON.stringify(n, (o, c) => c instanceof Set ? [...c] : c), lr = Object.keys, pe = {}, re = () => pe;
let $r = 9999;
const ee = /* @__PURE__ */ new WeakMap(), Ir = (n) => {
  let o = ee.get(n);
  return o || (o = (++$r).toString(36).split("").reduce((c, l) => l + c, ""), ee.set(n, o)), o;
}, $e = (n) => {
  let o;
  return n instanceof Set ? o = /* @__PURE__ */ new Set([...n]) : o = ke(n) ? [...n] : { ...n }, ee.has(n) && (ee.set(o, ee.get(n)), ee.delete(n)), o;
}, Mr = /\[([^\]]+)\]/g;
let We = /* @__PURE__ */ new Map();
const Le = (n) => {
  if (!n)
    return [];
  let o = We.get(n);
  return o || (o = n.replace(Mr, ".$1").split("."), We.set(n, o), o);
}, Pr = () => {
  We = /* @__PURE__ */ new Map();
}, Ue = (n, o) => {
  if (o !== void 0)
    return n.length === 0 ? o : Ue(n.slice(1), o[n[0]]);
}, j = (n, o) => Ue(Le(n), o), Ye = (n, o, c) => {
  const { length: l } = n;
  if (l > 0) {
    const f = n[0];
    if (l === 1) {
      o[f] = c;
      return;
    }
    const O = o[f] === void 0, h = Nr(n[1]);
    if (fr(h))
      return o[f] = O ? [] : $e(o[f]), o[f][h] = o[f][h] === void 0 ? {} : $e(o[f][h]), Ye(n.slice(2), o[f][h], c);
    o[f] = O ? {} : $e(o[f]), Ye(n.slice(1), o[f], c);
  }
}, U = (n, o, c) => {
  const l = { ...o };
  return Ye(Le(n), l, c), l;
}, Ce = (n, o) => {
  const { length: c } = n;
  if (c === 0 || o === void 0)
    return;
  const l = n[0];
  if (c === 1) {
    delete o[l];
    return;
  }
  Ce(n.slice(1), o[l]);
}, nr = (n) => lr(n || pe).length === 0, Wr = (n, o) => {
  Ce(n, o), n.map((l, f) => f === 0 ? [...n] : [...n].slice(0, -1 * f)).forEach((l) => {
    const f = Ue(l, o);
    f !== void 0 && (ke(f) ? (f.length === 0 || f.every(nr)) && (f.message || Ce(l, o)) : nr(f) && Ce(l, o));
  });
}, Ie = (n, o) => {
  const c = { ...o };
  return Wr(Le(n), c), c;
}, Yr = (n) => {
  const { value: o, type: c, checked: l, options: f, files: O, multiple: h, valueAsNumber: S, valueAsDate: v } = n.target;
  switch (c) {
    case "checkbox":
      return l;
    case "range":
      return S;
    case "date":
      return v;
    case "number": {
      if (o === "")
        return null;
      const k = Number.parseFloat(o);
      return fr(k) ? k : void 0;
    }
    case "file":
      return h ? O : O.item(0);
    case "select-multiple":
      return [...f].filter((k) => k.selected).map((k) => k.value);
    default:
      return o;
  }
}, or = (n, o, c) => {
  const l = j(n, o);
  return l && ke(l) ? U(n, o, c(l)) : o;
}, ar = (n, o, c) => {
  if (ke(n)) {
    const l = [...n];
    return [l[o], l[c]] = [l[c], l[o]], l;
  }
  return n;
}, Me = (n, o, c) => `${c || ""} ${o || ""} ${n.type ? `error-${n.type}` : ""}`.trim();
var Ve = {}, Vr = {
  get exports() {
    return Ve;
  },
  set exports(n) {
    Ve = n;
  }
}, de = {};
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
function Lr() {
  if (sr)
    return de;
  sr = 1;
  var n = cr, o = Symbol.for("react.element"), c = Symbol.for("react.fragment"), l = Object.prototype.hasOwnProperty, f = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, O = { key: !0, ref: !0, __self: !0, __source: !0 };
  function h(S, v, k) {
    var x, N = {}, A = null, B = null;
    k !== void 0 && (A = "" + k), v.key !== void 0 && (A = "" + v.key), v.ref !== void 0 && (B = v.ref);
    for (x in v)
      l.call(v, x) && !O.hasOwnProperty(x) && (N[x] = v[x]);
    if (S && S.defaultProps)
      for (x in v = S.defaultProps, v)
        N[x] === void 0 && (N[x] = v[x]);
    return { $$typeof: o, type: S, key: A, ref: B, props: N, _owner: f.current };
  }
  return de.Fragment = c, de.jsx = h, de.jsxs = h, de;
}
var ve = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ir;
function Ur() {
  return ir || (ir = 1, process.env.NODE_ENV !== "production" && function() {
    var n = cr, o = Symbol.for("react.element"), c = Symbol.for("react.portal"), l = Symbol.for("react.fragment"), f = Symbol.for("react.strict_mode"), O = Symbol.for("react.profiler"), h = Symbol.for("react.provider"), S = Symbol.for("react.context"), v = Symbol.for("react.forward_ref"), k = Symbol.for("react.suspense"), x = Symbol.for("react.suspense_list"), N = Symbol.for("react.memo"), A = Symbol.for("react.lazy"), B = Symbol.for("react.offscreen"), z = Symbol.iterator, me = "@@iterator";
    function ye(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = z && e[z] || e[me];
      return typeof r == "function" ? r : null;
    }
    var V = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function R(e) {
      {
        for (var r = arguments.length, a = new Array(r > 1 ? r - 1 : 0), u = 1; u < r; u++)
          a[u - 1] = arguments[u];
        te("error", e, a);
      }
    }
    function te(e, r, a) {
      {
        var u = V.ReactDebugCurrentFrame, y = u.getStackAddendum();
        y !== "" && (r += "%s", a = a.concat([y]));
        var _ = a.map(function(p) {
          return String(p);
        });
        _.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, _);
      }
    }
    var ne = !1, oe = !1, ge = !1, P = !1, ae = !1, se;
    se = Symbol.for("react.module.reference");
    function Ee(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === l || e === O || ae || e === f || e === k || e === x || P || e === B || ne || oe || ge || typeof e == "object" && e !== null && (e.$$typeof === A || e.$$typeof === N || e.$$typeof === h || e.$$typeof === S || e.$$typeof === v || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === se || e.getModuleId !== void 0));
    }
    function J(e, r, a) {
      var u = e.displayName;
      if (u)
        return u;
      var y = r.displayName || r.name || "";
      return y !== "" ? a + "(" + y + ")" : a;
    }
    function W(e) {
      return e.displayName || "Context";
    }
    function $(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && R("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case l:
          return "Fragment";
        case c:
          return "Portal";
        case O:
          return "Profiler";
        case f:
          return "StrictMode";
        case k:
          return "Suspense";
        case x:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case S:
            var r = e;
            return W(r) + ".Consumer";
          case h:
            var a = e;
            return W(a._context) + ".Provider";
          case v:
            return J(e, e.render, "ForwardRef");
          case N:
            var u = e.displayName || null;
            return u !== null ? u : $(e.type) || "Memo";
          case A: {
            var y = e, _ = y._payload, p = y._init;
            try {
              return $(p(_));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var D = Object.assign, q = 0, _e, Re, be, he, Te, ie, we;
    function ce() {
    }
    ce.__reactDisabledLog = !0;
    function Se() {
      {
        if (q === 0) {
          _e = console.log, Re = console.info, be = console.warn, he = console.error, Te = console.group, ie = console.groupCollapsed, we = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: ce,
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
    function xe() {
      {
        if (q--, q === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: D({}, e, {
              value: _e
            }),
            info: D({}, e, {
              value: Re
            }),
            warn: D({}, e, {
              value: be
            }),
            error: D({}, e, {
              value: he
            }),
            group: D({}, e, {
              value: Te
            }),
            groupCollapsed: D({}, e, {
              value: ie
            }),
            groupEnd: D({}, e, {
              value: we
            })
          });
        }
        q < 0 && R("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ue = V.ReactCurrentDispatcher, fe;
    function G(e, r, a) {
      {
        if (fe === void 0)
          try {
            throw Error();
          } catch (y) {
            var u = y.stack.trim().match(/\n( *(at )?)/);
            fe = u && u[1] || "";
          }
        return `
` + fe + e;
      }
    }
    var K = !1, H;
    {
      var t = typeof WeakMap == "function" ? WeakMap : Map;
      H = new t();
    }
    function s(e, r) {
      if (!e || K)
        return "";
      {
        var a = H.get(e);
        if (a !== void 0)
          return a;
      }
      var u;
      K = !0;
      var y = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var _;
      _ = ue.current, ue.current = null, Se();
      try {
        if (r) {
          var p = function() {
            throw Error();
          };
          if (Object.defineProperty(p.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(p, []);
            } catch (Y) {
              u = Y;
            }
            Reflect.construct(e, [], p);
          } else {
            try {
              p.call();
            } catch (Y) {
              u = Y;
            }
            e.call(p.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Y) {
            u = Y;
          }
          e();
        }
      } catch (Y) {
        if (Y && u && typeof Y.stack == "string") {
          for (var d = Y.stack.split(`
`), F = u.stack.split(`
`), T = d.length - 1, w = F.length - 1; T >= 1 && w >= 0 && d[T] !== F[w]; )
            w--;
          for (; T >= 1 && w >= 0; T--, w--)
            if (d[T] !== F[w]) {
              if (T !== 1 || w !== 1)
                do
                  if (T--, w--, w < 0 || d[T] !== F[w]) {
                    var I = `
` + d[T].replace(" at new ", " at ");
                    return e.displayName && I.includes("<anonymous>") && (I = I.replace("<anonymous>", e.displayName)), typeof e == "function" && H.set(e, I), I;
                  }
                while (T >= 1 && w >= 0);
              break;
            }
        }
      } finally {
        K = !1, ue.current = _, xe(), Error.prepareStackTrace = y;
      }
      var Z = e ? e.displayName || e.name : "", er = Z ? G(Z) : "";
      return typeof e == "function" && H.set(e, er), er;
    }
    function i(e, r, a) {
      return s(e, !1);
    }
    function g(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function m(e, r, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return s(e, g(e));
      if (typeof e == "string")
        return G(e);
      switch (e) {
        case k:
          return G("Suspense");
        case x:
          return G("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case v:
            return i(e.render);
          case N:
            return m(e.type, r, a);
          case A: {
            var u = e, y = u._payload, _ = u._init;
            try {
              return m(_(y), r, a);
            } catch {
            }
          }
        }
      return "";
    }
    var E = Object.prototype.hasOwnProperty, C = {}, L = V.ReactDebugCurrentFrame;
    function Oe(e) {
      if (e) {
        var r = e._owner, a = m(e.type, e._source, r ? r.type : null);
        L.setExtraStackFrame(a);
      } else
        L.setExtraStackFrame(null);
    }
    function dr(e, r, a, u, y) {
      {
        var _ = Function.call.bind(E);
        for (var p in e)
          if (_(e, p)) {
            var d = void 0;
            try {
              if (typeof e[p] != "function") {
                var F = Error((u || "React class") + ": " + a + " type `" + p + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[p] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw F.name = "Invariant Violation", F;
              }
              d = e[p](r, p, u, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (T) {
              d = T;
            }
            d && !(d instanceof Error) && (Oe(y), R("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", u || "React class", a, p, typeof d), Oe(null)), d instanceof Error && !(d.message in C) && (C[d.message] = !0, Oe(y), R("Failed %s type: %s", a, d.message), Oe(null));
          }
      }
    }
    var vr = Array.isArray;
    function je(e) {
      return vr(e);
    }
    function pr(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, a = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function mr(e) {
      try {
        return Be(e), !1;
      } catch {
        return !0;
      }
    }
    function Be(e) {
      return "" + e;
    }
    function Je(e) {
      if (mr(e))
        return R("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", pr(e)), Be(e);
    }
    var le = V.ReactCurrentOwner, yr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, qe, ze, Ae;
    Ae = {};
    function gr(e) {
      if (E.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function Er(e) {
      if (E.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function _r(e, r) {
      if (typeof e.ref == "string" && le.current && r && le.current.stateNode !== r) {
        var a = $(le.current.type);
        Ae[a] || (R('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', $(le.current.type), e.ref), Ae[a] = !0);
      }
    }
    function Rr(e, r) {
      {
        var a = function() {
          qe || (qe = !0, R("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        a.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: a,
          configurable: !0
        });
      }
    }
    function br(e, r) {
      {
        var a = function() {
          ze || (ze = !0, R("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        a.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: a,
          configurable: !0
        });
      }
    }
    var hr = function(e, r, a, u, y, _, p) {
      var d = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: o,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: a,
        props: p,
        // Record the component responsible for creating this element.
        _owner: _
      };
      return d._store = {}, Object.defineProperty(d._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(d, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: u
      }), Object.defineProperty(d, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: y
      }), Object.freeze && (Object.freeze(d.props), Object.freeze(d)), d;
    };
    function Tr(e, r, a, u, y) {
      {
        var _, p = {}, d = null, F = null;
        a !== void 0 && (Je(a), d = "" + a), Er(r) && (Je(r.key), d = "" + r.key), gr(r) && (F = r.ref, _r(r, y));
        for (_ in r)
          E.call(r, _) && !yr.hasOwnProperty(_) && (p[_] = r[_]);
        if (e && e.defaultProps) {
          var T = e.defaultProps;
          for (_ in T)
            p[_] === void 0 && (p[_] = T[_]);
        }
        if (d || F) {
          var w = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          d && Rr(p, w), F && br(p, w);
        }
        return hr(e, d, F, y, u, le.current, p);
      }
    }
    var De = V.ReactCurrentOwner, Ge = V.ReactDebugCurrentFrame;
    function X(e) {
      if (e) {
        var r = e._owner, a = m(e.type, e._source, r ? r.type : null);
        Ge.setExtraStackFrame(a);
      } else
        Ge.setExtraStackFrame(null);
    }
    var Fe;
    Fe = !1;
    function Ne(e) {
      return typeof e == "object" && e !== null && e.$$typeof === o;
    }
    function Ke() {
      {
        if (De.current) {
          var e = $(De.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function wr(e) {
      {
        if (e !== void 0) {
          var r = e.fileName.replace(/^.*[\\\/]/, ""), a = e.lineNumber;
          return `

Check your code at ` + r + ":" + a + ".";
        }
        return "";
      }
    }
    var He = {};
    function Sr(e) {
      {
        var r = Ke();
        if (!r) {
          var a = typeof e == "string" ? e : e.displayName || e.name;
          a && (r = `

Check the top-level render call using <` + a + ">.");
        }
        return r;
      }
    }
    function Xe(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var a = Sr(r);
        if (He[a])
          return;
        He[a] = !0;
        var u = "";
        e && e._owner && e._owner !== De.current && (u = " It was passed a child from " + $(e._owner.type) + "."), X(e), R('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', a, u), X(null);
      }
    }
    function Ze(e, r) {
      {
        if (typeof e != "object")
          return;
        if (je(e))
          for (var a = 0; a < e.length; a++) {
            var u = e[a];
            Ne(u) && Xe(u, r);
          }
        else if (Ne(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var y = ye(e);
          if (typeof y == "function" && y !== e.entries)
            for (var _ = y.call(e), p; !(p = _.next()).done; )
              Ne(p.value) && Xe(p.value, r);
        }
      }
    }
    function Or(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var a;
        if (typeof r == "function")
          a = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === v || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === N))
          a = r.propTypes;
        else
          return;
        if (a) {
          var u = $(r);
          dr(a, e.props, "prop", u, e);
        } else if (r.PropTypes !== void 0 && !Fe) {
          Fe = !0;
          var y = $(r);
          R("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", y || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && R("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Cr(e) {
      {
        for (var r = Object.keys(e.props), a = 0; a < r.length; a++) {
          var u = r[a];
          if (u !== "children" && u !== "key") {
            X(e), R("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", u), X(null);
            break;
          }
        }
        e.ref !== null && (X(e), R("Invalid attribute `ref` supplied to `React.Fragment`."), X(null));
      }
    }
    function Qe(e, r, a, u, y, _) {
      {
        var p = Ee(e);
        if (!p) {
          var d = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (d += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var F = wr(y);
          F ? d += F : d += Ke();
          var T;
          e === null ? T = "null" : je(e) ? T = "array" : e !== void 0 && e.$$typeof === o ? (T = "<" + ($(e.type) || "Unknown") + " />", d = " Did you accidentally export a JSX literal instead of a component?") : T = typeof e, R("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", T, d);
        }
        var w = Tr(e, r, a, y, _);
        if (w == null)
          return w;
        if (p) {
          var I = r.children;
          if (I !== void 0)
            if (u)
              if (je(I)) {
                for (var Z = 0; Z < I.length; Z++)
                  Ze(I[Z], e);
                Object.freeze && Object.freeze(I);
              } else
                R("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Ze(I, e);
        }
        return e === l ? Cr(w) : Or(w), w;
      }
    }
    function kr(e, r, a) {
      return Qe(e, r, a, !0);
    }
    function xr(e, r, a) {
      return Qe(e, r, a, !1);
    }
    var jr = xr, Ar = kr;
    ve.Fragment = l, ve.jsx = jr, ve.jsxs = Ar;
  }()), ve;
}
(function(n) {
  process.env.NODE_ENV === "production" ? n.exports = Lr() : n.exports = Ur();
})(Vr);
const Pe = Ve.jsx, b = (n) => {
  const o = Q(n);
  return o.current = n, ur((...c) => o.current(...c), []);
}, M = {
  key: "",
  name: "",
  "aria-invalid": !1,
  className: "",
  onChange: re,
  onBlur: re,
  ref: re,
  value: "",
  checked: !1
}, Jr = ({
  defaultValues: n,
  mode: o,
  classNameError: c,
  shouldFocusError: l = !1,
  resolver: f = re
}) => {
  const [O, h] = Dr({
    values: n || pe,
    errors: {}
  }), {
    values: S,
    errors: v
  } = O, k = Q(!1), x = Q(!1), N = Q(!1), A = Q(/* @__PURE__ */ new Map()), B = Q(), z = o === "onSubmit", me = o === "onBlur", ye = o === "onChange", V = !z && !me && !ye, R = (t) => h((s) => ({
    ...s,
    errors: t
  })), te = ur((t) => {
    const s = t || pe;
    B.current = tr(s), h((i) => ({
      ...i,
      values: {
        ...s
      }
    }));
  }, []);
  Fr(() => (te(n), Pr), [n, te]);
  const ne = (t) => {
    const s = A.current.get(t);
    return s && s.focus ? (s.focus(), !0) : !1;
  }, oe = b((t = "") => (A.current.has(t) || A.current.set(t, null), j(t, S))), ge = b((t = "", s = v) => j(t, s)), P = b((t = "", s = v) => t === "" ? lr(s).length > 0 : j(t, s) !== void 0), ae = b((t, s = v) => {
    let i = s;
    return P(t, s) && (i = Ie(t, s)), i;
  }), se = b((t = "", s = S) => new Promise((i = re) => {
    const g = f(s);
    if (t === "") {
      R(g), i(g);
      return;
    }
    const m = isArray(t) ? t : [t];
    let E = {
      ...v
    };
    m.forEach((C) => {
      const L = j(C, g);
      E = Ie(C, E), L !== void 0 && (E = U(C, E, L));
    }), R(E), i(E);
  })), Ee = ye || N.current && V, J = Ee && !z, W = b((t, s) => {
    let i = v;
    if ((Ee || P(t)) && (i = Ie(t, i), !z)) {
      const g = j(t, f(s));
      g && (i = U(t, i, g));
    }
    return i;
  }), $ = b((t, s, i) => {
    const g = j(t, f(i)), m = j(t, s);
    return m && (delete m.message, delete m.type, g != null && g.message && (m.message = g.message, m.type = g.type)), s;
  }), D = b((t, s, i = W) => new Promise((g = re) => {
    h((m) => {
      const E = U(t, {
        ...t === "" ? s : S
      }, s);
      k.current = !0, x.current = B.current !== tr(E);
      const C = i(t, E), L = {
        values: E,
        errors: C
      };
      return g(L), L;
    });
  })), q = b((t) => D(t, [], J ? W : () => [])), _e = b((t, s) => {
    const i = J ? W : () => v;
    return D(t, [...j(t, S), s], i);
  }), Re = b((t, s) => {
    const i = J ? W : (g, m) => {
      let E = or(t, v, (C) => [void 0, ...C]);
      return $(t, E, m);
    };
    return D(t, [s, ...j(t, S)], i);
  }), be = b((t, s) => {
    const i = J ? W : (g, m) => {
      let E = ae(`${t}.${s}`, {
        ...v
      });
      return E = or(t, E, (C) => (C.splice(s, 1), C)), $(t, E, m);
    };
    return D(t, j(t, S).filter((g, m) => m !== s), i);
  }), he = b((t, s, i) => {
    const g = J ? W : (m, E) => {
      let C = ar(j(t, v), s, i);
      return C = C ? U(t, v, C) : v, $(t, C, E);
    };
    return D(t, ar(oe(t), s, i), g);
  }), Te = b((t) => A.current.get(t)), ie = b((t, s) => {
    s && A.current.set(t, s);
  }), we = b((t) => t && ie(t.name, t)), ce = b((t) => D(t.target.name, Yr(t))), Se = b((t) => {
    const {
      name: s
    } = t.target, i = j(s, f(S));
    i ? (R(U(s, v, i)), l && ne(s)) : R(ae(s));
  }), xe = b((t, s = "") => {
    const i = oe(t), g = P(t);
    return M.name = t, M["aria-invalid"] = g, M.className = Me(pe, g ? c : "", s), M.onChange = ce, M.ref = we, M.onBlur = me ? Se : void 0, i === !0 || i === !1 ? (M.checked = i, M.value = void 0) : (M.value = `${i}` == "0" ? i : i || "", M.checked = void 0), M;
  }), ue = (t) => (s) => {
    s && (s == null || s.preventDefault());
    const i = f(S);
    if (R(i), P("", i)) {
      if (l) {
        let g = !1;
        A.current.forEach((m, E) => {
          !g && P(E, i) && (g = ne(E));
        });
      }
      return N.current = !0, !1;
    }
    return t(S), !0;
  }, fe = b((t = n, s = !0) => {
    te(t), k.current = !1, x.current = !1, s && se("", t);
  }), G = b(({
    for: t,
    children: s
  }) => {
    const i = ge(t, v);
    return i != null && i.message ? rr(s) ? s(i) : /* @__PURE__ */ Pe("span", {
      className: Me(i, c),
      children: i.message
    }) : !1;
  }), K = !P(), H = b(({
    children: t,
    focusable: s = !1
  }) => {
    if (K)
      return !1;
    const g = Array.from(A.current).filter((m) => !!m[1]).map((m) => m[0]).filter((m) => P(m, v)).sort().map((m) => {
      const E = j(m, v);
      return /* @__PURE__ */ Pe("li", {
        className: Me(E, c),
        children: s ? /* @__PURE__ */ Pe("a", {
          onClick: () => ne(m),
          children: E.message
        }) : E.message
      }, m);
    });
    return rr(t) ? t(g) : g;
  });
  return {
    getValue: oe,
    setValue: D,
    register: xe,
    onChange: ce,
    onBlur: Se,
    getRef: Te,
    setRef: ie,
    trigger: se,
    handleSubmit: ue,
    hasError: P,
    getError: ge,
    clearError: (t) => R(ae(t)),
    setErrors: (t) => {
      N.current = !0, R(t);
    },
    array: {
      append: _e,
      prepend: Re,
      remove: be,
      swap: he,
      clear: q
    },
    key: Ir,
    reset: fe,
    Error: G,
    Errors: H,
    formState: {
      errors: v,
      isValid: K,
      isTouched: k.current,
      isDirty: x.current
    }
  };
}, qr = (n) => (o) => {
  let c = {};
  try {
    n.validateSync(o, {
      abortEarly: !1
    });
  } catch (l) {
    for (const f of l.inner) {
      const O = j(f.path, c) || {};
      O.message = f.message, O.type = f.type, c = U(f.path, c, O);
    }
  }
  return c;
}, zr = (n) => (o) => {
  let c = {};
  const l = n.safeParse(o);
  return l.success || l.error.errors.forEach((f) => {
    const O = f.path.join("."), h = j(O, c) || {};
    h.message = f.message, h.type = f.type, c = U(f.path, c, h);
  }), c;
};
export {
  Jr as default,
  qr as yupResolver,
  zr as zodResolver
};
