(()=>{var e={};e.id=931,e.ids=[931],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},55315:e=>{"use strict";e.exports=require("path")},17360:e=>{"use strict";e.exports=require("url")},53270:(e,t,n)=>{"use strict";n.r(t),n.d(t,{GlobalError:()=>s.a,__next_app__:()=>f,originalPathname:()=>d,pages:()=>c,routeModule:()=>p,tree:()=>u}),n(4148),n(75327),n(90996);var r=n(30170),o=n(45002),i=n(83876),s=n.n(i),a=n(66299),l={};for(let e in a)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>a[e]);n.d(t,l);let u=["",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(n.bind(n,4148)),"E:\\NextJS\\mystrymessage\\src\\app\\page.tsx"],metadata:{icon:[async e=>(await Promise.resolve().then(n.bind(n,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(n.bind(n,75327)),"E:\\NextJS\\mystrymessage\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(n.t.bind(n,90996,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(n.bind(n,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],c=["E:\\NextJS\\mystrymessage\\src\\app\\page.tsx"],d="/page",f={require:n,loadChunk:()=>Promise.resolve()},p=new r.AppPageRouteModule({definition:{kind:o.x.APP_PAGE,page:"/page",pathname:"/",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:u}})},51990:(e,t,n)=>{Promise.resolve().then(n.t.bind(n,63642,23)),Promise.resolve().then(n.t.bind(n,87586,23)),Promise.resolve().then(n.t.bind(n,47838,23)),Promise.resolve().then(n.t.bind(n,58057,23)),Promise.resolve().then(n.t.bind(n,77741,23)),Promise.resolve().then(n.t.bind(n,13118,23))},31909:(e,t,n)=>{Promise.resolve().then(n.bind(n,93294)),Promise.resolve().then(n.bind(n,67312))},51571:(e,t,n)=>{Promise.resolve().then(n.bind(n,63130))},34178:(e,t,n)=>{"use strict";var r=n(25289);n.o(r,"useParams")&&n.d(t,{useParams:function(){return r.useParams}}),n.o(r,"useRouter")&&n.d(t,{useRouter:function(){return r.useRouter}})},63130:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>J});var r=n(97247),o=n(26323);let i=(0,o.Z)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);var s=n(55757);let a={active:!0,breakpoints:{},delay:4e3,jump:!1,playOnInit:!0,stopOnFocusIn:!0,stopOnInteraction:!0,stopOnMouseEnter:!1,stopOnLastSnap:!1,rootNode:null};function l(e={}){let t,n,r,o;let i=null,s=0,u=!1,c=!1,d=!1,f=!1;function p(){if(!r){if(x()){d=!0;return}u||n.emit("autoplay:play"),function(){let{ownerWindow:e}=n.internalEngine();e.clearTimeout(s),s=e.setTimeout(w,o[n.selectedScrollSnap()]),i=new Date().getTime(),n.emit("autoplay:timerset")}(),u=!0}}function m(){r||(u&&n.emit("autoplay:stop"),function(){let{ownerWindow:e}=n.internalEngine();e.clearTimeout(s),s=0,i=null,n.emit("autoplay:timerstopped")}(),u=!1)}function g(){if(x())return d=u,m();d&&p()}function x(){let{ownerDocument:e}=n.internalEngine();return"hidden"===e.visibilityState}function h(){c||m()}function v(){c||p()}function y(){c=!0,m()}function b(){c=!1,p()}function w(){let{index:e}=n.internalEngine(),r=e.clone().add(1).get(),o=n.scrollSnapList().length-1,i=t.stopOnLastSnap&&r===o;if(n.canScrollNext()?n.scrollNext(f):n.scrollTo(0,f),n.emit("autoplay:select"),i)return m();p()}return{name:"autoplay",options:e,init:function(i,s){n=i;let{mergeOptions:u,optionsAtMedia:c}=s,d=u(a,l.globalOptions);if(t=c(u(d,e)),n.scrollSnapList().length<=1)return;f=t.jump,r=!1,o=function(e,t){let n=e.scrollSnapList();return"number"==typeof t?n.map(()=>t):t(n,e)}(n,t.delay);let{eventStore:x,ownerDocument:w}=n.internalEngine(),N=!!n.internalEngine().options.watchDrag,j=function(e,t){let n=e.rootNode();return t&&t(n)||n}(n,t.rootNode);x.add(w,"visibilitychange",g),N&&n.on("pointerDown",h),N&&!t.stopOnInteraction&&n.on("pointerUp",v),t.stopOnMouseEnter&&x.add(j,"mouseenter",y),t.stopOnMouseEnter&&!t.stopOnInteraction&&x.add(j,"mouseleave",b),t.stopOnFocusIn&&n.on("slideFocusStart",m),t.stopOnFocusIn&&!t.stopOnInteraction&&x.add(n.containerNode(),"focusout",p),t.playOnInit&&p()},destroy:function(){n.off("pointerDown",h).off("pointerUp",v).off("slideFocusStart",m),m(),r=!0,u=!1},play:function(e){void 0!==e&&(f=e),p()},stop:function(){u&&m()},reset:function(){u&&p()},isPlaying:function(){return u},timeUntilNext:function(){return i?o[n.selectedScrollSnap()]-(new Date().getTime()-i):null}}}l.globalOptions=void 0;let u=JSON.parse('[{"title":"Message from User123","content":"Hey, how are you doing today?","received":"10 minutes ago"},{"title":"Message from SecretAdmirer","content":"I really liked your recent post!","received":"2 hours ago"},{"title":"Message from MysteryGuest","content":"Do you have any book recommendations?","received":"1 day ago"}]');var c=n(34178),d=n(28964);function f(e){return"[object Object]"===Object.prototype.toString.call(e)||Array.isArray(e)}function p(e,t){let n=Object.keys(e),r=Object.keys(t);return n.length===r.length&&JSON.stringify(Object.keys(e.breakpoints||{}))===JSON.stringify(Object.keys(t.breakpoints||{}))&&n.every(n=>{let r=e[n],o=t[n];return"function"==typeof r?`${r}`==`${o}`:f(r)&&f(o)?p(r,o):r===o})}function m(e){return e.concat().sort((e,t)=>e.name>t.name?1:-1).map(e=>e.options)}function g(e){return"number"==typeof e}function x(e){return"string"==typeof e}function h(e){return"boolean"==typeof e}function v(e){return"[object Object]"===Object.prototype.toString.call(e)}function y(e){return Math.abs(e)}function b(e){return Math.sign(e)}function w(e){return E(e).map(Number)}function N(e){return e[j(e)]}function j(e){return Math.max(0,e.length-1)}function S(e,t=0){return Array.from(Array(e),(e,n)=>t+n)}function E(e){return Object.keys(e)}function O(e,t){return void 0!==t.MouseEvent&&e instanceof t.MouseEvent}function k(){let e=[],t={add:function(n,r,o,i={passive:!0}){let s;return"addEventListener"in n?(n.addEventListener(r,o,i),s=()=>n.removeEventListener(r,o,i)):(n.addListener(o),s=()=>n.removeListener(o)),e.push(s),t},clear:function(){e=e.filter(e=>e())}};return t}function P(e=0,t=0){let n=y(e-t);function r(n){return n<e||n>t}return{length:n,max:t,min:e,constrain:function(n){return r(n)?n<e?e:t:n},reachedAny:r,reachedMax:function(e){return e>t},reachedMin:function(t){return t<e},removeOffset:function(e){return n?e-n*Math.ceil((e-t)/n):e}}}function A(e){let t=e;function n(e){return g(e)?e:e.get()}return{get:function(){return t},set:function(e){t=n(e)},add:function(e){t+=n(e)},subtract:function(e){t-=n(e)}}}function T(e,t){let n="x"===e.scroll?function(e){return`translate3d(${e}px,0px,0px)`}:function(e){return`translate3d(0px,${e}px,0px)`},r=t.style,o=null,i=!1;return{clear:function(){i||(r.transform="",t.getAttribute("style")||t.removeAttribute("style"))},to:function(t){if(i)return;let s=Math.round(100*e.direction(t))/100;s!==o&&(r.transform=n(s),o=s)},toggleActive:function(e){i=!e}}}let D={align:"center",axis:"x",container:null,slides:null,containScroll:"trimSnaps",direction:"ltr",slidesToScroll:1,inViewThreshold:0,breakpoints:{},dragFree:!1,dragThreshold:10,loop:!1,skipSnaps:!1,duration:25,startIndex:0,active:!0,watchDrag:!0,watchResize:!0,watchSlides:!0,watchFocus:!0};function I(e,t,n){let r,o,i,s,a;let l=e.ownerDocument,u=l.defaultView,c=function(e){function t(e,t){return function e(t,n){return[t,n].reduce((t,n)=>(E(n).forEach(r=>{let o=t[r],i=n[r],s=v(o)&&v(i);t[r]=s?e(o,i):i}),t),{})}(e,t||{})}return{mergeOptions:t,optionsAtMedia:function(n){let r=n.breakpoints||{},o=E(r).filter(t=>e.matchMedia(t).matches).map(e=>r[e]).reduce((e,n)=>t(e,n),{});return t(n,o)},optionsMediaQueries:function(t){return t.map(e=>E(e.breakpoints||{})).reduce((e,t)=>e.concat(t),[]).map(e.matchMedia)}}}(u),d=(a=[],{init:function(e,t){return(a=t.filter(({options:e})=>!1!==c.optionsAtMedia(e).active)).forEach(t=>t.init(e,c)),t.reduce((e,t)=>Object.assign(e,{[t.name]:t}),{})},destroy:function(){a=a.filter(e=>e.destroy())}}),f=k(),p=function(){let e,t={},n={init:function(t){e=t},emit:function(r){return(t[r]||[]).forEach(t=>t(e,r)),n},off:function(e,r){return t[e]=(t[e]||[]).filter(e=>e!==r),n},on:function(e,r){return t[e]=(t[e]||[]).concat([r]),n},clear:function(){t={}}};return n}(),{mergeOptions:m,optionsAtMedia:M,optionsMediaQueries:C}=c,{on:R,off:_,emit:z}=p,F=!1,L=m(D,I.globalOptions),q=m(L),V=[];function H(t,n){!F&&(q=M(L=m(L,t)),V=n||V,function(){let{container:t,slides:n}=q;i=(x(t)?e.querySelector(t):t)||e.children[0];let r=x(n)?i.querySelectorAll(n):n;s=[].slice.call(r||i.children)}(),r=function t(n){let r=function(e,t,n,r,o,i,s){let a,l;let{align:u,axis:c,direction:d,startIndex:f,loop:p,duration:m,dragFree:v,dragThreshold:D,inViewThreshold:I,slidesToScroll:M,skipSnaps:C,containScroll:R,watchResize:_,watchSlides:z,watchDrag:F,watchFocus:L}=i,q={measure:function(e){let{offsetTop:t,offsetLeft:n,offsetWidth:r,offsetHeight:o}=e;return{top:t,right:n+r,bottom:t+o,left:n,width:r,height:o}}},V=q.measure(t),H=n.map(q.measure),U=function(e,t){let n="rtl"===t,r="y"===e,o=!r&&n?-1:1;return{scroll:r?"y":"x",cross:r?"x":"y",startEdge:r?"top":n?"right":"left",endEdge:r?"bottom":n?"left":"right",measureSize:function(e){let{height:t,width:n}=e;return r?t:n},direction:function(e){return e*o}}}(c,d),G=U.measureSize(V),J={measure:function(e){return e/100*G}},$=function(e,t){let n={start:function(){return 0},center:function(e){return(t-e)/2},end:function(e){return t-e}};return{measure:function(r,o){return x(e)?n[e](r):e(t,r,o)}}}(u,G),B=!p&&!!R,{slideSizes:Z,slideSizesWithGaps:X,startGap:W,endGap:Y}=function(e,t,n,r,o,i){let{measureSize:s,startEdge:a,endEdge:l}=e,u=n[0]&&o,c=function(){if(!u)return 0;let e=n[0];return y(t[a]-e[a])}(),d=u?parseFloat(i.getComputedStyle(N(r)).getPropertyValue(`margin-${l}`)):0,f=n.map(s),p=n.map((e,t,n)=>{let r=t===j(n);return t?r?f[t]+d:n[t+1][a]-e[a]:f[t]+c}).map(y);return{slideSizes:f,slideSizesWithGaps:p,startGap:c,endGap:d}}(U,V,H,n,p||!!R,o),K=function(e,t,n,r,o,i,s,a,l){let{startEdge:u,endEdge:c,direction:d}=e,f=g(n);return{groupSlides:function(e){return f?w(e).filter(e=>e%n==0).map(t=>e.slice(t,t+n)):e.length?w(e).reduce((n,l,f)=>{let p=N(n)||0,m=l===j(e),g=o[u]-i[p][u],x=o[u]-i[l][c],h=r||0!==p?0:d(s),v=y(x-(!r&&m?d(a):0)-(g+h));return f&&v>t+2&&n.push(l),m&&n.push(e.length),n},[]).map((t,n,r)=>{let o=Math.max(r[n-1]||0);return e.slice(o,t)}):[]}}}(U,G,M,p,V,H,W,Y,0),{snaps:Q,snapsAligned:ee}=function(e,t,n,r,o){let{startEdge:i,endEdge:s}=e,{groupSlides:a}=o,l=a(r).map(e=>N(e)[s]-e[0][i]).map(y).map(t.measure),u=r.map(e=>n[i]-e[i]).map(e=>-y(e)),c=a(u).map(e=>e[0]).map((e,t)=>e+l[t]);return{snaps:u,snapsAligned:c}}(U,$,V,H,K),et=-N(Q)+N(X),{snapsContained:en,scrollContainLimit:er}=function(e,t,n,r,o){let i=P(-t+e,0),s=n.map((e,t)=>{let{min:r,max:o}=i,s=i.constrain(e),a=t===j(n);return t?a||1>=y(r-s)?r:1>=y(o-s)?o:s:o}).map(e=>parseFloat(e.toFixed(3))),a=function(){let e=s[0],t=N(s);return P(s.lastIndexOf(e),s.indexOf(t)+1)}();return{snapsContained:function(){if(t<=e+2)return[i.max];if("keepSnaps"===r)return s;let{min:n,max:o}=a;return s.slice(n,o)}(),scrollContainLimit:a}}(G,et,ee,R,0),eo=B?en:ee,{limit:ei}=function(e,t,n){let r=t[0];return{limit:P(n?r-e:N(t),r)}}(et,eo,p),es=function e(t,n,r){let{constrain:o}=P(0,t),i=t+1,s=a(n);function a(e){return r?y((i+e)%i):o(e)}function l(){return e(t,s,r)}let u={get:function(){return s},set:function(e){return s=a(e),u},add:function(e){return l().set(s+e)},clone:l};return u}(j(eo),f,p),ea=es.clone(),el=w(n),eu=({dragHandler:e,scrollBody:t,scrollBounds:n,options:{loop:r}})=>{r||n.constrain(e.pointerDown()),t.seek()},ec=({scrollBody:e,translate:t,location:n,offsetLocation:r,previousLocation:o,scrollLooper:i,slideLooper:s,dragHandler:a,animation:l,eventHandler:u,scrollBounds:c,options:{loop:d}},f)=>{let p=e.settled(),m=!c.shouldConstrain(),g=d?p:p&&m;g&&!a.pointerDown()&&(l.stop(),u.emit("settle")),g||u.emit("scroll");let x=n.get()*f+o.get()*(1-f);r.set(x),d&&(i.loop(e.direction()),s.loop()),t.to(r.get())},ed=function(e,t,n,r){let o=k(),i=1e3/60,s=null,a=0,l=0;function u(e){if(!l)return;s||(s=e,n(),n());let o=e-s;for(s=e,a+=o;a>=i;)n(),a-=i;r(a/i),l&&(l=t.requestAnimationFrame(u))}function c(){t.cancelAnimationFrame(l),s=null,a=0,l=0}return{init:function(){o.add(e,"visibilitychange",()=>{e.hidden&&(s=null,a=0)})},destroy:function(){c(),o.clear()},start:function(){l||(l=t.requestAnimationFrame(u))},stop:c,update:n,render:r}}(r,o,()=>eu(eE),e=>ec(eE,e)),ef=eo[es.get()],ep=A(ef),em=A(ef),eg=A(ef),ex=A(ef),eh=function(e,t,n,r,o,i){let s=0,a=0,l=o,u=.68,c=e.get(),d=0;function f(e){return l=e,m}function p(e){return u=e,m}let m={direction:function(){return a},duration:function(){return l},velocity:function(){return s},seek:function(){let t=r.get()-e.get(),o=0;return l?(n.set(e),s+=t/l,s*=u,c+=s,e.add(s),o=c-d):(s=0,n.set(r),e.set(r),o=t),a=b(o),d=c,m},settled:function(){return .001>y(r.get()-t.get())},useBaseFriction:function(){return p(.68)},useBaseDuration:function(){return f(o)},useFriction:p,useDuration:f};return m}(ep,eg,em,ex,m,0),ev=function(e,t,n,r,o){let{reachedAny:i,removeOffset:s,constrain:a}=r;function l(e){return e.concat().sort((e,t)=>y(e)-y(t))[0]}function u(t,r){let o=[t,t+n,t-n];if(!e)return t;if(!r)return l(o);let i=o.filter(e=>b(e)===r);return i.length?l(i):N(o)-n}return{byDistance:function(n,r){let l=o.get()+n,{index:c,distance:d}=function(n){let r=e?s(n):a(n),{index:o}=t.map((e,t)=>({diff:u(e-r,0),index:t})).sort((e,t)=>y(e.diff)-y(t.diff))[0];return{index:o,distance:r}}(l),f=!e&&i(l);if(!r||f)return{index:c,distance:n};let p=n+u(t[c]-d,0);return{index:c,distance:p}},byIndex:function(e,n){let r=u(t[e]-o.get(),n);return{index:e,distance:r}},shortcut:u}}(p,eo,et,ei,ex),ey=function(e,t,n,r,o,i,s){function a(o){let a=o.distance,l=o.index!==t.get();i.add(a),a&&(r.duration()?e.start():(e.update(),e.render(1),e.update())),l&&(n.set(t.get()),t.set(o.index),s.emit("select"))}return{distance:function(e,t){a(o.byDistance(e,t))},index:function(e,n){let r=t.clone().set(e);a(o.byIndex(r.get(),n))}}}(ed,es,ea,eh,ev,ex,s),eb=function(e){let{max:t,length:n}=e;return{get:function(e){return n?-((e-t)/n):0}}}(ei),ew=k(),eN=function(e,t,n,r){let o;let i={},s=null,a=null,l=!1;return{init:function(){o=new IntersectionObserver(e=>{l||(e.forEach(e=>{i[t.indexOf(e.target)]=e}),s=null,a=null,n.emit("slidesInView"))},{root:e.parentElement,threshold:r}),t.forEach(e=>o.observe(e))},destroy:function(){o&&o.disconnect(),l=!0},get:function(e=!0){if(e&&s)return s;if(!e&&a)return a;let t=E(i).reduce((t,n)=>{let r=parseInt(n),{isIntersecting:o}=i[r];return(e&&o||!e&&!o)&&t.push(r),t},[]);return e&&(s=t),e||(a=t),t}}}(t,n,s,I),{slideRegistry:ej}=function(e,t,n,r,o,i){let{groupSlides:s}=o,{min:a,max:l}=r;return{slideRegistry:function(){let r=s(i);return 1===n.length?[i]:e&&"keepSnaps"!==t?r.slice(a,l).map((e,t,n)=>{let r=t===j(n);return t?r?S(j(i)-N(n)[0]+1,N(n)[0]):e:S(N(n[0])+1)}):r}()}}(B,R,eo,er,K,el),eS=function(e,t,n,r,o,i,s,a){let l={passive:!0,capture:!0},u=0;function c(e){"Tab"===e.code&&(u=new Date().getTime())}return{init:function(d){a&&(i.add(document,"keydown",c,!1),t.forEach((t,c)=>{i.add(t,"focus",t=>{(h(a)||a(d,t))&&function(t){if(new Date().getTime()-u>10)return;s.emit("slideFocusStart"),e.scrollLeft=0;let i=n.findIndex(e=>e.includes(t));g(i)&&(o.useDuration(0),r.index(i,0),s.emit("slideFocus"))}(c)},l)}))}}}(e,n,ej,ey,eh,ew,s,L),eE={ownerDocument:r,ownerWindow:o,eventHandler:s,containerRect:V,slideRects:H,animation:ed,axis:U,dragHandler:function(e,t,n,r,o,i,s,a,l,u,c,d,f,p,m,g,x,v,w){let{cross:N,direction:j}=e,S=["INPUT","SELECT","TEXTAREA"],E={passive:!1},A=k(),T=k(),D=P(50,225).constrain(p.measure(20)),I={mouse:300,touch:400},M={mouse:500,touch:600},C=m?43:25,R=!1,_=0,z=0,F=!1,L=!1,q=!1,V=!1;function H(e){if(!O(e,r)&&e.touches.length>=2)return U(e);let t=i.readPoint(e),n=i.readPoint(e,N),s=y(t-_),l=y(n-z);if(!L&&!V&&(!e.cancelable||!(L=s>l)))return U(e);let c=i.pointerMove(e);s>g&&(q=!0),u.useFriction(.3).useDuration(.75),a.start(),o.add(j(c)),e.preventDefault()}function U(e){let t=c.byDistance(0,!1).index!==d.get(),n=i.pointerUp(e)*(m?M:I)[V?"mouse":"touch"],r=function(e,t){let n=d.add(-1*b(e)),r=c.byDistance(e,!m).distance;return m||y(e)<D?r:x&&t?.5*r:c.byIndex(n.get(),0).distance}(j(n),t),o=function(e,t){var n,r;if(0===e||0===t||y(e)<=y(t))return 0;let o=(n=y(e),r=y(t),y(n-r));return y(o/e)}(n,r);L=!1,F=!1,T.clear(),u.useDuration(C-10*o).useFriction(.68+o/50),l.distance(r,!m),V=!1,f.emit("pointerUp")}function G(e){q&&(e.stopPropagation(),e.preventDefault(),q=!1)}return{init:function(e){w&&A.add(t,"dragstart",e=>e.preventDefault(),E).add(t,"touchmove",()=>void 0,E).add(t,"touchend",()=>void 0).add(t,"touchstart",a).add(t,"mousedown",a).add(t,"touchcancel",U).add(t,"contextmenu",U).add(t,"click",G,!0);function a(a){(h(w)||w(e,a))&&function(e){let a=O(e,r);V=a,q=m&&a&&!e.buttons&&R,R=y(o.get()-s.get())>=2,a&&0!==e.button||function(e){let t=e.nodeName||"";return S.includes(t)}(e.target)||(F=!0,i.pointerDown(e),u.useFriction(0).useDuration(0),o.set(s),function(){let e=V?n:t;T.add(e,"touchmove",H,E).add(e,"touchend",U).add(e,"mousemove",H,E).add(e,"mouseup",U)}(),_=i.readPoint(e),z=i.readPoint(e,N),f.emit("pointerDown"))}(a)}},destroy:function(){A.clear(),T.clear()},pointerDown:function(){return F}}}(U,e,r,o,ex,function(e,t){let n,r;function o(e){return e.timeStamp}function i(n,r){let o=r||e.scroll,i=`client${"x"===o?"X":"Y"}`;return(O(n,t)?n:n.touches[0])[i]}return{pointerDown:function(e){return n=e,r=e,i(e)},pointerMove:function(e){let t=i(e)-i(r),s=o(e)-o(n)>170;return r=e,s&&(n=e),t},pointerUp:function(e){if(!n||!r)return 0;let t=i(r)-i(n),s=o(e)-o(n),a=o(e)-o(r)>170,l=t/s;return s&&!a&&y(l)>.1?l:0},readPoint:i}}(U,o),ep,ed,ey,eh,ev,es,s,J,v,D,C,0,F),eventStore:ew,percentOfView:J,index:es,indexPrevious:ea,limit:ei,location:ep,offsetLocation:eg,previousLocation:em,options:i,resizeHandler:function(e,t,n,r,o,i,s){let a,l;let u=[e].concat(r),c=[],d=!1;function f(e){return o.measureSize(s.measure(e))}return{init:function(o){i&&(l=f(e),c=r.map(f),a=new ResizeObserver(n=>{(h(i)||i(o,n))&&function(n){for(let i of n){if(d)return;let n=i.target===e,s=r.indexOf(i.target),a=n?l:c[s];if(y(f(n?e:r[s])-a)>=.5){o.reInit(),t.emit("resize");break}}}(n)}),n.requestAnimationFrame(()=>{u.forEach(e=>a.observe(e))}))},destroy:function(){d=!0,a&&a.disconnect()}}}(t,s,o,n,U,_,q),scrollBody:eh,scrollBounds:function(e,t,n,r,o){let i=o.measure(10),s=o.measure(50),a=P(.1,.99),l=!1;function u(){return!!(!l&&e.reachedAny(n.get())&&e.reachedAny(t.get()))}return{shouldConstrain:u,constrain:function(o){if(!u())return;let l=e.reachedMin(t.get())?"min":"max",c=y(e[l]-t.get()),d=n.get()-t.get(),f=a.constrain(c/s);n.subtract(d*f),!o&&y(d)<i&&(n.set(e.constrain(n.get())),r.useDuration(25).useBaseFriction())},toggleActive:function(e){l=!e}}}(ei,eg,ex,eh,J),scrollLooper:function(e,t,n,r){let{reachedMin:o,reachedMax:i}=P(t.min+.1,t.max+.1);return{loop:function(t){if(!(1===t?i(n.get()):-1===t&&o(n.get())))return;let s=-1*t*e;r.forEach(e=>e.add(s))}}}(et,ei,eg,[ep,eg,em,ex]),scrollProgress:eb,scrollSnapList:eo.map(eb.get),scrollSnaps:eo,scrollTarget:ev,scrollTo:ey,slideLooper:function(e,t,n,r,o,i,s,a,l){let u=w(o),c=p(f(w(o).reverse(),s[0]),n,!1).concat(p(f(u,t-s[0]-1),-n,!0));function d(e,t){return e.reduce((e,t)=>e-o[t],t)}function f(e,t){return e.reduce((e,n)=>d(e,t)>0?e.concat([n]):e,[])}function p(o,s,u){let c=i.map((e,n)=>({start:e-r[n]+.5+s,end:e+t-.5+s}));return o.map(t=>{let r=u?0:-n,o=u?n:0,i=c[t][u?"end":"start"];return{index:t,loopPoint:i,slideLocation:A(-1),translate:T(e,l[t]),target:()=>a.get()>i?r:o}})}return{canLoop:function(){return c.every(({index:e})=>.1>=d(u.filter(t=>t!==e),t))},clear:function(){c.forEach(e=>e.translate.clear())},loop:function(){c.forEach(e=>{let{target:t,translate:n,slideLocation:r}=e,o=t();o!==r.get()&&(n.to(o),r.set(o))})},loopPoints:c}}(U,G,et,Z,X,Q,eo,eg,n),slideFocus:eS,slidesHandler:(l=!1,{init:function(e){z&&(a=new MutationObserver(t=>{!l&&(h(z)||z(e,t))&&function(t){for(let n of t)if("childList"===n.type){e.reInit(),s.emit("slidesChanged");break}}(t)})).observe(t,{childList:!0})},destroy:function(){a&&a.disconnect(),l=!0}}),slidesInView:eN,slideIndexes:el,slideRegistry:ej,slidesToScroll:K,target:ex,translate:T(U,t)};return eE}(e,i,s,l,u,n,p);return n.loop&&!r.slideLooper.canLoop()?t(Object.assign({},n,{loop:!1})):r}(q),C([L,...V.map(({options:e})=>e)]).forEach(e=>f.add(e,"change",U)),q.active&&(r.translate.to(r.location.get()),r.animation.init(),r.slidesInView.init(),r.slideFocus.init(B),r.eventHandler.init(B),r.resizeHandler.init(B),r.slidesHandler.init(B),r.options.loop&&r.slideLooper.loop(),i.offsetParent&&s.length&&r.dragHandler.init(B),o=d.init(B,V)))}function U(e,t){let n=$();G(),H(m({startIndex:n},e),t),p.emit("reInit")}function G(){r.dragHandler.destroy(),r.eventStore.clear(),r.translate.clear(),r.slideLooper.clear(),r.resizeHandler.destroy(),r.slidesHandler.destroy(),r.slidesInView.destroy(),r.animation.destroy(),d.destroy(),f.clear()}function J(e,t,n){q.active&&!F&&(r.scrollBody.useBaseFriction().useDuration(!0===t?0:q.duration),r.scrollTo.index(e,n||0))}function $(){return r.index.get()}let B={canScrollNext:function(){return r.index.add(1).get()!==$()},canScrollPrev:function(){return r.index.add(-1).get()!==$()},containerNode:function(){return i},internalEngine:function(){return r},destroy:function(){F||(F=!0,f.clear(),G(),p.emit("destroy"),p.clear())},off:_,on:R,emit:z,plugins:function(){return o},previousScrollSnap:function(){return r.indexPrevious.get()},reInit:U,rootNode:function(){return e},scrollNext:function(e){J(r.index.add(1).get(),e,-1)},scrollPrev:function(e){J(r.index.add(-1).get(),e,1)},scrollProgress:function(){return r.scrollProgress.get(r.location.get())},scrollSnapList:function(){return r.scrollSnapList},scrollTo:J,selectedScrollSnap:$,slideNodes:function(){return s},slidesInView:function(){return r.slidesInView.get()},slidesNotInView:function(){return r.slidesInView.get(!1)}};return H(t,n),setTimeout(()=>p.emit("init"),0),B}function M(e={},t=[]){let n=(0,d.useRef)(e),r=(0,d.useRef)(t),[o,i]=(0,d.useState)(),[s,a]=(0,d.useState)(),l=(0,d.useCallback)(()=>{o&&o.reInit(n.current,r.current)},[o]);return(0,d.useEffect)(()=>{p(n.current,e)||(n.current=e,l())},[e,l]),(0,d.useEffect)(()=>{!function(e,t){if(e.length!==t.length)return!1;let n=m(e),r=m(t);return n.every((e,t)=>p(e,r[t]))}(r.current,t)&&(r.current=t,l())},[t,l]),(0,d.useEffect)(()=>{if("undefined"!=typeof window&&window.document&&window.document.createElement&&s){I.globalOptions=M.globalOptions;let e=I(s,n.current,r.current);return i(e),()=>e.destroy()}i(void 0)},[s,i]),[a,o]}I.globalOptions=void 0,M.globalOptions=void 0;let C=(0,o.Z)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]),R=(0,o.Z)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);var _=n(40677),z=n(54293);let F=d.createContext(null);function L(){let e=d.useContext(F);if(!e)throw Error("useCarousel must be used within a <Carousel />");return e}let q=d.forwardRef(({orientation:e="horizontal",opts:t,setApi:n,plugins:o,className:i,children:s,...a},l)=>{let[u,c]=M({...t,axis:"horizontal"===e?"x":"y"},o),[f,p]=d.useState(!1),[m,g]=d.useState(!1),x=d.useCallback(e=>{e&&(p(e.canScrollPrev()),g(e.canScrollNext()))},[]),h=d.useCallback(()=>{c?.scrollPrev()},[c]),v=d.useCallback(()=>{c?.scrollNext()},[c]),y=d.useCallback(e=>{"ArrowLeft"===e.key?(e.preventDefault(),h()):"ArrowRight"===e.key&&(e.preventDefault(),v())},[h,v]);return d.useEffect(()=>{c&&n&&n(c)},[c,n]),d.useEffect(()=>{if(c)return x(c),c.on("reInit",x),c.on("select",x),()=>{c?.off("select",x)}},[c,x]),r.jsx(F.Provider,{value:{carouselRef:u,api:c,opts:t,orientation:e||(t?.axis==="y"?"vertical":"horizontal"),scrollPrev:h,scrollNext:v,canScrollPrev:f,canScrollNext:m},children:r.jsx("div",{ref:l,onKeyDownCapture:y,className:(0,_.cn)("relative",i),role:"region","aria-roledescription":"carousel",...a,children:s})})});q.displayName="Carousel";let V=d.forwardRef(({className:e,...t},n)=>{let{carouselRef:o,orientation:i}=L();return r.jsx("div",{ref:o,className:"overflow-hidden",children:r.jsx("div",{ref:n,className:(0,_.cn)("flex","horizontal"===i?"-ml-4":"-mt-4 flex-col",e),...t})})});V.displayName="CarouselContent";let H=d.forwardRef(({className:e,...t},n)=>{let{orientation:o}=L();return r.jsx("div",{ref:n,role:"group","aria-roledescription":"slide",className:(0,_.cn)("min-w-0 shrink-0 grow-0 basis-full","horizontal"===o?"pl-4":"pt-4",e),...t})});H.displayName="CarouselItem";let U=d.forwardRef(({className:e,variant:t="outline",size:n="icon",...o},i)=>{let{orientation:s,scrollPrev:a,canScrollPrev:l}=L();return(0,r.jsxs)(z.z,{ref:i,variant:t,size:n,className:(0,_.cn)("absolute  h-8 w-8 rounded-full","horizontal"===s?"-left-12 top-1/2 -translate-y-1/2":"-top-12 left-1/2 -translate-x-1/2 rotate-90",e),disabled:!l,onClick:a,...o,children:[r.jsx(C,{className:"h-4 w-4"}),r.jsx("span",{className:"sr-only",children:"Previous slide"})]})});U.displayName="CarouselPrevious";let G=d.forwardRef(({className:e,variant:t="outline",size:n="icon",...o},i)=>{let{orientation:s,scrollNext:a,canScrollNext:l}=L();return(0,r.jsxs)(z.z,{ref:i,variant:t,size:n,className:(0,_.cn)("absolute h-8 w-8 rounded-full","horizontal"===s?"-right-12 top-1/2 -translate-y-1/2":"-bottom-12 left-1/2 -translate-x-1/2 rotate-90",e),disabled:!l,onClick:a,...o,children:[r.jsx(R,{className:"h-4 w-4"}),r.jsx("span",{className:"sr-only",children:"Next slide"})]})});function J(){let e=(0,c.useRouter)();return(0,r.jsxs)("div",{className:"flex flex-col h-screen bg-gray-800 text-white",children:[(0,r.jsxs)("main",{className:"flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12",children:[(0,r.jsxs)("section",{className:"text-center mb-8 md:mb-12",children:[r.jsx("h1",{className:"text-3xl md:text-5xl font-bold",children:"Dive into the World of Anonymous Feedback"}),r.jsx("p",{className:"mt-3 md:mt-4 text-base md:text-lg",children:"True Feedback - Where your identity remains a secret."})]}),(0,r.jsxs)("div",{className:"flex space-x-4 mb-8",children:[r.jsx("button",{className:"px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 text-white font-semibold transition-all",onClick:()=>{e.push("/sign-in")},children:"Sign In"}),r.jsx("button",{className:"px-6 py-3 bg-teal-600 rounded-lg hover:bg-teal-500 text-white font-semibold transition-all",onClick:()=>{e.push("/sign-up")},children:"Sign Up"})]}),r.jsx("div",{className:"relative w-full max-w-lg md:max-w-xl flex-grow",children:(0,r.jsxs)(q,{plugins:[l({delay:2e3})],className:"w-full h-full",children:[r.jsx(V,{children:u.map((e,t)=>r.jsx(H,{className:"p-4",children:(0,r.jsxs)(s.Zb,{className:"w-full",children:[r.jsx(s.Ol,{children:r.jsx(s.ll,{children:e.title})}),(0,r.jsxs)(s.aY,{className:"flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4",children:[r.jsx(i,{className:"flex-shrink-0"}),(0,r.jsxs)("div",{children:[r.jsx("p",{children:e.content}),r.jsx("p",{className:"text-xs text-muted-foreground",children:e.received})]})]})]})},t))}),r.jsx(U,{className:"absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600",children:"← "}),r.jsx(G,{className:"absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600",children:"→ "})]})})]}),r.jsx("footer",{className:"text-center p-4 md:p-6 bg-gray-900 text-white",children:"\xa9 2025 True Feedback. All rights reserved."})]})}G.displayName="CarouselNext"},54293:(e,t,n)=>{"use strict";n.d(t,{d:()=>l,z:()=>u});var r=n(97247),o=n(28964),i=n(69008),s=n(87972),a=n(40677);let l=(0,s.j)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),u=o.forwardRef(({className:e,variant:t,size:n,asChild:o=!1,...s},u)=>{let c=o?i.g7:"button";return r.jsx(c,{className:(0,a.cn)(l({variant:t,size:n,className:e})),ref:u,...s})});u.displayName="Button"},55757:(e,t,n)=>{"use strict";n.d(t,{Ol:()=>a,Zb:()=>s,aY:()=>u,ll:()=>l});var r=n(97247),o=n(28964),i=n(40677);let s=o.forwardRef(({className:e,...t},n)=>r.jsx("div",{ref:n,className:(0,i.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...t}));s.displayName="Card";let a=o.forwardRef(({className:e,...t},n)=>r.jsx("div",{ref:n,className:(0,i.cn)("flex flex-col space-y-1.5 p-6",e),...t}));a.displayName="CardHeader";let l=o.forwardRef(({className:e,...t},n)=>r.jsx("div",{ref:n,className:(0,i.cn)("text-2xl font-semibold leading-none tracking-tight",e),...t}));l.displayName="CardTitle",o.forwardRef(({className:e,...t},n)=>r.jsx("div",{ref:n,className:(0,i.cn)("text-sm text-muted-foreground",e),...t})).displayName="CardDescription";let u=o.forwardRef(({className:e,...t},n)=>r.jsx("div",{ref:n,className:(0,i.cn)("p-6 pt-0",e),...t}));u.displayName="CardContent",o.forwardRef(({className:e,...t},n)=>r.jsx("div",{ref:n,className:(0,i.cn)("flex items-center p-6 pt-0",e),...t})).displayName="CardFooter"},93294:(e,t,n)=>{"use strict";n.d(t,{Toaster:()=>h});var r=n(97247),o=n(49835),i=n(28964),s=n(57574),a=n(87972),l=n(37013),u=n(40677);let c=s.zt,d=i.forwardRef(({className:e,...t},n)=>r.jsx(s.l_,{ref:n,className:(0,u.cn)("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",e),...t}));d.displayName=s.l_.displayName;let f=(0,a.j)("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",{variants:{variant:{default:"border bg-background text-foreground",destructive:"destructive group border-destructive bg-destructive text-destructive-foreground"}},defaultVariants:{variant:"default"}}),p=i.forwardRef(({className:e,variant:t,...n},o)=>r.jsx(s.fC,{ref:o,className:(0,u.cn)(f({variant:t}),e),...n}));p.displayName=s.fC.displayName,i.forwardRef(({className:e,...t},n)=>r.jsx(s.aU,{ref:n,className:(0,u.cn)("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",e),...t})).displayName=s.aU.displayName;let m=i.forwardRef(({className:e,...t},n)=>r.jsx(s.x8,{ref:n,className:(0,u.cn)("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",e),"toast-close":"",...t,children:r.jsx(l.Z,{className:"h-4 w-4"})}));m.displayName=s.x8.displayName;let g=i.forwardRef(({className:e,...t},n)=>r.jsx(s.Dx,{ref:n,className:(0,u.cn)("text-sm font-semibold",e),...t}));g.displayName=s.Dx.displayName;let x=i.forwardRef(({className:e,...t},n)=>r.jsx(s.dk,{ref:n,className:(0,u.cn)("text-sm opacity-90",e),...t}));function h(){let{toasts:e}=(0,o.pm)();return(0,r.jsxs)(c,{children:[e.map(function({id:e,title:t,description:n,action:o,...i}){return(0,r.jsxs)(p,{...i,children:[(0,r.jsxs)("div",{className:"grid gap-1",children:[t&&r.jsx(g,{children:t}),n&&r.jsx(x,{children:n})]}),o,r.jsx(m,{})]},e)}),r.jsx(d,{})]})}x.displayName=s.dk.displayName},67312:(e,t,n)=>{"use strict";n.d(t,{default:()=>i});var r=n(97247),o=n(19898);function i({children:e}){return r.jsx(o.SessionProvider,{children:e})}},49835:(e,t,n)=>{"use strict";n.d(t,{pm:()=>f});var r=n(28964);let o=0,i=new Map,s=e=>{if(i.has(e))return;let t=setTimeout(()=>{i.delete(e),c({type:"REMOVE_TOAST",toastId:e})},1e6);i.set(e,t)},a=(e,t)=>{switch(t.type){case"ADD_TOAST":return{...e,toasts:[t.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case"DISMISS_TOAST":{let{toastId:n}=t;return n?s(n):e.toasts.forEach(e=>{s(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===n||void 0===n?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===t.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)}}},l=[],u={toasts:[]};function c(e){u=a(u,e),l.forEach(e=>{e(u)})}function d({...e}){let t=(o=(o+1)%Number.MAX_SAFE_INTEGER).toString(),n=()=>c({type:"DISMISS_TOAST",toastId:t});return c({type:"ADD_TOAST",toast:{...e,id:t,open:!0,onOpenChange:e=>{e||n()}}}),{id:t,dismiss:n,update:e=>c({type:"UPDATE_TOAST",toast:{...e,id:t}})}}function f(){let[e,t]=r.useState(u);return r.useEffect(()=>(l.push(t),()=>{let e=l.indexOf(t);e>-1&&l.splice(e,1)}),[e]),{...e,toast:d,dismiss:e=>c({type:"DISMISS_TOAST",toastId:e})}}},40677:(e,t,n)=>{"use strict";n.d(t,{cn:()=>i});var r=n(61929),o=n(35770);function i(...e){return(0,o.m6)((0,r.W)(e))}},75327:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>f,metadata:()=>d});var r=n(72051),o=n(52017),i=n.n(o),s=n(99005),a=n.n(s);n(5023);var l=n(45347);let u=(0,l.createProxy)(String.raw`E:\NextJS\mystrymessage\src\context\AuthProvider.tsx#default`),c=(0,l.createProxy)(String.raw`E:\NextJS\mystrymessage\src\components\ui\toaster.tsx#Toaster`),d={title:"Create Next App",description:"Generated by create next app"};function f({children:e}){return r.jsx("html",{lang:"en",children:r.jsx(u,{children:(0,r.jsxs)("body",{className:`${i().variable} ${a().variable} antialiased`,children:[e,r.jsx(c,{})]})})})}},4148:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>r});let r=(0,n(45347).createProxy)(String.raw`E:\NextJS\mystrymessage\src\app\page.tsx#default`)},73881:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>o});var r=n(54564);let o=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,r.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]},5023:()=>{}};var t=require("../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),r=t.X(0,[379,614,564],()=>n(53270));module.exports=r})();