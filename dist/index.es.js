import { jsx as D } from "react/jsx-runtime";
import { useState as p, useRef as T, useCallback as ye, useEffect as ge, useId as Re } from "react";
const ie = (r) => typeof r == "function", b = {}, ae = () => b;
let Se = 2e9;
const M = /* @__PURE__ */ new WeakMap(), Te = (r) => {
  let e = M.get(r);
  return e || (e = (Se++).toString(36), M.set(r, e)), e;
}, ue = (r) => {
  let e;
  if (r instanceof Set)
    e = /* @__PURE__ */ new Set([...r]);
  else {
    const c = Array.isArray(r);
    e = c ? [...r] : { ...r }, c && r.message && (e.message = r.message, e.type = r.type);
  }
  return M.has(r) && (M.set(e, M.get(r)), M.delete(r)), e;
}, xe = /\[([^\]]+)\]/g;
let G = /* @__PURE__ */ new Map();
const Q = (r) => {
  if (!r)
    return [];
  let e = G.get(r);
  return e || (e = r.replace(xe, ".$1").split(".").map((c) => +c - +c < 1 ? +c : c), G.set(r, e), e);
}, Ce = () => {
  G = /* @__PURE__ */ new Map();
}, U = (r, e) => {
  if (e !== void 0)
    return r.length === 0 ? e : U(r.slice(1), e[r[0]]);
}, w = (r, e) => U(Q(r), e), le = (r, e, c) => {
  const { length: i } = r;
  if (i === 0)
    return;
  const a = r[0];
  if (i === 1) {
    e[a] = c;
    return;
  }
  const d = e[a] !== void 0, y = r[1], E = +y - +y < 1;
  e[a] = d ? ue(e[a]) : E ? [] : {}, E && (e[a][y] = e[a][y] === void 0 ? {} : ue(e[a][y])), le(r.slice(1), e[a], c);
}, v = (r, e, c) => {
  const i = { ...e };
  return le(Q(r), i, c), i;
}, $ = (r, e) => {
  const { length: c } = r;
  if (c === 0 || e === void 0)
    return;
  const i = r[0];
  if (c === 1) {
    delete e[i];
    return;
  }
  $(r.slice(1), e[i]);
}, L = (r) => Object.keys(r || b).length === 0, Be = (r, e) => {
  $(r, e), r.map((i, a) => a === 0 ? [...r] : [...r].slice(0, -1 * a)).forEach((i) => {
    const a = U(i, e);
    a !== void 0 && (Array.isArray(a) ? (a.length === 0 || a.every(L)) && !a.message && $(i, e) : L(a) && $(i, e));
  });
}, V = (r, e) => {
  const c = { ...e };
  return Be(Q(r), c), c;
}, Ie = (r) => {
  const { value: e, type: c, checked: i, options: a, files: d, multiple: y, valueAsNumber: E, valueAsDate: _ } = r.target;
  switch (c) {
    case "checkbox":
      return i;
    case "range":
      return E;
    case "date":
      return _;
    case "number": {
      if (e === "")
        return null;
      const g = Number.parseFloat(e);
      return +g - +g < 1 ? +g : void 0;
    }
    case "file":
      return y ? d : d.item(0);
    case "select-multiple":
      return [...a].filter((g) => g.selected).map((g) => g.value);
    default:
      return e;
  }
}, De = (r, e, c) => {
  const i = [...r];
  return [i[e], i[c]] = [i[c], i[e]], i;
}, fe = (r, e, c) => {
  const i = [...r];
  return i.splice(e, 0, c), i;
}, de = (...r) => r.filter((e) => !!e).map((e) => `${e.type ? `error-${e.type}` : e}`).join(" "), Y = (r) => JSON.stringify(r, (e, c) => c instanceof Set ? [...c].sort() : c), q = /* @__PURE__ */ new Map(), O = (r) => {
  const e = Re();
  return q.set(e, r), ge(() => () => q.delete(e), []), ye((...c) => q.get(e)(...c), []);
}, pe = (r) => r && r.focus ? (r.focus(), !0) : !1, be = ({ defaultValues: r, mode: e, focusOn: c, classNameError: i, shouldFocusError: a = !1, resolver: d = ae }) => {
  const [y, E] = p({
    values: r || b,
    errors: {}
  }), { values: _, errors: g } = y, x = T(!1), C = T(!1), R = T(!1), A = T(/* @__PURE__ */ new Map()), F = T(), X = e === "onSubmit", Z = e === "onBlur", J = e === "onChange", j = !X && !Z && !J, [P] = p(
    () => (s, t) => E((n) => {
      const o = v(s, n.values, t);
      x.current = !0, C.current = F.current !== Y(o);
      let u = n.errors;
      if ((J || R.current && j || N(s, u)) && (u = V(s, u), !X)) {
        const f = w(s, d(o));
        f && (u = v(s, u, f));
      }
      return {
        values: o,
        errors: u
      };
    })
  ), [me] = p(() => {
    const s = (n, o, u) => {
      E((f) => {
        const l = v(n, f.values, o(w(n, f.values)));
        x.current = !0, C.current = F.current !== Y(l);
        let m = f.errors;
        const S = w(n, m);
        let k = [];
        if (Array.isArray(S) && (k = u(S)), J || R.current && j) {
          const I = w(n, d(l));
          if (I && I.message) {
            const W = k.length > 0 ? k : {};
            W.message = I.message, W.type = I.type, k = W;
          }
        }
        return m = V(n, m), (k.length > 0 || k.message) && (m = v(n, m, k)), {
          values: l,
          errors: m
        };
      });
    }, t = (n, o, u) => {
      s(
        n,
        (f) => fe(f, o, u),
        (f) => fe(f, o, void 0)
      );
    };
    return {
      insert: t,
      append: (n, o) => t(n, H(n).length, o),
      prepend: (n, o) => t(n, 0, o),
      clear: (n) => {
        const o = () => [];
        s(n, o, o);
      },
      remove: (n, o) => {
        const u = (f) => [...f].filter((l, m) => m !== o);
        s(n, u, u);
      },
      swap: (n, o, u) => {
        const f = (l) => De(l, o, u);
        s(n, f, f);
      }
    };
  }), [B] = p(
    () => (s) => E((t) => ({
      ...t,
      errors: s
    }))
  ), [Ee] = p(() => (s) => {
    R.current = !0, B(s);
  }), [h] = p(() => (s) => {
    const t = s || b;
    F.current = Y(t), E((n) => ({
      ...n,
      values: { ...t }
    }));
  }), [z] = p(() => (s) => pe(A.current.get(s))), [ee] = p(
    () => (s = "") => new Promise((t = ae) => {
      E((n) => {
        let o = d(n.values);
        if (s !== "") {
          const f = Array.isArray(s) ? s : [s];
          let l = { ...n.errors };
          f.forEach((m) => {
            const S = w(m, o);
            l = V(m, l), S !== void 0 && (l = v(m, l, S));
          }), o = l;
        }
        const u = {
          ...n,
          errors: o
        };
        return t(u), u;
      });
    })
  ), [re] = p(() => (s, t) => {
    let n = t;
    return N(s, t) && (n = V(s, t)), n;
  }), [we] = p(
    () => (s) => E((t) => {
      const n = t.errors, o = re(s, n);
      return o === n ? t : {
        ...t,
        errors: o
      };
    })
  ), ve = ye((s) => pe(s), []), [Ae] = p(() => (s) => A.current.get(s)), [se] = p(() => (s, t) => {
    t && (A.current.set(s, t), s === c && ve(t));
  }), [Ne] = p(() => (s) => se(s == null ? void 0 : s.name, s)), [ke] = p(() => (s, t = !0) => {
    h(s || r), x.current = !1, C.current = !1, t && ee("", s);
  }), [ne] = p(() => (s) => P(s.target.name, Ie(s)));
  ge(() => (h(r), () => {
    Ce();
  }), [r, h]);
  const H = O((s = "") => (A.current.has(s) || A.current.set(s, null), w(s, _))), K = O((s = "", t = g) => w(s, t)), N = O(
    (s = "", t = g) => s === "" ? !L(t) : w(s, t) !== void 0
  ), te = O((s) => {
    const { name: t } = s.target, n = w(t, d(_));
    n ? (B(v(t, g, n)), a && z(t)) : B(re(t, g));
  }), Oe = O((s, t = "") => {
    const n = H(s), o = K(s), u = n === !0 || n === !1;
    return {
      name: s,
      "aria-invalid": !!o,
      className: de(t, o && i, o),
      onChange: ne,
      onBlur: Z ? te : void 0,
      ref: Ne,
      value: u ? void 0 : `${n}` == "0" ? n : n || "",
      checked: u ? n : void 0
    };
  }), _e = (s) => (t) => {
    t && t.preventDefault();
    const n = d(_);
    if (B(n), N("", n)) {
      if (a) {
        let o = !1;
        A.current.forEach((u, f) => {
          !o && N(f, n) && (o = z(f));
        });
      }
      return R.current = !0, !1;
    }
    return s(_), !0;
  }, oe = O(({ for: s, children: t }) => {
    const n = K(s);
    if (n != null && n.message) {
      const o = de(i, n);
      return ie(t) ? t(n, o) : /* @__PURE__ */ D("span", { className: o, children: n.message });
    }
    return !1;
  }), ce = !N(), Me = O(({ children: s, focusable: t = !1 }) => {
    if (ce)
      return !1;
    const n = Array.from(A.current).map((o) => o[0]).filter((o) => !!o && N(o)).map((o) => /* @__PURE__ */ D(oe, { for: o, children: (u, f) => /* @__PURE__ */ D("li", { className: f, children: t ? /* @__PURE__ */ D("a", { onClick: () => z(o), children: u.message }) : u.message }) }, o));
    return ie(s) ? s(n) : n;
  });
  return {
    getValue: H,
    setValue: P,
    register: Oe,
    onChange: ne,
    onBlur: te,
    getRef: Ae,
    setRef: se,
    trigger: ee,
    handleSubmit: _e,
    hasError: N,
    getError: K,
    clearError: we,
    setErrors: Ee,
    array: me,
    key: Te,
    Error: oe,
    Errors: Me,
    formState: {
      errors: g,
      isValid: ce,
      isTouched: x.current,
      isDirty: C.current,
      hadError: R.current,
      reset: ke
    }
  };
}, Fe = (r) => (e) => {
  let c = {};
  try {
    r.validateSync(e, { abortEarly: !1 });
  } catch (i) {
    for (const a of i.inner) {
      const d = w(a.path, c) || {};
      d.message = a.message, d.type = a.type, c = v(a.path, c, d);
    }
  }
  return c;
}, Je = (r) => (e) => {
  let c = {};
  const i = r.safeParse(e);
  return i.success || i.error.errors.forEach((a) => {
    const d = a.path.join("."), y = w(d, c) || {};
    y.message = a.message, y.type = a.type, c = v(d, c, y);
  }), c;
};
export {
  be as default,
  Fe as yupResolver,
  Je as zodResolver
};
