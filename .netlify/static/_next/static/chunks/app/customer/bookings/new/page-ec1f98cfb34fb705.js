(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4041],{3321:(e,t,r)=>{"use strict";var s=r(4645);r.o(s,"useParams")&&r.d(t,{useParams:function(){return s.useParams}}),r.o(s,"usePathname")&&r.d(t,{usePathname:function(){return s.usePathname}}),r.o(s,"useRouter")&&r.d(t,{useRouter:function(){return s.useRouter}}),r.o(s,"useSearchParams")&&r.d(t,{useSearchParams:function(){return s.useSearchParams}})},6570:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>d});var s=r(5155),a=r(2115),i=r(3321),o=r(8599),n=r(8434);function l(){let e=(0,i.useSearchParams)(),t=(0,i.useRouter)(),r=e.get("workerId"),l=e.get("service"),[d,c]=(0,a.useState)(""),[u,m]=(0,a.useState)(""),[p,f]=(0,a.useState)(""),[g,b]=(0,a.useState)("CASH_ON_DELIVERY"),[h,x]=(0,a.useState)(null),[y,v]=(0,a.useState)(""),[E,N]=(0,a.useState)(!1),j=new Date;j.setDate(j.getDate()+1);let w=j.toISOString().split("T")[0],k=async()=>{if(!d||!u||!p)return void n.Ay.error("Please fill all required fields");N(!0);try{let e=await fetch("/api/bookings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serviceId:l||"PLUMBER",scheduledDate:d,timeSlot:u,address:p,workerId:r||void 0,paymentMethod:g,problemDescription:y||void 0,isEmergency:!1})});if(!e.ok){let t=await e.json();throw Error(t.error||"Failed to create booking")}let s=await e.json();n.Ay.success("Booking created successfully!"),t.push(`/customer/bookings/${s.id}`)}catch(e){n.Ay.error(e.message||"Failed to create booking")}finally{N(!1)}};return(0,s.jsxs)("div",{className:"max-w-2xl mx-auto",children:[(0,s.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:"Book a Service"}),(0,s.jsx)("p",{className:"text-gray-600 mb-8",children:"Fill in the details to schedule your service"}),(0,s.jsxs)("div",{className:"card space-y-6",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Service Category *"}),(0,s.jsx)("select",{value:l||"PLUMBER",disabled:!0,className:"input-field bg-gray-50",children:o.Xt.map(e=>(0,s.jsxs)("option",{value:e.id,children:[e.icon," ",e.name]},e.id))})]}),(0,s.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Date *"}),(0,s.jsx)("input",{type:"date",value:d,min:w,onChange:e=>c(e.target.value),className:"input-field"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Time Slot *"}),(0,s.jsxs)("select",{value:u,onChange:e=>m(e.target.value),className:"input-field",children:[(0,s.jsx)("option",{value:"",children:"Select time"}),["08:00-09:00","09:00-10:00","10:00-11:00","11:00-12:00","12:00-13:00","14:00-15:00","15:00-16:00","16:00-17:00","17:00-18:00","18:00-19:00"].map(e=>(0,s.jsx)("option",{value:e,children:e},e))]})]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Service Address *"}),(0,s.jsx)("textarea",{value:p,onChange:e=>f(e.target.value),rows:3,placeholder:"Enter your complete address",className:"input-field resize-none"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Problem Description (Optional)"}),(0,s.jsx)("textarea",{value:y,onChange:e=>v(e.target.value),rows:2,placeholder:"Describe the issue briefly",className:"input-field resize-none"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Upload Problem Photo (Optional)"}),(0,s.jsxs)("div",{className:"border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer",children:[(0,s.jsx)("p",{className:"text-gray-500 text-sm",children:"Click to upload a photo of the issue"}),(0,s.jsx)("p",{className:"text-xs text-gray-400 mt-1",children:"Supports JPG, PNG (max 5MB)"})]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Payment Method *"}),(0,s.jsxs)("div",{className:"grid grid-cols-2 gap-3",children:[(0,s.jsxs)("button",{onClick:()=>b("CASH_ON_DELIVERY"),className:`p-4 rounded-xl border-2 text-center transition-colors ${"CASH_ON_DELIVERY"===g?"border-blue-600 bg-blue-50":"border-gray-200 hover:border-gray-300"}`,children:[(0,s.jsx)("p",{className:"text-2xl mb-1",children:"\uD83D\uDCB5"}),(0,s.jsx)("p",{className:"font-medium text-sm",children:"Cash on Delivery"})]}),(0,s.jsxs)("button",{onClick:()=>b("ONLINE"),className:`p-4 rounded-xl border-2 text-center transition-colors ${"ONLINE"===g?"border-blue-600 bg-blue-50":"border-gray-200 hover:border-gray-300"}`,children:[(0,s.jsx)("p",{className:"text-2xl mb-1",children:"\uD83D\uDCB3"}),(0,s.jsx)("p",{className:"font-medium text-sm",children:"Online Payment"})]})]})]}),(0,s.jsxs)("div",{className:"bg-gray-50 rounded-xl p-4",children:[(0,s.jsx)("h3",{className:"font-semibold mb-2",children:"Price Breakdown"}),(0,s.jsxs)("div",{className:"space-y-2 text-sm",children:[(0,s.jsxs)("div",{className:"flex justify-between",children:[(0,s.jsx)("span",{className:"text-gray-600",children:"Visit Charge"}),(0,s.jsx)("span",{children:(0,o.vv)(199)})]}),(0,s.jsxs)("div",{className:"flex justify-between",children:[(0,s.jsx)("span",{className:"text-gray-600",children:"Estimated Service Charge"}),(0,s.jsx)("span",{children:(0,o.vv)(159)})]}),(0,s.jsxs)("div",{className:"border-t pt-2 flex justify-between font-semibold",children:[(0,s.jsx)("span",{children:"Total"}),(0,s.jsx)("span",{children:(0,o.vv)(358)})]})]})]}),(0,s.jsx)("button",{onClick:k,disabled:E||!d||!u||!p,className:"btn-primary w-full py-3 text-lg",children:E?"Booking...":"Confirm Booking"})]})]})}function d(){return(0,s.jsx)(a.Suspense,{fallback:(0,s.jsx)("div",{className:"h-96 bg-gray-100 rounded-xl animate-pulse"}),children:(0,s.jsx)(l,{})})}},7812:(e,t,r)=>{Promise.resolve().then(r.bind(r,6570))},8434:(e,t,r)=>{"use strict";let s,a;r.d(t,{Toaster:()=>ee,Ay:()=>et});var i,o=r(2115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,u=(e,t)=>{let r="",s="",a="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+o+";":s+="f"==i[1]?u(o,i):i+"{"+u(o,"k"==i[1]?"":t)+"}":"object"==typeof o?s+=u(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=u.p?u.p(i,o):i+":"+o+";")}return r+(t&&a?t+"{"+a+"}":a)+s},m={},p=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+p(e[r]);return t}return e};function f(e){let t,r,s=this||{},a=e.call?e(s.p):e;return((e,t,r,s,a)=>{var i;let o=p(e),n=m[o]||(m[o]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(o));if(!m[n]){let t=o!==e?e:(e=>{let t,r,s=[{}];for(;t=l.exec(e.replace(d,""));)t[4]?s.shift():t[3]?(r=t[3].replace(c," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][t[1]]=t[2].replace(c," ").trim();return s[0]})(e);m[n]=u(a?{["@keyframes "+n]:t}:t,r?"":"."+n)}let f=r&&m.g;return r&&(m.g=m[n]),i=m[n],f?t.data=t.data.replace(f,i):-1===t.data.indexOf(i)&&(t.data=s?i+t.data:t.data+i),n})(a.unshift?a.raw?(t=[].slice.call(arguments,1),r=s.p,a.reduce((e,s,a)=>{let i=t[a];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+s+(null==i?"":i)},"")):a.reduce((e,t)=>Object.assign(e,t&&t.call?t(s.p):t),{}):a,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(s.target),s.g,s.o,s.k)}f.bind({g:1});let g,b,h,x=f.bind({k:1});function y(e,t){let r=this||{};return function(){let s=arguments;function a(i,o){let n=Object.assign({},i),l=n.className||a.className;r.p=Object.assign({theme:b&&b()},n),r.o=/go\d/.test(l),n.className=f.apply(r,s)+(l?" "+l:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),h&&d[0]&&h(n),g(d,n)}return t?t(a):a}}var v=(e,t)=>"function"==typeof e?e(t):e,E=(s=0,()=>(++s).toString()),N=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},j="default",w=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===s.id),toast:s});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},k=[],C={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},S={},P=(e,t=j)=>{S[t]=w(S[t]||C,e),k.forEach(([e,r])=>{e===t&&r(S[t])})},D=e=>Object.keys(S).forEach(t=>P(e,t)),I=(e=j)=>t=>{P(t,e)},O={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},R=e=>(t,r)=>{let s,a=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||E()}))(t,e,r);return I(a.toasterId||(s=a.id,Object.keys(S).find(e=>S[e].toasts.some(e=>e.id===s))))({type:2,toast:a}),a.id},A=(e,t)=>R("blank")(e,t);A.error=R("error"),A.success=R("success"),A.loading=R("loading"),A.custom=R("custom"),A.dismiss=(e,t)=>{let r={type:3,toastId:e};t?I(t)(r):D(r)},A.dismissAll=e=>A.dismiss(void 0,e),A.remove=(e,t)=>{let r={type:4,toastId:e};t?I(t)(r):D(r)},A.removeAll=e=>A.remove(void 0,e),A.promise=(e,t,r)=>{let s=A.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?v(t.success,e):void 0;return a?A.success(a,{id:s,...r,...null==r?void 0:r.success}):A.dismiss(s),e}).catch(e=>{let a=t.error?v(t.error,e):void 0;a?A.error(a,{id:s,...r,...null==r?void 0:r.error}):A.dismiss(s)}),e};var _=1e3,T=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,L=x`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,$=x`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,M=y("div")`
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
    animation: ${L} 0.15s ease-out forwards;
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
    animation: ${$} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,H=x`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,B=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${H} 1s linear infinite;
