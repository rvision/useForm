import { jsx as W } from "react/jsx-runtime";
import { useState as y, useRef as T, useCallback as pe, useEffect as ye, useId as Re } from "react";
const ie = (e) => typeof e == "function", b = {}, ae = () => b;
let Se = 2e9;
const M = /* @__PURE__ */ new WeakMap(), Te = (e) => {
  let r = M.get(e);
  return r || (r = (Se++).toString(36), M.set(e, r)), r;
}, ue = (e) => {
  let r;
  if (e instanceof Set)
    r = /* @__PURE__ */ new Set([...e]);
  else {
    const t = Array.isArray(e);
    r = t ? [...e] : { ...e }, t && e.message && (r.message = e.message, r.type = e.type);
  }
  return M.has(e) && (M.set(r, M.get(e)), M.delete(e)), r;
}, xe = /\[([^\]]+)\]/g;
let L = /* @__PURE__ */ new Map();
const U = (e) => {
  if (!e)
    return [];
  let r = L.get(e);
  return r || (r = e.replace(xe, ".$1").split(".").map((t) => +t - +t < 1 ? +t : t), L.set(e, r), r);
}, Ce = () => {
  L = /* @__PURE__ */ new Map();
}, X = (e, r) => {
  if (r !== void 0)
    return e.length === 0 ? r : X(e.slice(1), r[e[0]]);
}, w = (e, r) => X(U(e), r), ge = (e, r, t) => {
  const { length: c } = e;
  if (c === 0)
    return;
  const a = e[0];
  if (c === 1) {
    r[a] = t;
    return;
  }
  const d = r[a] !== void 0, g = e[1], E = +g - +g < 1;
  r[a] = d ? ue(r[a]) : E ? [] : {}, E && (r[a][g] = r[a][g] === void 0 ? {} : ue(r[a][g])), ge(e.slice(1), r[a], t);
}, v = (e, r, t) => {
  const c = { ...r };
  return ge(U(e), c, t), c;
}, $ = (e, r) => {
  const { length: t } = e;
  if (t === 0 || r === void 0)
    return;
  const c = e[0];
  if (t === 1) {
    delete r[c];
    return;
  }
  $(e.slice(1), r[c]);
}, Q = (e) => Object.keys(e || b).length === 0, Be = (e, r) => {
  $(e, r), e.map((c, a) => a === 0 ? [...e] : [...e].slice(0, -1 * a)).forEach((c) => {
    const a = X(c, r);
    a !== void 0 && (Array.isArray(a) ? (a.length === 0 || a.every(Q)) && !a.message && $(c, r) : Q(a) && $(c, r));
  });
}, V = (e, r) => {
  const t = { ...r };
  return Be(U(e), t), t;
}, Ie = (e) => {
  const { value: r, type: t, checked: c, options: a, files: d, multiple: g, valueAsNumber: E, valueAsDate: _ } = e.target;
  switch (t) {
    case "checkbox":
      return c;
    case "range":
      return E;
    case "date":
      return _;
    case "number": {
      if (r === "")
        return null;
      const p = Number.parseFloat(r);
      return +p - +p < 1 ? +p : void 0;
    }
    case "file":
      return g ? d : d.item(0);
    case "select-multiple":
      return [...a].filter((p) => p.selected).map((p) => p.value);
    default:
      return r;
  }
}, De = (e, r, t) => {
  const c = [...e];
  return [c[r], c[t]] = [c[t], c[r]], c;
}, fe = (e, r, t) => {
  const c = [...e];
  return c.splice(r, 0, t), c;
}, Y = (e, r, t) => [t, r, e].filter((c) => !!c).map((c) => `${c.type ? `error-${c.type}` : c}`).join(" "), q = (e) => JSON.stringify(e, (r, t) => t instanceof Set ? [...t].sort() : t), G = /* @__PURE__ */ new Map(), O = (e) => {
  const r = Re();
  return G.set(r, e), ye(() => () => G.delete(r), []), pe((...t) => G.get(r)(...t), []);
}, de = (e) => e && e.focus ? (e.focus(), !0) : !1, be = ({ defaultValues: e, mode: r, focusOn: t, classNameError: c, shouldFocusError: a = !1, resolver: d = ae }) => {
  const [g, E] = y({
    values: e || b,
    errors: {}
  }), { values: _, errors: p } = g, x = T(!1), C = T(!1), R = T(!1), A = T(/* @__PURE__ */ new Map()), F = T(), Z = r === "onSubmit", j = r === "onBlur", J = r === "onChange", P = !Z && !j && !J, [ee] = y(
    () => (s, o) => E((n) => {
      const i = v(s, n.values, o);
      x.current = !0, C.current = F.current !== q(i);
      let u = n.errors;
      if ((J || R.current && P || N(s, u)) && (u = V(s, u), !Z)) {
        const f = w(s, d(i));
        f && (u = v(s, u, f));
      }
      return {
        values: i,
        errors: u
      };
    })
  ), [le] = y(() => {
    const s = (n, i, u) => {
      E((f) => {
        const l = v(n, f.values, i(w(n, f.values)));
        x.current = !0, C.current = F.current !== q(l);
        let m = f.errors;
        const S = w(n, m);
        let k = [];
        if (Array.isArray(S) && (k = u(S)), J || R.current && P) {
          const D = w(n, d(l));
          if (D && D.message) {
            const K = k.length > 0 ? k : {};
            K.message = D.message, K.type = D.type, k = K;
          }
        }
        return m = V(n, m), (k.length > 0 || k.message) && (m = v(n, m, k)), {
          values: l,
          errors: m
        };
      });
    }, o = (n, i, u) => {
      s(
        n,
        (f) => fe(f, i, u),
        (f) => fe(f, i, void 0)
      );
    };
    return {
      insert: o,
      append: (n, i) => o(n, H(n).length, i),
      prepend: (n, i) => o(n, 0, i),
      clear: (n) => {
        const i = () => [];
        s(n, i, i);
      },
      remove: (n, i) => {
        const u = (f) => [...f].filter((l, m) => m !== i);
        s(n, u, u);
      },
      swap: (n, i, u) => {
        const f = (l) => De(l, i, u);
        s(n, f, f);
      }
    };
  }), [B] = y(
    () => (s) => E((o) => ({
      ...o,
      errors: s
    }))
  ), [me] = y(() => (s) => {
    R.current = !0, B(s);
  }), [h] = y(() => (s) => {
    const o = s || b;
    F.current = q(o), E((n) => ({
      ...n,
      values: { ...o }
    }));
  }), [z] = y(() => (s) => de(A.current.get(s))), [re] = y(
    () => (s = "") => new Promise((o = ae) => {
      E((n) => {
        let i = d(n.values);
        if (s !== "") {
          const f = Array.isArray(s) ? s : [s];
          let l = { ...n.errors };
          f.forEach((m) => {
            const S = w(m, i);
            l = V(m, l), S !== void 0 && (l = v(m, l, S));
          }), i = l;
        }
        const u = {
          ...n,
          errors: i
        };
        return o(u), u;
      });
    })
  ), [se] = y(() => (s, o) => {
    let n = o;
    return N(s, o) && (n = V(s, o)), n;
  }), [Ee] = y(
    () => (s) => E((o) => {
      const n = o.errors, i = se(s, n);
      return i === n ? o : {
        ...o,
        errors: i
      };
    })
  ), we = pe((s) => de(s), []), [ve] = y(() => (s) => A.current.get(s)), [ne] = y(() => (s, o) => {
    o && (A.current.set(s, o), s === t && we(o));
  }), [Ae] = y(() => (s) => ne(s == null ? void 0 : s.name, s)), [Ne] = y(() => (s, o = !0) => {
    h(s || e), x.current = !1, C.current = !1, o && re("", s);
  }), [te] = y(() => (s) => ee(s.target.name, Ie(s)));
  ye(() => (h(e), () => {
    Ce();
  }), [e, h]);
  const H = O((s = "") => (A.current.has(s) || A.current.set(s, null), w(s, _))), I = O((s = "", o = p) => w(s, o)), N = O(
    (s = "", o = p) => s === "" ? !Q(o) : w(s, o) !== void 0
  ), oe = O((s) => {
    const { name: o } = s.target, n = w(o, d(_));
    n ? (B(v(o, p, n)), a && z(o)) : B(se(o, p));
  }), ke = O((s, o = "") => {
    const n = H(s), i = I(s), u = n === !0 || n === !1;
    return {
      name: s,
      "aria-invalid": !!i,
      className: Y(i, i ? c : "", o),
      onChange: te,
      onBlur: j ? oe : void 0,
      ref: Ae,
      value: u ? void 0 : `${n}` == "0" ? n : n || "",
      checked: u ? n : void 0
    };
  }), Oe = (s) => (o) => {
    o && o.preventDefault();
    const n = d(_);
    if (B(n), N("", n)) {
      if (a) {
        let i = !1;
        A.current.forEach((u, f) => {
          !i && N(f, n) && (i = z(f));
        });
      }
      return R.current = !0, !1;
    }
    return s(_), !0;
  }, _e = O(({ for: s, children: o }) => {
    const n = I(s, p);
    return n != null && n.message ? ie(o) ? o(n) : /* @__PURE__ */ W("span", { className: Y(n, c), children: n.message }) : !1;
  }), ce = !N(), Me = O(({ children: s, focusable: o = !1 }) => {
    if (ce)
      return !1;
    const i = Array.from(A.current).map((u) => u[0]).filter((u) => u !== "").filter((u) => N(u, p)).sort().map((u) => {
      const f = I(u);
      return /* @__PURE__ */ W("li", { className: Y(f, c), children: o ? /* @__PURE__ */ W("a", { onClick: () => z(u), children: f.message }) : f.message }, u);
    });
    return ie(s) ? s(i) : i;
  });
  return {
    getValue: H,
    setValue: ee,
    register: ke,
    onChange: te,
    onBlur: oe,
    getRef: ve,
    setRef: ne,
    trigger: re,
    handleSubmit: Oe,
    hasError: N,
    getError: I,
    clearError: Ee,
    setErrors: me,
    array: le,
    key: Te,
    Error: _e,
    Errors: Me,
    formState: {
      errors: p,
      isValid: ce,
      isTouched: x.current,
      isDirty: C.current,
      hadError: R.current,
      reset: Ne
    }
  };
}, Fe = (e) => (r) => {
  let t = {};
  try {
    e.validateSync(r, { abortEarly: !1 });
  } catch (c) {
    for (const a of c.inner) {
      const d = w(a.path, t) || {};
      d.message = a.message, d.type = a.type, t = v(a.path, t, d);
    }
  }
  return t;
}, Je = (e) => (r) => {
  let t = {};
  const c = e.safeParse(r);
  return c.success || c.error.errors.forEach((a) => {
    const d = a.path.join("."), g = w(d, t) || {};
    g.message = a.message, g.type = a.type, t = v(d, t, g);
  }), t;
};
export {
  be as default,
  Fe as yupResolver,
  Je as zodResolver
};
