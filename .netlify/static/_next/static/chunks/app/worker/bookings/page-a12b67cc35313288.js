(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9694],{1148:(e,t,a)=>{Promise.resolve().then(a.bind(a,7038))},7038:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>l});var s=a(5155),r=a(2115),i=a(8599),o=a(4921),n=a(8434);function l(){let{data:e}=(0,o.wV)(),[t,a]=(0,r.useState)([]),[l,c]=(0,r.useState)(""),[d,u]=(0,r.useState)(!0);(0,r.useEffect)(()=>{let e=l?`?status=${l}`:"";fetch(`/api/bookings${e}`).then(e=>e.json()).then(e=>{a(e.bookings||[]),u(!1)}).catch(()=>u(!1))},[l]);let p=async t=>{try{if(!(await fetch(`/api/bookings/${t}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"WORKER_ASSIGNED",workerId:e?.user?.id})})).ok)throw Error();n.Ay.success("Job accepted!"),c("")}catch{n.Ay.error("Failed to accept")}},m=async e=>{try{await fetch(`/api/bookings/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"CANCELLED",cancellationReason:"Worker rejected"})}),n.Ay.success("Job rejected"),c("")}catch{n.Ay.error("Failed to reject")}},f=async(e,t)=>{try{await fetch(`/api/bookings/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:t})}),n.Ay.success(`Status updated to ${(0,i.ps)(t)}`),c("")}catch{n.Ay.error("Failed to update")}},g={WORKER_ASSIGNED:"WORKER_ON_THE_WAY",WORKER_ON_THE_WAY:"SERVICE_STARTED",SERVICE_STARTED:"COMPLETED"};return(0,s.jsxs)("div",{children:[(0,s.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-6",children:"My Jobs"}),(0,s.jsx)("div",{className:"flex gap-2 mb-6 overflow-x-auto",children:[{value:"",label:"All"},{value:"PENDING",label:"New Requests"},{value:"WORKER_ASSIGNED",label:"Accepted"},{value:"COMPLETED",label:"Completed"},{value:"CANCELLED",label:"Cancelled"}].map(e=>(0,s.jsx)("button",{onClick:()=>c(e.value),className:`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${l===e.value?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`,children:e.label},e.value))}),d?(0,s.jsx)("div",{className:"space-y-3",children:[1,2,3].map(e=>(0,s.jsx)("div",{className:"card animate-pulse h-24"},e))}):0===t.length?(0,s.jsxs)("div",{className:"text-center py-16",children:[(0,s.jsx)("p",{className:"text-5xl mb-4",children:"\uD83D\uDCCB"}),(0,s.jsx)("h3",{className:"text-xl font-semibold text-gray-900 mb-2",children:"No jobs found"}),(0,s.jsx)("p",{className:"text-gray-500",children:"New bookings will appear here"})]}):(0,s.jsx)("div",{className:"space-y-3",children:t.map(e=>(0,s.jsxs)("div",{className:"card",children:[(0,s.jsx)("div",{className:"flex items-start justify-between",children:(0,s.jsxs)("div",{className:"flex-1",children:[(0,s.jsxs)("div",{className:"flex items-center gap-3 mb-2",children:[(0,s.jsx)("span",{className:"font-semibold text-gray-900",children:e.service.name}),(0,s.jsx)("span",{className:`badge ${(0,i.qY)(e.status)}`,children:(0,i.ps)(e.status)})]}),(0,s.jsxs)("div",{className:"grid grid-cols-2 gap-2 text-sm text-gray-600",children:[(0,s.jsxs)("p",{children:["\uD83D\uDCC5 ",new Date(e.scheduledDate).toLocaleDateString()," at ",e.timeSlot]}),(0,s.jsxs)("p",{children:["\uD83D\uDCCD ",e.address]}),(0,s.jsxs)("p",{children:["\uD83D\uDC64 ",e.customer.name||"Customer"," - ",e.customer.phone]}),(0,s.jsxs)("p",{children:["\uD83D\uDCB0 ",(0,i.vv)(e.finalAmount)]})]})]})}),(0,s.jsxs)("div",{className:"flex gap-2 mt-4 pt-3 border-t border-gray-100",children:["PENDING"===e.status&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("button",{onClick:()=>p(e.id),className:"btn-primary text-sm",children:"Accept Job"}),(0,s.jsx)("button",{onClick:()=>m(e.id),className:"btn-secondary text-sm",children:"Reject"})]}),g[e.status]&&(0,s.jsxs)("button",{onClick:()=>f(e.id,g[e.status]),className:"btn-primary text-sm",children:["Mark as ",(0,i.ps)(g[e.status])]})]})]},e.id))})]})}},8434:(e,t,a)=>{"use strict";let s,r;a.d(t,{Toaster:()=>ee,Ay:()=>et});var i,o=a(2115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,u=(e,t)=>{let a="",s="",r="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+o+";":s+="f"==i[1]?u(o,i):i+"{"+u(o,"k"==i[1]?"":t)+"}":"object"==typeof o?s+=u(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=u.p?u.p(i,o):i+":"+o+";")}return a+(t&&r?t+"{"+r+"}":r)+s},p={},m=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+m(e[a]);return t}return e};function f(e){let t,a,s=this||{},r=e.call?e(s.p):e;return((e,t,a,s,r)=>{var i;let o=m(e),n=p[o]||(p[o]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(o));if(!p[n]){let t=o!==e?e:(e=>{let t,a,s=[{}];for(;t=l.exec(e.replace(c,""));)t[4]?s.shift():t[3]?(a=t[3].replace(d," ").trim(),s.unshift(s[0][a]=s[0][a]||{})):s[0][t[1]]=t[2].replace(d," ").trim();return s[0]})(e);p[n]=u(r?{["@keyframes "+n]:t}:t,a?"":"."+n)}let f=a&&p.g;return a&&(p.g=p[n]),i=p[n],f?t.data=t.data.replace(f,i):-1===t.data.indexOf(i)&&(t.data=s?i+t.data:t.data+i),n})(r.unshift?r.raw?(t=[].slice.call(arguments,1),a=s.p,r.reduce((e,s,r)=>{let i=t[r];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+s+(null==i?"":i)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(s.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(s.target),s.g,s.o,s.k)}f.bind({g:1});let g,b,y,h=f.bind({k:1});function x(e,t){let a=this||{};return function(){let s=arguments;function r(i,o){let n=Object.assign({},i),l=n.className||r.className;a.p=Object.assign({theme:b&&b()},n),a.o=/go\d/.test(l),n.className=f.apply(a,s)+(l?" "+l:""),t&&(n.ref=o);let c=e;return e[0]&&(c=n.as||e,delete n.as),y&&c[0]&&y(n),g(c,n)}return t?t(r):r}}var v=(e,t)=>"function"==typeof e?e(t):e,E=(s=0,()=>(++s).toString()),N=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},w="default",C=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return C(e,{type:+!!e.toasts.find(e=>e.id===s.id),toast:s});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},j=[],A={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},k={},R=(e,t=w)=>{k[t]=C(k[t]||A,e),j.forEach(([e,a])=>{e===t&&a(k[t])})},D=e=>Object.keys(k).forEach(t=>R(e,t)),S=(e=w)=>t=>{R(t,e)},O={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},I=e=>(t,a)=>{let s,r=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||E()}))(t,e,a);return S(r.toasterId||(s=r.id,Object.keys(k).find(e=>k[e].toasts.some(e=>e.id===s))))({type:2,toast:r}),r.id},_=(e,t)=>I("blank")(e,t);_.error=I("error"),_.success=I("success"),_.loading=I("loading"),_.custom=I("custom"),_.dismiss=(e,t)=>{let a={type:3,toastId:e};t?S(t)(a):D(a)},_.dismissAll=e=>_.dismiss(void 0,e),_.remove=(e,t)=>{let a={type:4,toastId:e};t?S(t)(a):D(a)},_.removeAll=e=>_.remove(void 0,e),_.promise=(e,t,a)=>{let s=_.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?v(t.success,e):void 0;return r?_.success(r,{id:s,...a,...null==a?void 0:a.success}):_.dismiss(s),e}).catch(e=>{let r=t.error?v(t.error,e):void 0;r?_.error(r,{id:s,...a,...null==a?void 0:a.error}):_.dismiss(s)}),e};var T=1e3,P=h`
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
}`,L=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,M=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${P} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
    animation: ${L} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,H=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,W=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${H} 1s linear infinite;
`,F=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,V=h`
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
}`,z=x("div")`
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
    animation: ${V} 0.2s ease-out forwards;
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
`,K=x("div")`
  position: absolute;
`,G=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,J=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Y=x("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${J} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,U=({toast:e})=>{let{icon:t,type:a,iconTheme:s}=e;return void 0!==t?"string"==typeof t?o.createElement(Y,null,t):t:"blank"===a?null:o.createElement(G,null,o.createElement(W,{...s}),"loading"!==a&&o.createElement(K,null,"error"===a?o.createElement(M,{...s}):o.createElement(z,{...s})))},B=x("div")`
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
`,q=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,X=o.memo(({toast:e,position:t,style:a,children:s})=>{let r=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[s,r]=N()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${h(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(U,{toast:e}),n=o.createElement(q,{...e.ariaProps},v(e.message,e));return o.createElement(B,{className:e.className,style:{...r,...a,...e.style}},"function"==typeof s?s({icon:i,message:n}):o.createElement(o.Fragment,null,i,n))});i=o.createElement,u.p=void 0,g=i,b=void 0,y=void 0;var Z=({id:e,className:t,style:a,onHeightUpdate:s,children:r})=>{let i=o.useCallback(t=>{if(t){let a=()=>{s(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return o.createElement("div",{ref:i,className:t,style:a},r)},Q=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:s,children:r,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:a,pausedAt:s}=((e={},t=w)=>{let[a,s]=(0,o.useState)(k[t]||A),r=(0,o.useRef)(k[t]);(0,o.useEffect)(()=>(r.current!==k[t]&&s(k[t]),j.push([t,s]),()=>{let e=j.findIndex(([e])=>e===t);e>-1&&j.splice(e,1)}),[t]);let i=a.toasts.map(t=>{var a,s,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||O[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...a,toasts:i}})(e,t),r=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=T)=>{if(r.has(e))return;let a=setTimeout(()=>{r.delete(e),n({type:4,toastId:e})},t);r.set(e,a)},[]);(0,o.useEffect)(()=>{if(s)return;let e=Date.now(),r=a.map(a=>{if(a.duration===1/0)return;let s=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(s<0){a.visible&&_.dismiss(a.id);return}return setTimeout(()=>_.dismiss(a.id,t),s)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[a,s,t]);let n=(0,o.useCallback)(S(t),[t]),l=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),c=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=(0,o.useCallback)(()=>{s&&n({type:6,time:Date.now()})},[s,n]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:s=!1,gutter:r=8,defaultPosition:i}=t||{},o=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...s?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[a]);return(0,o.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[a,i]),{toasts:a,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}})(a,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(a=>{let i,n,l=a.position||t,c=d.calculateOffset(a,{reverseOrder:e,gutter:s,defaultPosition:t}),u=(i=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:N()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return o.createElement(Z,{id:a.id,key:a.id,onHeightUpdate:d.updateHeight,className:a.visible?Q:"",style:u},"custom"===a.type?v(a.message,a):r?r(a):o.createElement(X,{toast:a,position:l}))}))},et=_},8599:(e,t,a)=>{"use strict";function s(e){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(e)}function r(e){return({PENDING:"bg-yellow-100 text-yellow-800",CONFIRMED:"bg-blue-100 text-blue-800",WORKER_ASSIGNED:"bg-indigo-100 text-indigo-800",WORKER_ON_THE_WAY:"bg-purple-100 text-purple-800",SERVICE_STARTED:"bg-orange-100 text-orange-800",COMPLETED:"bg-green-100 text-green-800",CANCELLED:"bg-red-100 text-red-800"})[e]||"bg-gray-100 text-gray-800"}function i(e){return({PENDING:"Pending",CONFIRMED:"Confirmed",WORKER_ASSIGNED:"Worker Assigned",WORKER_ON_THE_WAY:"Worker On The Way",SERVICE_STARTED:"Service Started",COMPLETED:"Completed",CANCELLED:"Cancelled"})[e]||e}a.d(t,{Xt:()=>o,i9:()=>n,ps:()=>i,qY:()=>r,vv:()=>s});let o=[{id:"PLUMBER",name:"Plumber",icon:"\uD83D\uDD27",color:"bg-blue-500"},{id:"ELECTRICIAN",name:"Electrician",icon:"⚡",color:"bg-yellow-500"},{id:"DRIVER",name:"Driver",icon:"\uD83D\uDE97",color:"bg-green-500"},{id:"MAID",name:"Maid/Bai",icon:"\uD83E\uDDF9",color:"bg-pink-500"},{id:"CARPENTER",name:"Carpenter",icon:"\uD83E\uDE9A",color:"bg-orange-500"},{id:"HOUSE_PAINTER",name:"House Painter",icon:"\uD83C\uDFA8",color:"bg-purple-500"},{id:"HOUSE_CLEANER",name:"House Cleaning",icon:"\uD83E\uDDFD",color:"bg-teal-500"},{id:"LOCKSMITH",name:"Locksmith",icon:"\uD83D\uDD10",color:"bg-red-500"}],n=[{tier:"BASIC",name:"Basic",price:99,features:{bookingPriority:!0,freeVisits:1,discount:10,support:"24x7 Support",extras:[]}},{tier:"PREMIUM",name:"Premium",price:199,features:{bookingPriority:!0,freeVisits:2,discount:20,support:"24x7 Support",extras:["Service Reminders"]}},{tier:"VIP",name:"VIP",price:299,features:{bookingPriority:!0,freeVisits:4,discount:30,support:"24x7 Support",extras:["Service Reminders","Annual Health Check"]}}]}},e=>{e.O(0,[4921,8441,3794,7358],()=>e(e.s=1148)),_N_E=e.O()}]);