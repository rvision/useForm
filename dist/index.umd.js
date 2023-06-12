var Xe=Object.defineProperty,Ze=Object.defineProperties;var qe=Object.getOwnPropertyDescriptors;var ge=Object.getOwnPropertySymbols;var $e=Object.prototype.hasOwnProperty,Pe=Object.prototype.propertyIsEnumerable;var ve=(l,a,g)=>a in l?Xe(l,a,{enumerable:!0,configurable:!0,writable:!0,value:g}):l[a]=g,A=(l,a)=>{for(var g in a||(a={}))$e.call(a,g)&&ve(l,g,a[g]);if(ge)for(var g of ge(a))Pe.call(a,g)&&ve(l,g,a[g]);return l},L=(l,a)=>Ze(l,qe(a));(function(l,a){typeof exports=="object"&&typeof module!="undefined"?a(exports,require("react")):typeof define=="function"&&define.amd?define(["exports","react"],a):(l=typeof globalThis!="undefined"?globalThis:l||self,a(l["@rvision/use-form"]={},l.react))})(this,function(l,a){"use strict";function g(e){return e&&typeof e=="object"&&"default"in e?e:{default:e}}var Ee=g(a);const $=e=>typeof e=="function",C={},M=()=>C;let _e=2e9;const x=new WeakMap,we=e=>{let r=x.get(e);return r||(r=(_e++).toString(36),x.set(e,r)),r},P=e=>{let r;if(e instanceof Set)r=new Set([...e]);else{const o=Array.isArray(e);r=o?[...e]:A({},e),o&&e.message&&(r.message=e.message,r.type=e.type)}return x.has(e)&&(x.set(r,x.get(e)),x.delete(e)),r},Re=/\[([^\]]+)\]/g;let z=new Map;const U=e=>{if(!e)return[];let r=z.get(e);return r||(r=e.replace(Re,".$1").split(".").map(o=>isNaN(parseInt(o,10))?o:+o),z.set(e,r),r)},Ne=()=>{z=new Map},W=(e,r)=>{if(r!==void 0)return e.length===0?r:W(e.slice(1),r[e[0]])},v=(e,r)=>W(U(e),r),ee=(e,r,o)=>{const{length:c}=e;if(c===0)return;const i=e[0];if(c===1){r[i]=o;return}const y=r[i]!==void 0,p=e[1],N=!isNaN(p);r[i]=y?P(r[i]):N?[]:{},N&&(r[i][p]=r[i][p]===void 0?{}:P(r[i][p])),ee(e.slice(1),r[i],o)},k=(e,r,o)=>{const c=A({},r);return ee(U(e),c,o),c},B=(e,r)=>{const{length:o}=e;if(o===0||r===void 0)return;const c=e[0];if(o===1){delete r[c];return}B(e.slice(1),r[c])},Y=e=>Object.keys(e||C).length===0,Ae=(e,r)=>{B(e,r),e.map((c,i)=>i===0?[...e]:[...e].slice(0,-1*i)).forEach(c=>{const i=W(c,r);i!==void 0&&(Array.isArray(i)?(i.length===0||i.every(Y))&&!i.message&&B(c,r):Y(i)&&B(c,r))})},D=(e,r)=>{const o=A({},r);return Ae(U(e),o),o},ke=e=>{const{value:r,type:o,checked:c,options:i,files:y,multiple:p,valueAsNumber:N,valueAsDate:R}=e.target;switch(o){case"checkbox":return c;case"range":return N;case"date":return R;case"number":{if(r==="")return null;const _=Number.parseFloat(r);return isNaN(_)?void 0:+_}case"file":return p?y:y.item(0);case"select-multiple":return[...i].filter(_=>_.selected).map(_=>_.value);default:return r}},Oe=(e,r,o)=>{if(Array.isArray(e)){const c=[...e];for(;c.length<r+1||c.length<o+1;)c.length++;return[c[r],c[o]]=[c[o],c[r]],c}return e},j=(e,r,o)=>`${o||""} ${r||""} ${e.type?`error-${e.type}`:""}`.trim(),Se=e=>r=>{let o={};try{e.validateSync(r,{abortEarly:!1})}catch(c){for(const i of c.inner){const y=v(i.path,o)||{};y.message=i.message,y.type=i.type,o=k(i.path,o,y)}}return o},he=e=>r=>{let o={};const c=e.safeParse(r);return c.success||c.error.errors.forEach(i=>{const y=i.path.join("."),p=v(y,o)||{};p.message=i.message,p.type=i.type,o=k(y,o,p)}),o};var re={exports:{}},F={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Te=Ee.default,xe=Symbol.for("react.element"),Ce=Symbol.for("react.fragment"),Me=Object.prototype.hasOwnProperty,Ie=Te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,be={key:!0,ref:!0,__self:!0,__source:!0};function se(e,r,o){var c,i={},y=null,p=null;o!==void 0&&(y=""+o),r.key!==void 0&&(y=""+r.key),r.ref!==void 0&&(p=r.ref);for(c in r)Me.call(r,c)&&!be.hasOwnProperty(c)&&(i[c]=r[c]);if(e&&e.defaultProps)for(c in r=e.defaultProps,r)i[c]===void 0&&(i[c]=r[c]);return{$$typeof:xe,type:e,key:y,ref:p,props:i,_owner:Ie.current}}F.Fragment=Ce,F.jsx=se,F.jsxs=se,re.exports=F;const H=re.exports.jsx,ne="aria-invalid",K=e=>JSON.stringify(e,(r,o)=>o instanceof Set?[...o].sort():o),d=e=>{const r=a.useRef(e);return r.current=e,a.useCallback((...o)=>r.current(...o),[])},E={name:"",[ne]:!1,className:"",onChange:M,onBlur:M,ref:M,value:"",checked:!1},Be=({defaultValues:e,mode:r,classNameError:o,shouldFocusError:c=!1,resolver:i=M})=>{const[y,p]=a.useState({values:e||C,errors:{}}),{values:N,errors:R}=y,_=a.useRef(!1),V=a.useRef(!1),J=a.useRef(!1),h=a.useRef(new Map),G=a.useRef(),te=r==="onSubmit",oe=r==="onBlur",ce=r==="onChange",De=!te&&!oe&&!ce,I=s=>p(n=>L(A({},n),{errors:s})),Q=a.useCallback(s=>{const n=s||C;G.current=K(n),p(t=>L(A({},t),{values:A({},n)}))},[]);a.useEffect(()=>(Q(e),Ne),[e,Q]);const X=s=>{const n=h.current.get(s);return n&&n.focus?(n.focus(),!0):!1},ie=d((s="")=>(h.current.has(s)||h.current.set(s,null),v(s,N))),Z=d((s="",n=R)=>v(s,n)),O=d((s="",n=R)=>s===""?!Y(n):v(s,n)!==void 0),ae=d((s,n=R)=>{let t=n;return O(s,n)&&(t=D(s,n)),t}),ue=d((s="")=>new Promise((n=M)=>{p(t=>{let u=i(t.values);if(s!==""){const m=Array.isArray(s)?s:[s];let S=A({},t.errors);m.forEach(w=>{const T=v(w,u);S=D(w,S),T!==void 0&&(S=k(w,S,T))}),u=S}const f=L(A({},t),{errors:u});return n(f),f})})),fe=ce||J.current&&De,Fe=d((s,n)=>{let t=R;if((fe||O(s))&&(t=D(s,t),!te)){const u=v(s,i(n));u&&(t=k(s,t,u))}return t}),de=d((s,n,t=Fe)=>p(u=>{const f=k(s,u.values,n);return _.current=!0,V.current=G.current!==K(f),{values:f,errors:t(s,f)}})),b=d((s,n,t)=>{p(u=>{const f=k(s,u.values,n(v(s,u.values)));_.current=!0,V.current=G.current!==K(f);let m=u.errors;const S=v(s,m);let w=[];if(Array.isArray(S)&&(w=t(S)),fe){const T=v(s,i(f));if(T&&T.message){const q=w.length>0?w:{};q.message=T.message,q.type=T.type,w=q}}return m=D(s,m),(w.length>0||w.message)&&(m=k(s,m,w)),{values:f,errors:m}})}),Ve=d((s,n)=>{b(s,t=>[...t,n],t=>t)}),Je=d((s,n)=>{b(s,t=>[n,...t],t=>[void 0,...t])}),Le=d(s=>{const n=()=>[];b(s,n,n)}),ze=d((s,n)=>{const t=u=>u.filter((f,m)=>m!==n);b(s,t,t)}),Ue=d((s,n,t)=>{const u=f=>Oe(f,n,t);b(s,u,u)}),We=d(s=>h.current.get(s)),le=d((s,n)=>{n&&h.current.set(s,n)}),Ye=d(s=>s&&le(s.name,s)),pe=d(s=>de(s.target.name,ke(s))),ye=d(s=>{const{name:n}=s.target,t=v(n,i(N));t?(I(k(n,R,t)),c&&X(n)):I(ae(n))}),je=d((s,n="")=>{const t=ie(s),u=O(s);return E.name=s,E[ne]=u,E.className=j(C,u?o:"",n),E.onChange=pe,E.ref=Ye,E.onBlur=oe?ye:void 0,t===!0||t===!1?(E.checked=t,E.value=void 0):(E.value=`${t}`=="0"?t:t||"",E.checked=void 0),E}),He=d((s=e,n=!0)=>{Q(s),_.current=!1,V.current=!1,n&&ue("",s)}),Ke=s=>n=>{n&&n.preventDefault();const t=i(N);if(I(t),O("",t)){if(c){let u=!1;h.current.forEach((f,m)=>{!u&&O(m,t)&&(u=X(m))})}return J.current=!0,!1}return s(N),!0},Ge=d(({for:s,children:n})=>{const t=Z(s,R);return!t||!t.message?!1:$(n)?n(t):H("span",{className:j(t,o),children:t.message})}),me=!O(),Qe=d(({children:s,focusable:n=!1})=>{if(me)return!1;const u=Array.from(h.current).filter(f=>!!f[1]).map(f=>f[0]).filter(f=>O(f,R)).sort().map(f=>{const m=Z(f);return H("li",{className:j(m,o),children:n?H("a",{onClick:()=>X(f),children:m.message}):m.message},f)});return $(s)?s(u):u});return{getValue:ie,setValue:de,register:je,onChange:pe,onBlur:ye,getRef:We,setRef:le,trigger:ue,handleSubmit:Ke,hasError:O,getError:Z,clearError:s=>I(ae(s)),setErrors:s=>{J.current=!0,I(s)},array:{clear:Le,append:Ve,prepend:Je,remove:ze,swap:Ue},key:we,Error:Ge,Errors:Qe,formState:{errors:R,isValid:me,isTouched:_.current,isDirty:V.current,hadError:J.current,reset:He}}};l.default=Be,l.yupResolver=Se,l.zodResolver=he,Object.defineProperty(l,"__esModule",{value:!0}),l[Symbol.toStringTag]="Module"});
