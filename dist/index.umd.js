(function(S,v){typeof exports=="object"&&typeof module<"u"?v(exports,require("react/jsx-runtime"),require("react")):typeof define=="function"&&define.amd?define(["exports","react/jsx-runtime","react"],v):(S=typeof globalThis<"u"?globalThis:S||self,v(S["@rvision/use-form"]={},S["react/jsx-runtime"],S.react))})(this,function(S,v,a){"use strict";const U=s=>typeof s=="function",C={},X=()=>C;let le=2e9;const M=new WeakMap,ge=s=>{let e=M.get(s);return e||(e=(le++).toString(36),M.set(s,e)),e},Z=s=>{let e;if(s instanceof Set)e=new Set([...s]);else{const c=Array.isArray(s);e=c?[...s]:{...s},c&&s.message&&(e.message=s.message,e.type=s.type)}return M.has(s)&&(M.set(e,M.get(s)),M.delete(s)),e},me=/\[([^\]]+)\]/g;let h=new Map;const F=s=>{if(!s)return[];let e=h.get(s);return e||(e=s.replace(me,".$1").split(".").map(c=>+c-+c<1?+c:c),h.set(s,e),e)},Ee=()=>{h=new Map},J=(s,e)=>{if(e!==void 0)return s.length===0?e:J(s.slice(1),e[s[0]])},E=(s,e)=>J(F(s),e),P=(s,e,c)=>{const{length:i}=s;if(i===0)return;const u=s[0];if(i===1){e[u]=c;return}const p=e[u]!==void 0,y=s[1],w=+y-+y<1;e[u]=p?Z(e[u]):w?[]:{},w&&(e[u][y]=e[u][y]===void 0?{}:Z(e[u][y])),P(s.slice(1),e[u],c)},A=(s,e,c)=>{const i={...e};return P(F(s),i,c),i},B=(s,e)=>{const{length:c}=s;if(c===0||e===void 0)return;const i=s[0];if(c===1){delete e[i];return}B(s.slice(1),e[i])},q=s=>Object.keys(s||C).length===0,we=(s,e)=>{B(s,e),s.map((i,u)=>u===0?[...s]:[...s].slice(0,-1*u)).forEach(i=>{const u=J(i,e);u!==void 0&&(Array.isArray(u)?(u.length===0||u.every(q))&&!u.message&&B(i,e):q(u)&&B(i,e))})},b=(s,e)=>{const c={...e};return we(F(s),c),c},Se=s=>{const{value:e,type:c,checked:i,options:u,files:p,multiple:y,valueAsNumber:w,valueAsDate:O}=s.target;switch(c){case"checkbox":return i;case"range":return w;case"date":return O;case"number":{if(e==="")return null;const l=Number.parseFloat(e);return+l-+l<1?+l:void 0}case"file":return y?p:p.item(0);case"select-multiple":return[...u].filter(l=>l.selected).map(l=>l.value);default:return e}},ve=(s,e,c)=>{const i=[...s];return[i[e],i[c]]=[i[c],i[e]],i},ee=(s,e,c)=>{const i=[...s];return i.splice(e,0,c),i},se=(...s)=>s.filter(e=>!!e).map(e=>`${e.type?`error-${e.type}`:e}`).join(" "),z=s=>JSON.stringify(s,(e,c)=>c instanceof Set?[...c].sort():c),H=new Map,N=s=>{const e=a.useId();return H.set(e,s),a.useEffect(()=>()=>H.delete(e),[]),a.useCallback((...c)=>H.get(e)(...c),[])},re=s=>s&&s.focus?(s.focus(),!0):!1,Ae=({defaultValues:s,mode:e,focusOn:c,classNameError:i,shouldFocusError:u=!1,resolver:p=X})=>{const[y,w]=a.useState({values:s||C,errors:{}}),{values:O,errors:l}=y,I=a.useRef(!1),D=a.useRef(!1),T=a.useRef(!1),k=a.useRef(new Map),K=a.useRef(),ne=e==="onSubmit",te=e==="onBlur",W=e==="onChange",oe=!ne&&!te&&!W,[ce]=a.useState(()=>(r,t)=>w(n=>{const o=A(r,n.values,t);I.current=!0,D.current=K.current!==z(o);let f=n.errors;if((W||T.current&&oe||R(r,f))&&(f=b(r,f),!ne)){const d=E(r,p(o));d&&(f=A(r,f,d))}return{values:o,errors:f}})),[Re]=a.useState(()=>{const r=(n,o,f)=>{w(d=>{const g=A(n,d.values,o(E(n,d.values)));I.current=!0,D.current=K.current!==z(g);let m=d.errors;const x=E(n,m);let _=[];if(Array.isArray(x)&&(_=f(x)),W||T.current&&oe){const $=E(n,p(g));if($&&$.message){const Q=_.length>0?_:{};Q.message=$.message,Q.type=$.type,_=Q}}return m=b(n,m),(_.length>0||_.message)&&(m=A(n,m,_)),{values:g,errors:m}})},t=(n,o,f)=>{r(n,d=>ee(d,o,f),d=>ee(d,o,void 0))};return{insert:t,append:(n,o)=>t(n,G(n).length,o),prepend:(n,o)=>t(n,0,o),clear:n=>{const o=()=>[];r(n,o,o)},remove:(n,o)=>{const f=d=>[...d].filter((g,m)=>m!==o);r(n,f,f)},swap:(n,o,f)=>{const d=g=>ve(g,o,f);r(n,d,d)}}}),[V]=a.useState(()=>r=>w(t=>({...t,errors:r}))),[_e]=a.useState(()=>r=>{T.current=!0,V(r)}),[Y]=a.useState(()=>r=>{const t=r||C;K.current=z(t),w(n=>({...n,values:{...t}}))}),[j]=a.useState(()=>r=>re(k.current.get(r))),[ie]=a.useState(()=>(r="")=>new Promise((t=X)=>{w(n=>{let o=p(n.values);if(r!==""){const d=Array.isArray(r)?r:[r];let g={...n.errors};d.forEach(m=>{const x=E(m,o);g=b(m,g),x!==void 0&&(g=A(m,g,x))}),o=g}const f={...n,errors:o};return t(f),f})})),[ue]=a.useState(()=>(r,t)=>{let n=t;return R(r,t)&&(n=b(r,t)),n}),[Me]=a.useState(()=>r=>w(t=>{const n=t.errors,o=ue(r,n);return o===n?t:{...t,errors:o}})),Oe=a.useCallback(r=>re(r),[]),[Te]=a.useState(()=>r=>k.current.get(r)),[ae]=a.useState(()=>(r,t)=>{t&&(k.current.set(r,t),r===c&&Oe(t))}),[xe]=a.useState(()=>r=>ae(r==null?void 0:r.name,r)),[Ce]=a.useState(()=>(r,t=!0)=>{Y(r||s),I.current=!1,D.current=!1,t&&ie("",r)}),[fe]=a.useState(()=>r=>ce(r.target.name,Se(r)));a.useEffect(()=>(Y(s),()=>{Ee()}),[s,Y]);const G=N((r="")=>(k.current.has(r)||k.current.set(r,null),E(r,O))),L=N((r="",t=l)=>E(r,t)),R=N((r="",t=l)=>r===""?!q(t):E(r,t)!==void 0),de=N(r=>{const{name:t}=r.target,n=E(t,p(O));n?(V(A(t,l,n)),u&&j(t)):V(ue(t,l))}),Be=N((r,t="")=>{const n=G(r),o=L(r),f=n===!0||n===!1;return{name:r,"aria-invalid":!!o,className:se(t,o&&i,o),onChange:fe,onBlur:te?de:void 0,ref:xe,value:f?void 0:`${n}`=="0"?n:n||"",checked:f?n:void 0}}),be=r=>t=>{t&&t.preventDefault();const n=p(O);if(V(n),R("",n)){if(u){let o=!1;k.current.forEach((f,d)=>{!o&&R(d,n)&&(o=j(d))})}return T.current=!0,!1}return r(O),!0},pe=N(({for:r,children:t})=>{const n=L(r);if(n!=null&&n.message){const o=se(i,n);return U(t)?t(n,o):v.jsx("span",{className:o,children:n.message})}return!1}),ye=!R(),Ie=N(({children:r,focusable:t=!1})=>{if(ye)return!1;const n=Array.from(k.current).map(o=>o[0]).filter(o=>!!o&&R(o)).map(o=>v.jsx(pe,{for:o,children:(f,d)=>v.jsx("li",{className:d,children:t?v.jsx("a",{onClick:()=>j(o),children:f.message}):f.message})},o));return U(r)?r(n):n});return{getValue:G,setValue:ce,register:Be,onChange:fe,onBlur:de,getRef:Te,setRef:ae,trigger:ie,handleSubmit:be,hasError:R,getError:L,clearError:Me,setErrors:_e,array:Re,key:ge,Error:pe,Errors:Ie,formState:{errors:l,isValid:ye,isTouched:I.current,isDirty:D.current,hadError:T.current,reset:Ce}}},Ne=s=>e=>{let c={};try{s.validateSync(e,{abortEarly:!1})}catch(i){for(const u of i.inner){const p=E(u.path,c)||{};p.message=u.message,p.type=u.type,c=A(u.path,c,p)}}return c},ke=s=>e=>{let c={};const i=s.safeParse(e);return i.success||i.error.errors.forEach(u=>{const p=u.path.join("."),y=E(p,c)||{};y.message=u.message,y.type=u.type,c=A(p,c,y)}),c};S.default=Ae,S.yupResolver=Ne,S.zodResolver=ke,Object.defineProperties(S,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
