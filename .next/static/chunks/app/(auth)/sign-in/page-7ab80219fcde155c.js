(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[389],{6831:function(e,t,r){Promise.resolve().then(r.bind(r,7523))},7523:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return x}});var n=r(7437);r(2265);var s=r(3590),i=r(9501),o=r(605),a=r(935),d=r(2381),c=r(279),l=r(7648),u=r(9376),f=r(3340),m=r(1229);let p=m.z.object({identifier:m.z.string(),password:m.z.string()});function x(){let e=(0,u.useRouter)(),t=(0,i.cI)({resolver:(0,s.F)(p),defaultValues:{identifier:"",password:""}}),{toast:r}=(0,f.pm)(),m=async t=>{let n=await (0,o.signIn)("credentials",{redirect:!1,identifier:t.identifier,password:t.password});(null==n?void 0:n.error)&&("CredentialsSignin"===n.error?r({title:"Login Failed",description:"Incorrect username or password",variant:"destructive"}):r({title:"Error",description:n.error,variant:"destructive"})),(null==n?void 0:n.url)&&e.replace("/dashboard")};return(0,n.jsx)("div",{className:"flex justify-center items-center min-h-screen bg-gray-800",children:(0,n.jsxs)("div",{className:"w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md",children:[(0,n.jsxs)("div",{className:"text-center",children:[(0,n.jsx)("h1",{className:"text-4xl font-extrabold tracking-tight lg:text-5xl mb-6",children:"Welcome Back to True Feedback"}),(0,n.jsx)("p",{className:"mb-4",children:"Sign in to continue your secret conversations"})]}),(0,n.jsx)(a.l0,{...t,children:(0,n.jsxs)("form",{onSubmit:t.handleSubmit(m),className:"space-y-6",children:[(0,n.jsx)(a.Wi,{name:"identifier",control:t.control,render:e=>{let{field:t}=e;return(0,n.jsxs)(a.xJ,{children:[(0,n.jsx)(a.lX,{children:"Email/Username"}),(0,n.jsx)(c.I,{...t}),(0,n.jsx)(a.zG,{})]})}}),(0,n.jsx)(a.Wi,{name:"password",control:t.control,render:e=>{let{field:t}=e;return(0,n.jsxs)(a.xJ,{children:[(0,n.jsx)(a.lX,{children:"Password"}),(0,n.jsx)(c.I,{type:"password",...t}),(0,n.jsx)(a.zG,{})]})}}),(0,n.jsx)(d.z,{className:"w-full",type:"submit",children:"Sign In"})]})}),(0,n.jsx)("div",{className:"text-center mt-4",children:(0,n.jsxs)("p",{children:["Not a member yet?"," ",(0,n.jsx)(l.default,{href:"/sign-up",className:"text-blue-600 hover:text-blue-800",children:"Sign up"})]})})]})})}},2381:function(e,t,r){"use strict";r.d(t,{d:function(){return d},z:function(){return c}});var n=r(7437),s=r(2265),i=r(7053),o=r(535),a=r(3448);let d=(0,o.j)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),c=s.forwardRef((e,t)=>{let{className:r,variant:s,size:o,asChild:c=!1,...l}=e,u=c?i.g7:"button";return(0,n.jsx)(u,{className:(0,a.cn)(d({variant:s,size:o,className:r})),ref:t,...l})});c.displayName="Button"},935:function(e,t,r){"use strict";r.d(t,{l0:function(){return u},NI:function(){return h},Wi:function(){return m},xJ:function(){return g},lX:function(){return v},zG:function(){return b}});var n=r(7437),s=r(2265),i=r(7053),o=r(9501),a=r(3448),d=r(6394);let c=(0,r(535).j)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),l=s.forwardRef((e,t)=>{let{className:r,...s}=e;return(0,n.jsx)(d.f,{ref:t,className:(0,a.cn)(c(),r),...s})});l.displayName=d.f.displayName;let u=o.RV,f=s.createContext({}),m=e=>{let{...t}=e;return(0,n.jsx)(f.Provider,{value:{name:t.name},children:(0,n.jsx)(o.Qr,{...t})})},p=()=>{let e=s.useContext(f),t=s.useContext(x),{getFieldState:r,formState:n}=(0,o.Gc)(),i=r(e.name,n);if(!e)throw Error("useFormField should be used within <FormField>");let{id:a}=t;return{id:a,name:e.name,formItemId:"".concat(a,"-form-item"),formDescriptionId:"".concat(a,"-form-item-description"),formMessageId:"".concat(a,"-form-item-message"),...i}},x=s.createContext({}),g=s.forwardRef((e,t)=>{let{className:r,...i}=e,o=s.useId();return(0,n.jsx)(x.Provider,{value:{id:o},children:(0,n.jsx)("div",{ref:t,className:(0,a.cn)("space-y-2",r),...i})})});g.displayName="FormItem";let v=s.forwardRef((e,t)=>{let{className:r,...s}=e,{error:i,formItemId:o}=p();return(0,n.jsx)(l,{ref:t,className:(0,a.cn)(i&&"text-destructive",r),htmlFor:o,...s})});v.displayName="FormLabel";let h=s.forwardRef((e,t)=>{let{...r}=e,{error:s,formItemId:o,formDescriptionId:a,formMessageId:d}=p();return(0,n.jsx)(i.g7,{ref:t,id:o,"aria-describedby":s?"".concat(a," ").concat(d):"".concat(a),"aria-invalid":!!s,...r})});h.displayName="FormControl",s.forwardRef((e,t)=>{let{className:r,...s}=e,{formDescriptionId:i}=p();return(0,n.jsx)("p",{ref:t,id:i,className:(0,a.cn)("text-sm text-muted-foreground",r),...s})}).displayName="FormDescription";let b=s.forwardRef((e,t)=>{let{className:r,children:s,...i}=e,{error:o,formMessageId:d}=p(),c=o?String(null==o?void 0:o.message):s;return c?(0,n.jsx)("p",{ref:t,id:d,className:(0,a.cn)("text-sm font-medium text-destructive",r),...i,children:c}):null});b.displayName="FormMessage"},279:function(e,t,r){"use strict";r.d(t,{I:function(){return o}});var n=r(7437),s=r(2265),i=r(3448);let o=s.forwardRef((e,t)=>{let{className:r,type:s,...o}=e;return(0,n.jsx)("input",{type:s,className:(0,i.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",r),ref:t,...o})});o.displayName="Input"},3340:function(e,t,r){"use strict";r.d(t,{pm:function(){return f}});var n=r(2265);let s=0,i=new Map,o=e=>{if(i.has(e))return;let t=setTimeout(()=>{i.delete(e),l({type:"REMOVE_TOAST",toastId:e})},1e6);i.set(e,t)},a=(e,t)=>{switch(t.type){case"ADD_TOAST":return{...e,toasts:[t.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case"DISMISS_TOAST":{let{toastId:r}=t;return r?o(r):e.toasts.forEach(e=>{o(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===t.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)}}},d=[],c={toasts:[]};function l(e){c=a(c,e),d.forEach(e=>{e(c)})}function u(e){let{...t}=e,r=(s=(s+1)%Number.MAX_SAFE_INTEGER).toString(),n=()=>l({type:"DISMISS_TOAST",toastId:r});return l({type:"ADD_TOAST",toast:{...t,id:r,open:!0,onOpenChange:e=>{e||n()}}}),{id:r,dismiss:n,update:e=>l({type:"UPDATE_TOAST",toast:{...e,id:r}})}}function f(){let[e,t]=n.useState(c);return n.useEffect(()=>(d.push(t),()=>{let e=d.indexOf(t);e>-1&&d.splice(e,1)}),[e]),{...e,toast:u,dismiss:e=>l({type:"DISMISS_TOAST",toastId:e})}}},3448:function(e,t,r){"use strict";r.d(t,{cn:function(){return i}});var n=r(1994),s=r(3335);function i(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return(0,s.m6)((0,n.W)(t))}}},function(e){e.O(0,[569,318,605,22,971,117,744],function(){return e(e.s=6831)}),_N_E=e.O()}]);