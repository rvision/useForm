import { jsx as Y } from "react/jsx-runtime";
import { useState as p, useRef as _, useEffect as de, useCallback as Me } from "react";
const ie = (e) => typeof e == "function", V = {}, ae = () => V;
let Se = 2e9;
const S = /* @__PURE__ */ new WeakMap(), Re = (e) => {
  let r = S.get(e);
  return r || (r = (Se++).toString(36), S.set(e, r)), r;
}, ue = (e) => {
  let r;
  if (e instanceof Set)
    r = /* @__PURE__ */ new Set([...e]);
  else {
    const o = Array.isArray(e);
    r = o ? [...e] : { ...e }, o && e.message && (r.message = e.message, r.type = e.type);
  }
  return S.has(e) && (S.set(r, S.get(e)), S.delete(e)), r;
}, Te = /\[([^\]]+)\]/g;
let Q = /* @__PURE__ */ new Map();
const X = (e) => {
  if (!e)
    return [];
  let r = Q.get(e);
  return r || (r = e.replace(Te, ".$1").split(".").map((o) => +o - +o < 1 ? +o : o), Q.set(e, r), r);
}, _e = () => {
  Q = /* @__PURE__ */ new Map();
}, Z = (e, r) => {
  if (r !== void 0)
    return e.length === 0 ? r : Z(e.slice(1), r[e[0]]);
}, w = (e, r) => Z(X(e), r), le = (e, r, o) => {
  const { length: c } = e;
  if (c === 0)
    return;
  const a = e[0];
  if (c === 1) {
    r[a] = o;
    return;
  }
  const d = r[a] !== void 0, m = e[1], E = +m - +m < 1;
  r[a] = d ? ue(r[a]) : E ? [] : {}, E && (r[a][m] = r[a][m] === void 0 ? {} : ue(r[a][m])), le(e.slice(1), r[a], o);
}, v = (e, r, o) => {
  const c = { ...r };
  return le(X(e), c, o), c;
}, D = (e, r) => {
  const { length: o } = e;
  if (o === 0 || r === void 0)
    return;
  const c = e[0];
  if (o === 1) {
    delete r[c];
    return;
  }
  D(e.slice(1), r[c]);
}, U = (e) => Object.keys(e || V).length === 0, xe = (e, r) => {
  D(e, r), e.map((c, a) => a === 0 ? [...e] : [...e].slice(0, -1 * a)).forEach((c) => {
    const a = Z(c, r);
    a !== void 0 && (Array.isArray(a) ? (a.length === 0 || a.every(U)) && !a.message && D(c, r) : U(a) && D(c, r));
  });
}, I = (e, r) => {
  const o = { ...r };
  return xe(X(e), o), o;
}, Ce = (e) => {
  const { value: r, type: o, checked: c, options: a, files: d, multiple: m, valueAsNumber: E, valueAsDate: M } = e.target;
  switch (o) {
    case "checkbox":
      return c;
    case "range":
      return E;
    case "date":
      return M;
    case "number": {
      if (r === "")
        return null;
      const l = Number.parseFloat(r);
      return +l - +l < 1 ? +l : void 0;
    }
    case "file":
      return m ? d : d.item(0);
    case "select-multiple":
      return [...a].filter((l) => l.selected).map((l) => l.value);
    default:
      return r;
  }
}, Be = (e, r, o) => {
  const c = [...e];
  return [c[r], c[o]] = [c[o], c[r]], c;
}, fe = (e, r, o) => {
  const c = [...e];
  return c.splice(r, 0, o), c;
}, q = (e, r, o) => [o, r, e].filter((c) => !!c).map((c) => `${c.type ? `error-${c.type}` : c}`).join(" "), G = (e) => JSON.stringify(e, (r, o) => o instanceof Set ? [...o].sort() : o), L = /* @__PURE__ */ new Map(), $e = (e, r) => (L.set(e, r), de(() => () => L.delete(e), [e]), Me((...o) => L.get(e)(...o), [e])), De = ({ id: e, defaultValues: r, mode: o, classNameError: c, shouldFocusError: a = !1, resolver: d = ae }) => {
  const [m, E] = p({
    values: r || V,
    errors: {}
  }), { values: M, errors: l } = m, x = _(!1), C = _(!1), R = _(!1), A = _(/* @__PURE__ */ new Map()), F = _(), j = o === "onSubmit", h = o === "onBlur", J = o === "onChange", P = !j && !h && !J, [ee] = p(
    () => (s, t) => E((n) => {
      const i = v(s, n.values, t);
      x.current = !0, C.current = F.current !== G(i);
      let u = n.errors;
      if ((J || R.current && P || k(s, u)) && (u = I(s, u), !j)) {
        const f = w(s, d(i));
        f && (u = v(s, u, f));
      }
      return {
        values: i,
        errors: u
      };
    })
  ), [pe] = p(() => {
    const s = (n, i, u) => {
      E((f) => {
        const y = v(n, f.values, i(w(n, f.values)));
        x.current = !0, C.current = F.current !== G(y);
        let g = f.errors;
        const T = w(n, g);
        let O = [];
        if (Array.isArray(T) && (O = u(T)), J || R.current && P) {
          const b = w(n, d(y));
          if (b && b.message) {
            const W = O.length > 0 ? O : {};
            W.message = b.message, W.type = b.type, O = W;
          }
        }
        return g = I(n, g), (O.length > 0 || O.message) && (g = v(n, g, O)), {
          values: y,
          errors: g
        };
      });
    }, t = (n, i, u) => {
      s(
        n,
        (f) => fe(f, i, u),
        (f) => fe(f, i, void 0)
      );
    };
    return {
      insert: t,
      append: (n, i) => t(n, K(n).length, i),
      prepend: (n, i) => t(n, 0, i),
      clear: (n) => {
        const i = () => [];
        s(n, i, i);
      },
      remove: (n, i) => {
        const u = (f) => [...f].filter((y, g) => g !== i);
        s(n, u, u);
      },
      swap: (n, i, u) => {
        const f = (y) => Be(y, i, u);
        s(n, f, f);
      }
    };
  }), [B] = p(
    () => (s) => E((t) => ({
      ...t,
      errors: s
    }))
  ), [me] = p(() => (s) => {
    R.current = !0, B(s);
  }), [z] = p(() => (s) => {
    const t = s || V;
    F.current = G(t), E((n) => ({
      ...n,
      values: { ...t }
    }));
  }), [H] = p(() => (s) => {
    const t = A.current.get(s);
    return t && t.focus ? (t.focus(), !0) : !1;
  }), [re] = p(
    () => (s = "") => new Promise((t = ae) => {
      E((n) => {
        let i = d(n.values);
        if (s !== "") {
          const f = Array.isArray(s) ? s : [s];
          let y = { ...n.errors };
          f.forEach((g) => {
            const T = w(g, i);
            y = I(g, y), T !== void 0 && (y = v(g, y, T));
          }), i = y;
        }
        const u = {
          ...n,
          errors: i
        };
        return t(u), u;
      });
    })
  ), [se] = p(() => (s, t) => {
    let n = t;
    return k(s, t) && (n = I(s, t)), n;
  }), [ye] = p(
    () => (s) => E((t) => {
      const n = t.errors, i = se(s, n);
      return i === n ? t : {
        ...t,
        errors: i
      };
    })
  ), [ge] = p(() => (s) => A.current.get(s)), [ne] = p(() => (s, t) => {
    t && A.current.set(s, t);
  }), [Ee] = p(() => (s) => s && ne(s.name, s)), [we] = p(() => (s, t = !0) => {
    z(s || r), x.current = !1, C.current = !1, t && re("", s);
  }), [te] = p(() => (s) => ee(s.target.name, Ce(s)));
  let ve = 1;
  const N = (s) => $e(`${e}!${ve++}`, s);
  de(() => (z(r), () => {
    _e();
  }), [r, z]);
  const K = N((s = "") => (A.current.has(s) || A.current.set(s, null), w(s, M))), $ = N((s = "", t = l) => w(s, t)), k = N(
    (s = "", t = l) => s === "" ? !U(t) : w(s, t) !== void 0
  ), oe = N((s) => {
    const { name: t } = s.target, n = w(t, d(M));
    n ? (B(v(t, l, n)), a && H(t)) : B(se(t, l));
  }), Ae = N((s, t = "") => {
    const n = K(s), i = $(s), u = n === !0 || n === !1;
    return {
      name: s,
      "aria-invalid": !!i,
      className: q(i, i ? c : "", t),
      onChange: te,
      onBlur: h ? oe : void 0,
      ref: Ee,
      value: u ? void 0 : `${n}` == "0" ? n : n || "",
      checked: u ? n : void 0
    };
  }), Ne = (s) => (t) => {
    t && t.preventDefault();
    const n = d(M);
    if (B(n), k("", n)) {
      if (a) {
        let i = !1;
        A.current.forEach((u, f) => {
          !i && k(f, n) && (i = H(f));
        });
      }
      return R.current = !0, !1;
    }
    return s(M), !0;
  }, ke = N(({ for: s, children: t }) => {
    const n = $(s, l);
    return n != null && n.message ? ie(t) ? t(n) : /* @__PURE__ */ Y("span", { className: q(n, c), children: n.message }) : !1;
  }), ce = !k(), Oe = N(({ children: s, focusable: t = !1 }) => {
    if (ce)
      return !1;
    const i = Array.from(A.current).map((u) => u[0]).filter((u) => u !== "").filter((u) => k(u, l)).sort().map((u) => {
      const f = $(u);
      return /* @__PURE__ */ Y("li", { className: q(f, c), children: t ? /* @__PURE__ */ Y("a", { onClick: () => H(u), children: f.message }) : f.message }, u);
    });
    return ie(s) ? s(i) : i;
  });
  return {
    getValue: K,
    setValue: ee,
    register: Ae,
    onChange: te,
    onBlur: oe,
    getRef: ge,
    setRef: ne,
    trigger: re,
    handleSubmit: Ne,
    hasError: k,
    getError: $,
    clearError: ye,
    setErrors: me,
    array: pe,
    key: Re,
    Error: ke,
    Errors: Oe,
    formState: {
      errors: l,
      isValid: ce,
      isTouched: x.current,
      isDirty: C.current,
      hadError: R.current,
      reset: we
    }
  };
}, Ve = (e) => (r) => {
  let o = {};
  try {
    e.validateSync(r, { abortEarly: !1 });
  } catch (c) {
    for (const a of c.inner) {
      const d = w(a.path, o) || {};
      d.message = a.message, d.type = a.type, o = v(a.path, o, d);
    }
  }
  return o;
}, Fe = (e) => (r) => {
  let o = {};
  const c = e.safeParse(r);
  return c.success || c.error.errors.forEach((a) => {
    const d = a.path.join("."), m = w(d, o) || {};
    m.message = a.message, m.type = a.type, o = v(d, o, m);
  }), o;
};
export {
  De as default,
  Ve as yupResolver,
  Fe as zodResolver
};
