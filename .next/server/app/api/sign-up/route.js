"use strict";(()=>{var e={};e.id=163,e.ids=[163],e.modules={11185:e=>{e.exports=require("mongoose")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},61212:e=>{e.exports=require("async_hooks")},84770:e=>{e.exports=require("crypto")},76162:e=>{e.exports=require("stream")},21764:e=>{e.exports=require("util")},84492:e=>{e.exports=require("node:stream")},5870:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>rr,patchFetch:()=>rt,requestAsyncStorage:()=>e8,routeModule:()=>e3,serverHooks:()=>re,staticGenerationAsyncStorage:()=>e9});var n={};t.r(n),t.d(n,{POST:()=>e7});var s=t(73278),i=t(45002),a=t(54877),o=t(51534),l=t(63506),c=t.n(l),d=Object.defineProperty,u=Object.defineProperties,f=Object.getOwnPropertyDescriptors,p=Object.getOwnPropertySymbols,h=Object.prototype.hasOwnProperty,y=Object.prototype.propertyIsEnumerable,m=(e,r,t)=>r in e?d(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,g=(e,r)=>{for(var t in r||(r={}))h.call(r,t)&&m(e,t,r[t]);if(p)for(var t of p(r))y.call(r,t)&&m(e,t,r[t]);return e},b=(e,r)=>u(e,f(r)),v=(e,r,t)=>new Promise((n,s)=>{var i=e=>{try{o(t.next(e))}catch(e){s(e)}},a=e=>{try{o(t.throw(e))}catch(e){s(e)}},o=e=>e.done?n(e.value):Promise.resolve(e.value).then(i,a);o((t=t.apply(e,r)).next())}),O=class{constructor(e){this.resend=e}create(e){return v(this,arguments,function*(e,r={}){return yield this.resend.post("/api-keys",e,r)})}list(){return v(this,null,function*(){return yield this.resend.get("/api-keys")})}remove(e){return v(this,null,function*(){return yield this.resend.delete(`/api-keys/${e}`)})}},j=class{constructor(e){this.resend=e}create(e){return v(this,arguments,function*(e,r={}){return yield this.resend.post("/audiences",e,r)})}list(){return v(this,null,function*(){return yield this.resend.get("/audiences")})}get(e){return v(this,null,function*(){return yield this.resend.get(`/audiences/${e}`)})}remove(e){return v(this,null,function*(){return yield this.resend.delete(`/audiences/${e}`)})}},w=class{constructor(e){this.resend=e}send(e){return v(this,arguments,function*(e,r={}){return this.create(e,r)})}create(e){return v(this,arguments,function*(e,r={}){for(let r of e)if(r.react){if(!this.renderAsync)try{let{renderAsync:e}=yield t.e(444).then(t.bind(t,14444));this.renderAsync=e}catch(e){throw Error("Failed to render React component. Make sure to install `@react-email/render`")}r.html=yield this.renderAsync(r.react),r.react=void 0}return yield this.resend.post("/emails/batch",e,r)})}},x=class{constructor(e){this.resend=e}create(e){return v(this,arguments,function*(e,r={}){return yield this.resend.post(`/audiences/${e.audienceId}/contacts`,{unsubscribed:e.unsubscribed,email:e.email,first_name:e.firstName,last_name:e.lastName},r)})}list(e){return v(this,null,function*(){return yield this.resend.get(`/audiences/${e.audienceId}/contacts`)})}get(e){return v(this,null,function*(){return yield this.resend.get(`/audiences/${e.audienceId}/contacts/${e.id}`)})}update(e){return v(this,null,function*(){return yield this.resend.patch(`/audiences/${e.audienceId}/contacts/${e.id}`,{unsubscribed:e.unsubscribed,first_name:e.firstName,last_name:e.lastName})})}remove(e){return v(this,null,function*(){return yield this.resend.delete(`/audiences/${e.audienceId}/contacts/${(null==e?void 0:e.email)?null==e?void 0:e.email:null==e?void 0:e.id}`)})}},P=class{constructor(e){this.resend=e}create(e){return v(this,arguments,function*(e,r={}){return yield this.resend.post("/domains",e,r)})}list(){return v(this,null,function*(){return yield this.resend.get("/domains")})}get(e){return v(this,null,function*(){return yield this.resend.get(`/domains/${e}`)})}update(e){return v(this,null,function*(){return yield this.resend.patch(`/domains/${e.id}`,{click_tracking:e.clickTracking,open_tracking:e.openTracking,tls:e.tls})})}remove(e){return v(this,null,function*(){return yield this.resend.delete(`/domains/${e}`)})}verify(e){return v(this,null,function*(){return yield this.resend.post(`/domains/${e}/verify`)})}},E=class{constructor(e){this.resend=e}send(e){return v(this,arguments,function*(e,r={}){return this.create(e,r)})}create(e){return v(this,arguments,function*(e,r={}){if(e.react){if(!this.renderAsync)try{let{renderAsync:e}=yield t.e(444).then(t.bind(t,14444));this.renderAsync=e}catch(e){throw Error("Failed to render React component. Make sure to install `@react-email/render`")}e.html=yield this.renderAsync(e.react)}return yield this.resend.post("/emails",{attachments:e.attachments,bcc:e.bcc,cc:e.cc,from:e.from,headers:e.headers,html:e.html,reply_to:e.replyTo,scheduled_at:e.scheduledAt,subject:e.subject,tags:e.tags,text:e.text,to:e.to},r)})}get(e){return v(this,null,function*(){return yield this.resend.get(`/emails/${e}`)})}update(e){return v(this,null,function*(){return yield this.resend.patch(`/emails/${e.id}`,{scheduled_at:e.scheduledAt})})}cancel(e){return v(this,null,function*(){return yield this.resend.post(`/emails/${e}/cancel`)})}},S="undefined"!=typeof process&&process.env&&process.env.RESEND_BASE_URL||"https://api.resend.com",R="undefined"!=typeof process&&process.env&&process.env.RESEND_USER_AGENT||"resend-node:4.0.1";let q=new class{constructor(e){if(this.key=e,this.apiKeys=new O(this),this.audiences=new j(this),this.batch=new w(this),this.contacts=new x(this),this.domains=new P(this),this.emails=new E(this),!e&&("undefined"!=typeof process&&process.env&&(this.key=process.env.RESEND_API_KEY),!this.key))throw Error('Missing API key. Pass it to the constructor `new Resend("re_123")`');this.headers=new Headers({Authorization:`Bearer ${this.key}`,"User-Agent":R,"Content-Type":"application/json"})}fetchRequest(e){return v(this,arguments,function*(e,r={}){try{let t=yield fetch(`${S}${e}`,r);if(!t.ok)try{let e=yield t.text();return{data:null,error:JSON.parse(e)}}catch(r){if(r instanceof SyntaxError)return{data:null,error:{name:"application_error",message:"Internal server error. We are unable to process your request right now, please try again later."}};let e={message:t.statusText,name:"application_error"};if(r instanceof Error)return{data:null,error:b(g({},e),{message:r.message})};return{data:null,error:e}}return{data:yield t.json(),error:null}}catch(e){return{data:null,error:{name:"application_error",message:"Unable to fetch data. The request could not be resolved."}}}})}post(e,r){return v(this,arguments,function*(e,r,t={}){let n=g({method:"POST",headers:this.headers,body:JSON.stringify(r)},t);return this.fetchRequest(e,n)})}get(e){return v(this,arguments,function*(e,r={}){let t=g({method:"GET",headers:this.headers},r);return this.fetchRequest(e,t)})}put(e,r){return v(this,arguments,function*(e,r,t={}){let n=g({method:"PUT",headers:this.headers,body:JSON.stringify(r)},t);return this.fetchRequest(e,n)})}patch(e,r){return v(this,arguments,function*(e,r,t={}){let n=g({method:"PATCH",headers:this.headers,body:JSON.stringify(r)},t);return this.fetchRequest(e,n)})}delete(e,r){return v(this,null,function*(){let t={method:"DELETE",headers:this.headers,body:JSON.stringify(r)};return this.fetchRequest(e,t)})}}(process.env.RESEND_API_KEY);var $=t(72051),A=t(26269),_=Object.defineProperty,k=Object.defineProperties,N=Object.getOwnPropertyDescriptors,D=Object.getOwnPropertySymbols,T=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable,C=(e,r,t)=>r in e?_(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,F=(e,r)=>{for(var t in r||(r={}))T.call(r,t)&&C(e,t,r[t]);if(D)for(var t of D(r))I.call(r,t)&&C(e,t,r[t]);return e},U=(e,r)=>k(e,N(r)),H=(e,r)=>{var t={};for(var n in e)T.call(e,n)&&0>r.indexOf(n)&&(t[n]=e[n]);if(null!=e&&D)for(var n of D(e))0>r.indexOf(n)&&I.call(e,n)&&(t[n]=e[n]);return t},M=A.forwardRef((e,r)=>{var{children:t,lang:n="en",dir:s="ltr"}=e,i=H(e,["children","lang","dir"]);return(0,$.jsx)("html",U(F({},i),{dir:s,lang:n,ref:r,children:t}))});M.displayName="Html";var V=Object.defineProperty,B=Object.defineProperties,J=Object.getOwnPropertyDescriptors,K=Object.getOwnPropertySymbols,Z=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable,G=(e,r,t)=>r in e?V(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,W=(e,r)=>{for(var t in r||(r={}))Z.call(r,t)&&G(e,t,r[t]);if(K)for(var t of K(r))L.call(r,t)&&G(e,t,r[t]);return e},z=(e,r)=>B(e,J(r)),Y=(e,r)=>{var t={};for(var n in e)Z.call(e,n)&&0>r.indexOf(n)&&(t[n]=e[n]);if(null!=e&&K)for(var n of K(e))0>r.indexOf(n)&&L.call(e,n)&&(t[n]=e[n]);return t},X=A.forwardRef((e,r)=>{var{children:t}=e,n=Y(e,["children"]);return(0,$.jsxs)("head",z(W({},n),{ref:r,children:[(0,$.jsx)("meta",{content:"text/html; charset=UTF-8",httpEquiv:"Content-Type"}),(0,$.jsx)("meta",{name:"x-apple-disable-message-reformatting"}),t]}))});X.displayName="Head";var Q=({fontFamily:e,fallbackFontFamily:r,webFont:t,fontStyle:n="normal",fontWeight:s=400})=>{let i=t?`src: url(${t.url}) format('${t.format}');`:"",a=`
    @font-face {
      font-family: '${e}';
      font-style: ${n};
      font-weight: ${s};
      mso-font-alt: '${Array.isArray(r)?r[0]:r}';
      ${i}
    }

    * {
      font-family: '${e}', ${Array.isArray(r)?r.join(", "):r};
    }
  `;return(0,$.jsx)("style",{dangerouslySetInnerHTML:{__html:a}})},ee=Object.defineProperty,er=Object.defineProperties,et=Object.getOwnPropertyDescriptors,en=Object.getOwnPropertySymbols,es=Object.prototype.hasOwnProperty,ei=Object.prototype.propertyIsEnumerable,ea=(e,r,t)=>r in e?ee(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,eo=(e,r)=>{for(var t in r||(r={}))es.call(r,t)&&ea(e,t,r[t]);if(en)for(var t of en(r))ei.call(r,t)&&ea(e,t,r[t]);return e},el=(e,r)=>er(e,et(r)),ec=(e,r)=>{var t={};for(var n in e)es.call(e,n)&&0>r.indexOf(n)&&(t[n]=e[n]);if(null!=e&&en)for(var n of en(e))0>r.indexOf(n)&&ei.call(e,n)&&(t[n]=e[n]);return t},ed=A.forwardRef((e,r)=>{var{children:t=""}=e,n=ec(e,["children"]);let s=(Array.isArray(t)?t.join(""):t).substring(0,150);return(0,$.jsxs)("div",el(eo({style:{display:"none",overflow:"hidden",lineHeight:"1px",opacity:0,maxHeight:0,maxWidth:0}},n),{ref:r,children:[s,eu(s)]}))});ed.displayName="Preview";var eu=e=>e.length>=150?null:(0,$.jsx)("div",{children:"\xa0‌​‍‎‏\uFEFF".repeat(150-e.length)}),ef=Object.defineProperty,ep=Object.defineProperties,eh=Object.getOwnPropertyDescriptors,ey=Object.getOwnPropertySymbols,em=Object.prototype.hasOwnProperty,eg=Object.prototype.propertyIsEnumerable,eb=(e,r,t)=>r in e?ef(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,ev=(e,r)=>{for(var t in r||(r={}))em.call(r,t)&&eb(e,t,r[t]);if(ey)for(var t of ey(r))eg.call(r,t)&&eb(e,t,r[t]);return e},eO=(e,r)=>ep(e,eh(r)),ej=(e,r)=>{var t={};for(var n in e)em.call(e,n)&&0>r.indexOf(n)&&(t[n]=e[n]);if(null!=e&&ey)for(var n of ey(e))0>r.indexOf(n)&&eg.call(e,n)&&(t[n]=e[n]);return t},ew=A.forwardRef((e,r)=>{var{children:t,style:n}=e,s=ej(e,["children","style"]);return(0,$.jsx)("table",eO(ev({align:"center",width:"100%",border:0,cellPadding:"0",cellSpacing:"0",role:"presentation"},s),{ref:r,style:n,children:(0,$.jsx)("tbody",{children:(0,$.jsx)("tr",{children:(0,$.jsx)("td",{children:t})})})}))});ew.displayName="Section";var ex=Object.defineProperty,eP=Object.defineProperties,eE=Object.getOwnPropertyDescriptors,eS=Object.getOwnPropertySymbols,eR=Object.prototype.hasOwnProperty,eq=Object.prototype.propertyIsEnumerable,e$=(e,r,t)=>r in e?ex(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,eA=(e,r)=>{for(var t in r||(r={}))eR.call(r,t)&&e$(e,t,r[t]);if(eS)for(var t of eS(r))eq.call(r,t)&&e$(e,t,r[t]);return e},e_=(e,r)=>eP(e,eE(r)),ek=(e,r)=>{var t={};for(var n in e)eR.call(e,n)&&0>r.indexOf(n)&&(t[n]=e[n]);if(null!=e&&eS)for(var n of eS(e))0>r.indexOf(n)&&eq.call(e,n)&&(t[n]=e[n]);return t},eN=A.forwardRef((e,r)=>{var{children:t,style:n}=e,s=ek(e,["children","style"]);return(0,$.jsx)("table",e_(eA({align:"center",width:"100%",border:0,cellPadding:"0",cellSpacing:"0",role:"presentation"},s),{ref:r,style:n,children:(0,$.jsx)("tbody",{style:{width:"100%"},children:(0,$.jsx)("tr",{style:{width:"100%"},children:t})})}))});eN.displayName="Row";var eD=Object.defineProperty,eT=Object.defineProperties,eI=Object.getOwnPropertyDescriptors,eC=Object.getOwnPropertySymbols,eF=Object.prototype.hasOwnProperty,eU=Object.prototype.propertyIsEnumerable,eH=(e,r,t)=>r in e?eD(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,eM=(e,r)=>{for(var t in r||(r={}))eF.call(r,t)&&eH(e,t,r[t]);if(eC)for(var t of eC(r))eU.call(r,t)&&eH(e,t,r[t]);return e},eV=(e,r)=>eT(e,eI(r)),eB=(e,r)=>{var t={};for(var n in e)eF.call(e,n)&&0>r.indexOf(n)&&(t[n]=e[n]);if(null!=e&&eC)for(var n of eC(e))0>r.indexOf(n)&&eU.call(e,n)&&(t[n]=e[n]);return t},eJ=e=>[eK(e.m,["margin"]),eK(e.mx,["marginLeft","marginRight"]),eK(e.my,["marginTop","marginBottom"]),eK(e.mt,["marginTop"]),eK(e.mr,["marginRight"]),eK(e.mb,["marginBottom"]),eK(e.ml,["marginLeft"])].filter(e=>Object.keys(e).length).reduce((e,r)=>eM(eM({},e),r),{}),eK=(e,r)=>r.reduce((r,t)=>isNaN(parseFloat(e))?r:eV(eM({},r),{[t]:`${e}px`}),{}),eZ=A.forwardRef((e,r)=>{var{as:t="h1",children:n,style:s,m:i,mx:a,my:o,mt:l,mr:c,mb:d,ml:u}=e,f=eB(e,["as","children","style","m","mx","my","mt","mr","mb","ml"]);return(0,$.jsx)(t,eV(eM({},f),{ref:r,style:eM(eM({},eJ({m:i,mx:a,my:o,mt:l,mr:c,mb:d,ml:u})),s),children:n}))});eZ.displayName="Heading";var eL=Object.defineProperty,eG=Object.defineProperties,eW=Object.getOwnPropertyDescriptors,ez=Object.getOwnPropertySymbols,eY=Object.prototype.hasOwnProperty,eX=Object.prototype.propertyIsEnumerable,eQ=(e,r,t)=>r in e?eL(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,e0=(e,r)=>{for(var t in r||(r={}))eY.call(r,t)&&eQ(e,t,r[t]);if(ez)for(var t of ez(r))eX.call(r,t)&&eQ(e,t,r[t]);return e},e1=(e,r)=>eG(e,eW(r)),e4=(e,r)=>{var t={};for(var n in e)eY.call(e,n)&&0>r.indexOf(n)&&(t[n]=e[n]);if(null!=e&&ez)for(var n of ez(e))0>r.indexOf(n)&&eX.call(e,n)&&(t[n]=e[n]);return t},e5=A.forwardRef((e,r)=>{var{style:t}=e,n=e4(e,["style"]);return(0,$.jsx)("p",e1(e0({},n),{ref:r,style:e0({fontSize:"14px",lineHeight:"24px",margin:"16px 0"},t)}))});async function e2(e,r,t){try{return await q.emails.send({from:"onboarding@resend.dev",to:e,subject:"Mystery message | Verification Code",react:function({username:e,otp:r}){return(0,$.jsxs)(M,{lang:"en",dir:"ltr",children:[(0,$.jsxs)(X,{children:[$.jsx("title",{children:"Verification Code"}),$.jsx(Q,{fontFamily:"Roboto",fallbackFontFamily:"Verdana",webFont:{url:"https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",format:"woff2"},fontWeight:400,fontStyle:"normal"})]}),(0,$.jsxs)(ed,{children:["Here's your verification code: ",r]}),(0,$.jsxs)(ew,{children:[$.jsx(eN,{children:(0,$.jsxs)(eZ,{as:"h2",children:["Hello ",e,","]})}),$.jsx(eN,{children:$.jsx(e5,{children:"Thank you for registering. Please use the following verification code to complete your registration:"})}),$.jsx(eN,{children:$.jsx(e5,{children:r})}),$.jsx(eN,{children:$.jsx(e5,{children:"If you did not request this code, please ignore this email."})})]})]})}({username:r,otp:t})}),{success:!0,message:"Verification email Send Successfully"}}catch(e){return console.log("Error sending verification email",e),{success:!1,message:"Failed to send Verification Email"}}}e5.displayName="Text";var e6=t(62651);async function e7(e){await (0,o.Z)();try{let{username:r,email:t,password:n}=await e.json();if(await e6.Z.findOne({username:r,isVerified:!0}))return Response.json({success:!1,message:"Username is already taken"},{status:400});let s=await e6.Z.findOne({email:t}),i=Math.floor(1e5+9e5*Math.random()).toString();if(s){if(s.isVerified)return Response.json({success:!1,message:"User already exists with this email"},{status:400});{let e=await c().hash(n,10);s.password=e,s.verifyCode=i,s.verifyCodeExpiry=new Date(Date.now()+36e5),await s.save()}}else{let e=await c().hash(n,10),s=new Date;s.setHours(s.getHours()+1);let a=new e6.Z({username:r,email:t,password:e,verifyCode:i,isVerified:!1,verifyCodeExpiry:s,isAcceptingMessage:!0,messages:[]});await a.save()}let a=await e2(t,r,i);if(!a.success)return Response.json({success:!1,message:a.message},{status:500});return Response.json({success:!0,message:"User registered successfully. Please verify your email."},{status:200})}catch(e){return console.error("Error registering user",e),Response.json({success:!1,message:"Error in registering user"},{status:500})}}let e3=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/sign-up/route",pathname:"/api/sign-up",filename:"route",bundlePath:"app/api/sign-up/route"},resolvedPagePath:"E:\\NextJS\\mystrymessage\\src\\app\\api\\sign-up\\route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:e8,staticGenerationAsyncStorage:e9,serverHooks:re}=e3,rr="/api/sign-up/route";function rt(){return(0,a.patchFetch)({serverHooks:re,staticGenerationAsyncStorage:e9})}},72051:(e,r,t)=>{e.exports=t(30170).vendored["react-rsc"].ReactJsxRuntime},51534:(e,r,t)=>{t.d(r,{Z:()=>a});var n=t(11185),s=t.n(n);let i={},a=async function(){if(i.isConnected){console.log("Already connected to database");return}try{let e=await s().connect(process.env.MONGODB_URI||"",{});console.log("db:",e),i.isConnected=e.connections[0].readyState,console.log("db.connetions:",e.connection),console.log("DB Connected Successfully")}catch(e){console.log("Database connection failed",e),process.exit(1)}}},62651:(e,r,t)=>{t.d(r,{Z:()=>o});var n=t(11185),s=t.n(n);let i=new n.Schema({content:{type:String,required:!0},createdAt:{type:Date,required:!0,default:Date.now}}),a=new n.Schema({username:{type:String,required:[!0,"Username is required"],trim:!0,unique:!0},email:{type:String,required:[!0,"Email is Required"],unique:!0,match:[/.+\@.+\..+/,"please use a valid email adderss"]},password:{type:String,required:[!0,"password is required"]},verifyCode:{type:String,required:[!0,"Verify Code is required"]},verifyCodeExpiry:{type:Date,required:[!0,"verify code is Expired"]},isVerified:{type:Boolean,default:!1},isAcceptingMessage:{type:Boolean,default:!0},messages:[i]}),o=s().models.User||s().model("User",a)}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),n=r.X(0,[379,903],()=>t(5870));module.exports=n})();