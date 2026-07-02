(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2678],{994:(e,t,a)=>{Promise.resolve().then(a.bind(a,6534))},3321:(e,t,a)=>{"use strict";var r=a(4645);a.o(r,"useParams")&&a.d(t,{useParams:function(){return r.useParams}}),a.o(r,"usePathname")&&a.d(t,{usePathname:function(){return r.usePathname}}),a.o(r,"useRouter")&&a.d(t,{useRouter:function(){return r.useRouter}}),a.o(r,"useSearchParams")&&a.d(t,{useSearchParams:function(){return r.useSearchParams}})},6534:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>u});var r=a(5155),s=a(2115),i=a(4921),o=a(3321),l=a(8500),n=a.n(l),d=a(8434);let c=[{value:"PLUMBER",label:"Plumber"},{value:"ELECTRICIAN",label:"Electrician"},{value:"DRIVER",label:"Driver"},{value:"MAID",label:"Maid/Bai"},{value:"CARPENTER",label:"Carpenter"},{value:"HOUSE_PAINTER",label:"House Painter"},{value:"HOUSE_CLEANER",label:"House Cleaning"},{value:"LOCKSMITH",label:"Locksmith"}];function u(){let e=(0,o.useRouter)(),[t,a]=(0,s.useState)(""),[l,u]=(0,s.useState)(""),[m,p]=(0,s.useState)("PLUMBER"),[f,h]=(0,s.useState)(!1),g=async()=>{if(t.length<10||!l)return void d.Ay.error("Please fill all fields");h(!0);try{let a=await (0,i.Jv)("credentials",{phone:t,otp:"123456",role:"WORKER",serviceCategory:m,redirect:!1});if(a?.error)return void d.Ay.error("Registration failed");d.Ay.success("Registration successful!"),e.push("/worker/dashboard")}catch{d.Ay.error("Registration failed")}finally{h(!1)}};return(0,r.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4",children:(0,r.jsxs)("div",{className:"w-full max-w-md",children:[(0,r.jsxs)("div",{className:"text-center mb-8",children:[(0,r.jsx)("h1",{className:"text-4xl font-bold text-blue-600",children:"GharSathi"}),(0,r.jsx)("p",{className:"text-gray-600 mt-2",children:"Join as a Service Professional"})]}),(0,r.jsxs)("div",{className:"card",children:[(0,r.jsx)("h2",{className:"text-xl font-semibold mb-6",children:"Worker Registration"}),(0,r.jsxs)("div",{className:"space-y-4",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Full Name"}),(0,r.jsx)("input",{type:"text",value:l,onChange:e=>u(e.target.value),placeholder:"Enter your full name",className:"input-field"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Phone Number"}),(0,r.jsx)("input",{type:"tel",value:t,onChange:e=>a(e.target.value.replace(/\D/g,"").slice(0,10)),placeholder:"Enter your 10-digit phone number",className:"input-field",maxLength:10})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Service Category"}),(0,r.jsx)("select",{value:m,onChange:e=>p(e.target.value),className:"input-field",children:c.map(e=>(0,r.jsx)("option",{value:e.value,children:e.label},e.value))})]}),(0,r.jsx)("button",{onClick:g,disabled:f||!l||t.length<10,className:"btn-primary w-full",children:f?"Registering...":"Register & Login"})]}),(0,r.jsxs)("p",{className:"text-center text-sm text-gray-500 mt-4",children:["Already registered?"," ",(0,r.jsx)(n(),{href:"/login",className:"text-blue-600 hover:underline",children:"Login here"})]})]})]})})}},8434:(e,t,a)=>{"use strict";let r,s;a.d(t,{Toaster:()=>ee,Ay:()=>et});var i,o=a(2115);let l={data:""},n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,u=(e,t)=>{let a="",r="",s="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+o+";":r+="f"==i[1]?u(o,i):i+"{"+u(o,"k"==i[1]?"":t)+"}":"object"==typeof o?r+=u(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=u.p?u.p(i,o):i+":"+o+";")}return a+(t&&s?t+"{"+s+"}":s)+r},m={},p=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+p(e[a]);return t}return e};function f(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var i;let o=p(e),l=m[o]||(m[o]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(o));if(!m[l]){let t=o!==e?e:(e=>{let t,a,r=[{}];for(;t=n.exec(e.replace(d,""));)t[4]?r.shift():t[3]?(a=t[3].replace(c," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(c," ").trim();return r[0]})(e);m[l]=u(s?{["@keyframes "+l]:t}:t,a?"":"."+l)}let f=a&&m.g;return a&&(m.g=m[l]),i=m[l],f?t.data=t.data.replace(f,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),l})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let i=t[s];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||l})(r.target),r.g,r.o,r.k)}f.bind({g:1});let h,g,b,y=f.bind({k:1});function v(e,t){let a=this||{};return function(){let r=arguments;function s(i,o){let l=Object.assign({},i),n=l.className||s.className;a.p=Object.assign({theme:g&&g()},l),a.o=/go\d/.test(n),l.className=f.apply(a,r)+(n?" "+n:""),t&&(l.ref=o);let d=e;return e[0]&&(d=l.as||e,delete l.as),b&&d[0]&&b(l),h(d,l)}return t?t(s):s}}var x=(e,t)=>"function"==typeof e?e(t):e,w=(r=0,()=>(++r).toString()),E=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},N="default",j=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},k=[],C={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},P={},R=(e,t=N)=>{P[t]=j(P[t]||C,e),k.forEach(([e,a])=>{e===t&&a(P[t])})},A=e=>Object.keys(P).forEach(t=>R(e,t)),O=(e=N)=>t=>{R(t,e)},$={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||w()}))(t,e,a);return O(s.toasterId||(r=s.id,Object.keys(P).find(e=>P[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},S=(e,t)=>D("blank")(e,t);S.error=D("error"),S.success=D("success"),S.loading=D("loading"),S.custom=D("custom"),S.dismiss=(e,t)=>{let a={type:3,toastId:e};t?O(t)(a):A(a)},S.dismissAll=e=>S.dismiss(void 0,e),S.remove=(e,t)=>{let a={type:4,toastId:e};t?O(t)(a):A(a)},S.removeAll=e=>S.remove(void 0,e),S.promise=(e,t,a)=>{let r=S.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?x(t.success,e):void 0;return s?S.success(s,{id:r,...a,...null==a?void 0:a.success}):S.dismiss(r),e}).catch(e=>{let s=t.error?x(t.error,e):void 0;s?S.error(s,{id:r,...a,...null==a?void 0:a.error}):S.dismiss(r)}),e};var I=1e3,L=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,_=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,M=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,T=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
    animation: ${M} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,z=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,H=v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${z} 1s linear infinite;
`,F=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,U=y`
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
}`,B=v("div")`
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
    animation: ${U} 0.2s ease-out forwards;
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
`,J=v("div")`
  position: absolute;
