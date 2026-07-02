(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8365],{3321:(e,t,r)=>{"use strict";var a=r(4645);r.o(a,"useParams")&&r.d(t,{useParams:function(){return a.useParams}}),r.o(a,"usePathname")&&r.d(t,{usePathname:function(){return a.usePathname}}),r.o(a,"useRouter")&&r.d(t,{useRouter:function(){return a.useRouter}}),r.o(a,"useSearchParams")&&r.d(t,{useSearchParams:function(){return a.useSearchParams}})},6795:(e,t,r)=>{Promise.resolve().then(r.bind(r,8341))},8341:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>l});var a=r(5155),i=r(2115),s=r(8599),o=r(8434),n=r(3321);function l(){let e=(0,n.useRouter)(),[t,r]=(0,i.useState)(null),l=async t=>{r(t);try{if(!(await fetch("/api/subscriptions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tier:t})})).ok)throw Error("Failed");o.Ay.success(`Subscribed to ${t} plan!`),e.refresh()}catch{o.Ay.error("Subscription failed")}finally{r(null)}};return(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"text-center mb-10",children:[(0,a.jsx)("h1",{className:"text-3xl font-bold text-gray-900",children:"Membership Plans"}),(0,a.jsx)("p",{className:"text-gray-600 mt-2",children:"Choose the plan that fits your home service needs"})]}),(0,a.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto",children:s.i9.map(e=>(0,a.jsxs)("div",{className:`card relative ${"PREMIUM"===e.tier?"ring-2 ring-blue-500 shadow-lg scale-105":""}`,children:["PREMIUM"===e.tier&&(0,a.jsx)("div",{className:"absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-medium",children:"Most Popular"}),(0,a.jsxs)("div",{className:"text-center mb-6",children:[(0,a.jsx)("h2",{className:"text-xl font-bold text-gray-900",children:e.name}),(0,a.jsxs)("p",{className:"text-4xl font-bold text-blue-600 mt-2",children:["₹",e.price,(0,a.jsx)("span",{className:"text-base text-gray-500 font-normal",children:"/mo"})]})]}),(0,a.jsxs)("div",{className:"space-y-3 mb-6",children:[(0,a.jsx)(c,{included:e.features.bookingPriority,label:"Priority Booking"}),(0,a.jsx)(c,{included:!0,label:`${e.features.freeVisits} Free Visit${e.features.freeVisits>1?"s":""} / Month`}),(0,a.jsx)(c,{included:!0,label:`Up to ${e.features.discount}% Discount`}),(0,a.jsx)(c,{included:!0,label:e.features.support}),"BASIC"===e.tier?(0,a.jsx)(c,{included:!1,label:"Service Reminders"}):(0,a.jsx)(c,{included:!0,label:"Service Reminders"}),"VIP"===e.tier?(0,a.jsx)(c,{included:!0,label:"Annual Health Check"}):(0,a.jsx)(c,{included:!1,label:"Annual Health Check"})]}),(0,a.jsx)("button",{onClick:()=>l(e.tier),disabled:t===e.tier,className:`w-full py-3 rounded-xl font-semibold transition-colors ${"VIP"===e.tier?"bg-purple-600 text-white hover:bg-purple-700":"PREMIUM"===e.tier?"bg-blue-600 text-white hover:bg-blue-700":"bg-gray-100 text-gray-800 hover:bg-gray-200"} disabled:opacity-50`,children:t===e.tier?"Subscribing...":`Subscribe ${e.name}`})]},e.tier))}),(0,a.jsxs)("div",{className:"max-w-4xl mx-auto mt-12",children:[(0,a.jsx)("h2",{className:"text-xl font-bold text-gray-900 mb-6 text-center",children:"Feature Comparison"}),(0,a.jsx)("div",{className:"overflow-x-auto card",children:(0,a.jsxs)("table",{className:"w-full text-sm",children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{className:"border-b border-gray-200",children:[(0,a.jsx)("th",{className:"text-left py-3 px-4 font-semibold",children:"Feature"}),(0,a.jsx)("th",{className:"text-center py-3 px-4 font-semibold",children:"Basic (₹99)"}),(0,a.jsx)("th",{className:"text-center py-3 px-4 font-semibold",children:"Premium (₹199)"}),(0,a.jsx)("th",{className:"text-center py-3 px-4 font-semibold",children:"VIP (₹299)"})]})}),(0,a.jsx)("tbody",{children:[{feature:"Booking Priority",basic:"✓",premium:"✓",vip:"✓"},{feature:"Free Visits / Month",basic:"1",premium:"2",vip:"4"},{feature:"Max Discount",basic:"10%",premium:"20%",vip:"30%"},{feature:"24x7 Support",basic:"✓",premium:"✓",vip:"✓"},{feature:"Service Reminders",basic:"-",premium:"✓",vip:"✓"},{feature:"Annual Health Check",basic:"-",premium:"-",vip:"✓"}].map(e=>(0,a.jsxs)("tr",{className:"border-b border-gray-100",children:[(0,a.jsx)("td",{className:"py-3 px-4 text-gray-700",children:e.feature}),(0,a.jsx)("td",{className:"text-center py-3 px-4 font-medium",children:e.basic}),(0,a.jsx)("td",{className:"text-center py-3 px-4 font-medium text-blue-600",children:e.premium}),(0,a.jsx)("td",{className:"text-center py-3 px-4 font-medium text-purple-600",children:e.vip})]},e.feature))})]})})]})]})}function c({included:e,label:t}){return(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsx)("span",{className:e?"text-green-500":"text-gray-300",children:e?"✓":"✗"}),(0,a.jsx)("span",{className:e?"text-gray-700":"text-gray-400",children:t})]})}},8434:(e,t,r)=>{"use strict";let a,i;r.d(t,{Toaster:()=>ee,Ay:()=>et});var s,o=r(2115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,u=(e,t)=>{let r="",a="",i="";for(let s in e){let o=e[s];"@"==s[0]?"i"==s[1]?r=s+" "+o+";":a+="f"==s[1]?u(o,s):s+"{"+u(o,"k"==s[1]?"":t)+"}":"object"==typeof o?a+=u(o,t?t.replace(/([^,])+/g,e=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):s):null!=o&&(s="-"==s[1]?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=u.p?u.p(s,o):s+":"+o+";")}return r+(t&&i?t+"{"+i+"}":i)+a},p={},m=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+m(e[r]);return t}return e};function f(e){let t,r,a=this||{},i=e.call?e(a.p):e;return((e,t,r,a,i)=>{var s;let o=m(e),n=p[o]||(p[o]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(o));if(!p[n]){let t=o!==e?e:(e=>{let t,r,a=[{}];for(;t=l.exec(e.replace(c,""));)t[4]?a.shift():t[3]?(r=t[3].replace(d," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(d," ").trim();return a[0]})(e);p[n]=u(i?{["@keyframes "+n]:t}:t,r?"":"."+n)}let f=r&&p.g;return r&&(p.g=p[n]),s=p[n],f?t.data=t.data.replace(f,s):-1===t.data.indexOf(s)&&(t.data=a?s+t.data:t.data+s),n})(i.unshift?i.raw?(t=[].slice.call(arguments,1),r=a.p,i.reduce((e,a,i)=>{let s=t[i];if(s&&s.call){let e=s(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;s=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+a+(null==s?"":s)},"")):i.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):i,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(a.target),a.g,a.o,a.k)}f.bind({g:1});let b,x,h,g=f.bind({k:1});function y(e,t){let r=this||{};return function(){let a=arguments;function i(s,o){let n=Object.assign({},s),l=n.className||i.className;r.p=Object.assign({theme:x&&x()},n),r.o=/go\d/.test(l),n.className=f.apply(r,a)+(l?" "+l:""),t&&(n.ref=o);let c=e;return e[0]&&(c=n.as||e,delete n.as),h&&c[0]&&h(n),b(c,n)}return t?t(i):i}}var v=(e,t)=>"function"==typeof e?e(t):e,E=(a=0,()=>(++a).toString()),N=()=>{if(void 0===i&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");i=!e||e.matches}return i},w="default",j=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+s}))}}},P=[],C={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},k={},I=(e,t=w)=>{k[t]=j(k[t]||C,e),P.forEach(([e,r])=>{e===t&&r(k[t])})},R=e=>Object.keys(k).forEach(t=>I(e,t)),S=(e=w)=>t=>{I(t,e)},A={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=e=>(t,r)=>{let a,i=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||E()}))(t,e,r);return S(i.toasterId||(a=i.id,Object.keys(k).find(e=>k[e].toasts.some(e=>e.id===a))))({type:2,toast:i}),i.id},O=(e,t)=>D("blank")(e,t);O.error=D("error"),O.success=D("success"),O.loading=D("loading"),O.custom=D("custom"),O.dismiss=(e,t)=>{let r={type:3,toastId:e};t?S(t)(r):R(r)},O.dismissAll=e=>O.dismiss(void 0,e),O.remove=(e,t)=>{let r={type:4,toastId:e};t?S(t)(r):R(r)},O.removeAll=e=>O.remove(void 0,e),O.promise=(e,t,r)=>{let a=O.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let i=t.success?v(t.success,e):void 0;return i?O.success(i,{id:a,...r,...null==r?void 0:r.success}):O.dismiss(a),e}).catch(e=>{let i=t.error?v(t.error,e):void 0;i?O.error(i,{id:a,...r,...null==r?void 0:r.error}):O.dismiss(a)}),e};var M=1e3,$=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,_=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,T=g`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,L=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${$} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${_} 0.15s ease-out forwards;
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
    animation: ${T} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,H=g`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,V=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${H} 1s linear infinite;
