(function(S,A){typeof exports=="object"&&typeof module<"u"?A(exports,require("react/jsx-runtime"),require("react")):typeof define=="function"&&define.amd?define(["exports","react/jsx-runtime","react"],A):(S=typeof globalThis<"u"?globalThis:S||self,A(S["@rvision/use-form"]={},S["react/jsx-runtime"],S.react))})(this,function(S,A,f){"use strict";const X=e=>typeof e=="function",C={},Z=()=>C;let ye=2e9;const M=new WeakMap,le=e=>{let s=M.get(e);return s||(s=(ye++).toString(36),M.set(e,s)),s},P=e=>{let s;if(e instanceof Set)s=new Set([...e]);else{const t=Array.isArray(e);s=t?[...e]:{...e},t&&e.message&&(s.message=e.message,s.type=e.type)}return M.has(e)&&(M.set(s,M.get(e)),M.delete(e)),s},ge=/\[([^\]]+)\]/g;let F=new Map;const J=e=>{if(!e)return[];let s=F.get(e);return s||(s=e.replace(ge,".$1").split(".").map(t=>+t-+t<1?+t:t),F.set(e,s),s)},me=()=>{F=new Map},q=(e,s)=>{if(s!==void 0)return e.length===0?s:q(e.slice(1),s[e[0]])},E=(e,s)=>q(J(e),s),ee=(e,s,t)=>{const{length:c}=e;if(c===0)return;const u=e[0];if(c===1){s[u]=t;return}const p=s[u]!==void 0,l=e[1],w=+l-+l<1;s[u]=p?P(s[u]):w?[]:{},w&&(s[u][l]=s[u][l]===void 0?{}:P(s[u][l])),ee(e.slice(1),s[u],t)},v=(e,s,t)=>{const c={...s};return ee(J(e),c,t),c},B=(e,s)=>{const{length:t}=e;if(t===0||s===void 0)return;const c=e[0];if(t===1){delete s[c];return}B(e.slice(1),s[c])},z=e=>Object.keys(e||C).length===0,Ee=(e,s)=>{B(e,s),e.map((c,u)=>u===0?[...e]:[...e].slice(0,-1*u)).forEach(c=>{const u=q(c,s);u!==void 0&&(Array.isArray(u)?(u.length===0||u.every(z))&&!u.message&&B(c,s):z(u)&&B(c,s))})},b=(e,s)=>{const t={...s};return Ee(J(e),t),t},we=e=>{const{value:s,type:t,checked:c,options:u,files:p,multiple:l,valueAsNumber:w,valueAsDate:O}=e.target;switch(t){case"checkbox":return c;case"range":return w;case"date":return O;case"number":{if(s==="")return null;const y=Number.parseFloat(s);return+y-+y<1?+y:void 0}case"file":return l?p:p.item(0);case"select-multiple":return[...u].filter(y=>y.selected).map(y=>y.value);default:return s}},Se=(e,s,t)=>{const c=[...e];return[c[s],c[t]]=[c[t],c[s]],c},se=(e,s,t)=>{const c=[...e];return c.splice(s,0,t),c},H=(e,s,t)=>[t,s,e].filter(c=>!!c).map(c=>`${c.type?`error-${c.type}`:c}`).join(" "),K=e=>JSON.stringify(e,(s,t)=>t instanceof Set?[...t].sort():t),W=new Map,N=e=>{const s=f.useId();return W.set(s,e),f.useEffect(()=>()=>W.delete(s),[]),f.useCallback((...t)=>W.get(s)(...t),[])},re=e=>e&&e.focus?(e.focus(),!0):!1,ve=({defaultValues:e,mode:s,focusOn:t,classNameError:c,shouldFocusError:u=!1,resolver:p=Z})=>{const[l,w]=f.useState({values:e||C,errors:{}}),{values:O,errors:y}=l,h=f.useRef(!1),I=f.useRef(!1),T=f.useRef(!1),R=f.useRef(new Map),Y=f.useRef(),ne=s==="onSubmit",te=s==="onBlur",j=s==="onChange",oe=!ne&&!te&&!j,[ce]=f.useState(()=>(r,o)=>w(n=>{const i=v(r,n.values,o);h.current=!0,I.current=Y.current!==K(i);let a=n.errors;if((j||T.current&&oe||k(r,a))&&(a=b(r,a),!ne)){const d=E(r,p(i));d&&(a=v(r,a,d))}return{values:i,errors:a}})),[Re]=f.useState(()=>{const r=(n,i,a)=>{w(d=>{const g=v(n,d.values,i(E(n,d.values)));h.current=!0,I.current=Y.current!==K(g);let m=d.errors;const x=E(n,m);let _=[];if(Array.isArray(x)&&(_=a(x)),j||T.current&&oe){const $=E(n,p(g));if($&&$.message){const U=_.length>0?_:{};U.message=$.message,U.type=$.type,_=U}}return m=b(n,m),(_.length>0||_.message)&&(m=v(n,m,_)),{values:g,errors:m}})},o=(n,i,a)=>{r(n,d=>se(d,i,a),d=>se(d,i,void 0))};return{insert:o,append:(n,i)=>o(n,Q(n).length,i),prepend:(n,i)=>o(n,0,i),clear:n=>{const i=()=>[];r(n,i,i)},remove:(n,i)=>{const a=d=>[...d].filter((g,m)=>m!==i);r(n,a,a)},swap:(n,i,a)=>{const d=g=>Se(g,i,a);r(n,d,d)}}}),[D]=f.useState(()=>r=>w(o=>({...o,errors:r}))),[ke]=f.useState(()=>r=>{T.current=!0,D(r)}),[G]=f.useState(()=>r=>{const o=r||C;Y.current=K(o),w(n=>({...n,values:{...o}}))}),[L]=f.useState(()=>r=>re(R.current.get(r))),[ie]=f.useState(()=>(r="")=>new Promise((o=Z)=>{w(n=>{let i=p(n.values);if(r!==""){const d=Array.isArray(r)?r:[r];let g={...n.errors};d.forEach(m=>{const x=E(m,i);g=b(m,g),x!==void 0&&(g=v(m,g,x))}),i=g}const a={...n,errors:i};return o(a),a})})),[ue]=f.useState(()=>(r,o)=>{let n=o;return k(r,o)&&(n=b(r,o)),n}),[_e]=f.useState(()=>r=>w(o=>{const n=o.errors,i=ue(r,n);return i===n?o:{...o,errors:i}})),Me=f.useCallback(r=>re(r),[]),[Oe]=f.useState(()=>r=>R.current.get(r)),[ae]=f.useState(()=>(r,o)=>{o&&(R.current.set(r,o),r===t&&Me(o))}),[Te]=f.useState(()=>r=>ae(r==null?void 0:r.name,r)),[xe]=f.useState(()=>(r,o=!0)=>{G(r||e),h.current=!1,I.current=!1,o&&ie("",r)}),[fe]=f.useState(()=>r=>ce(r.target.name,we(r)));f.useEffect(()=>(G(e),()=>{me()}),[e,G]);const Q=N((r="")=>(R.current.has(r)||R.current.set(r,null),E(r,O))),V=N((r="",o=y)=>E(r,o)),k=N((r="",o=y)=>r===""?!z(o):E(r,o)!==void 0),de=N(r=>{const{name:o}=r.target,n=E(o,p(O));n?(D(v(o,y,n)),u&&L(o)):D(ue(o,y))}),Ce=N((r,o="")=>{const n=Q(r),i=V(r),a=n===!0||n===!1;return{name:r,"aria-invalid":!!i,className:H(i,i?c:"",o),onChange:fe,onBlur:te?de:void 0,ref:Te,value:a?void 0:`${n}`=="0"?n:n||"",checked:a?n:void 0}}),Be=r=>o=>{o&&o.preventDefault();const n=p(O);if(D(n),k("",n)){if(u){let i=!1;R.current.forEach((a,d)=>{!i&&k(d,n)&&(i=L(d))})}return T.current=!0,!1}return r(O),!0},be=N(({for:r,children:o})=>{const n=V(r,y);return n!=null&&n.message?X(o)?o(n):A.jsx("span",{className:H(n,c),children:n.message}):!1}),pe=!k(),he=N(({children:r,focusable:o=!1})=>{if(pe)return!1;const i=Array.from(R.current).map(a=>a[0]).filter(a=>a!=="").filter(a=>k(a,y)).sort().map(a=>{const d=V(a);return A.jsx("li",{className:H(d,c),children:o?A.jsx("a",{onClick:()=>L(a),children:d.message}):d.message},a)});return X(r)?r(i):i});return{getValue:Q,setValue:ce,register:Ce,onChange:fe,onBlur:de,getRef:Oe,setRef:ae,trigger:ie,handleSubmit:Be,hasError:k,getError:V,clearError:_e,setErrors:ke,array:Re,key:le,Error:be,Errors:he,formState:{errors:y,isValid:pe,isTouched:h.current,isDirty:I.current,hadError:T.current,reset:xe}}},Ae=e=>s=>{let t={};try{e.validateSync(s,{abortEarly:!1})}catch(c){for(const u of c.inner){const p=E(u.path,t)||{};p.message=u.message,p.type=u.type,t=v(u.path,t,p)}}return t},Ne=e=>s=>{let t={};const c=e.safeParse(s);return c.success||c.error.errors.forEach(u=>{const p=u.path.join("."),l=E(p,t)||{};l.message=u.message,l.type=u.type,t=v(p,t,l)}),t};S.default=ve,S.yupResolver=Ae,S.zodResolver=Ne,Object.defineProperties(S,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
