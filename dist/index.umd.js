var Ie=Object.defineProperty;var re=Object.getOwnPropertySymbols;var Le=Object.prototype.hasOwnProperty,Je=Object.prototype.propertyIsEnumerable;var te=(l,u,_)=>u in l?Ie(l,u,{enumerable:!0,configurable:!0,writable:!0,value:_}):l[u]=_,b=(l,u)=>{for(var _ in u||(u={}))Le.call(u,_)&&te(l,_,u[_]);if(re)for(var _ of re(u))Je.call(u,_)&&te(l,_,u[_]);return l};(function(l,u){typeof exports=="object"&&typeof module!="undefined"?u(exports,require("react")):typeof define=="function"&&define.amd?define(["exports","react"],u):(l=typeof globalThis!="undefined"?globalThis:l||self,u(l["@rvision/use-form"]={},l.react))})(this,function(l,u){"use strict";function _(e){return e&&typeof e=="object"&&"default"in e?e:{default:e}}var se=_(u);const oe=()=>{throw new ReferenceError("Callback was called directly while rendering, pass it as a callback prop instead.")},R=e=>{const n=u.useRef(oe);return u.useLayoutEffect(()=>{n.current=e}),u.useCallback((...s)=>n.current(...s),[])},ce=["object","function"];let ie=Date.now();const ue=()=>{const e=u.useRef(new WeakMap);return u.useEffect(()=>()=>{e&&e.current&&(e.current=new WeakMap)},[]),u.useCallback((s={})=>{const t=e.current;if(t.has(s))return t.get(s);if(!ce.includes(typeof s))return`key-${s}`;const c=(++ie).toString(36);return t.set(s,c),c},[e])};var G={exports:{}},M={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var fe=se.default,ae=Symbol.for("react.element"),pe=Symbol.for("react.fragment"),de=Object.prototype.hasOwnProperty,le=fe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,ye={key:!0,ref:!0,__self:!0,__source:!0};function H(e,n,s){var t,c={},a=null,N=null;s!==void 0&&(a=""+s),n.key!==void 0&&(a=""+n.key),n.ref!==void 0&&(N=n.ref);for(t in n)de.call(n,t)&&!ye.hasOwnProperty(t)&&(c[t]=n[t]);if(e&&e.defaultProps)for(t in n=e.defaultProps,n)c[t]===void 0&&(c[t]=n[t]);return{$$typeof:ae,type:e,key:a,ref:N,props:c,_owner:le.current}}M.Fragment=pe,M.jsx=H,M.jsxs=H,G.exports=M;const L=G.exports.jsx,J=e=>!Number.isNaN(e),Q=e=>parseInt(e,10),X=e=>typeof e=="function",{isArray:C}=Array,Z=JSON.stringify,A=Object.keys,E={key:"",name:"","aria-invalid":!1,className:"",onChange:()=>{},onBlur:()=>{},ref:()=>{},value:"",checked:!1},me=/\[([^\]]+)\]/g;let x={};const F=e=>{if(!e)return[];if(x[e])return x[e];const n=e.replace(me,".$1").split(".");return x[e]=n,n},V=e=>typeof e!="object"||e===null?e:e instanceof Date?new Date(e.getTime()):C(e)?e.reduce((n,s,t)=>(n[t]=V(s),n),[]):e instanceof Object?A(e).reduce((n,s)=>(n[s]=V(e[s]),n),{}):e,y=(e,n)=>{if(!C(e))return y(F(e),n);if(n!==void 0)switch(e.length){case 0:return n;case 1:return n[e[0]];default:return y(e.slice(1),n[e[0]])}},k=(e,n,s)=>{if(!C(e)){k(F(e),n,s);return}if(e.length===0)return;const t=e[0];if(e.length===1){n[t]=s;return}const c=Q(e[1]);J(c)?(n[t]=n[t]===void 0?[]:n[t],n[t][c]=n[t][c]===void 0?{}:n[t][c],e.length===2?n[t][c]=s:k(e.slice(2),n[t][c],s)):(n[t]=n[t]===void 0?{}:b({},n[t]),k(e.slice(1),n[t],s))},g=(e,n)=>{if(!C(e)){g(F(e),n);return}if(e.length===0||n===void 0)return;const s=e[0];if(e.length===1){delete n[s];return}if(n[s]===void 0)return;const t=e[1],c=Q(t);J(c)?e.length===2?delete n[s][c]:g(e.slice(2),n[s][c]):g(e.slice(1),n[s][c])},D=(e,n)=>{if(!C(e)){D(F(e),n);return}g(e,n);const s=e.map((t,c)=>c===0?[...e]:[...e].slice(0,-1*c));for(const t of s){const c=y(t,n);c!==void 0&&(C(c)?(c.length===0||c.every(a=>A(a||{}).length===0))&&g(t,n):A(c||{}).length===0&&g(t,n))}},we=e=>{const{value:n,type:s,checked:t,options:c,files:a,multiple:N,valueAsNumber:d}=e.target;switch(s){default:return n;case"checkbox":return t;case"range":return d;case"number":if(n==="")return null;const m=Number.parseFloat(n);return J(m)?m:void 0;case"file":return N?a:a.item(0);case"select-multiple":return[...c].filter(O=>O.selected).map(O=>O.value)}},K=(e,n)=>{const s=y(e,n);if(s&&!C(s)){const t=b({},n);return D(e,t),t}return n},j=(e,n,s)=>{const t=y(e,n);if(t&&C(t)){const c=b({},n),a=s([...t]);return k(e,c,a),c}return n},q=(e,n,s,t)=>{const c=y(n,e);if(C(c)){const a=[...c],N=a[s];return a[s]=a[t],a[t]=N,a}return c},W=(e,n,s)=>`${s||""} ${n||""} ${e.type?`error-${e.type}`:""}`.trim(),U=e=>e&&e.focus?(e.focus(),!0):!1,ve=({defaultValues:e={},mode:n="onSubmit",classNameError:s=null,shouldFocusError:t=!1,resolver:c=()=>({})})=>{const[a,N]=u.useState(e),[d,m]=u.useState({}),O=u.useRef(!1),h=u.useRef(!1),S=u.useRef(new Map),$=u.useRef(""),Y=ue(),Ee=n==="onBlur",ke=n==="onChange",z=u.useCallback(r=>{$.current=Z(r),N(V(r))},[]);u.useEffect(()=>(z(e),()=>{x={}}),[e,z]);const w=u.useCallback((r=null,i=d)=>r===null?A(i||{}).length>0:y(r,i)!==void 0,[d]),B=u.useCallback((r,i=d)=>{if(w(r)){const o=b({},i);return D(r,o),m(o),o}return i},[d,w]),Re=u.useCallback(r=>{const i=b({},d);for(const o of A(r))w(o)&&D(o,i),k(o,i,r[o]);return m(i),i},[d,w]),Ce=R((r="",i=a)=>{const o=c(i),f=y(r,o),p=b({},o);return D(r,p),f!==void 0&&k(r,p,f),m(p),p}),P=(r="")=>y(r,a),T=R((r,i,o=!0)=>{N(f=>{const p=b({},r===""?i:f);if(k(r,p,i),h.current=$.current!==Z(p),o&&(w(r)||ke)){const v=B(r),I=y(r,c(p));I&&(k(r,v,I),m(v))}return p}),O.current=!0}),be=R((r,i)=>{const o=[...y(r,a),i];T(r,o,!1);const f=K(r,d);return m(f),o}),Ne=R((r,i)=>{const o=[i,...y(r,a)];T(r,o,!1);let f=K(r,d);return f=j(r,f,p=>[void 0,...p]),m(f),o}),Se=R((r,i)=>{const o=y(r,a).filter((p,v)=>i!==v);T(r,o,!1);let f=K(r,d);return f=B(`${r}.${i}`,f),f=j(r,f,p=>(p.splice(i,1),p)),m(f),o}),Oe=R((r,i,o)=>{const f=q(a,r,i,o);T(r,f);const p=q(d,r,i,o),v=b({},d);return k(r,v,p),m(v),f}),ge=u.useCallback(r=>{r&&S.current.set(r.name,r)},[S.current]),Te=u.useCallback(r=>S.current.get(r),[S.current]),Ae=u.useCallback((r,i)=>{i&&S.current.set(r,i)},[S.current]),ee=R(r=>{T(r.target.name,we(r))}),ne=R(r=>{const{name:i}=r.target,o=y(i,c(a));if(o){const f=b({},d);k(i,f,o),m(f),t&&U(S.current.get(i))}else B(i)}),De=(r,i="")=>{const o=P(r),f=w(r);return E.key=E.name=r,E["aria-invalid"]=f,E.className=W({},f?s:!1,i),E.onChange=ee,E.onBlur=Ee?ne:void 0,E.ref=ge,o===!0||o===!1?(E.checked=o,E.value=void 0):(E.value=`${o}`=="0"?o:o||"",E.checked=void 0),E},Me=r=>R(i=>{i&&i.preventDefault&&i.preventDefault();const o=c(a);if(m(o),w(null,o)){if(t){let f=!1;S.current.forEach((p,v)=>{!f&&w(v,o)&&(f=U(p))})}return!1}return r(a),!0}),xe=R((r=e,i=!0)=>{z(r),O.current=!1,h.current=!1,i&&m(c(r))}),Fe=u.useMemo(()=>({for:r,children:i})=>{const o=y(r,d);return!o||C(o)?!1:X(i)?i(o):L("span",{className:W(o,s),children:o.message})},[d,s]),Be=u.useCallback(({children:r,focusable:i=!1})=>{if(!w())return!1;const o=Array.from(S.current).filter(p=>w(p[0])).map(p=>{const[v,I]=p;return{error:y(v,d),element:I}});if(o.length===0)return!1;const f=o.map(({error:p,element:v})=>L("li",{className:W(p,s),children:i?L("a",{onClick:()=>U(v),children:p.message}):p.message},Y(p)));return X(r)?r(f):f},[d,w,s,Y]);return{getValue:P,setValue:T,register:De,onChange:ee,onBlur:ne,getRef:Te,setRef:Ae,trigger:Ce,handleSubmit:Me,hasError:w,clearError:B,setErrors:Re,append:be,prepend:Ne,remove:Se,swap:Oe,key:Y,reset:xe,Error:Fe,Errors:Be,formState:{errors:d,isValid:!w(),isTouched:O.current,isDirty:h.current}}},_e=e=>n=>{const s={};try{e.validateSync(n,{abortEarly:!1})}catch(t){for(const c of t.inner){const a={message:c.message,type:c.type};k(c.path,s,a)}}return s};l.default=ve,l.yupResolver=_e,Object.defineProperty(l,"__esModule",{value:!0}),l[Symbol.toStringTag]="Module"});