`,F=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,z=g`
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
}`,U=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${F} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,W=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,K=g`
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
  animation: ${K} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Y=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?o.createElement(G,null,t):t:"blank"===r?null:o.createElement(W,null,o.createElement(V,{...a}),"loading"!==r&&o.createElement(B,null,"error"===r?o.createElement(L,{...a}):o.createElement(U,{...a})))},q=y("div")`
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
`,X=o.memo(({toast:e,position:t,style:r,children:a})=>{let i=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,i]=N()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},s=o.createElement(Y,{toast:e}),n=o.createElement(J,{...e.ariaProps},v(e.message,e));return o.createElement(q,{className:e.className,style:{...i,...r,...e.style}},"function"==typeof a?a({icon:s,message:n}):o.createElement(o.Fragment,null,s,n))});s=o.createElement,u.p=void 0,b=s,x=void 0,h=void 0;var Z=({id:e,className:t,style:r,onHeightUpdate:a,children:i})=>{let s=o.useCallback(t=>{if(t){let r=()=>{a(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return o.createElement("div",{ref:s,className:t,style:r},i)},Q=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:i,toasterId:s,containerStyle:n,containerClassName:l})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:r,pausedAt:a}=((e={},t=w)=>{let[r,a]=(0,o.useState)(k[t]||C),i=(0,o.useRef)(k[t]);(0,o.useEffect)(()=>(i.current!==k[t]&&a(k[t]),P.push([t,a]),()=>{let e=P.findIndex(([e])=>e===t);e>-1&&P.splice(e,1)}),[t]);let s=r.toasts.map(t=>{var r,a,i;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||A[t.type],style:{...e.style,...null==(i=e[t.type])?void 0:i.style,...t.style}}});return{...r,toasts:s}})(e,t),i=(0,o.useRef)(new Map).current,s=(0,o.useCallback)((e,t=M)=>{if(i.has(e))return;let r=setTimeout(()=>{i.delete(e),n({type:4,toastId:e})},t);i.set(e,r)},[]);(0,o.useEffect)(()=>{if(a)return;let e=Date.now(),i=r.map(r=>{if(r.duration===1/0)return;let a=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(a<0){r.visible&&O.dismiss(r.id);return}return setTimeout(()=>O.dismiss(r.id,t),a)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[r,a,t]);let n=(0,o.useCallback)(S(t),[t]),l=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),c=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=(0,o.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:i=8,defaultPosition:s}=t||{},o=r.filter(t=>(t.position||s)===(e.position||s)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+i,0)},[r]);return(0,o.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)s(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[r,s]),{toasts:r,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}})(r,s);return o.createElement("div",{"data-rht-toaster":s||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(r=>{let s,n,l=r.position||t,c=d.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}),u=(s=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:N()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...n});return o.createElement(Z,{id:r.id,key:r.id,onHeightUpdate:d.updateHeight,className:r.visible?Q:"",style:u},"custom"===r.type?v(r.message,r):i?i(r):o.createElement(X,{toast:r,position:l}))}))},et=O},8599:(e,t,r)=>{"use strict";function a(e){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(e)}function i(e){return({PENDING:"bg-yellow-100 text-yellow-800",CONFIRMED:"bg-blue-100 text-blue-800",WORKER_ASSIGNED:"bg-indigo-100 text-indigo-800",WORKER_ON_THE_WAY:"bg-purple-100 text-purple-800",SERVICE_STARTED:"bg-orange-100 text-orange-800",COMPLETED:"bg-green-100 text-green-800",CANCELLED:"bg-red-100 text-red-800"})[e]||"bg-gray-100 text-gray-800"}function s(e){return({PENDING:"Pending",CONFIRMED:"Confirmed",WORKER_ASSIGNED:"Worker Assigned",WORKER_ON_THE_WAY:"Worker On The Way",SERVICE_STARTED:"Service Started",COMPLETED:"Completed",CANCELLED:"Cancelled"})[e]||e}r.d(t,{Xt:()=>o,i9:()=>n,ps:()=>s,qY:()=>i,vv:()=>a});let o=[{id:"PLUMBER",name:"Plumber",icon:"\uD83D\uDD27",color:"bg-blue-500"},{id:"ELECTRICIAN",name:"Electrician",icon:"⚡",color:"bg-yellow-500"},{id:"DRIVER",name:"Driver",icon:"\uD83D\uDE97",color:"bg-green-500"},{id:"MAID",name:"Maid/Bai",icon:"\uD83E\uDDF9",color:"bg-pink-500"},{id:"CARPENTER",name:"Carpenter",icon:"\uD83E\uDE9A",color:"bg-orange-500"},{id:"HOUSE_PAINTER",name:"House Painter",icon:"\uD83C\uDFA8",color:"bg-purple-500"},{id:"HOUSE_CLEANER",name:"House Cleaning",icon:"\uD83E\uDDFD",color:"bg-teal-500"},{id:"LOCKSMITH",name:"Locksmith",icon:"\uD83D\uDD10",color:"bg-red-500"}],n=[{tier:"BASIC",name:"Basic",price:99,features:{bookingPriority:!0,freeVisits:1,discount:10,support:"24x7 Support",extras:[]}},{tier:"PREMIUM",name:"Premium",price:199,features:{bookingPriority:!0,freeVisits:2,discount:20,support:"24x7 Support",extras:["Service Reminders"]}},{tier:"VIP",name:"VIP",price:299,features:{bookingPriority:!0,freeVisits:4,discount:30,support:"24x7 Support",extras:["Service Reminders","Annual Health Check"]}}]}},e=>{e.O(0,[8441,3794,7358],()=>e(e.s=6795)),_N_E=e.O()}]);