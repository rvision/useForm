var er=Object.defineProperty,rr=Object.defineProperties;var sr=Object.getOwnPropertyDescriptors;var we=Object.getOwnPropertySymbols;var tr=Object.prototype.hasOwnProperty,nr=Object.prototype.propertyIsEnumerable;var Re=(p,a,E)=>a in p?er(p,a,{enumerable:!0,configurable:!0,writable:!0,value:E}):p[a]=E,k=(p,a)=>{for(var E in a||(a={}))tr.call(a,E)&&Re(p,E,a[E]);if(we)for(var E of we(a))nr.call(a,E)&&Re(p,E,a[E]);return p},j=(p,a)=>rr(p,sr(a));(function(p,a){typeof exports=="object"&&typeof module!="undefined"?a(exports,require("react")):typeof define=="function"&&define.amd?define(["exports","react"],a):(p=typeof globalThis!="undefined"?globalThis:p||self,a(p["@rvision/use-form"]={},p.react))})(this,function(p,a){"use strict";function E(r){return r&&typeof r=="object"&&"default"in r?r:{default:r}}var ke=E(a);const se=r=>typeof r=="function",M={},C=()=>M;let Ae=2e9;const b=new WeakMap,Oe=r=>{let s=b.get(r);return s||(s=(Ae++).toString(36),b.set(r,s)),s},te=r=>{let s;if(r instanceof Set)s=new Set([...r]);else{const n=Array.isArray(r);s=n?[...r]:k({},r),n&&r.message&&(s.message=r.message,s.type=r.type)}return b.has(r)&&(b.set(s,b.get(r)),b.delete(r)),s},Se=/\[([^\]]+)\]/g;let z=new Map;const U=r=>{if(!r)return[];let s=z.get(r);return s||(s=r.replace(Se,".$1").split(".").map(n=>+n-+n<1?+n:n),z.set(r,s),s)},Ne=()=>{z=new Map},W=(r,s)=>{if(s!==void 0)return r.length===0?s:W(r.slice(1),s[r[0]])},v=(r,s)=>W(U(r),s),ne=(r,s,n)=>{const{length:o}=r;if(o===0)return;const i=r[0];if(o===1){s[i]=n;return}const d=s[i]!==void 0,m=r[1],R=+m-+m<1;s[i]=d?te(s[i]):R?[]:{},R&&(s[i][m]=s[i][m]===void 0?{}:te(s[i][m])),ne(r.slice(1),s[i],n)},A=(r,s,n)=>{const o=k({},s);return ne(U(r),o,n),o},B=(r,s)=>{const{length:n}=r;if(n===0||s===void 0)return;const o=r[0];if(n===1){delete s[o];return}B(r.slice(1),s[o])},Y=r=>Object.keys(r||M).length===0,Te=(r,s)=>{B(r,s),r.map((o,i)=>i===0?[...r]:[...r].slice(0,-1*i)).forEach(o=>{const i=W(o,s);i!==void 0&&(Array.isArray(i)?(i.length===0||i.every(Y))&&!i.message&&B(o,s):Y(i)&&B(o,s))})},D=(r,s)=>{const n=k({},s);return Te(U(r),n),n},be=r=>{const{value:s,type:n,checked:o,options:i,files:d,multiple:m,valueAsNumber:R,valueAsDate:x}=r.target;switch(n){case"checkbox":return o;case"range":return R;case"date":return x;case"number":{if(s==="")return null;const g=Number.parseFloat(s);return+g-+g<1?+g:void 0}case"file":return m?d:d.item(0);case"select-multiple":return[...i].filter(g=>g.selected).map(g=>g.value);default:return s}},xe=(r,s,n)=>{const o=[...r];return[o[s],o[n]]=[o[n],o[s]],o},oe=(r,s,n)=>{const o=[...r];return o.splice(s,0,n),o},H=(r,s,n)=>[n,s,r].filter(o=>!!o).map(o=>`${o.type?`error-${o.type}`:o}`).join(" "),Ce=r=>s=>{let n={};try{r.validateSync(s,{abortEarly:!1})}catch(o){for(const i of o.inner){const d=v(i.path,n)||{};d.message=i.message,d.type=i.type,n=A(i.path,n,d)}}return n},Ie=r=>s=>{let n={};const o=r.safeParse(s);return o.success||o.error.errors.forEach(i=>{const d=i.path.join("."),m=v(d,n)||{};m.message=i.message,m.type=i.type,n=A(d,n,m)}),n};var ce={exports:{}},F={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Me=ke.default,Be=Symbol.for("react.element"),De=Symbol.for("react.fragment"),Fe=Object.prototype.hasOwnProperty,he=Me.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ve={key:!0,ref:!0,__self:!0,__source:!0};function ie(r,s,n){var o,i={},d=null,m=null;n!==void 0&&(d=""+n),s.key!==void 0&&(d=""+s.key),s.ref!==void 0&&(m=s.ref);for(o in s)Fe.call(s,o)&&!Ve.hasOwnProperty(o)&&(i[o]=s[o]);if(r&&r.defaultProps)for(o in s=r.defaultProps,s)i[o]===void 0&&(i[o]=s[o]);return{$$typeof:Be,type:r,key:d,ref:m,props:i,_owner:he.current}}F.Fragment=De,F.jsx=ie,F.jsxs=ie,ce.exports=F;const K=ce.exports.jsx,ae="aria-invalid",G=r=>JSON.stringify(r,(s,n)=>n instanceof Set?[...n].sort():n),Q=new Map,Je=(r,s)=>(Q.set(r,s),a.useEffect(()=>()=>Q.delete(r),[r]),a.useCallback((...n)=>Q.get(r)(...n),[r])),_={name:"",[ae]:!1,className:"",onChange:C,onBlur:C,ref:C,value:"",checked:!1},Le=({id:r="",defaultValues:s,mode:n,classNameError:o,shouldFocusError:i=!1,resolver:d=C})=>{const[m,R]=a.useState({values:s||M,errors:{}}),{values:x,errors:g}=m,h=a.useRef(!1),V=a.useRef(!1),J=a.useRef(!1),N=a.useRef(new Map),X=a.useRef(),ue=n==="onSubmit",fe=n==="onBlur",le=n==="onChange",je=!ue&&!fe&&!le;let ze=1;const y=e=>Je(r+ze++,e),I=e=>R(t=>j(k({},t),{errors:e})),Z=a.useCallback(e=>{const t=e||M;X.current=G(t),R(c=>j(k({},c),{values:k({},t)}))},[]);a.useEffect(()=>(Z(s),()=>{Ne()}),[s,Z]);const q=a.useCallback(e=>{const t=N.current.get(e);return t&&t.focus?(t.focus(),!0):!1},[]),$=y((e="")=>(N.current.has(e)||N.current.set(e,null),v(e,x))),P=y((e="",t=g)=>v(e,t)),O=y((e="",t=g)=>e===""?!Y(t):v(e,t)!==void 0),de=y((e,t=g)=>{let c=t;return O(e,t)&&(c=D(e,t)),c}),pe=y((e="")=>new Promise((t=C)=>{R(c=>{let f=d(c.values);if(e!==""){const l=Array.isArray(e)?e:[e];let S=k({},c.errors);l.forEach(w=>{const T=v(w,f);S=D(w,S),T!==void 0&&(S=A(w,S,T))}),f=S}const u=j(k({},c),{errors:f});return t(u),u})})),ye=le||J.current&&je,me=y((e,t)=>R(c=>{const f=A(e,c.values,t);h.current=!0,V.current=X.current!==G(f);let u=g;if((ye||O(e))&&(u=D(e,u),!ue)){const l=v(e,d(f));l&&(u=A(e,u,l))}return{values:f,errors:u}})),L=y((e,t,c)=>{R(f=>{const u=A(e,f.values,t(v(e,f.values)));h.current=!0,V.current=X.current!==G(u);let l=f.errors;const S=v(e,l);let w=[];if(Array.isArray(S)&&(w=c(S)),ye){const T=v(e,d(u));if(T&&T.message){const re=w.length>0?w:{};re.message=T.message,re.type=T.type,w=re}}return l=D(e,l),(w.length>0||w.message)&&(l=A(e,l,w)),{values:u,errors:l}})}),ee=y((e,t,c)=>{L(e,l=>oe(l,t,c),l=>oe(l,t,void 0))}),Ue=y((e,t)=>ee(e,$(e).length,t)),We=(e,t)=>ee(e,0,t),Ye=y(e=>{const t=()=>[];L(e,t,t)}),He=y((e,t)=>{const c=f=>[...f].filter((u,l)=>l!==t);L(e,c,c)}),Ke=y((e,t,c)=>{const f=u=>xe(u,t,c);L(e,f,f)}),Ge=y(e=>N.current.get(e)),ge=y((e,t)=>{t&&N.current.set(e,t)}),Qe=e=>e&&ge(e.name,e),Ee=y(e=>me(e.target.name,be(e))),ve=y(e=>{const{name:t}=e.target,c=v(t,d(x));c?(I(A(t,g,c)),i&&q(t)):I(de(t))}),Xe=y((e,t="")=>{const c=$(e),f=O(e);return _.name=e,_[ae]=f,_.className=H(!1,f?o:"",t),_.onChange=Ee,_.ref=Qe,_.onBlur=fe?ve:void 0,c===!0||c===!1?(_.checked=c,_.value=void 0):(_.value=`${c}`=="0"?c:c||"",_.checked=void 0),_}),Ze=y((e=s,t=!0)=>{Z(e),h.current=!1,V.current=!1,t&&pe("",e)}),qe=e=>t=>{t&&t.preventDefault();const c=d(x);if(I(c),O("",c)){if(i){let f=!1;N.current.forEach((u,l)=>{!f&&O(l,c)&&(f=q(l))})}return J.current=!0,!1}return e(x),!0},$e=y(({for:e,children:t})=>{const c=P(e,g);return(c==null?void 0:c.message)?se(t)?t(c):K("span",{className:H(c,o),children:c.message}):!1}),_e=!O(),Pe=y(({children:e,focusable:t=!1})=>{if(_e)return!1;const f=Array.from(N.current).map(u=>u[0]).filter(u=>u!=="").filter(u=>O(u,g)).sort().map(u=>{const l=P(u);return K("li",{className:H(l,o),children:t?K("a",{onClick:()=>q(u),children:l.message}):l.message},u)});return se(e)?e(f):f});return{getValue:$,setValue:me,register:Xe,onChange:Ee,onBlur:ve,getRef:Ge,setRef:ge,trigger:pe,handleSubmit:qe,hasError:O,getError:P,clearError:e=>I(de(e)),setErrors:e=>{J.current=!0,I(e)},array:{clear:Ye,append:Ue,prepend:We,remove:He,swap:Ke,insert:ee},key:Oe,Error:$e,Errors:Pe,formState:{errors:g,isValid:_e,isTouched:h.current,isDirty:V.current,hadError:J.current,reset:Ze}}};p.default=Le,p.yupResolver=Ce,p.zodResolver=Ie,Object.defineProperty(p,"__esModule",{value:!0}),p[Symbol.toStringTag]="Module"});
