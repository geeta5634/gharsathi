(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5854],{2053:(e,t,s)=>{Promise.resolve().then(s.bind(s,2984))},2984:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>m});var a=s(5155),r=s(2115),i=s(3321),n=s(4921),o=s(8599);let l=[{key:"CONFIRMED",label:"Confirmed"},{key:"WORKER_ASSIGNED",label:"Worker Assigned"},{key:"WORKER_ON_THE_WAY",label:"On The Way"},{key:"SERVICE_STARTED",label:"Service Started"},{key:"COMPLETED",label:"Completed"}];function c({currentStatus:e}){let t=l.findIndex(t=>t.key===e);return(0,a.jsx)("div",{className:"flex items-center justify-between w-full py-4",children:l.map((e,s)=>{let r=s<=t;return(0,a.jsxs)("div",{className:"flex items-center flex-1 last:flex-none",children:[(0,a.jsxs)("div",{className:"flex flex-col items-center",children:[(0,a.jsx)("div",{className:`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${r?"bg-green-500 text-white":"bg-gray-200 text-gray-500"} ${s===t?"ring-2 ring-green-300":""}`,children:s+1}),(0,a.jsx)("span",{className:`text-xs mt-1 text-center ${r?"text-green-600 font-medium":"text-gray-400"}`,children:e.label})]}),s<l.length-1&&(0,a.jsx)("div",{className:`flex-1 h-0.5 mx-2 ${s<t?"bg-green-500":"bg-gray-200"}`})]},e.key)})})}var d=s(8434);function m(){let e=(0,i.useParams)(),{data:t}=(0,n.wV)(),[s,l]=(0,r.useState)(null),[m,u]=(0,r.useState)(!0),[p,x]=(0,r.useState)(""),f=(0,r.useRef)(null),h=()=>{fetch(`/api/bookings/${e.id}`).then(e=>e.json()).then(e=>{l(e),u(!1)}).catch(()=>u(!1))};(0,r.useEffect)(()=>{h()},[e.id]),(0,r.useEffect)(()=>{f.current?.scrollIntoView({behavior:"smooth"})},[s?.messages]);let g=async()=>{if(p.trim())try{await fetch("/api/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({bookingId:e.id,content:p})}),x(""),h()}catch{d.Ay.error("Failed to send message")}};return m?(0,a.jsxs)("div",{className:"animate-pulse space-y-4",children:[(0,a.jsx)("div",{className:"h-12 bg-gray-100 rounded-lg w-1/3"}),(0,a.jsx)("div",{className:"h-32 bg-gray-100 rounded-xl"}),(0,a.jsx)("div",{className:"h-64 bg-gray-100 rounded-xl"})]}):s?(0,a.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[(0,a.jsxs)("div",{className:"lg:col-span-2 space-y-6",children:[(0,a.jsxs)("div",{className:"card",children:[(0,a.jsxs)("div",{className:"flex justify-between items-start mb-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:s.service.name}),(0,a.jsxs)("p",{className:"text-sm text-gray-500",children:["Booking ID: ",s.bookingId]})]}),(0,a.jsx)("span",{className:`badge text-sm ${(0,o.qY)(s.status)}`,children:(0,o.ps)(s.status)})]}),(0,a.jsx)(c,{currentStatus:s.status}),(0,a.jsxs)("div",{className:"grid grid-cols-2 gap-4 mt-4 text-sm",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-gray-500",children:"Date"}),(0,a.jsx)("p",{className:"font-medium",children:new Date(s.scheduledDate).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-gray-500",children:"Time"}),(0,a.jsx)("p",{className:"font-medium",children:s.timeSlot})]}),(0,a.jsxs)("div",{className:"col-span-2",children:[(0,a.jsx)("p",{className:"text-gray-500",children:"Address"}),(0,a.jsx)("p",{className:"font-medium",children:s.address})]}),s.problemDescription&&(0,a.jsxs)("div",{className:"col-span-2",children:[(0,a.jsx)("p",{className:"text-gray-500",children:"Issue Description"}),(0,a.jsx)("p",{className:"font-medium",children:s.problemDescription})]})]})]}),s.worker&&(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h2",{className:"text-lg font-semibold mb-3",children:"Assigned Worker"}),(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[(0,a.jsx)("div",{className:"w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600",children:s.worker.name?.[0]||"W"}),(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"font-semibold",children:s.worker.name||"Worker"}),(0,a.jsx)("p",{className:"text-sm text-gray-500",children:s.worker.phone}),(0,a.jsxs)("div",{className:"flex items-center gap-3 mt-2",children:[(0,a.jsx)("button",{className:"text-sm text-blue-600 hover:underline",children:"\uD83D\uDCDE Call"}),(0,a.jsx)("button",{className:"text-sm text-blue-600 hover:underline",children:"\uD83D\uDCAC Chat"})]})]})]})]}),"CANCELLED"!==s.status&&"COMPLETED"!==s.status&&(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h2",{className:"text-lg font-semibold mb-3",children:"Live Chat"}),(0,a.jsxs)("div",{className:"h-64 overflow-y-auto mb-3 space-y-3 border rounded-lg p-3",children:[0===s.messages.length?(0,a.jsx)("p",{className:"text-center text-gray-400 text-sm py-8",children:"No messages yet"}):s.messages.map(e=>(0,a.jsx)("div",{className:`flex ${e.sender.id===t?.user?.id?"justify-end":"justify-start"}`,children:(0,a.jsxs)("div",{className:`max-w-[80%] p-3 rounded-xl text-sm ${e.sender.id===t?.user?.id?"bg-blue-600 text-white":"bg-gray-100 text-gray-900"}`,children:[(0,a.jsx)("p",{children:e.content}),(0,a.jsx)("p",{className:"text-xs mt-1 opacity-70",children:new Date(e.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]})},e.id)),(0,a.jsx)("div",{ref:f})]}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)("input",{type:"text",value:p,onChange:e=>x(e.target.value),onKeyDown:e=>"Enter"===e.key&&g(),placeholder:"Type a message...",className:"input-field flex-1"}),(0,a.jsx)("button",{onClick:g,className:"btn-primary",children:"Send"})]})]}),"COMPLETED"===s.status&&!s.review&&(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h2",{className:"text-lg font-semibold mb-3",children:"Rate This Service"}),(0,a.jsx)("p",{className:"text-sm text-gray-500 mb-3",children:"How was your experience?"}),(0,a.jsx)("button",{className:"btn-primary",children:"Write a Review"})]})]}),(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h2",{className:"text-lg font-semibold mb-4",children:"Payment Details"}),(0,a.jsxs)("div",{className:"space-y-2 text-sm",children:[(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("span",{className:"text-gray-500",children:"Visit Charge"}),(0,a.jsx)("span",{children:(0,o.vv)(s.visitCharge)})]}),(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("span",{className:"text-gray-500",children:"Service Charge"}),(0,a.jsx)("span",{children:(0,o.vv)(s.serviceCharge)})]}),s.discountAmount>0&&(0,a.jsxs)("div",{className:"flex justify-between text-green-600",children:[(0,a.jsx)("span",{children:"Discount"}),(0,a.jsxs)("span",{children:["-",(0,o.vv)(s.discountAmount)]})]}),(0,a.jsxs)("div",{className:"border-t pt-2 flex justify-between font-semibold",children:[(0,a.jsx)("span",{children:"Total"}),(0,a.jsx)("span",{children:(0,o.vv)(s.finalAmount)})]}),(0,a.jsxs)("div",{className:"flex justify-between pt-1",children:[(0,a.jsx)("span",{className:"text-gray-500",children:"Payment"}),(0,a.jsx)("span",{className:"capitalize",children:s.paymentMethod.replace("_"," ").toLowerCase()})]})]})]}),(0,a.jsxs)("div",{className:"card",children:[(0,a.jsx)("h2",{className:"text-lg font-semibold mb-3",children:"Status History"}),(0,a.jsx)("div",{className:"space-y-3",children:s.statusHistory.map(e=>(0,a.jsxs)("div",{className:"flex items-start gap-3 text-sm",children:[(0,a.jsx)("div",{className:"w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"}),(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"font-medium",children:(0,o.ps)(e.status)}),e.note&&(0,a.jsx)("p",{className:"text-gray-500 text-xs",children:e.note}),(0,a.jsx)("p",{className:"text-gray-400 text-xs",children:new Date(e.createdAt).toLocaleString()})]})]},e.createdAt))})]})]})]}):(0,a.jsx)("div",{className:"text-center py-16",children:(0,a.jsx)("h3",{className:"text-xl font-semibold",children:"Booking not found"})})}},3321:(e,t,s)=>{"use strict";var a=s(4645);s.o(a,"useParams")&&s.d(t,{useParams:function(){return a.useParams}}),s.o(a,"usePathname")&&s.d(t,{usePathname:function(){return a.usePathname}}),s.o(a,"useRouter")&&s.d(t,{useRouter:function(){return a.useRouter}}),s.o(a,"useSearchParams")&&s.d(t,{useSearchParams:function(){return a.useSearchParams}})},8434:(e,t,s)=>{"use strict";let a,r;s.d(t,{Toaster:()=>ee,Ay:()=>et});var i,n=s(2115);let o={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,m=(e,t)=>{let s="",a="",r="";for(let i in e){let n=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+n+";":a+="f"==i[1]?m(n,i):i+"{"+m(n,"k"==i[1]?"":t)+"}":"object"==typeof n?a+=m(n,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=n&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=m.p?m.p(i,n):i+":"+n+";")}return s+(t&&r?t+"{"+r+"}":r)+a},u={},p=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+p(e[s]);return t}return e};function x(e){let t,s,a=this||{},r=e.call?e(a.p):e;return((e,t,s,a,r)=>{var i;let n=p(e),o=u[n]||(u[n]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(n));if(!u[o]){let t=n!==e?e:(e=>{let t,s,a=[{}];for(;t=l.exec(e.replace(c,""));)t[4]?a.shift():t[3]?(s=t[3].replace(d," ").trim(),a.unshift(a[0][s]=a[0][s]||{})):a[0][t[1]]=t[2].replace(d," ").trim();return a[0]})(e);u[o]=m(r?{["@keyframes "+o]:t}:t,s?"":"."+o)}let x=s&&u.g;return s&&(u.g=u[o]),i=u[o],x?t.data=t.data.replace(x,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),o})(r.unshift?r.raw?(t=[].slice.call(arguments,1),s=a.p,r.reduce((e,a,r)=>{let i=t[r];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":m(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||o})(a.target),a.g,a.o,a.k)}x.bind({g:1});let f,h,g,y=x.bind({k:1});function b(e,t){let s=this||{};return function(){let a=arguments;function r(i,n){let o=Object.assign({},i),l=o.className||r.className;s.p=Object.assign({theme:h&&h()},o),s.o=/go\d/.test(l),o.className=x.apply(s,a)+(l?" "+l:""),t&&(o.ref=n);let c=e;return e[0]&&(c=o.as||e,delete o.as),g&&c[0]&&g(o),f(c,o)}return t?t(r):r}}var v=(e,t)=>"function"==typeof e?e(t):e,j=(a=0,()=>(++a).toString()),N=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},E="default",w=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},C=[],k={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},D={},S=(e,t=E)=>{D[t]=w(D[t]||k,e),C.forEach(([e,s])=>{e===t&&s(D[t])})},A=e=>Object.keys(D).forEach(t=>S(e,t)),I=(e=E)=>t=>{S(t,e)},P={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},R=e=>(t,s)=>{let a,r=((e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||j()}))(t,e,s);return I(r.toasterId||(a=r.id,Object.keys(D).find(e=>D[e].toasts.some(e=>e.id===a))))({type:2,toast:r}),r.id},O=(e,t)=>R("blank")(e,t);O.error=R("error"),O.success=R("success"),O.loading=R("loading"),O.custom=R("custom"),O.dismiss=(e,t)=>{let s={type:3,toastId:e};t?I(t)(s):A(s)},O.dismissAll=e=>O.dismiss(void 0,e),O.remove=(e,t)=>{let s={type:4,toastId:e};t?I(t)(s):A(s)},O.removeAll=e=>O.remove(void 0,e),O.promise=(e,t,s)=>{let a=O.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?v(t.success,e):void 0;return r?O.success(r,{id:a,...s,...null==s?void 0:s.success}):O.dismiss(a),e}).catch(e=>{let r=t.error?v(t.error,e):void 0;r?O.error(r,{id:a,...s,...null==s?void 0:s.error}):O.dismiss(a)}),e};var T=1e3,_=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,L=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,$=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,M=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${_} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,W=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,H=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${W} 1s linear infinite;
`,V=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,z=y`
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
}`,F=b("div")`
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
`,K=b("div")`
  position: absolute;
`,B=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,U=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Y=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${U} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,G=({toast:e})=>{let{icon:t,type:s,iconTheme:a}=e;return void 0!==t?"string"==typeof t?n.createElement(Y,null,t):t:"blank"===s?null:n.createElement(B,null,n.createElement(H,{...a}),"loading"!==s&&n.createElement(K,null,"error"===s?n.createElement(M,{...a}):n.createElement(F,{...a})))},q=b("div")`
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
`,J=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,X=n.memo(({toast:e,position:t,style:s,children:a})=>{let r=e.height?((e,t)=>{let s=e.includes("top")?1:-1,[a,r]=N()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*s}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*s}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=n.createElement(G,{toast:e}),o=n.createElement(J,{...e.ariaProps},v(e.message,e));return n.createElement(q,{className:e.className,style:{...r,...s,...e.style}},"function"==typeof a?a({icon:i,message:o}):n.createElement(n.Fragment,null,i,o))});i=n.createElement,m.p=void 0,f=i,h=void 0,g=void 0;var Z=({id:e,className:t,style:s,onHeightUpdate:a,children:r})=>{let i=n.useCallback(t=>{if(t){let s=()=>{a(e,t.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return n.createElement("div",{ref:i,className:t,style:s},r)},Q=x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:a,children:r,toasterId:i,containerStyle:o,containerClassName:l})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:s,pausedAt:a}=((e={},t=E)=>{let[s,a]=(0,n.useState)(D[t]||k),r=(0,n.useRef)(D[t]);(0,n.useEffect)(()=>(r.current!==D[t]&&a(D[t]),C.push([t,a]),()=>{let e=C.findIndex(([e])=>e===t);e>-1&&C.splice(e,1)}),[t]);let i=s.toasts.map(t=>{var s,a,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(s=e[t.type])?void 0:s.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||P[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...s,toasts:i}})(e,t),r=(0,n.useRef)(new Map).current,i=(0,n.useCallback)((e,t=T)=>{if(r.has(e))return;let s=setTimeout(()=>{r.delete(e),o({type:4,toastId:e})},t);r.set(e,s)},[]);(0,n.useEffect)(()=>{if(a)return;let e=Date.now(),r=s.map(s=>{if(s.duration===1/0)return;let a=(s.duration||0)+s.pauseDuration-(e-s.createdAt);if(a<0){s.visible&&O.dismiss(s.id);return}return setTimeout(()=>O.dismiss(s.id,t),a)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[s,a,t]);let o=(0,n.useCallback)(I(t),[t]),l=(0,n.useCallback)(()=>{o({type:5,time:Date.now()})},[o]),c=(0,n.useCallback)((e,t)=>{o({type:1,toast:{id:e,height:t}})},[o]),d=(0,n.useCallback)(()=>{a&&o({type:6,time:Date.now()})},[a,o]),m=(0,n.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:r=8,defaultPosition:i}=t||{},n=s.filter(t=>(t.position||i)===(e.position||i)&&t.height),o=n.findIndex(t=>t.id===e.id),l=n.filter((e,t)=>t<o&&e.visible).length;return n.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[s]);return(0,n.useEffect)(()=>{s.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[s,i]),{toasts:s,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:m}}})(s,i);return n.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...o},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(s=>{let i,o,l=s.position||t,c=d.calculateOffset(s,{reverseOrder:e,gutter:a,defaultPosition:t}),m=(i=l.includes("top"),o=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:N()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...o});return n.createElement(Z,{id:s.id,key:s.id,onHeightUpdate:d.updateHeight,className:s.visible?Q:"",style:m},"custom"===s.type?v(s.message,s):r?r(s):n.createElement(X,{toast:s,position:l}))}))},et=O},8599:(e,t,s)=>{"use strict";function a(e){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(e)}function r(e){return({PENDING:"bg-yellow-100 text-yellow-800",CONFIRMED:"bg-blue-100 text-blue-800",WORKER_ASSIGNED:"bg-indigo-100 text-indigo-800",WORKER_ON_THE_WAY:"bg-purple-100 text-purple-800",SERVICE_STARTED:"bg-orange-100 text-orange-800",COMPLETED:"bg-green-100 text-green-800",CANCELLED:"bg-red-100 text-red-800"})[e]||"bg-gray-100 text-gray-800"}function i(e){return({PENDING:"Pending",CONFIRMED:"Confirmed",WORKER_ASSIGNED:"Worker Assigned",WORKER_ON_THE_WAY:"Worker On The Way",SERVICE_STARTED:"Service Started",COMPLETED:"Completed",CANCELLED:"Cancelled"})[e]||e}s.d(t,{Xt:()=>n,i9:()=>o,ps:()=>i,qY:()=>r,vv:()=>a});let n=[{id:"PLUMBER",name:"Plumber",icon:"\uD83D\uDD27",color:"bg-blue-500"},{id:"ELECTRICIAN",name:"Electrician",icon:"⚡",color:"bg-yellow-500"},{id:"DRIVER",name:"Driver",icon:"\uD83D\uDE97",color:"bg-green-500"},{id:"MAID",name:"Maid/Bai",icon:"\uD83E\uDDF9",color:"bg-pink-500"},{id:"CARPENTER",name:"Carpenter",icon:"\uD83E\uDE9A",color:"bg-orange-500"},{id:"HOUSE_PAINTER",name:"House Painter",icon:"\uD83C\uDFA8",color:"bg-purple-500"},{id:"HOUSE_CLEANER",name:"House Cleaning",icon:"\uD83E\uDDFD",color:"bg-teal-500"},{id:"LOCKSMITH",name:"Locksmith",icon:"\uD83D\uDD10",color:"bg-red-500"}],o=[{tier:"BASIC",name:"Basic",price:99,features:{bookingPriority:!0,freeVisits:1,discount:10,support:"24x7 Support",extras:[]}},{tier:"PREMIUM",name:"Premium",price:199,features:{bookingPriority:!0,freeVisits:2,discount:20,support:"24x7 Support",extras:["Service Reminders"]}},{tier:"VIP",name:"VIP",price:299,features:{bookingPriority:!0,freeVisits:4,discount:30,support:"24x7 Support",extras:["Service Reminders","Annual Health Check"]}}]}},e=>{e.O(0,[4921,8441,3794,7358],()=>e(e.s=2053)),_N_E=e.O()}]);