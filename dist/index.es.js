import { jsx as D } from "react/jsx-runtime";
import { useState as p, useRef as T, useCallback as _e, useEffect as Re, memo as ce } from "react";
const ie = (r) => typeof r == "function", $ = {}, ae = () => $;
let Me = 2e9;
const A = /* @__PURE__ */ new WeakMap(), Se = (r) => {
  let e = A.get(r);
  return e || (e = (Me++).toString(36), A.set(r, e)), e;
}, ue = (r) => {
  let e;
  if (r instanceof Set)
    e = /* @__PURE__ */ new Set([...r]);
  else {
    const c = Array.isArray(r);
    e = c ? [...r] : { ...r }, c && r.message && (e.message = r.message, e.type = r.type);
  }
  return A.has(r) && (A.set(e, A.get(r)), A.delete(r)), e;
}, Te = /\[([^\]]+)\]/g;
let q = /* @__PURE__ */ new Map();
const L = (r) => {
  if (!r)
    return [];
  let e = q.get(r);
  return e || (e = r.replace(Te, ".$1").split(".").map((c) => +c - +c < 1 ? +c : c), q.set(r, e), e);
}, Ce = () => {
  q = /* @__PURE__ */ new Map();
}, Q = (r, e) => {
  if (e !== void 0)
    return r.length === 0 ? e : Q(r.slice(1), e[r[0]]);
}, w = (r, e) => Q(L(r), e), le = (r, e, c) => {
  const { length: i } = r;
  if (i === 0)
    return;
  const a = r[0];
  if (i === 1) {
    e[a] = c;
    return;
  }
  const d = e[a] !== void 0, l = r[1], E = +l - +l < 1;
  e[a] = d ? ue(e[a]) : E ? [] : {}, E && (e[a][l] = e[a][l] === void 0 ? {} : ue(e[a][l])), le(r.slice(1), e[a], c);
}, v = (r, e, c) => {
  const i = { ...e };
  return le(L(r), i, c), i;
}, V = (r, e) => {
  const { length: c } = r;
  if (c === 0 || e === void 0)
    return;
  const i = r[0];
  if (c === 1) {
    delete e[i];
    return;
  }
  V(r.slice(1), e[i]);
}, G = (r) => Object.keys(r || $).length === 0, xe = (r, e) => {
  V(r, e), r.map((i, a) => a === 0 ? [...r] : [...r].slice(0, -1 * a)).forEach((i) => {
    const a = Q(i, e);
    a !== void 0 && (Array.isArray(a) ? (a.length === 0 || a.every(G)) && !a.message && V(i, e) : G(a) && V(i, e));
  });
}, I = (r, e) => {
  const c = { ...e };
  return xe(L(r), c), c;
}, Be = (r) => {
  const { value: e, type: c, checked: i, options: a, files: d, multiple: l, valueAsNumber: E, valueAsDate: R } = r.target;
  switch (c) {
    case "checkbox":
      return i;
    case "range":
      return E;
    case "date":
      return R;
    case "number": {
      if (e === "")
        return null;
      const y = Number.parseFloat(e);
      return +y - +y < 1 ? +y : void 0;
    }
    case "file":
      return l ? d : d.item(0);
    case "select-multiple":
      return [...a].filter((y) => y.selected).map((y) => y.value);
    default:
      return e;
  }
}, be = (r, e, c) => {
  const i = [...r];
  return [i[e], i[c]] = [i[c], i[e]], i;
}, fe = (r, e, c) => {
  const i = [...r];
  return i.splice(e, 0, c), i;
}, de = (...r) => r.filter((e) => !!e).map((e) => `${e.type ? `error-${e.type}` : e}`).join(" "), Y = (r) => JSON.stringify(r, (e, c) => c instanceof Set ? [...c].sort() : c), _ = (r) => {
  const [e] = p(() => (...c) => A.get(e)(...c));
  return A.set(e, r), e;
}, pe = (r) => r && r.focus ? (r.focus(), !0) : !1, Ve = ({ defaultValues: r, mode: e, focusOn: c, classNameError: i, shouldFocusError: a = !1, resolver: d = ae }) => {
  const [l, E] = p({
    values: r || $,
    errors: {}
  }), { values: R, errors: y } = l, C = T(!1), x = T(!1), M = T(!1), N = T(/* @__PURE__ */ new Map()), F = T(), U = e === "onSubmit", X = e === "onBlur", J = e === "onChange", Z = !U && !X && !J, [h] = p(
    () => (s, t) => E((n) => {
      const o = v(s, n.values, t);
      C.current = !0, x.current = F.current !== Y(o);
      let u = n.errors;
      if ((J || M.current && Z || k(s, u)) && (u = I(s, u), !U)) {
        const f = w(s, d(o));
        f && (u = v(s, u, f));
      }
      return {
        values: o,
        errors: u
      };
    })
  ), [ye] = p(() => {
    const s = (n, o, u) => {
      E((f) => {
        const g = v(n, f.values, o(w(n, f.values)));
        C.current = !0, x.current = F.current !== Y(g);
        let m = f.errors;
        const S = w(n, m);
        let O = [];
        if (Array.isArray(S) && (O = u(S)), J || M.current && Z) {
          const b = w(n, d(g));
          if (b && b.message) {
            const W = O.length > 0 ? O : {};
            W.message = b.message, W.type = b.type, O = W;
          }
        }
        return m = I(n, m), (O.length > 0 || O.message) && (m = v(n, m, O)), {
          values: g,
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
        const u = (f) => [...f].filter((g, m) => m !== o);
        s(n, u, u);
      },
      swap: (n, o, u) => {
        const f = (g) => be(g, o, u);
        s(n, f, f);
      }
    };
  }), [B] = p(
    () => (s) => E((t) => ({
      ...t,
      errors: s
    }))
  ), [ge] = p(() => (s) => {
    M.current = !0, B(s);
  }), [j] = p(() => (s) => {
    const t = s || $;
    F.current = Y(t), E((n) => ({
      ...n,
      values: { ...t }
    }));
  }), [z] = p(() => (s) => pe(N.current.get(s))), [P] = p(
    () => (s = "") => new Promise((t = ae) => {
      E((n) => {
        let o = d(n.values);
        if (s !== "") {
          const f = Array.isArray(s) ? s : [s];
          let g = { ...n.errors };
          f.forEach((m) => {
            const S = w(m, o);
            g = I(m, g), S !== void 0 && (g = v(m, g, S));
          }), o = g;
        }
        const u = {
          ...n,
          errors: o
        };
        return t(u), u;
      });
    })
  ), [ee] = p(() => (s, t) => {
    let n = t;
    return k(s, t) && (n = I(s, t)), n;
  }), [me] = p(
    () => (s) => E((t) => {
      const n = t.errors, o = ee(s, n);
      return o === n ? t : {
        ...t,
        errors: o
      };
    })
  ), Ee = _e((s) => pe(s), []), [we] = p(() => (s) => N.current.get(s)), [re] = p(() => (s, t) => {
    t && (N.current.set(s, t), s === c && Ee(t));
  }), [ve] = p(() => (s) => re(s == null ? void 0 : s.name, s)), [Ae] = p(() => (s, t = !0) => {
    j(s || r), C.current = !1, x.current = !1, t && P("", s);
  }), [se] = p(() => (s) => h(s.target.name, Be(s)));
  Re(() => (j(r), () => {
    Ce();
  }), [r]);
  const H = _((s = "") => (N.current.has(s) || N.current.set(s, null), w(s, R))), K = _((s = "", t = y) => w(s, t)), k = _(
    (s = "", t = y) => s === "" ? !G(t) : w(s, t) !== void 0
  ), ne = _((s) => {
    const { name: t } = s.target, n = w(t, d(R));
    n ? (B(v(t, y, n)), a && z(t)) : B(ee(t, y));
  }), Ne = _((s, t = "") => {
    const n = H(s), o = K(s), u = n === !0 || n === !1;
    return {
      name: s,
      "aria-invalid": !!o,
      className: de(t, o && i, o),
      onChange: se,
      onBlur: X ? ne : void 0,
      ref: ve,
      value: u ? void 0 : `${n}` == "0" ? n : n || "",
      checked: u ? n : void 0
    };
  }), ke = (s) => (t) => {
    t && t.preventDefault();
    const n = d(R);
    if (B(n), k("", n)) {
      if (a) {
        let o = !1;
        N.current.forEach((u, f) => {
          !o && k(f, n) && (o = z(f));
        });
      }
      return M.current = !0, !1;
    }
    return s(R), !0;
  }, te = ce(
    _(({ for: s, children: t }) => {
      const n = K(s);
      if (n != null && n.message) {
        const o = de(i, n);
        return ie(t) ? t(n, o) : /* @__PURE__ */ D("span", { className: o, role: "alert", "aria-live": "polite", children: n.message });
      }
      return !1;
    })
  ), oe = !k(), Oe = ce(
    _(({ children: s, focusable: t = !1 }) => {
      if (oe)
        return !1;
      const n = Array.from(N.current).map((o) => o[0]).filter((o) => !!o && k(o)).map((o) => /* @__PURE__ */ D(te, { for: o, children: (u, f) => /* @__PURE__ */ D("li", { className: f, children: t ? /* @__PURE__ */ D("a", { onClick: () => z(o), children: u.message }) : u.message }) }, o));
      return ie(s) ? s(n) : n;
    })
  );
  return {
    getValue: H,
    setValue: h,
    register: Ne,
    onChange: se,
    onBlur: ne,
    getRef: we,
    setRef: re,
    trigger: P,
    handleSubmit: ke,
    hasError: k,
    getError: K,
    clearError: me,
    setErrors: ge,
    array: ye,
    key: Se,
    Error: te,
    Errors: Oe,
    formState: {
      errors: y,
      isValid: oe,
      isTouched: C.current,
      isDirty: x.current,
      hadError: M.current,
      reset: Ae
    }
  };
}, $e = (r) => (e) => {
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
}, Fe = (r) => (e) => {
  let c = {};
  const i = r.safeParse(e);
  return i.success || i.error.errors.forEach((a) => {
    const d = a.path.join("."), l = w(d, c) || {};
    l.message = a.message, l.type = a.type, c = v(d, c, l);
  }), c;
};
export {
  Ve as default,
  $e as yupResolver,
  Fe as zodResolver
};