`,K=v("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,W=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,q=v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${W} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,G=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?o.createElement(q,null,t):t:"blank"===a?null:o.createElement(K,null,o.createElement(H,{...r}),"loading"!==a&&o.createElement(J,null,"error"===a?o.createElement(T,{...r}):o.createElement(B,{...r})))},V=v("div")`
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
`,Y=v("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Z=o.memo(({toast:e,position:t,style:a,children:r})=>{let s=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,s]=E()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(G,{toast:e}),l=o.createElement(Y,{...e.ariaProps},x(e.message,e));return o.createElement(V,{className:e.className,style:{...s,...a,...e.style}},"function"==typeof r?r({icon:i,message:l}):o.createElement(o.Fragment,null,i,l))});i=o.createElement,u.p=void 0,h=i,g=void 0,b=void 0;var Q=({id:e,className:t,style:a,onHeightUpdate:r,children:s})=>{let i=o.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return o.createElement("div",{ref:i,className:t,style:a},s)},X=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:s,toasterId:i,containerStyle:l,containerClassName:n})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=N)=>{let[a,r]=(0,o.useState)(P[t]||C),s=(0,o.useRef)(P[t]);(0,o.useEffect)(()=>(s.current!==P[t]&&r(P[t]),k.push([t,r]),()=>{let e=k.findIndex(([e])=>e===t);e>-1&&k.splice(e,1)}),[t]);let i=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||$[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:i}})(e,t),s=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=I)=>{if(s.has(e))return;let a=setTimeout(()=>{s.delete(e),l({type:4,toastId:e})},t);s.set(e,a)},[]);(0,o.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&S.dismiss(a.id);return}return setTimeout(()=>S.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let l=(0,o.useCallback)(O(t),[t]),n=(0,o.useCallback)(()=>{l({type:5,time:Date.now()})},[l]),d=(0,o.useCallback)((e,t)=>{l({type:1,toast:{id:e,height:t}})},[l]),c=(0,o.useCallback)(()=>{r&&l({type:6,time:Date.now()})},[r,l]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:i}=t||{},o=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),l=o.findIndex(t=>t.id===e.id),n=o.filter((e,t)=>t<l&&e.visible).length;return o.filter(e=>e.visible).slice(...r?[n+1]:[0,n]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,o.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=s.get(e.id);t&&(clearTimeout(t),s.delete(e.id))}})},[a,i]),{toasts:a,handlers:{updateHeight:d,startPause:n,endPause:c,calculateOffset:u}}})(a,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...l},className:n,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(a=>{let i,l,n=a.position||t,d=c.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(i=n.includes("top"),l=n.includes("center")?{justifyContent:"center"}:n.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:E()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...l});return o.createElement(Q,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?X:"",style:u},"custom"===a.type?x(a.message,a):s?s(a):o.createElement(Z,{toast:a,position:n}))}))},et=S}},e=>{e.O(0,[4921,8500,8441,3794,7358],()=>e(e.s=994)),_N_E=e.O()}]);