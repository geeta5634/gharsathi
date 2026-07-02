(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5725],{2543:(e,t,a)=>{Promise.resolve().then(a.bind(a,4546))},4546:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>n});var r=a(5155),s=a(2115),i=a(8599),o=a(8434);function n(){let[e,t]=(0,s.useState)([]),[a,n]=(0,s.useState)(!0),[l,c]=(0,s.useState)(!1),[d,u]=(0,s.useState)({title:"",description:"",type:"REPAIR",serviceDate:"",nextDueDate:"",amount:"",notes:""}),m=()=>{fetch("/api/health-records").then(e=>e.json()).then(e=>{t(e),n(!1)}).catch(()=>n(!1))};(0,s.useEffect)(()=>{m()},[]);let p=async()=>{if(!d.title)return void o.Ay.error("Title is required");try{if(!(await fetch("/api/health-records",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...d,amount:d.amount?parseFloat(d.amount):null,serviceDate:d.serviceDate||null,nextDueDate:d.nextDueDate||null})})).ok)throw Error("Failed to create");o.Ay.success("Record added!"),c(!1),u({title:"",description:"",type:"REPAIR",serviceDate:"",nextDueDate:"",amount:"",notes:""}),m()}catch{o.Ay.error("Failed to create record")}},x=[{value:"REPAIR",label:"\uD83D\uDD27 Repair",color:"bg-blue-50 text-blue-700"},{value:"MAINTENANCE",label:"\uD83D\uDD04 Maintenance",color:"bg-green-50 text-green-700"},{value:"INSTALLATION",label:"\uD83D\uDEE0️ Installation",color:"bg-purple-50 text-purple-700"},{value:"WARRANTY",label:"\uD83D\uDCDC Warranty",color:"bg-yellow-50 text-yellow-700"},{value:"REMINDER",label:"⏰ Reminder",color:"bg-orange-50 text-orange-700"}];return(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h1",{className:"text-3xl font-bold text-gray-900",children:"\uD83C\uDFE5 Ghar Ka Health Record"}),(0,r.jsx)("p",{className:"text-gray-600 mt-1",children:"Track maintenance, repairs, and warranties for your home"})]}),(0,r.jsx)("button",{onClick:()=>c(!l),className:"btn-primary",children:"+ Add Record"})]}),l&&(0,r.jsxs)("div",{className:"card mb-6",children:[(0,r.jsx)("h2",{className:"text-lg font-semibold mb-4",children:"New Record"}),(0,r.jsxs)("div",{className:"space-y-4",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Title *"}),(0,r.jsx)("input",{type:"text",value:d.title,onChange:e=>u({...d,title:e.target.value}),placeholder:"e.g., AC Servicing, Water Tank Cleaning",className:"input-field"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Type"}),(0,r.jsx)("div",{className:"flex flex-wrap gap-2",children:x.map(e=>(0,r.jsx)("button",{onClick:()=>u({...d,type:e.value}),className:`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${d.type===e.value?e.color:"bg-gray-100 text-gray-600"}`,children:e.label},e.value))})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Description"}),(0,r.jsx)("textarea",{value:d.description,onChange:e=>u({...d,description:e.target.value}),rows:2,className:"input-field resize-none"})]}),(0,r.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Service Date"}),(0,r.jsx)("input",{type:"date",value:d.serviceDate,onChange:e=>u({...d,serviceDate:e.target.value}),className:"input-field"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Next Due Date"}),(0,r.jsx)("input",{type:"date",value:d.nextDueDate,onChange:e=>u({...d,nextDueDate:e.target.value}),className:"input-field"})]})]}),(0,r.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Amount (₹)"}),(0,r.jsx)("input",{type:"number",value:d.amount,onChange:e=>u({...d,amount:e.target.value}),placeholder:"0",className:"input-field"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Notes"}),(0,r.jsx)("input",{type:"text",value:d.notes,onChange:e=>u({...d,notes:e.target.value}),placeholder:"Any additional notes",className:"input-field"})]})]}),(0,r.jsx)("button",{onClick:p,className:"btn-primary w-full",children:"Save Record"})]})]}),a?(0,r.jsx)("div",{className:"space-y-3",children:[1,2,3].map(e=>(0,r.jsx)("div",{className:"card animate-pulse h-16"},e))}):0===e.length?(0,r.jsxs)("div",{className:"text-center py-16",children:[(0,r.jsx)("p",{className:"text-5xl mb-4",children:"\uD83C\uDFE0"}),(0,r.jsx)("h3",{className:"text-xl font-semibold text-gray-900 mb-2",children:"No health records yet"}),(0,r.jsx)("p",{className:"text-gray-500",children:"Track your home maintenance history here"})]}):(0,r.jsx)("div",{className:"space-y-3",children:e.map(e=>{let t=x.find(t=>t.value===e.type)||x[0];return(0,r.jsx)("div",{className:"card hover:shadow-md transition-shadow",children:(0,r.jsx)("div",{className:"flex items-start justify-between",children:(0,r.jsxs)("div",{className:"flex items-start gap-3",children:[(0,r.jsx)("span",{className:`px-2 py-1 rounded-lg text-sm ${t.color}`,children:t.label.split(" ")[0]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h3",{className:"font-semibold text-gray-900",children:e.title}),e.description&&(0,r.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:e.description}),(0,r.jsxs)("div",{className:"flex items-center gap-4 mt-2 text-xs text-gray-500",children:[e.serviceDate&&(0,r.jsxs)("span",{children:["Service: ",new Date(e.serviceDate).toLocaleDateString()]}),e.nextDueDate&&(0,r.jsxs)("span",{className:"text-orange-600 font-medium",children:["Next due: ",new Date(e.nextDueDate).toLocaleDateString()]}),e.amount&&(0,r.jsxs)("span",{children:["Cost: ",(0,i.vv)(e.amount)]})]}),e.notes&&(0,r.jsxs)("p",{className:"text-xs text-gray-400 mt-1",children:["\uD83D\uDCDD ",e.notes]})]})]})})},e.id)})})]})}},8434:(e,t,a)=>{"use strict";let r,s;a.d(t,{Toaster:()=>ee,Ay:()=>et});var i,o=a(2115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,u=(e,t)=>{let a="",r="",s="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+o+";":r+="f"==i[1]?u(o,i):i+"{"+u(o,"k"==i[1]?"":t)+"}":"object"==typeof o?r+=u(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=u.p?u.p(i,o):i+":"+o+";")}return a+(t&&s?t+"{"+s+"}":s)+r},m={},p=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+p(e[a]);return t}return e};function x(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var i;let o=p(e),n=m[o]||(m[o]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(o));if(!m[n]){let t=o!==e?e:(e=>{let t,a,r=[{}];for(;t=l.exec(e.replace(c,""));)t[4]?r.shift():t[3]?(a=t[3].replace(d," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(d," ").trim();return r[0]})(e);m[n]=u(s?{["@keyframes "+n]:t}:t,a?"":"."+n)}let x=a&&m.g;return a&&(m.g=m[n]),i=m[n],x?t.data=t.data.replace(x,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),n})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let i=t[s];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(r.target),r.g,r.o,r.k)}x.bind({g:1});let f,g,h,b=x.bind({k:1});function y(e,t){let a=this||{};return function(){let r=arguments;function s(i,o){let n=Object.assign({},i),l=n.className||s.className;a.p=Object.assign({theme:g&&g()},n),a.o=/go\d/.test(l),n.className=x.apply(a,r)+(l?" "+l:""),t&&(n.ref=o);let c=e;return e[0]&&(c=n.as||e,delete n.as),h&&c[0]&&h(n),f(c,n)}return t?t(s):s}}var v=(e,t)=>"function"==typeof e?e(t):e,N=(r=0,()=>(++r).toString()),E=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},j="default",D=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return D(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},w=[],C={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},k={},R=(e,t=j)=>{k[t]=D(k[t]||C,e),w.forEach(([e,a])=>{e===t&&a(k[t])})},A=e=>Object.keys(k).forEach(t=>R(e,t)),I=(e=j)=>t=>{R(t,e)},S={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||N()}))(t,e,a);return I(s.toasterId||(r=s.id,Object.keys(k).find(e=>k[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},T=(e,t)=>O("blank")(e,t);T.error=O("error"),T.success=O("success"),T.loading=O("loading"),T.custom=O("custom"),T.dismiss=(e,t)=>{let a={type:3,toastId:e};t?I(t)(a):A(a)},T.dismissAll=e=>T.dismiss(void 0,e),T.remove=(e,t)=>{let a={type:4,toastId:e};t?I(t)(a):A(a)},T.removeAll=e=>T.remove(void 0,e),T.promise=(e,t,a)=>{let r=T.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?v(t.success,e):void 0;return s?T.success(s,{id:r,...a,...null==a?void 0:a.success}):T.dismiss(r),e}).catch(e=>{let s=t.error?v(t.error,e):void 0;s?T.error(s,{id:r,...a,...null==a?void 0:a.error}):T.dismiss(r)}),e};var P=1e3,_=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,L=b`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,$=b`
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
`,H=b`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,F=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${H} 1s linear infinite;
`,W=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,z=b`
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

  animation: ${W} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,K=y("div")`
  position: absolute;
`,U=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,B=b`
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
  animation: ${B} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Y=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?o.createElement(G,null,t):t:"blank"===a?null:o.createElement(U,null,o.createElement(F,{...r}),"loading"!==a&&o.createElement(K,null,"error"===a?o.createElement(M,{...r}):o.createElement(V,{...r})))},q=y("div")`
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
`,X=o.memo(({toast:e,position:t,style:a,children:r})=>{let s=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,s]=E()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${b(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${b(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(Y,{toast:e}),n=o.createElement(J,{...e.ariaProps},v(e.message,e));return o.createElement(q,{className:e.className,style:{...s,...a,...e.style}},"function"==typeof r?r({icon:i,message:n}):o.createElement(o.Fragment,null,i,n))});i=o.createElement,u.p=void 0,f=i,g=void 0,h=void 0;var Z=({id:e,className:t,style:a,onHeightUpdate:r,children:s})=>{let i=o.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return o.createElement("div",{ref:i,className:t,style:a},s)},Q=x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:s,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=j)=>{let[a,r]=(0,o.useState)(k[t]||C),s=(0,o.useRef)(k[t]);(0,o.useEffect)(()=>(s.current!==k[t]&&r(k[t]),w.push([t,r]),()=>{let e=w.findIndex(([e])=>e===t);e>-1&&w.splice(e,1)}),[t]);let i=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||S[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:i}})(e,t),s=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=P)=>{if(s.has(e))return;let a=setTimeout(()=>{s.delete(e),n({type:4,toastId:e})},t);s.set(e,a)},[]);(0,o.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&T.dismiss(a.id);return}return setTimeout(()=>T.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let n=(0,o.useCallback)(I(t),[t]),l=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),c=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=(0,o.useCallback)(()=>{r&&n({type:6,time:Date.now()})},[r,n]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:i}=t||{},o=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,o.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=s.get(e.id);t&&(clearTimeout(t),s.delete(e.id))}})},[a,i]),{toasts:a,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}})(a,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(a=>{let i,n,l=a.position||t,c=d.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(i=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:E()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return o.createElement(Z,{id:a.id,key:a.id,onHeightUpdate:d.updateHeight,className:a.visible?Q:"",style:u},"custom"===a.type?v(a.message,a):s?s(a):o.createElement(X,{toast:a,position:l}))}))},et=T},8599:(e,t,a)=>{"use strict";function r(e){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(e)}function s(e){return({PENDING:"bg-yellow-100 text-yellow-800",CONFIRMED:"bg-blue-100 text-blue-800",WORKER_ASSIGNED:"bg-indigo-100 text-indigo-800",WORKER_ON_THE_WAY:"bg-purple-100 text-purple-800",SERVICE_STARTED:"bg-orange-100 text-orange-800",COMPLETED:"bg-green-100 text-green-800",CANCELLED:"bg-red-100 text-red-800"})[e]||"bg-gray-100 text-gray-800"}function i(e){return({PENDING:"Pending",CONFIRMED:"Confirmed",WORKER_ASSIGNED:"Worker Assigned",WORKER_ON_THE_WAY:"Worker On The Way",SERVICE_STARTED:"Service Started",COMPLETED:"Completed",CANCELLED:"Cancelled"})[e]||e}a.d(t,{Xt:()=>o,i9:()=>n,ps:()=>i,qY:()=>s,vv:()=>r});let o=[{id:"PLUMBER",name:"Plumber",icon:"\uD83D\uDD27",color:"bg-blue-500"},{id:"ELECTRICIAN",name:"Electrician",icon:"⚡",color:"bg-yellow-500"},{id:"DRIVER",name:"Driver",icon:"\uD83D\uDE97",color:"bg-green-500"},{id:"MAID",name:"Maid/Bai",icon:"\uD83E\uDDF9",color:"bg-pink-500"},{id:"CARPENTER",name:"Carpenter",icon:"\uD83E\uDE9A",color:"bg-orange-500"},{id:"HOUSE_PAINTER",name:"House Painter",icon:"\uD83C\uDFA8",color:"bg-purple-500"},{id:"HOUSE_CLEANER",name:"House Cleaning",icon:"\uD83E\uDDFD",color:"bg-teal-500"},{id:"LOCKSMITH",name:"Locksmith",icon:"\uD83D\uDD10",color:"bg-red-500"}],n=[{tier:"BASIC",name:"Basic",price:99,features:{bookingPriority:!0,freeVisits:1,discount:10,support:"24x7 Support",extras:[]}},{tier:"PREMIUM",name:"Premium",price:199,features:{bookingPriority:!0,freeVisits:2,discount:20,support:"24x7 Support",extras:["Service Reminders"]}},{tier:"VIP",name:"VIP",price:299,features:{bookingPriority:!0,freeVisits:4,discount:30,support:"24x7 Support",extras:["Service Reminders","Annual Health Check"]}}]}},e=>{e.O(0,[8441,3794,7358],()=>e(e.s=2543)),_N_E=e.O()}]);