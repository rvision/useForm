var We=Object.defineProperty;var ue=Object.getOwnPropertySymbols;var Ue=Object.prototype.hasOwnProperty,Ye=Object.prototype.propertyIsEnumerable;var fe=(m,u,w)=>u in m?We(m,u,{enumerable:!0,configurable:!0,writable:!0,value:w}):m[u]=w,k=(m,u)=>{for(var w in u||(u={}))Ue.call(u,w)&&fe(m,w,u[w]);if(ue)for(var w of ue(u))Ye.call(u,w)&&fe(m,w,u[w]);return m};(function(m,u){typeof exports=="object"&&typeof module!="undefined"?u(exports,require("react")):typeof define=="function"&&define.amd?define(["exports","react"],u):(m=typeof globalThis!="undefined"?globalThis:m||self,u(m["@rvision/use-form"]={},m.react))})(this,function(m,u){"use strict";function w(e){return e&&typeof e=="object"&&"default"in e?e:{default:e}}var pe=w(u);const ae=["object","function"];let de=Date.now();const me=()=>{const e=u.useRef(new WeakMap);return u.useEffect(()=>()=>{(e==null?void 0:e.current)&&(e.current=new WeakMap)},[]),u.useCallback((r={})=>{const c=e.current;if(c.has(r))return c.get(r);if(!ae.includes(typeof r))return`key-${r}`;const t=(++de).toString(36);return c.set(r,t),t},[e])};var X={exports:{}},F={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ye=pe.default,ve=Symbol.for("react.element"),_e=Symbol.for("react.fragment"),we=Object.prototype.hasOwnProperty,le=ye.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ee={key:!0,ref:!0,__self:!0,__source:!0};function Z(e,r,c){var t,i={},p=null,N=null;c!==void 0&&(p=""+c),r.key!==void 0&&(p=""+r.key),r.ref!==void 0&&(N=r.ref);for(t in r)we.call(r,t)&&!Ee.hasOwnProperty(t)&&(i[t]=r[t]);if(e&&e.defaultProps)for(t in r=e.defaultProps,r)i[t]===void 0&&(i[t]=r[t]);return{$$typeof:ve,type:e,key:p,ref:N,props:i,_owner:le.current}}F.Fragment=_e,F.jsx=Z,F.jsxs=Z,X.exports=F;const W=X.exports.jsx,d=e=>{const r=u.useRef(e);return r.current=e,u.useCallback((...c)=>r.current(...c),[])},U=e=>!Number.isNaN(e),h=e=>parseInt(e,10),j=e=>typeof e=="function",{isArray:E}=Array,q=JSON.stringify,b=Object.keys,D={},T=()=>D,l={key:"",name:"","aria-invalid":!1,className:"",onChange:T,onBlur:T,ref:T,value:"",checked:!1},Re=/\[([^\]]+)\]/g;let I={};const J=e=>{if(!e)return[];if(I[e])return I[e];const r=e.replace(Re,".$1").split(".");return I[e]=r,r},L=e=>!e||typeof e!="object"?e:e instanceof Date?new Date(e.getTime()):E(e)?e.reduce((r,c,t)=>(r[t]=L(c),r),[]):e instanceof Object?b(e).reduce((r,c)=>(r[c]=L(e[c]),r),{}):e instanceof Set?new Set(L([...e])):e,y=(e,r)=>{if(r!==void 0){if(!E(e))return y(J(e),r);switch(e.length){case 0:return r;default:return y(e.slice(1),r[e[0]])}}},R=(e,r,c)=>{if(!E(e)){R(J(e),r,c);return}if(e.length===0)return;const t=e[0];if(e.length===1){r[t]=c;return}const i=h(e[1]);U(i)?(r[t]=r[t]===void 0?[]:r[t],r[t][i]=r[t][i]===void 0?{}:r[t][i],e.length===2?r[t][i]=c:R(e.slice(2),r[t][i],c)):(r[t]=r[t]===void 0?{}:k({},r[t]),R(e.slice(1),r[t],c))},M=(e,r)=>{if(!E(e)){M(J(e),r);return}if(e.length===0||r===void 0)return;const c=e[0];if(e.length===1){delete r[c];return}if(r[c]===void 0)return;const t=h(e[1]);U(t)?e.length===2?delete r[c][t]:M(e.slice(2),r[c][t]):M(e.slice(1),r[c])},A=(e,r)=>{if(!E(e)){A(J(e),r);return}M(e,r);const c=e.map((t,i)=>i===0?[...e]:[...e].slice(0,-1*i));for(const t of c){const i=y(t,r);i!==void 0&&(E(i)?(i.length===0||i.every(p=>b(p||D).length===0))&&M(t,r):b(i||D).length===0&&M(t,r))}},Se=e=>{const{value:r,type:c,checked:t,options:i,files:p,multiple:N,valueAsNumber:_}=e.target;switch(c){case"checkbox":return t;case"range":return _;case"number":if(r==="")return null;const S=Number.parseFloat(r);return U(S)?S:void 0;case"file":return N?p:p.item(0);case"select-multiple":return[...i].filter(g=>g.selected).map(g=>g.value);default:return r}},ke=(e,r)=>{const c=y(e,r);if(c&&!E(c)){const t=k({},r);return A(e,t),t}return r},$=(e,r,c)=>{const t=y(e,r);if(t&&E(t)){const i=k({},r),p=c([...t]);return R(e,i,p),i}return r},P=(e,r,c,t)=>{const i=y(r,e);if(E(i)){const p=[...i],N=p[c];return p[c]=p[t],p[t]=N,p}return i},Y=(e,r,c)=>`${c||""} ${r||""} ${e.type?`error-${e.type}`:""}`.trim(),Ne=({defaultValues:e,mode:r="onSubmit",classNameError:c=null,shouldFocusError:t=!1,resolver:i=T})=>{const[p,N]=u.useState(e||D),[_,S]=u.useState({}),g=u.useRef(!1),z=u.useRef(!1),x=u.useRef(new Map),ee=u.useRef(""),re=me(),Ce=r==="onBlur",Te=r==="onChange",G=d(n=>{const s=n||D;ee.current=q(s),N(L(s))});u.useEffect(()=>(G(e),()=>{I={}}),[e,G]);const H=d(n=>{const s=x.current.get(n);return s&&s.focus?(s.focus(),!0):!1}),ne=d((n="")=>y(n,p)),ge=d((n="",s=_)=>y(n,s)),O=d((n="",s=_)=>n===""?b(s).length>0:y(n,s)!==void 0),V=d((n,s=_)=>{if(O(n,s)){const o=k({},s);return A(n,o),S(o),o}return s}),De=d(n=>{const s=k({},_);for(const o of b(n))O(o)&&A(o,s),R(o,s,n[o]);return S(s),s}),se=d((n="",s=p)=>new Promise((o=T)=>{const f=i(s);n===""&&(S(f),o(f));const v=E(n)?n:[n],a=k({},_);v.forEach(C=>{const B=y(C,f);A(C,a),B!==void 0&&R(C,a,B)}),S(a),o(a)})),Q=d((n,s,o=!0)=>new Promise((f=T)=>{N(v=>{g.current=!0;const a=k({},n===""?s:v);R(n,a,s),z.current=ee.current!==q(a);let C=_;if(o&&(O(n)||Te)){C=V(n);const B=y(n,i(a));B&&(R(n,C,B),S(C))}return f({values:a,errors:C}),a})})),K=(n,s,o)=>new Promise((f=T)=>{Promise.resolve(Q(n,s,!1)).then(({values:v})=>{const a=o(ke(n,_));S(a),f({values:v,errors:a})})}),Me=d((n,s)=>K(n,[...y(n,p),s],o=>o)),be=d((n,s)=>K(n,[s,...y(n,p)],o=>$(n,o,f=>[void 0,...f]))),Ae=d((n,s)=>K(n,y(n,p).filter((o,f)=>s!==f),o=>(o=V(`${n}.${s}`,o),$(n,o,f=>(f.splice(s,1),f))))),xe=d((n,s,o)=>K(n,P(p,n,s,o),f=>{const v=P(f,n,s,o),a=k({},_);return R(n,a,v),a})),Be=d(n=>x.current.get(n)),te=d((n,s)=>{s&&x.current.set(n,s)}),Fe=d(n=>n&&te(n.name,n)),oe=d(n=>{Q(n.target.name,Se(n))}),ce=d(n=>{const{name:s}=n.target,o=y(s,i(p));if(o){const f=k({},_);R(s,f,o),S(f),t&&H(s)}else V(s)}),Ie=(n,s="")=>{const o=ne(n),f=O(n);return l.key=l.name=n,l["aria-invalid"]=f,l.className=Y(D,f?c:!1,s),l.onChange=oe,l.onBlur=Ce?ce:void 0,l.ref=Fe,o===!0||o===!1?(l.checked=o,l.value=void 0):(l.value=`${o}`=="0"?o:o||"",l.checked=void 0),l},Je=n=>s=>{s&&(s==null||s.preventDefault());const o=i(p);if(S(o),O("",o)){if(t){let f=!1;x.current.forEach((v,a)=>{!f&&O(a,o)&&(f=H(a))})}return!1}return n(p),!0},Le=d((n=e,s=!0)=>{G(n),g.current=!1,z.current=!1,s&&se("",n)}),Ve=d(({for:n,children:s})=>{const o=y(n,_);return!o||E(o)?!1:j(s)?s(o):W("span",{className:Y(o,c),children:o.message})}),ie=!O(),Ke=d(({children:n,focusable:s=!1})=>{if(ie)return!1;const f=Array.from(x.current).map(v=>v[0]).filter(v=>O(v)).sort().map(v=>{const a=y(v,_);return W("li",{className:Y(a,c),children:s?W("a",{onClick:()=>H(v),children:a.message}):a.message},re(a))});return j(n)?n(f):f});return{getValue:ne,setValue:Q,register:Ie,onChange:oe,onBlur:ce,getRef:Be,setRef:te,trigger:se,handleSubmit:Je,hasError:O,getError:ge,clearError:V,setErrors:De,append:Me,prepend:be,remove:Ae,swap:xe,key:re,reset:Le,Error:Ve,Errors:Ke,formState:{errors:_,isValid:ie,isTouched:g.current,isDirty:z.current}}},Oe=e=>r=>{const c={};try{e.validateSync(r,{abortEarly:!1})}catch(t){for(const i of t.inner)R(i.path,c,{message:i.message,type:i.type})}return c};m.default=Ne,m.yupResolver=Oe,Object.defineProperty(m,"__esModule",{value:!0}),m[Symbol.toStringTag]="Module"});
