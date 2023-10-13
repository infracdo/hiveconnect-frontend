import{c as W,h as N,v as ee,i as te,j as $,k as Z,u as oe,f as le,a as ne}from"./QBtn.326e8d97.js";import{c as f,h as B,a as I,Z as j,w as F,o as ie,g as V,d as R,k as h,l as p,x as G,$ as re,E as J,a0 as se,r as O,A as ae}from"./index.1f269414.js";var ke=W({name:"QItemLabel",props:{overline:Boolean,caption:Boolean,header:Boolean,lines:[Number,String]},setup(e,{slots:t}){const o=f(()=>parseInt(e.lines,10)),l=f(()=>"q-item__label"+(e.overline===!0?" q-item__label--overline text-overline":"")+(e.caption===!0?" q-item__label--caption text-caption":"")+(e.header===!0?" q-item__label--header":"")+(o.value===1?" ellipsis":"")),i=f(()=>e.lines!==void 0&&o.value>1?{overflow:"hidden",display:"-webkit-box","-webkit-box-orient":"vertical","-webkit-line-clamp":o.value}:null);return()=>B("div",{style:i.value,class:l.value},N(t.default))}});const ue={dark:{type:Boolean,default:null}};function ce(e,t){return f(()=>e.dark===null?t.dark.isActive:e.dark)}function xe(e,t,o){let l;function i(){l!==void 0&&(j.remove(l),l=void 0)}return I(()=>{e.value===!0&&i()}),{removeFromHistory:i,addToHistory(){l={condition:()=>o.value===!0,handler:t},j.add(l)}}}const Ee={modelValue:{type:Boolean,default:null},"onUpdate:modelValue":[Function,Array]},Le=["beforeShow","show","beforeHide","hide"];function Te({showing:e,canShow:t,hideOnRouteChange:o,handleShow:l,handleHide:i,processOnMount:v}){const a=V(),{props:u,emit:d,proxy:x}=a;let c;function b(n){e.value===!0?g(n):y(n)}function y(n){if(u.disable===!0||n!==void 0&&n.qAnchorHandled===!0||t!==void 0&&t(n)!==!0)return;const r=u["onUpdate:modelValue"]!==void 0;r===!0&&(d("update:modelValue",!0),c=n,R(()=>{c===n&&(c=void 0)})),(u.modelValue===null||r===!1)&&m(n)}function m(n){e.value!==!0&&(e.value=!0,d("beforeShow",n),l!==void 0?l(n):d("show",n))}function g(n){if(u.disable===!0)return;const r=u["onUpdate:modelValue"]!==void 0;r===!0&&(d("update:modelValue",!1),c=n,R(()=>{c===n&&(c=void 0)})),(u.modelValue===null||r===!1)&&E(n)}function E(n){e.value!==!1&&(e.value=!1,d("beforeHide",n),i!==void 0?i(n):d("hide",n))}function L(n){u.disable===!0&&n===!0?u["onUpdate:modelValue"]!==void 0&&d("update:modelValue",!1):n===!0!==e.value&&(n===!0?m:E)(c)}F(()=>u.modelValue,L),o!==void 0&&ee(a)===!0&&F(()=>x.$route.fullPath,()=>{o.value===!0&&e.value===!0&&g()}),v===!0&&ie(()=>{L(u.modelValue)});const T={show:y,hide:g,toggle:b};return Object.assign(x,T),T}const de=[null,document,document.body,document.scrollingElement,document.documentElement];function Se(e,t){let o=te(t);if(o===void 0){if(e==null)return window;o=e.closest(".scroll,.scroll-y,.overflow-auto")}return de.includes(o)?window:o}function fe(e){return e===window?window.pageYOffset||window.scrollY||document.body.scrollTop||0:e.scrollTop}function ve(e){return e===window?window.pageXOffset||window.scrollX||document.body.scrollLeft||0:e.scrollLeft}let S;function Ce(){if(S!==void 0)return S;const e=document.createElement("p"),t=document.createElement("div");$(e,{width:"100%",height:"200px"}),$(t,{position:"absolute",top:"0px",left:"0px",visibility:"hidden",width:"200px",height:"150px",overflow:"hidden"}),t.appendChild(e),document.body.appendChild(t);const o=e.offsetWidth;t.style.overflow="scroll";let l=e.offsetWidth;return o===l&&(l=t.clientWidth),t.remove(),S=o-l,S}function me(e,t=!0){return!e||e.nodeType!==Node.ELEMENT_NODE?!1:t?e.scrollHeight>e.clientHeight&&(e.classList.contains("scroll")||e.classList.contains("overflow-auto")||["auto","scroll"].includes(window.getComputedStyle(e)["overflow-y"])):e.scrollWidth>e.clientWidth&&(e.classList.contains("scroll")||e.classList.contains("overflow-auto")||["auto","scroll"].includes(window.getComputedStyle(e)["overflow-x"]))}let q=0,H,P,k,A=!1,z,Q,X,w=null;function pe(e){we(e)&&G(e)}function we(e){if(e.target===document.body||e.target.classList.contains("q-layout__backdrop"))return!0;const t=re(e),o=e.shiftKey&&!e.deltaX,l=!o&&Math.abs(e.deltaX)<=Math.abs(e.deltaY),i=o||l?e.deltaY:e.deltaX;for(let v=0;v<t.length;v++){const a=t[v];if(me(a,l))return l?i<0&&a.scrollTop===0?!0:i>0&&a.scrollTop+a.clientHeight===a.scrollHeight:i<0&&a.scrollLeft===0?!0:i>0&&a.scrollLeft+a.clientWidth===a.scrollWidth}return!0}function Y(e){e.target===document&&(document.scrollingElement.scrollTop=document.scrollingElement.scrollTop)}function C(e){A!==!0&&(A=!0,requestAnimationFrame(()=>{A=!1;const{height:t}=e.target,{clientHeight:o,scrollTop:l}=document.scrollingElement;(k===void 0||t!==window.innerHeight)&&(k=o-t,document.scrollingElement.scrollTop=l),l>k&&(document.scrollingElement.scrollTop-=Math.ceil((l-k)/8))}))}function D(e){const t=document.body,o=window.visualViewport!==void 0;if(e==="add"){const{overflowY:l,overflowX:i}=window.getComputedStyle(t);H=ve(window),P=fe(window),z=t.style.left,Q=t.style.top,X=window.location.href,t.style.left=`-${H}px`,t.style.top=`-${P}px`,i!=="hidden"&&(i==="scroll"||t.scrollWidth>window.innerWidth)&&t.classList.add("q-body--force-scrollbar-x"),l!=="hidden"&&(l==="scroll"||t.scrollHeight>window.innerHeight)&&t.classList.add("q-body--force-scrollbar-y"),t.classList.add("q-body--prevent-scroll"),document.qScrollPrevented=!0,h.is.ios===!0&&(o===!0?(window.scrollTo(0,0),window.visualViewport.addEventListener("resize",C,p.passiveCapture),window.visualViewport.addEventListener("scroll",C,p.passiveCapture),window.scrollTo(0,0)):window.addEventListener("scroll",Y,p.passiveCapture))}h.is.desktop===!0&&h.is.mac===!0&&window[`${e}EventListener`]("wheel",pe,p.notPassive),e==="remove"&&(h.is.ios===!0&&(o===!0?(window.visualViewport.removeEventListener("resize",C,p.passiveCapture),window.visualViewport.removeEventListener("scroll",C,p.passiveCapture)):window.removeEventListener("scroll",Y,p.passiveCapture)),t.classList.remove("q-body--prevent-scroll"),t.classList.remove("q-body--force-scrollbar-x"),t.classList.remove("q-body--force-scrollbar-y"),document.qScrollPrevented=!1,t.style.left=z,t.style.top=Q,window.location.href===X&&window.scrollTo(H,P),k=void 0)}function be(e){let t="add";if(e===!0){if(q++,w!==null){clearTimeout(w),w=null;return}if(q>1)return}else{if(q===0||(q--,q>0))return;if(t="remove",h.is.ios===!0&&h.is.nativeMobile===!0){w!==null&&clearTimeout(w),w=setTimeout(()=>{D(t),w=null},100);return}}D(t)}function _e(){let e;return{preventBodyScroll(t){t!==e&&(e!==void 0||t===!0)&&(e=t,be(t))}}}function Be(){let e=null;const t=V();function o(){e!==null&&(clearTimeout(e),e=null)}return J(o),I(o),{removeTimeout:o,registerTimeout(l,i){o(),Z(t)===!1&&(e=setTimeout(l,i))}}}function Ve(){if(window.getSelection!==void 0){const e=window.getSelection();e.empty!==void 0?e.empty():e.removeAllRanges!==void 0&&(e.removeAllRanges(),se.is.mobile!==!0&&e.addRange(document.createRange()))}else document.selection!==void 0&&document.selection.empty()}function He(e,t,o){return o<=t?t:Math.min(o,Math.max(t,e))}function Pe(e,t,o){if(o<=t)return t;const l=o-t+1;let i=t+(e-t)%l;return i<t&&(i=l+i),i===0?0:i}let M,_=0;const s=new Array(256);for(let e=0;e<256;e++)s[e]=(e+256).toString(16).substring(1);const he=(()=>{const e=typeof crypto!="undefined"?crypto:typeof window!="undefined"?window.crypto||window.msCrypto:void 0;if(e!==void 0){if(e.randomBytes!==void 0)return e.randomBytes;if(e.getRandomValues!==void 0)return t=>{const o=new Uint8Array(t);return e.getRandomValues(o),o}}return t=>{const o=[];for(let l=t;l>0;l--)o.push(Math.floor(Math.random()*256));return o}})(),K=4096;function Ae(){(M===void 0||_+16>K)&&(_=0,M=he(K));const e=Array.prototype.slice.call(M,_,_+=16);return e[6]=e[6]&15|64,e[8]=e[8]&63|128,s[e[0]]+s[e[1]]+s[e[2]]+s[e[3]]+"-"+s[e[4]]+s[e[5]]+"-"+s[e[6]]+s[e[7]]+"-"+s[e[8]]+s[e[9]]+"-"+s[e[10]]+s[e[11]]+s[e[12]]+s[e[13]]+s[e[14]]+s[e[15]]}function Me(){let e;const t=V();function o(){e=void 0}return J(o),I(o),{removeTick:o,registerTick(l){e=l,R(()=>{e===l&&(Z(t)===!1&&e(),e=void 0)})}}}let ye=!1;{const e=document.createElement("div");e.setAttribute("dir","rtl"),Object.assign(e.style,{width:"1px",height:"1px",overflow:"auto"});const t=document.createElement("div");Object.assign(t.style,{width:"1000px",height:"1px"}),document.body.appendChild(e),e.appendChild(t),e.scrollLeft=-1e3,ye=e.scrollLeft>=0,e.remove()}var Re=W({name:"QItemSection",props:{avatar:Boolean,thumbnail:Boolean,side:Boolean,top:Boolean,noWrap:Boolean},setup(e,{slots:t}){const o=f(()=>`q-item__section column q-item__section--${e.avatar===!0||e.side===!0||e.thumbnail===!0?"side":"main"}`+(e.top===!0?" q-item__section--top justify-start":" justify-center")+(e.avatar===!0?" q-item__section--avatar":"")+(e.thumbnail===!0?" q-item__section--thumbnail":"")+(e.noWrap===!0?" q-item__section--nowrap":""));return()=>B("div",{class:o.value},N(t.default))}}),We=W({name:"QItem",props:{...ue,...oe,tag:{type:String,default:"div"},active:{type:Boolean,default:null},clickable:Boolean,dense:Boolean,insetLevel:Number,tabindex:[String,Number],focused:Boolean,manualFocus:Boolean},emits:["click","keyup"],setup(e,{slots:t,emit:o}){const{proxy:{$q:l}}=V(),i=ce(e,l),{hasLink:v,linkAttrs:a,linkClass:u,linkTag:d,navigateOnClick:x}=le(),c=O(null),b=O(null),y=f(()=>e.clickable===!0||v.value===!0||e.tag==="label"),m=f(()=>e.disable!==!0&&y.value===!0),g=f(()=>"q-item q-item-type row no-wrap"+(e.dense===!0?" q-item--dense":"")+(i.value===!0?" q-item--dark":"")+(v.value===!0&&e.active===null?u.value:e.active===!0?` q-item--active${e.activeClass!==void 0?` ${e.activeClass}`:""}`:"")+(e.disable===!0?" disabled":"")+(m.value===!0?" q-item--clickable q-link cursor-pointer "+(e.manualFocus===!0?"q-manual-focusable":"q-focusable q-hoverable")+(e.focused===!0?" q-manual-focusable--focused":""):"")),E=f(()=>{if(e.insetLevel===void 0)return null;const r=l.lang.rtl===!0?"Right":"Left";return{["padding"+r]:16+e.insetLevel*56+"px"}});function L(r){m.value===!0&&(b.value!==null&&(r.qKeyEvent!==!0&&document.activeElement===c.value?b.value.focus():document.activeElement===b.value&&c.value.focus()),x(r))}function T(r){if(m.value===!0&&ae(r,13)===!0){G(r),r.qKeyEvent=!0;const U=new MouseEvent("click",r);U.qKeyEvent=!0,c.value.dispatchEvent(U)}o("keyup",r)}function n(){const r=ne(t.default,[]);return m.value===!0&&r.unshift(B("div",{class:"q-focus-helper",tabindex:-1,ref:b})),r}return()=>{const r={ref:c,class:g.value,style:E.value,role:"listitem",onClick:L,onKeyup:T};return m.value===!0?(r.tabindex=e.tabindex||"0",Object.assign(r,a.value)):y.value===!0&&(r["aria-disabled"]="true"),B(d.value,r,n())}}});export{Re as Q,ue as a,Le as b,Ve as c,ce as d,Be as e,Te as f,xe as g,He as h,_e as i,Ae as j,Me as k,Se as l,fe as m,ve as n,Ce as o,ke as p,We as q,ye as r,Pe as s,Ee as u};
