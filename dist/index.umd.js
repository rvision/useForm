var Ke=Object.defineProperty;var ce=Object.getOwnPropertySymbols;var Ve=Object.prototype.hasOwnProperty,We=Object.prototype.propertyIsEnumerable;var ie=(y,u,v)=>u in y?Ke(y,u,{enumerable:!0,configurable:!0,writable:!0,value:v}):y[u]=v,N=(y,u)=>{for(var v in u||(u={}))Ve.call(u,v)&&ie(y,v,u[v]);if(ce)for(var v of ce(u))We.call(u,v)&&ie(y,v,u[v]);return y};(function(y,u){typeof exports=="object"&&typeof module!="undefined"?u(exports,require("react")):typeof define=="function"&&define.amd?define(["exports","react"],u):(y=typeof globalThis!="undefined"?globalThis:y||self,u(y["@rvision/use-form"]={},y.react))})(this,function(y,u){"use strict";function v(e){return e&&typeof e=="object"&&"default"in e?e:{default:e}}var ue=v(u);const fe=()=>{throw new ReferenceError("Callback was called directly while rendering, pass it as a callback prop instead.")},E=e=>{const n=u.useRef(fe);return u.useLayoutEffect(()=>{n.current=e}),u.useCallback((...o)=>n.current(...o),[])},ae=["object","function"];let pe=Date.now();const de=()=>{const e=u.useRef(new WeakMap);return u.useEffect(()=>()=>{(e==null?void 0:e.current)&&(e.current=new WeakMap)},[]),u.useCallback((n={})=>{const o=e.current;if(o.has(n))return o.get(n);if(!ae.includes(typeof n))return`key-${n}`;const s=(++pe).toString(36);return o.set(n,s),s},[e])};var Q={exports:{}},I={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var le=ue.default,ye=Symbol.for("react.element"),me=Symbol.for("react.fragment"),we=Object.prototype.hasOwnProperty,ve=le.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,_e={key:!0,ref:!0,__self:!0,__source:!0};function X(e,n,o){var s,i={},a=null,O=null;o!==void 0&&(a=""+o),n.key!==void 0&&(a=""+n.key),n.ref!==void 0&&(O=n.ref);for(s in n)we.call(n,s)&&!_e.hasOwnProperty(s)&&(i[s]=n[s]);if(e&&e.defaultProps)for(s in n=e.defaultProps,n)i[s]===void 0&&(i[s]=n[s]);return{$$typeof:ye,type:e,key:a,ref:O,props:i,_owner:ve.current}}I.Fragment=me,I.jsx=X,I.jsxs=X,Q.exports=I;const V=Q.exports.jsx,W=e=>!Number.isNaN(e),Z=e=>parseInt(e,10),q=e=>typeof e=="function",{isArray:k}=Array,$=JSON.stringify,x=Object.keys,S={},g=()=>S,_={key:"",name:"","aria-invalid":!1,className:"",onChange:g,onBlur:g,ref:g,value:"",checked:!1},Ee=/\[([^\]]+)\]/g;let L={};const J=e=>{if(!e)return[];if(L[e])return L[e];const n=e.replace(Ee,".$1").split(".");return L[e]=n,n},U=e=>typeof e!="object"||e===null?e:e instanceof Date?new Date(e.getTime()):k(e)?e.reduce((n,o,s)=>(n[s]=U(o),n),[]):e instanceof Object?x(e).reduce((n,o)=>(n[o]=U(e[o]),n),{}):e,m=(e,n)=>{if(!k(e))return m(J(e),n);if(n!==void 0)switch(e.length){case 0:return n;default:return m(e.slice(1),n[e[0]])}},R=(e,n,o)=>{if(!k(e)){R(J(e),n,o);return}if(e.length===0)return;const s=e[0];if(e.length===1){n[s]=o;return}const i=Z(e[1]);W(i)?(n[s]=n[s]===void 0?[]:n[s],n[s][i]=n[s][i]===void 0?{}:n[s][i],e.length===2?n[s][i]=o:R(e.slice(2),n[s][i],o)):(n[s]=n[s]===void 0?{}:N({},n[s]),R(e.slice(1),n[s],o))},A=(e,n)=>{if(!k(e)){A(J(e),n);return}if(e.length===0||n===void 0)return;const o=e[0];if(e.length===1){delete n[o];return}if(n[o]===void 0)return;const s=e[1],i=Z(s);W(i)?e.length===2?delete n[o][i]:A(e.slice(2),n[o][i]):A(e.slice(1),n[o][i])},B=(e,n)=>{if(!k(e)){B(J(e),n);return}A(e,n);const o=e.map((s,i)=>i===0?[...e]:[...e].slice(0,-1*i));for(const s of o){const i=m(s,n);i!==void 0&&(k(i)?(i.length===0||i.every(a=>x(a||S).length===0))&&A(s,n):x(i||S).length===0&&A(s,n))}},ke=e=>{const{value:n,type:o,checked:s,options:i,files:a,multiple:O,valueAsNumber:l}=e.target;switch(o){case"checkbox":return s;case"range":return l;case"number":if(n==="")return null;const w=Number.parseFloat(n);return W(w)?w:void 0;case"file":return O?a:a.item(0);case"select-multiple":return[...i].filter(T=>T.selected).map(T=>T.value);default:return n}},Y=(e,n)=>{const o=m(e,n);if(o&&!k(o)){const s=N({},n);return B(e,s),s}return n},P=(e,n,o)=>{const s=m(e,n);if(s&&k(s)){const i=N({},n),a=o([...s]);return R(e,i,a),i}return n},ee=(e,n,o,s)=>{const i=m(n,e);if(k(i)){const a=[...i],O=a[o];return a[o]=a[s],a[s]=O,a}return i},h=(e,n,o)=>`${o||""} ${n||""} ${e.type?`error-${e.type}`:""}`.trim(),j=e=>e&&e.focus?(e.focus(),!0):!1,Re=({defaultValues:e,mode:n="onSubmit",classNameError:o=null,shouldFocusError:s=!1,resolver:i=g})=>{const[a,O]=u.useState(e||S),[l,w]=u.useState({}),T=u.useRef(!1),z=u.useRef(!1),D=u.useRef(new Map),ne=u.useRef(""),G=de(),be=n==="onBlur",Ne=n==="onChange",H=u.useCallback(r=>{ne.current=$(r),O(U(r))},[]);u.useEffect(()=>(H(e||S),()=>{L={}}),[e,H]);const C=u.useCallback((r="",t=l)=>r===""?x(t).length>0:m(r,t)!==void 0,[l]),K=E((r,t=l)=>{if(C(r,t)){const c=N({},t);return B(r,c),w(c),c}return t}),Oe=E(r=>{const t=N({},l);for(const c of x(r))C(c)&&B(c,t),R(c,t,r[c]);return w(t),t}),re=E((r="",t=a)=>new Promise((c=g)=>{const f=i(t);r===""&&(w(f),c(f));const p=k(r)?r:[r],d=N({},l);p.forEach(b=>{const F=m(b,f);B(b,d),F!==void 0&&R(b,d,F)}),w(d),c(d)})),se=(r="")=>m(r,a),M=E((r,t,c=!0)=>new Promise((f=g)=>{O(p=>{T.current=!0;const d=N({},r===""?t:p);R(r,d,t),z.current=ne.current!==$(d);let b=l;if(c&&(C(r)||Ne)){b=K(r);const F=m(r,i(d));F&&(R(r,b,F),w(b))}return f({values:d,errors:b}),d})})),Se=E((r,t)=>{const c=[...m(r,a),t];M(r,c,!1);const f=Y(r,l);return w(f),c}),Te=E((r,t)=>{const c=[t,...m(r,a)];M(r,c,!1);let f=Y(r,l);return f=P(r,f,p=>[void 0,...p]),w(f),c}),ge=E((r,t)=>{const c=m(r,a).filter((p,d)=>t!==d);M(r,c,!1);let f=Y(r,l);return f=K(`${r}.${t}`,f),f=P(r,f,p=>(p.splice(t,1),p)),w(f),c}),Ae=E((r,t,c)=>{const f=ee(a,r,t,c);M(r,f);const p=ee(l,r,t,c),d=N({},l);return R(r,d,p),w(d),f}),De=u.useCallback(r=>{r&&D.current.set(r.name,r)},[]),Me=u.useCallback(r=>D.current.get(r),[]),xe=u.useCallback((r,t)=>{t&&D.current.set(r,t)},[]),te=E(r=>{M(r.target.name,ke(r))}),oe=E(r=>{const{name:t}=r.target,c=m(t,i(a));if(c){const f=N({},l);R(t,f,c),w(f),s&&j(D.current.get(t))}else K(t)}),Be=(r,t="")=>{const c=se(r),f=C(r);return _.key=_.name=r,_["aria-invalid"]=f,_.className=h(S,f?o:!1,t),_.onChange=te,_.onBlur=be?oe:void 0,_.ref=De,c===!0||c===!1?(_.checked=c,_.value=void 0):(_.value=`${c}`=="0"?c:c||"",_.checked=void 0),_},Fe=r=>t=>{t&&(t==null||t.preventDefault());const c=i(a);if(w(c),C("",c)){if(s){let f=!1;D.current.forEach((p,d)=>{!f&&C(d,c)&&(f=j(p))})}return!1}return r(a),!0},Ie=E((r=e,t=!0)=>{H(r||S),T.current=!1,z.current=!1,t&&re("",r)}),Le=u.useCallback(({for:r,children:t})=>{const c=m(r,l);return!c||k(c)?!1:q(t)?t(c):V("span",{className:h(c,o),children:c.message})},[l,o]),Je=u.useCallback(({children:r,focusable:t=!1})=>{if(!C())return!1;const c=Array.from(D.current).filter(p=>C(p[0])).map(p=>{const[d,b]=p;return{error:m(d,l),element:b}});if(c.length===0)return!1;const f=c.map(({error:p,element:d})=>V("li",{className:h(p,o),children:t?V("a",{onClick:()=>j(d),children:p.message}):p.message},G(p)));return q(r)?r(f):f},[l,C,o,G]);return{getValue:se,setValue:M,register:Be,onChange:te,onBlur:oe,getRef:Me,setRef:xe,trigger:re,handleSubmit:Fe,hasError:C,clearError:K,setErrors:Oe,append:Se,prepend:Te,remove:ge,swap:Ae,key:G,reset:Ie,Error:Le,Errors:Je,formState:{errors:l,isValid:!C(),isTouched:T.current,isDirty:z.current}}},Ce=e=>n=>{const o={};try{e.validateSync(n,{abortEarly:!1})}catch(s){for(const i of s.inner){const a={message:i.message,type:i.type};R(i.path,o,a)}}return o};y.default=Re,y.yupResolver=Ce,Object.defineProperty(y,"__esModule",{value:!0}),y[Symbol.toStringTag]="Module"});