`,z=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,F=x`
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
}`,V=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${F} 0.2s ease-out forwards;
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
`,U=y("div")`
  position: absolute;
`,W=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Y=x`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,G=y("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Y} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,K=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return void 0!==t?"string"==typeof t?o.createElement(G,null,t):t:"blank"===r?null:o.createElement(W,null,o.createElement(B,{...s}),"loading"!==r&&o.createElement(U,null,"error"===r?o.createElement(M,{...s}):o.createElement(V,{...s})))},q=y("div")`
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
`,J=y("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,X=o.memo(({toast:e,position:t,style:r,children:s})=>{let a=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[s,a]=N()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${x(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${x(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(K,{toast:e}),n=o.createElement(J,{...e.ariaProps},v(e.message,e));return o.createElement(q,{className:e.className,style:{...a,...r,...e.style}},"function"==typeof s?s({icon:i,message:n}):o.createElement(o.Fragment,null,i,n))});i=o.createElement,u.p=void 0,g=i,b=void 0,h=void 0;var Z=({id:e,className:t,style:r,onHeightUpdate:s,children:a})=>{let i=o.useCallback(t=>{if(t){let r=()=>{s(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return o.createElement("div",{ref:i,className:t,style:r},a)},Q=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:s,children:a,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:r,pausedAt:s}=((e={},t=j)=>{let[r,s]=(0,o.useState)(S[t]||C),a=(0,o.useRef)(S[t]);(0,o.useEffect)(()=>(a.current!==S[t]&&s(S[t]),k.push([t,s]),()=>{let e=k.findIndex(([e])=>e===t);e>-1&&k.splice(e,1)}),[t]);let i=r.toasts.map(t=>{var r,s,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||O[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}});return{...r,toasts:i}})(e,t),a=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=_)=>{if(a.has(e))return;let r=setTimeout(()=>{a.delete(e),n({type:4,toastId:e})},t);a.set(e,r)},[]);(0,o.useEffect)(()=>{if(s)return;let e=Date.now(),a=r.map(r=>{if(r.duration===1/0)return;let s=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(s<0){r.visible&&A.dismiss(r.id);return}return setTimeout(()=>A.dismiss(r.id,t),s)});return()=>{a.forEach(e=>e&&clearTimeout(e))}},[r,s,t]);let n=(0,o.useCallback)(I(t),[t]),l=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,o.useCallback)(()=>{s&&n({type:6,time:Date.now()})},[s,n]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:s=!1,gutter:a=8,defaultPosition:i}=t||{},o=r.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...s?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+a,0)},[r]);return(0,o.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=a.get(e.id);t&&(clearTimeout(t),a.delete(e.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:u}}})(r,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(r=>{let i,n,l=r.position||t,d=c.calculateOffset(r,{reverseOrder:e,gutter:s,defaultPosition:t}),u=(i=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:N()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return o.createElement(Z,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?Q:"",style:u},"custom"===r.type?v(r.message,r):a?a(r):o.createElement(X,{toast:r,position:l}))}))},et=A},8599:(e,t,r)=>{"use strict";function s(e){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(e)}function a(e){return({PENDING:"bg-yellow-100 text-yellow-800",CONFIRMED:"bg-blue-100 text-blue-800",WORKER_ASSIGNED:"bg-indigo-100 text-indigo-800",WORKER_ON_THE_WAY:"bg-purple-100 text-purple-800",SERVICE_STARTED:"bg-orange-100 text-orange-800",COMPLETED:"bg-green-100 text-green-800",CANCELLED:"bg-red-100 text-red-800"})[e]||"bg-gray-100 text-gray-800"}function i(e){return({PENDING:"Pending",CONFIRMED:"Confirmed",WORKER_ASSIGNED:"Worker Assigned",WORKER_ON_THE_WAY:"Worker On The Way",SERVICE_STARTED:"Service Started",COMPLETED:"Completed",CANCELLED:"Cancelled"})[e]||e}r.d(t,{Xt:()=>o,i9:()=>n,ps:()=>i,qY:()=>a,vv:()=>s});let o=[{id:"PLUMBER",name:"Plumber",icon:"\uD83D\uDD27",color:"bg-blue-500"},{id:"ELECTRICIAN",name:"Electrician",icon:"⚡",color:"bg-yellow-500"},{id:"DRIVER",name:"Driver",icon:"\uD83D\uDE97",color:"bg-green-500"},{id:"MAID",name:"Maid/Bai",icon:"\uD83E\uDDF9",color:"bg-pink-500"},{id:"CARPENTER",name:"Carpenter",icon:"\uD83E\uDE9A",color:"bg-orange-500"},{id:"HOUSE_PAINTER",name:"House Painter",icon:"\uD83C\uDFA8",color:"bg-purple-500"},{id:"HOUSE_CLEANER",name:"House Cleaning",icon:"\uD83E\uDDFD",color:"bg-teal-500"},{id:"LOCKSMITH",name:"Locksmith",icon:"\uD83D\uDD10",color:"bg-red-500"}],n=[{tier:"BASIC",name:"Basic",price:99,features:{bookingPriority:!0,freeVisits:1,discount:10,support:"24x7 Support",extras:[]}},{tier:"PREMIUM",name:"Premium",price:199,features:{bookingPriority:!0,freeVisits:2,discount:20,support:"24x7 Support",extras:["Service Reminders"]}},{tier:"VIP",name:"VIP",price:299,features:{bookingPriority:!0,freeVisits:4,discount:30,support:"24x7 Support",extras:["Service Reminders","Annual Health Check"]}}]}},e=>{e.O(0,[8441,3794,7358],()=>e(e.s=7812)),_N_E=e.O()}]);