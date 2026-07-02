(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5939],{4003:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>o});var a=s(5155),r=s(2115),i=s(4921),l=s(8599),n=s(8434);function o(){let e,{data:t}=(0,i.wV)(),[s,o]=(0,r.useState)(null),[c,d]=(0,r.useState)(!0),[u,m]=(0,r.useState)(!1),[p,x]=(0,r.useState)({});(0,r.useEffect)(()=>{t?.user?.id&&fetch(`/api/workers/${t.user.id}`).then(e=>e.json()).then(e=>{o(e);let t=[];if("string"==typeof e.skills)try{t=JSON.parse(e.skills)}catch{t=[]}else Array.isArray(e.skills)&&(t=e.skills);x({bio:e.bio||"",skills:t.join(", "),hourlyRate:e.hourlyRate||0,visitCharge:e.visitCharge||0,yearsOfExperience:e.yearsOfExperience||0,city:e.city||"",area:e.area||"",isAvailable:e.isAvailable,bankAccountName:e.bankAccountName||"",bankAccountNumber:e.bankAccountNumber||"",bankIfscCode:e.bankIfscCode||""}),d(!1)}).catch(()=>d(!1))},[t]);let f=async()=>{try{if(!(await fetch(`/api/workers/${s.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({...p,skills:JSON.stringify(p.skills.split(",").map(e=>e.trim()).filter(Boolean))})})).ok)throw Error();n.Ay.success("Profile updated!"),m(!1)}catch{n.Ay.error("Failed to update profile")}};return c?(0,a.jsx)("div",{className:"h-64 bg-gray-100 rounded-xl animate-pulse"}):(0,a.jsxs)("div",{className:"max-w-3xl mx-auto",children:[(0,a.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-6",children:"My Profile"}),(0,a.jsxs)("div",{className:"card mb-4",children:[(0,a.jsxs)("div",{className:"flex items-center gap-4 mb-6",children:[(0,a.jsx)("div",{className:"w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600",children:s?.user?.name?.[0]||"W"}),(0,a.jsxs)("div",{className:"flex-1",children:[(0,a.jsx)("h2",{className:"text-xl font-semibold",children:s?.user?.name||t?.user?.phone}),(0,a.jsx)("p",{className:"text-gray-500",children:l.Xt.find(e=>e.id===s?.serviceCategory)?.name}),(0,a.jsxs)("div",{className:"flex items-center gap-3 mt-2",children:[(0,a.jsx)("span",{className:`px-2 py-0.5 rounded-full text-xs font-medium ${s?.isVerified?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`,children:s?.isVerified?"Verified ✓":"Unverified"}),(0,a.jsxs)("span",{className:`px-2 py-0.5 rounded-full text-xs font-medium ${s?.kycStatus==="VERIFIED"?"bg-green-100 text-green-700":"bg-orange-100 text-orange-700"}`,children:["KYC: ",s?.kycStatus]}),(0,a.jsxs)("span",{className:"text-sm text-gray-500",children:["Trust Score: ",s?.trustScore.toFixed(0),"%"]})]})]}),(0,a.jsx)("button",{onClick:()=>m(!u),className:"btn-secondary text-sm",children:u?"Cancel":"Edit"})]}),u?(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Bio"}),(0,a.jsx)("textarea",{value:p.bio,onChange:e=>x({...p,bio:e.target.value}),rows:3,className:"input-field resize-none",placeholder:"Tell customers about yourself"})]}),(0,a.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Skills (comma-separated)"}),(0,a.jsx)("input",{type:"text",value:p.skills,onChange:e=>x({...p,skills:e.target.value}),className:"input-field",placeholder:"e.g., pipe repair, faucet installation"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Years of Experience"}),(0,a.jsx)("input",{type:"number",value:p.yearsOfExperience,onChange:e=>x({...p,yearsOfExperience:parseFloat(e.target.value)}),className:"input-field",min:"0",step:"0.5"})]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Visit Charge (₹)"}),(0,a.jsx)("input",{type:"number",value:p.visitCharge,onChange:e=>x({...p,visitCharge:parseFloat(e.target.value)}),className:"input-field",min:"0"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Hourly Rate (₹)"}),(0,a.jsx)("input",{type:"number",value:p.hourlyRate,onChange:e=>x({...p,hourlyRate:parseFloat(e.target.value)}),className:"input-field",min:"0"})]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"City"}),(0,a.jsx)("input",{type:"text",value:p.city,onChange:e=>x({...p,city:e.target.value}),className:"input-field"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Area"}),(0,a.jsx)("input",{type:"text",value:p.area,onChange:e=>x({...p,area:e.target.value}),className:"input-field"})]})]}),(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[(0,a.jsxs)("label",{className:"relative inline-flex items-center cursor-pointer",children:[(0,a.jsx)("input",{type:"checkbox",checked:p.isAvailable,onChange:e=>x({...p,isAvailable:e.target.checked}),className:"sr-only peer"}),(0,a.jsx)("div",{className:"w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"})]}),(0,a.jsxs)("span",{className:"text-sm font-medium text-gray-700",children:["Available for work (",p.isAvailable?"Online":"Offline",")"]})]}),(0,a.jsxs)("div",{className:"border-t pt-4",children:[(0,a.jsx)("h3",{className:"font-semibold text-gray-900 mb-3",children:"\uD83C\uDFE6 Bank Account Details"}),(0,a.jsxs)("div",{className:"grid grid-cols-3 gap-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Account Holder"}),(0,a.jsx)("input",{type:"text",value:p.bankAccountName,onChange:e=>x({...p,bankAccountName:e.target.value}),className:"input-field"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Account Number"}),(0,a.jsx)("input",{type:"text",value:p.bankAccountNumber,onChange:e=>x({...p,bankAccountNumber:e.target.value}),className:"input-field"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"IFSC Code"}),(0,a.jsx)("input",{type:"text",value:p.bankIfscCode,onChange:e=>x({...p,bankIfscCode:e.target.value}),className:"input-field"})]})]})]}),(0,a.jsx)("button",{onClick:f,className:"btn-primary w-full",children:"Save Changes"})]}):(0,a.jsxs)("div",{className:"space-y-4",children:[s?.bio&&(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-sm text-gray-500 mb-1",children:"About"}),(0,a.jsx)("p",{className:"text-gray-700",children:s.bio})]}),(0,a.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-sm text-gray-500",children:"Visit Charge"}),(0,a.jsxs)("p",{className:"font-semibold",children:["₹",s?.visitCharge]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-sm text-gray-500",children:"Hourly Rate"}),(0,a.jsxs)("p",{className:"font-semibold",children:["₹",s?.hourlyRate]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-sm text-gray-500",children:"Experience"}),(0,a.jsxs)("p",{className:"font-semibold",children:[s?.yearsOfExperience," yrs"]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-sm text-gray-500",children:"Rating"}),(0,a.jsxs)("p",{className:"font-semibold",children:[s?.rating.toFixed(1)," ★"]})]})]}),0===(e="string"==typeof s?.skills?JSON.parse(s.skills||"[]"):s?.skills||[]).length?null:(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-sm text-gray-500 mb-2",children:"Skills"}),(0,a.jsx)("div",{className:"flex flex-wrap gap-2",children:e.map(e=>(0,a.jsx)("span",{className:"px-3 py-1 bg-gray-100 rounded-lg text-sm",children:e},e))})]}),(0,a.jsx)("div",{className:"border-t pt-4",children:(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"font-semibold text-gray-900",children:"KYC Documents"}),(0,a.jsxs)("p",{className:"text-sm text-gray-500",children:[s?.kycDocuments.length," document(s) uploaded"]})]}),(0,a.jsx)("button",{className:"btn-outline text-sm",children:"Upload KYC"})]})})]})]})]})}},4239:(e,t,s)=>{Promise.resolve().then(s.bind(s,4003))},8434:(e,t,s)=>{"use strict";let a,r;s.d(t,{Toaster:()=>ee,Ay:()=>et});var i,l=s(2115);let n={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,u=(e,t)=>{let s="",a="",r="";for(let i in e){let l=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+l+";":a+="f"==i[1]?u(l,i):i+"{"+u(l,"k"==i[1]?"":t)+"}":"object"==typeof l?a+=u(l,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=l&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=u.p?u.p(i,l):i+":"+l+";")}return s+(t&&r?t+"{"+r+"}":r)+a},m={},p=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+p(e[s]);return t}return e};function x(e){let t,s,a=this||{},r=e.call?e(a.p):e;return((e,t,s,a,r)=>{var i;let l=p(e),n=m[l]||(m[l]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(l));if(!m[n]){let t=l!==e?e:(e=>{let t,s,a=[{}];for(;t=o.exec(e.replace(c,""));)t[4]?a.shift():t[3]?(s=t[3].replace(d," ").trim(),a.unshift(a[0][s]=a[0][s]||{})):a[0][t[1]]=t[2].replace(d," ").trim();return a[0]})(e);m[n]=u(r?{["@keyframes "+n]:t}:t,s?"":"."+n)}let x=s&&m.g;return s&&(m.g=m[n]),i=m[n],x?t.data=t.data.replace(x,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),n})(r.unshift?r.raw?(t=[].slice.call(arguments,1),s=a.p,r.reduce((e,a,r)=>{let i=t[r];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(a.target),a.g,a.o,a.k)}x.bind({g:1});let f,g,b,h=x.bind({k:1});function y(e,t){let s=this||{};return function(){let a=arguments;function r(i,l){let n=Object.assign({},i),o=n.className||r.className;s.p=Object.assign({theme:g&&g()},n),s.o=/go\d/.test(o),n.className=x.apply(s,a)+(o?" "+o:""),t&&(n.ref=l);let c=e;return e[0]&&(c=n.as||e,delete n.as),b&&c[0]&&b(n),f(c,n)}return t?t(r):r}}var v=(e,t)=>"function"==typeof e?e(t):e,N=(a=0,()=>(++a).toString()),j=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},k="default",E=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return E(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},C=[],w={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},A={},O=(e,t=k)=>{A[t]=E(A[t]||w,e),C.forEach(([e,s])=>{e===t&&s(A[t])})},S=e=>Object.keys(A).forEach(t=>O(e,t)),I=(e=k)=>t=>{O(t,e)},R={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=e=>(t,s)=>{let a,r=((e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||N()}))(t,e,s);return I(r.toasterId||(a=r.id,Object.keys(A).find(e=>A[e].toasts.some(e=>e.id===a))))({type:2,toast:r}),r.id},P=(e,t)=>D("blank")(e,t);P.error=D("error"),P.success=D("success"),P.loading=D("loading"),P.custom=D("custom"),P.dismiss=(e,t)=>{let s={type:3,toastId:e};t?I(t)(s):S(s)},P.dismissAll=e=>P.dismiss(void 0,e),P.remove=(e,t)=>{let s={type:4,toastId:e};t?I(t)(s):S(s)},P.removeAll=e=>P.remove(void 0,e),P.promise=(e,t,s)=>{let a=P.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?v(t.success,e):void 0;return r?P.success(r,{id:a,...s,...null==s?void 0:s.success}):P.dismiss(a),e}).catch(e=>{let r=t.error?v(t.error,e):void 0;r?P.error(r,{id:a,...s,...null==s?void 0:s.error}):P.dismiss(a)}),e};var _=1e3,T=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,$=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,F=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,H=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${T} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${$} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,L=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,M=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${L} 1s linear infinite;
`,V=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,z=h`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,W=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${V} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${z} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,B=y("div")`
  position: absolute;
`,K=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,U=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Y=y("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${U} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,G=({toast:e})=>{let{icon:t,type:s,iconTheme:a}=e;return void 0!==t?"string"==typeof t?l.createElement(Y,null,t):t:"blank"===s?null:l.createElement(K,null,l.createElement(M,{...a}),"loading"!==s&&l.createElement(B,null,"error"===s?l.createElement(H,{...a}):l.createElement(W,{...a})))},J=y("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,q=y("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,X=l.memo(({toast:e,position:t,style:s,children:a})=>{let r=e.height?((e,t)=>{let s=e.includes("top")?1:-1,[a,r]=j()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*s}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*s}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${h(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=l.createElement(G,{toast:e}),n=l.createElement(q,{...e.ariaProps},v(e.message,e));return l.createElement(J,{className:e.className,style:{...r,...s,...e.style}},"function"==typeof a?a({icon:i,message:n}):l.createElement(l.Fragment,null,i,n))});i=l.createElement,u.p=void 0,f=i,g=void 0,b=void 0;var Z=({id:e,className:t,style:s,onHeightUpdate:a,children:r})=>{let i=l.useCallback(t=>{if(t){let s=()=>{a(e,t.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return l.createElement("div",{ref:i,className:t,style:s},r)},Q=x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:a,children:r,toasterId:i,containerStyle:n,containerClassName:o})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:s,pausedAt:a}=((e={},t=k)=>{let[s,a]=(0,l.useState)(A[t]||w),r=(0,l.useRef)(A[t]);(0,l.useEffect)(()=>(r.current!==A[t]&&a(A[t]),C.push([t,a]),()=>{let e=C.findIndex(([e])=>e===t);e>-1&&C.splice(e,1)}),[t]);let i=s.toasts.map(t=>{var s,a,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(s=e[t.type])?void 0:s.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||R[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...s,toasts:i}})(e,t),r=(0,l.useRef)(new Map).current,i=(0,l.useCallback)((e,t=_)=>{if(r.has(e))return;let s=setTimeout(()=>{r.delete(e),n({type:4,toastId:e})},t);r.set(e,s)},[]);(0,l.useEffect)(()=>{if(a)return;let e=Date.now(),r=s.map(s=>{if(s.duration===1/0)return;let a=(s.duration||0)+s.pauseDuration-(e-s.createdAt);if(a<0){s.visible&&P.dismiss(s.id);return}return setTimeout(()=>P.dismiss(s.id,t),a)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[s,a,t]);let n=(0,l.useCallback)(I(t),[t]),o=(0,l.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),c=(0,l.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=(0,l.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),u=(0,l.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:r=8,defaultPosition:i}=t||{},l=s.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=l.findIndex(t=>t.id===e.id),o=l.filter((e,t)=>t<n&&e.visible).length;return l.filter(e=>e.visible).slice(...a?[o+1]:[0,o]).reduce((e,t)=>e+(t.height||0)+r,0)},[s]);return(0,l.useEffect)(()=>{s.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[s,i]),{toasts:s,handlers:{updateHeight:c,startPause:o,endPause:d,calculateOffset:u}}})(s,i);return l.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:o,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(s=>{let i,n,o=s.position||t,c=d.calculateOffset(s,{reverseOrder:e,gutter:a,defaultPosition:t}),u=(i=o.includes("top"),n=o.includes("center")?{justifyContent:"center"}:o.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:j()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return l.createElement(Z,{id:s.id,key:s.id,onHeightUpdate:d.updateHeight,className:s.visible?Q:"",style:u},"custom"===s.type?v(s.message,s):r?r(s):l.createElement(X,{toast:s,position:o}))}))},et=P},8599:(e,t,s)=>{"use strict";function a(e){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(e)}function r(e){return({PENDING:"bg-yellow-100 text-yellow-800",CONFIRMED:"bg-blue-100 text-blue-800",WORKER_ASSIGNED:"bg-indigo-100 text-indigo-800",WORKER_ON_THE_WAY:"bg-purple-100 text-purple-800",SERVICE_STARTED:"bg-orange-100 text-orange-800",COMPLETED:"bg-green-100 text-green-800",CANCELLED:"bg-red-100 text-red-800"})[e]||"bg-gray-100 text-gray-800"}function i(e){return({PENDING:"Pending",CONFIRMED:"Confirmed",WORKER_ASSIGNED:"Worker Assigned",WORKER_ON_THE_WAY:"Worker On The Way",SERVICE_STARTED:"Service Started",COMPLETED:"Completed",CANCELLED:"Cancelled"})[e]||e}s.d(t,{Xt:()=>l,i9:()=>n,ps:()=>i,qY:()=>r,vv:()=>a});let l=[{id:"PLUMBER",name:"Plumber",icon:"\uD83D\uDD27",color:"bg-blue-500"},{id:"ELECTRICIAN",name:"Electrician",icon:"⚡",color:"bg-yellow-500"},{id:"DRIVER",name:"Driver",icon:"\uD83D\uDE97",color:"bg-green-500"},{id:"MAID",name:"Maid/Bai",icon:"\uD83E\uDDF9",color:"bg-pink-500"},{id:"CARPENTER",name:"Carpenter",icon:"\uD83E\uDE9A",color:"bg-orange-500"},{id:"HOUSE_PAINTER",name:"House Painter",icon:"\uD83C\uDFA8",color:"bg-purple-500"},{id:"HOUSE_CLEANER",name:"House Cleaning",icon:"\uD83E\uDDFD",color:"bg-teal-500"},{id:"LOCKSMITH",name:"Locksmith",icon:"\uD83D\uDD10",color:"bg-red-500"}],n=[{tier:"BASIC",name:"Basic",price:99,features:{bookingPriority:!0,freeVisits:1,discount:10,support:"24x7 Support",extras:[]}},{tier:"PREMIUM",name:"Premium",price:199,features:{bookingPriority:!0,freeVisits:2,discount:20,support:"24x7 Support",extras:["Service Reminders"]}},{tier:"VIP",name:"VIP",price:299,features:{bookingPriority:!0,freeVisits:4,discount:30,support:"24x7 Support",extras:["Service Reminders","Annual Health Check"]}}]}},e=>{e.O(0,[4921,8441,3794,7358],()=>e(e.s=4239)),_N_E=e.O()}]);