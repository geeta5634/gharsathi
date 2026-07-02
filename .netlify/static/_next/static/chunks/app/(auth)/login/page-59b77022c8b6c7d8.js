(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[72],{3321:(e,t,r)=>{"use strict";var a=r(4645);r.o(a,"useParams")&&r.d(t,{useParams:function(){return a.useParams}}),r.o(a,"usePathname")&&r.d(t,{usePathname:function(){return a.usePathname}}),r.o(a,"useRouter")&&r.d(t,{useRouter:function(){return a.useRouter}}),r.o(a,"useSearchParams")&&r.d(t,{useSearchParams:function(){return a.useSearchParams}})},3902:(e,t,r)=>{Promise.resolve().then(r.bind(r,5784))},5784:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>c});var a=r(5155),s=r(2115),i=r(4921),o=r(3321),n=r(8500),l=r.n(n),d=r(8434);function c(){let e=(0,o.useRouter)(),[t,r]=(0,s.useState)("phone"),[n,c]=(0,s.useState)(""),[u,m]=(0,s.useState)(""),[p,f]=(0,s.useState)("CUSTOMER"),[h,g]=(0,s.useState)(!1),y=async()=>{if(n.length<10)return void d.Ay.error("Please enter a valid phone number");g(!0);try{let e=await fetch("/api/auth/send-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:n})}),t=await e.json();t.success?(d.Ay.success("OTP sent to "+n),r("otp")):d.Ay.error(t.error||"Failed to send OTP")}catch{d.Ay.error("Failed to send OTP")}finally{g(!1)}},b=async()=>{if(u.length<4)return void d.Ay.error("Please enter OTP");g(!0);try{let t=await (0,i.Jv)("credentials",{phone:n,otp:u,role:p,redirect:!1});if(t?.error)return void d.Ay.error("Invalid OTP");d.Ay.success("Login successful!"),e.push("WORKER"===p?"/worker/dashboard":"/customer/dashboard")}catch{d.Ay.error("Login failed")}finally{g(!1)}};return(0,a.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4",children:(0,a.jsxs)("div",{className:"w-full max-w-md",children:[(0,a.jsxs)("div",{className:"text-center mb-8",children:[(0,a.jsx)("h1",{className:"text-4xl font-bold text-blue-600",children:"GharSathi"}),(0,a.jsx)("p",{className:"text-gray-600 mt-2",children:"Your trusted home services platform"})]}),(0,a.jsx)("div",{className:"card",children:"phone"===t?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("h2",{className:"text-xl font-semibold mb-6",children:"Welcome Back"}),(0,a.jsxs)("div",{className:"flex gap-2 mb-6",children:[(0,a.jsx)("button",{onClick:()=>f("CUSTOMER"),className:`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${"CUSTOMER"===p?"bg-blue-600 text-white":"bg-gray-100 text-gray-600"}`,children:"Customer"}),(0,a.jsx)("button",{onClick:()=>f("WORKER"),className:`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${"WORKER"===p?"bg-blue-600 text-white":"bg-gray-100 text-gray-600"}`,children:"Worker"})]}),(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Phone Number"}),(0,a.jsx)("input",{type:"tel",value:n,onChange:e=>c(e.target.value.replace(/\D/g,"").slice(0,10)),placeholder:"Enter your 10-digit phone number",className:"input-field",maxLength:10})]}),(0,a.jsx)("button",{onClick:y,disabled:h||n.length<10,className:"btn-primary w-full",children:h?"Sending...":"Send OTP"})]}),(0,a.jsx)("p",{className:"text-center text-xs text-gray-500 mt-4",children:"By continuing, you agree to our Terms & Privacy Policy"})]}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("h2",{className:"text-xl font-semibold mb-2",children:"Enter OTP"}),(0,a.jsxs)("p",{className:"text-sm text-gray-500 mb-6",children:["OTP sent to ",n,(0,a.jsx)("button",{onClick:()=>r("phone"),className:"text-blue-600 ml-1 hover:underline",children:"Change"})]}),(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsx)("input",{type:"text",value:u,onChange:e=>m(e.target.value.replace(/\D/g,"").slice(0,6)),placeholder:"Enter 6-digit OTP",className:"input-field text-center text-lg tracking-widest",maxLength:6}),(0,a.jsx)("button",{onClick:b,disabled:h||u.length<4,className:"btn-primary w-full",children:h?"Verifying...":"Verify & Login"})]})]})}),"WORKER"===p&&"phone"===t&&(0,a.jsxs)("p",{className:"text-center text-sm text-gray-500 mt-4",children:["New worker?"," ",(0,a.jsx)(l(),{href:"/register",className:"text-blue-600 hover:underline",children:"Register here"})]})]})})}},8434:(e,t,r)=>{"use strict";let a,s;r.d(t,{Toaster:()=>ee,Ay:()=>et});var i,o=r(2115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,u=(e,t)=>{let r="",a="",s="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+o+";":a+="f"==i[1]?u(o,i):i+"{"+u(o,"k"==i[1]?"":t)+"}":"object"==typeof o?a+=u(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=u.p?u.p(i,o):i+":"+o+";")}return r+(t&&s?t+"{"+s+"}":s)+a},m={},p=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+p(e[r]);return t}return e};function f(e){let t,r,a=this||{},s=e.call?e(a.p):e;return((e,t,r,a,s)=>{var i;let o=p(e),n=m[o]||(m[o]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(o));if(!m[n]){let t=o!==e?e:(e=>{let t,r,a=[{}];for(;t=l.exec(e.replace(d,""));)t[4]?a.shift():t[3]?(r=t[3].replace(c," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(c," ").trim();return a[0]})(e);m[n]=u(s?{["@keyframes "+n]:t}:t,r?"":"."+n)}let f=r&&m.g;return r&&(m.g=m[n]),i=m[n],f?t.data=t.data.replace(f,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),n})(s.unshift?s.raw?(t=[].slice.call(arguments,1),r=a.p,s.reduce((e,a,s)=>{let i=t[s];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(a.target),a.g,a.o,a.k)}f.bind({g:1});let h,g,y,b=f.bind({k:1});function x(e,t){let r=this||{};return function(){let a=arguments;function s(i,o){let n=Object.assign({},i),l=n.className||s.className;r.p=Object.assign({theme:g&&g()},n),r.o=/go\d/.test(l),n.className=f.apply(r,a)+(l?" "+l:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),y&&d[0]&&y(n),h(d,n)}return t?t(s):s}}var v=(e,t)=>"function"==typeof e?e(t):e,w=(a=0,()=>(++a).toString()),j=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},N="default",E=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return E(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},k=[],O={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},P={},C=(e,t=N)=>{P[t]=E(P[t]||O,e),k.forEach(([e,r])=>{e===t&&r(P[t])})},T=e=>Object.keys(P).forEach(t=>C(e,t)),S=(e=N)=>t=>{C(t,e)},$={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},A=e=>(t,r)=>{let a,s=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||w()}))(t,e,r);return S(s.toasterId||(a=s.id,Object.keys(P).find(e=>P[e].toasts.some(e=>e.id===a))))({type:2,toast:s}),s.id},R=(e,t)=>A("blank")(e,t);R.error=A("error"),R.success=A("success"),R.loading=A("loading"),R.custom=A("custom"),R.dismiss=(e,t)=>{let r={type:3,toastId:e};t?S(t)(r):T(r)},R.dismissAll=e=>R.dismiss(void 0,e),R.remove=(e,t)=>{let r={type:4,toastId:e};t?S(t)(r):T(r)},R.removeAll=e=>R.remove(void 0,e),R.promise=(e,t,r)=>{let a=R.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?v(t.success,e):void 0;return s?R.success(s,{id:a,...r,...null==r?void 0:r.success}):R.dismiss(a),e}).catch(e=>{let s=t.error?v(t.error,e):void 0;s?R.error(s,{id:a,...r,...null==r?void 0:r.error}):R.dismiss(a)}),e};var D=1e3,_=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,I=b`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,L=b`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,z=x("div")`
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
    animation: ${I} 0.15s ease-out forwards;
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
`,F=b`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,M=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${F} 1s linear infinite;
`,W=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,H=b`
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
}`,U=x("div")`
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
    animation: ${H} 0.2s ease-out forwards;
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
`,B=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,J=b`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,V=x("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${J} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Y=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?o.createElement(V,null,t):t:"blank"===r?null:o.createElement(B,null,o.createElement(M,{...a}),"loading"!==r&&o.createElement(K,null,"error"===r?o.createElement(z,{...a}):o.createElement(U,{...a})))},q=x("div")`
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
`,G=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Z=o.memo(({toast:e,position:t,style:r,children:a})=>{let s=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,s]=j()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${b(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${b(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(Y,{toast:e}),n=o.createElement(G,{...e.ariaProps},v(e.message,e));return o.createElement(q,{className:e.className,style:{...s,...r,...e.style}},"function"==typeof a?a({icon:i,message:n}):o.createElement(o.Fragment,null,i,n))});i=o.createElement,u.p=void 0,h=i,g=void 0,y=void 0;var Q=({id:e,className:t,style:r,onHeightUpdate:a,children:s})=>{let i=o.useCallback(t=>{if(t){let r=()=>{a(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return o.createElement("div",{ref:i,className:t,style:r},s)},X=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:s,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:r,pausedAt:a}=((e={},t=N)=>{let[r,a]=(0,o.useState)(P[t]||O),s=(0,o.useRef)(P[t]);(0,o.useEffect)(()=>(s.current!==P[t]&&a(P[t]),k.push([t,a]),()=>{let e=k.findIndex(([e])=>e===t);e>-1&&k.splice(e,1)}),[t]);let i=r.toasts.map(t=>{var r,a,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||$[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...r,toasts:i}})(e,t),s=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=D)=>{if(s.has(e))return;let r=setTimeout(()=>{s.delete(e),n({type:4,toastId:e})},t);s.set(e,r)},[]);(0,o.useEffect)(()=>{if(a)return;let e=Date.now(),s=r.map(r=>{if(r.duration===1/0)return;let a=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(a<0){r.visible&&R.dismiss(r.id);return}return setTimeout(()=>R.dismiss(r.id,t),a)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[r,a,t]);let n=(0,o.useCallback)(S(t),[t]),l=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,o.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:s=8,defaultPosition:i}=t||{},o=r.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[r]);return(0,o.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=s.get(e.id);t&&(clearTimeout(t),s.delete(e.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:u}}})(r,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(r=>{let i,n,l=r.position||t,d=c.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}),u=(i=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:j()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return o.createElement(Q,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?X:"",style:u},"custom"===r.type?v(r.message,r):s?s(r):o.createElement(Z,{toast:r,position:l}))}))},et=R}},e=>{e.O(0,[4921,8500,8441,3794,7358],()=>e(e.s=3902)),_N_E=e.O()}]);