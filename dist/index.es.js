import { jsx as b } from "react/jsx-runtime";
import { useState as g, useRef as x, useCallback as Ne, useEffect as Oe } from "react";
const ce = (r) => typeof r == "function", I = {}, ie = () => I;
let Me = 2e9;
const C = /* @__PURE__ */ new WeakMap(), Re = (r) => {
  let t = C.get(r);
  return t || (t = (Me++).toString(36), C.set(r, t)), t;
}, ae = (r) => {
  let t;
  if (r instanceof Set)
    t = /* @__PURE__ */ new Set([...r]);
  else {
    const n = Array.isArray(r);
    t = n ? [...r] : { ...r }, n && r.message && (t.message = r.message, t.type = r.type);
  }
  return C.has(r) && (C.set(t, C.get(r)), C.delete(r)), t;
}, Se = /\[([^\]]+)\]/g;
let Y = /* @__PURE__ */ new Map();
const L = (r) => {
  if (!r)
    return [];
  let t = Y.get(r);
  return t || (t = r.replace(Se, ".$1").split(".").map((n) => +n - +n < 1 ? +n : n), Y.set(r, t)), t;
}, Ce = () => {
  Y = /* @__PURE__ */ new Map();
}, A = (r, t) => {
  let n = t;
  const i = Array.isArray(r) ? r : L(r);
  for (let u = 0; u < i.length; u += 1) {
    if (n === void 0)
      return;
    n = n[i[u]];
  }
  return n;
}, v = (r, t, n) => {
  const i = L(r), { length: u } = i;
  if (u === 0)
    return t;
  const d = { ...t };
  let a = d;
  for (let m = 0; m < u - 1; m += 1) {
    const y = i[m], p = i[m + 1], S = a[y] !== void 0, k = +p - +p < 1;
    a[y] = S ? ae(a[y]) : k ? [] : {}, k && (a[y][p] = a[y][p] === void 0 ? {} : ae(a[y][p])), a = a[y];
  }
  return a[i[u - 1]] = n, d;
}, K = (r, t) => {
  const { length: n } = r;
  if (n === 0 || t === void 0)
    return;
  let i = t;
  for (let u = 0; u < n - 1; u += 1)
    if (i = i[r[u]], i === void 0)
      return;
  delete i[r[n - 1]];
}, q = (r) => Object.keys(r || I).length === 0, D = (r, t) => {
  const n = { ...t }, i = L(r);
  return K(i, n), i.map((d, a) => a === 0 ? [...i] : [...i].slice(0, -1 * a)).forEach((d) => {
    const a = A(d, n);
    a !== void 0 && (Array.isArray(a) ? (a.length === 0 || a.every(q)) && !a.message && K(d, n) : q(a) && K(d, n));
  }), n;
}, Te = (r) => {
  const { value: t, type: n, checked: i, options: u, files: d, multiple: a, valueAsNumber: m, valueAsDate: y } = r.target;
  switch (n) {
    case "checkbox":
      return i;
    case "range":
      return m;
    case "date":
      return y;
    case "number": {
      if (t === "")
        return null;
      const p = Number.parseFloat(t);
      return +p - +p < 1 ? +p : void 0;
    }
    case "file":
      return a ? d : d.item(0);
    case "select-multiple":
      return [...u].filter((p) => p.selected).map((p) => p.value);
    default:
      return t;
  }
}, _e = (r, t, n) => {
  const i = [...r];
  return [i[t], i[n]] = [i[n], i[t]], i;
}, ue = (r, t, n) => {
  const i = [...r];
  return i.splice(t, 0, n), i;
}, fe = (...r) => r.filter((t) => !!t).map((t) => `${t.type ? `error-${t.type}` : t}`).join(" "), W = (r) => JSON.stringify(r, (t, n) => n instanceof Set ? [...n].sort() : n), G = /* @__PURE__ */ new Map(), R = (r) => {
  const [t] = g(() => (...n) => G.get(t)(...n));
  return G.set(t, r), t;
}, de = (r) => r && r.focus ? (r.focus(), !0) : !1, he = ({ defaultValues: r, mode: t, focusOn: n, classNameError: i, shouldFocusError: u = !1, resolver: d = ie }) => {
  const [a, m] = g({
    values: r || I,
    errors: {}
  }), { values: y, errors: p } = a, S = x(!1), k = x(!1), T = x(!1), N = x(/* @__PURE__ */ new Map()), V = x(), Q = t === "onSubmit", U = t === "onBlur", $ = t === "onChange", X = !Q && !U && !$, [Z] = g(
    () => (e, o) => m((s) => {
      const c = v(e, s.values, o);
      S.current = !0, k.current = V.current !== W(c);
      let f = s.errors;
      if (($ || T.current && X || O(e, f)) && (f = D(e, f), !Q)) {
        const l = A(e, d(c));
        l && (f = v(e, f, l));
      }
      return {
        values: c,
        errors: f
      };
    })
  ), [le] = g(() => {
    const e = (s, c, f) => {
      m((l) => {
        const E = v(s, l.values, c(A(s, l.values)));
        S.current = !0, k.current = V.current !== W(E);
        let w = l.errors;
        const _ = A(s, w);
        let M = [];
        if (Array.isArray(_) && (M = f(_)), $ || T.current && X) {
          const h = A(s, d(E));
          if (h && h.message) {
            const H = M.length > 0 ? M : {};
            H.message = h.message, H.type = h.type, M = H;
          }
        }
        return w = D(s, w), (M.length > 0 || M.message) && (w = v(s, w, M)), {
          values: E,
          errors: w
        };
      });
    }, o = (s, c, f) => {
      e(
        s,
        (l) => ue(l, c, f),
        (l) => ue(l, c, void 0)
      );
    };
    return {
      insert: o,
      append: (s, c) => o(s, J(s).length, c),
      prepend: (s, c) => o(s, 0, c),
      clear: (s) => {
        const c = () => [];
        e(s, c, c);
      },
      remove: (s, c) => {
        const f = (l) => [...l].filter((E, w) => w !== c);
        e(s, f, f);
      },
      swap: (s, c, f) => {
        const l = (E) => _e(E, c, f);
        e(s, l, l);
      }
    };
  }), [B] = g(
    () => (e) => m((o) => ({
      ...o,
      errors: e
    }))
  ), [pe] = g(() => (e) => {
    T.current = !0, B(e);
  }), [j] = g(() => (e) => {
    const o = e || I;
    V.current = W(o), m((s) => ({
      ...s,
      values: { ...o }
    }));
  }), [F] = g(() => (e) => de(N.current.get(e))), [P] = g(
    () => (e = "") => new Promise((o = ie) => {
      m((s) => {
        let c = d(s.values);
        if (e !== "") {
          const l = Array.isArray(e) ? e : [e];
          let E = { ...s.errors };
          l.forEach((w) => {
            const _ = A(w, c);
            E = D(w, E), _ !== void 0 && (E = v(w, E, _));
          }), c = E;
        }
        const f = {
          ...s,
          errors: c
        };
        return o(f), f;
      });
    })
  ), [ee] = g(() => (e, o) => {
    let s = o;
    return O(e, o) && (s = D(e, o)), s;
  }), [ge] = g(
    () => (e) => m((o) => {
      const s = o.errors, c = ee(e, s);
      return c === s ? o : {
        ...o,
        errors: c
      };
    })
  ), ye = Ne((e) => de(e), []), [me] = g(() => (e) => N.current.get(e)), [re] = g(() => (e, o) => {
    o && (N.current.set(e, o), e === n && ye(o));
  }), [Ee] = g(() => (e) => re(e == null ? void 0 : e.name, e)), [we] = g(() => (e, o = !0) => {
    j(e || r), S.current = !1, k.current = !1, o && P("", e);
  }), [se] = g(() => (e) => Z(e.target.name, Te(e)));
  Oe(() => (j(r), () => {
    Ce(), G.clear();
  }), [r]);
  const J = R((e = "") => (N.current.has(e) || N.current.set(e, null), A(e, y))), z = R((e = "", o = p) => A(e, o)), O = R(
    (e = "", o = p) => e === "" ? !q(o) : A(e, o) !== void 0
  ), te = R((e) => {
    const { name: o } = e.target, s = A(o, d(y));
    s ? (B(v(o, p, s)), u && F(o)) : B(ee(o, p));
  }), Ae = R((e, o = "") => {
    const s = J(e), c = z(e), f = s === !0 || s === !1;
    return {
      name: e,
      "aria-invalid": !!c,
      className: fe(o, c && i, c),
      onChange: se,
      onBlur: U ? te : void 0,
      ref: Ee,
      value: f ? void 0 : `${s}` == "0" ? s : s || "",
      checked: f ? s : void 0
    };
  }), ve = (e) => (o) => {
    o && o.preventDefault();
    const s = d(y);
    if (B(s), O("", s)) {
      if (u) {
        let c = !1;
        N.current.forEach((f, l) => {
          !c && O(l, s) && (c = F(l));
        });
      }
      return T.current = !0, !1;
    }
    return e(y), !0;
  }, ne = R(({ for: e, children: o }) => {
    const s = z(e);
    if (s != null && s.message) {
      const c = fe(i, s);
      return ce(o) ? o(s, c) : /* @__PURE__ */ b("span", { className: c, children: s.message });
    }
    return !1;
  }), oe = !O(), ke = R(({ children: e, focusable: o = !1 }) => {
    if (oe)
      return !1;
    const s = Array.from(N.current).map((c) => c[0]).filter((c) => !!c && O(c)).map((c) => /* @__PURE__ */ b(ne, { for: c, children: (f, l) => /* @__PURE__ */ b("li", { className: l, children: o ? /* @__PURE__ */ b("a", { onClick: () => F(c), children: f.message }) : f.message }) }, c));
    return ce(e) ? e(s) : s;
  });
  return {
    getValue: J,
    setValue: Z,
    register: Ae,
    onChange: se,
    onBlur: te,
    getRef: me,
    setRef: re,
    trigger: P,
    handleSubmit: ve,
    hasError: O,
    getError: z,
    clearError: ge,
    setErrors: pe,
    array: le,
    key: Re,
    Error: ne,
    Errors: ke,
    formState: {
      errors: p,
      isValid: oe,
      isTouched: S.current,
      isDirty: k.current,
      hadError: T.current,
      reset: we
    }
  };
}, be = (r) => (t) => {
  let n = {};
  try {
    r.validateSync(t, { abortEarly: !1 });
  } catch (i) {
    for (const u of i.inner) {
      const d = A(u.path, n) || {};
      d.message = u.message, d.type = u.type, n = v(u.path, n, d);
    }
  }
  return n;
}, De = (r) => (t) => {
  let n = {};
  const i = r.safeParse(t);
  return i.success || i.error.errors.forEach((u) => {
    const d = u.path.join("."), a = A(d, n) || {};
    a.message = u.message, a.type = u.type, n = v(d, n, a);
  }), n;
};
export {
  he as default,
  be as yupResolver,
  De as zodResolver
};
