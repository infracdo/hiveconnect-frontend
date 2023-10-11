import{c as B,h as M,a as F}from"./render.543f4f3c.js";import{c,h as L,g as C,a as K,S as A,w as R,o as G,d as I,k as b,l as m,x as N,U as J,V as Z,W as ee,r as Q,R as te}from"./index.75f6d34d.js";import{v as le,g as oe,c as $,b as ie,u as ne,d as re}from"./QBtn.0aa8684d.js";var be=B({name:"QItemLabel",props:{overline:Boolean,caption:Boolean,header:Boolean,lines:[Number,String]},setup(e,{slots:t}){const l=c(()=>parseInt(e.lines,10)),o=c(()=>"q-item__label"+(e.overline===!0?" q-item__label--overline text-overline":"")+(e.caption===!0?" q-item__label--caption text-caption":"")+(e.header===!0?" q-item__label--header":"")+(l.value===1?" ellipsis":"")),i=c(()=>e.lines!==void 0&&l.value>1?{overflow:"hidden",display:"-webkit-box","-webkit-box-orient":"vertical","-webkit-line-clamp":l.value}:null);return()=>L("div",{style:i.value,class:o.value},M(t.default))}});const O={dark:{type:Boolean,default:null}};function j(e,t){return c(()=>e.dark===null?t.dark.isActive:e.dark)}var he=B({name:"QList",props:{...O,bordered:Boolean,dense:Boolean,separator:Boolean,padding:Boolean,tag:{type:String,default:"div"}},setup(e,{slots:t}){const l=C(),o=j(e,l.proxy.$q),i=c(()=>"q-list"+(e.bordered===!0?" q-list--bordered":"")+(e.dense===!0?" q-list--dense":"")+(e.separator===!0?" q-list--separator":"")+(o.value===!0?" q-list--dark":"")+(e.padding===!0?" q-list--padding":""));return()=>L(e.tag,{class:i.value},M(t.default))}});function ye(e,t,l){let o;function i(){o!==void 0&&(A.remove(o),o=void 0)}return K(()=>{e.value===!0&&i()}),{removeFromHistory:i,addToHistory(){o={condition:()=>l.value===!0,handler:t},A.add(o)}}}const ge={modelValue:{type:Boolean,default:null},"onUpdate:modelValue":[Function,Array]},qe=["beforeShow","show","beforeHide","hide"];function Le({showing:e,canShow:t,hideOnRouteChange:l,handleShow:o,handleHide:i,processOnMount:f}){const s=C(),{props:a,emit:d,proxy:k}=s;let u;function p(n){e.value===!0?y(n):h(n)}function h(n){if(a.disable===!0||n!==void 0&&n.qAnchorHandled===!0||t!==void 0&&t(n)!==!0)return;const r=a["onUpdate:modelValue"]!==void 0;r===!0&&(d("update:modelValue",!0),u=n,I(()=>{u===n&&(u=void 0)})),(a.modelValue===null||r===!1)&&v(n)}function v(n){e.value!==!0&&(e.value=!0,d("beforeShow",n),o!==void 0?o(n):d("show",n))}function y(n){if(a.disable===!0)return;const r=a["onUpdate:modelValue"]!==void 0;r===!0&&(d("update:modelValue",!1),u=n,I(()=>{u===n&&(u=void 0)})),(a.modelValue===null||r===!1)&&T(n)}function T(n){e.value!==!1&&(e.value=!1,d("beforeHide",n),i!==void 0?i(n):d("hide",n))}function E(n){a.disable===!0&&n===!0?a["onUpdate:modelValue"]!==void 0&&d("update:modelValue",!1):n===!0!==e.value&&(n===!0?v:T)(u)}R(()=>a.modelValue,E),l!==void 0&&le(s)===!0&&R(()=>k.$route.fullPath,()=>{l.value===!0&&e.value===!0&&y()}),f===!0&&G(()=>{E(a.modelValue)});const S={show:h,hide:y,toggle:p};return Object.assign(k,S),S}const se=[null,document,document.body,document.scrollingElement,document.documentElement];function ke(e,t){let l=oe(t);if(l===void 0){if(e==null)return window;l=e.closest(".scroll,.scroll-y,.overflow-auto")}return se.includes(l)?window:l}function ae(e){return e===window?window.pageYOffset||window.scrollY||document.body.scrollTop||0:e.scrollTop}function ue(e){return e===window?window.pageXOffset||window.scrollX||document.body.scrollLeft||0:e.scrollLeft}let x;function Te(){if(x!==void 0)return x;const e=document.createElement("p"),t=document.createElement("div");$(e,{width:"100%",height:"200px"}),$(t,{position:"absolute",top:"0px",left:"0px",visibility:"hidden",width:"200px",height:"150px",overflow:"hidden"}),t.appendChild(e),document.body.appendChild(t);const l=e.offsetWidth;t.style.overflow="scroll";let o=e.offsetWidth;return l===o&&(o=t.clientWidth),t.remove(),x=l-o,x}function ce(e,t=!0){return!e||e.nodeType!==Node.ELEMENT_NODE?!1:t?e.scrollHeight>e.clientHeight&&(e.classList.contains("scroll")||e.classList.contains("overflow-auto")||["auto","scroll"].includes(window.getComputedStyle(e)["overflow-y"])):e.scrollWidth>e.clientWidth&&(e.classList.contains("scroll")||e.classList.contains("overflow-auto")||["auto","scroll"].includes(window.getComputedStyle(e)["overflow-x"]))}let g=0,V,H,q,P=!1,U,z,D,w=null;function de(e){fe(e)&&N(e)}function fe(e){if(e.target===document.body||e.target.classList.contains("q-layout__backdrop"))return!0;const t=J(e),l=e.shiftKey&&!e.deltaX,o=!l&&Math.abs(e.deltaX)<=Math.abs(e.deltaY),i=l||o?e.deltaY:e.deltaX;for(let f=0;f<t.length;f++){const s=t[f];if(ce(s,o))return o?i<0&&s.scrollTop===0?!0:i>0&&s.scrollTop+s.clientHeight===s.scrollHeight:i<0&&s.scrollLeft===0?!0:i>0&&s.scrollLeft+s.clientWidth===s.scrollWidth}return!0}function X(e){e.target===document&&(document.scrollingElement.scrollTop=document.scrollingElement.scrollTop)}function _(e){P!==!0&&(P=!0,requestAnimationFrame(()=>{P=!1;const{height:t}=e.target,{clientHeight:l,scrollTop:o}=document.scrollingElement;(q===void 0||t!==window.innerHeight)&&(q=l-t,document.scrollingElement.scrollTop=o),o>q&&(document.scrollingElement.scrollTop-=Math.ceil((o-q)/8))}))}function Y(e){const t=document.body,l=window.visualViewport!==void 0;if(e==="add"){const{overflowY:o,overflowX:i}=window.getComputedStyle(t);V=ue(window),H=ae(window),U=t.style.left,z=t.style.top,D=window.location.href,t.style.left=`-${V}px`,t.style.top=`-${H}px`,i!=="hidden"&&(i==="scroll"||t.scrollWidth>window.innerWidth)&&t.classList.add("q-body--force-scrollbar-x"),o!=="hidden"&&(o==="scroll"||t.scrollHeight>window.innerHeight)&&t.classList.add("q-body--force-scrollbar-y"),t.classList.add("q-body--prevent-scroll"),document.qScrollPrevented=!0,b.is.ios===!0&&(l===!0?(window.scrollTo(0,0),window.visualViewport.addEventListener("resize",_,m.passiveCapture),window.visualViewport.addEventListener("scroll",_,m.passiveCapture),window.scrollTo(0,0)):window.addEventListener("scroll",X,m.passiveCapture))}b.is.desktop===!0&&b.is.mac===!0&&window[`${e}EventListener`]("wheel",de,m.notPassive),e==="remove"&&(b.is.ios===!0&&(l===!0?(window.visualViewport.removeEventListener("resize",_,m.passiveCapture),window.visualViewport.removeEventListener("scroll",_,m.passiveCapture)):window.removeEventListener("scroll",X,m.passiveCapture)),t.classList.remove("q-body--prevent-scroll"),t.classList.remove("q-body--force-scrollbar-x"),t.classList.remove("q-body--force-scrollbar-y"),document.qScrollPrevented=!1,t.style.left=U,t.style.top=z,window.location.href===D&&window.scrollTo(V,H),q=void 0)}function ve(e){let t="add";if(e===!0){if(g++,w!==null){clearTimeout(w),w=null;return}if(g>1)return}else{if(g===0||(g--,g>0))return;if(t="remove",b.is.ios===!0&&b.is.nativeMobile===!0){w!==null&&clearTimeout(w),w=setTimeout(()=>{Y(t),w=null},100);return}}Y(t)}function Ee(){let e;return{preventBodyScroll(t){t!==e&&(e!==void 0||t===!0)&&(e=t,ve(t))}}}function Se(){let e=null;const t=C();function l(){e!==null&&(clearTimeout(e),e=null)}return Z(l),K(l),{removeTimeout:l,registerTimeout(o,i){l(),ie(t)===!1&&(e=setTimeout(o,i))}}}function xe(){if(window.getSelection!==void 0){const e=window.getSelection();e.empty!==void 0?e.empty():e.removeAllRanges!==void 0&&(e.removeAllRanges(),ee.is.mobile!==!0&&e.addRange(document.createRange()))}else document.selection!==void 0&&document.selection.empty()}function _e(e,t,l){return l<=t?t:Math.min(l,Math.max(t,e))}function Be(e,t,l){if(l<=t)return t;const o=l-t+1;let i=t+(e-t)%o;return i<t&&(i=o+i),i===0?0:i}var Ce=B({name:"QItemSection",props:{avatar:Boolean,thumbnail:Boolean,side:Boolean,top:Boolean,noWrap:Boolean},setup(e,{slots:t}){const l=c(()=>`q-item__section column q-item__section--${e.avatar===!0||e.side===!0||e.thumbnail===!0?"side":"main"}`+(e.top===!0?" q-item__section--top justify-start":" justify-center")+(e.avatar===!0?" q-item__section--avatar":"")+(e.thumbnail===!0?" q-item__section--thumbnail":"")+(e.noWrap===!0?" q-item__section--nowrap":""));return()=>L("div",{class:l.value},M(t.default))}}),Ve=B({name:"QItem",props:{...O,...ne,tag:{type:String,default:"div"},active:{type:Boolean,default:null},clickable:Boolean,dense:Boolean,insetLevel:Number,tabindex:[String,Number],focused:Boolean,manualFocus:Boolean},emits:["click","keyup"],setup(e,{slots:t,emit:l}){const{proxy:{$q:o}}=C(),i=j(e,o),{hasLink:f,linkAttrs:s,linkClass:a,linkTag:d,navigateOnClick:k}=re(),u=Q(null),p=Q(null),h=c(()=>e.clickable===!0||f.value===!0||e.tag==="label"),v=c(()=>e.disable!==!0&&h.value===!0),y=c(()=>"q-item q-item-type row no-wrap"+(e.dense===!0?" q-item--dense":"")+(i.value===!0?" q-item--dark":"")+(f.value===!0&&e.active===null?a.value:e.active===!0?` q-item--active${e.activeClass!==void 0?` ${e.activeClass}`:""}`:"")+(e.disable===!0?" disabled":"")+(v.value===!0?" q-item--clickable q-link cursor-pointer "+(e.manualFocus===!0?"q-manual-focusable":"q-focusable q-hoverable")+(e.focused===!0?" q-manual-focusable--focused":""):"")),T=c(()=>{if(e.insetLevel===void 0)return null;const r=o.lang.rtl===!0?"Right":"Left";return{["padding"+r]:16+e.insetLevel*56+"px"}});function E(r){v.value===!0&&(p.value!==null&&(r.qKeyEvent!==!0&&document.activeElement===u.value?p.value.focus():document.activeElement===p.value&&u.value.focus()),k(r))}function S(r){if(v.value===!0&&te(r,13)===!0){N(r),r.qKeyEvent=!0;const W=new MouseEvent("click",r);W.qKeyEvent=!0,u.value.dispatchEvent(W)}l("keyup",r)}function n(){const r=F(t.default,[]);return v.value===!0&&r.unshift(L("div",{class:"q-focus-helper",tabindex:-1,ref:p})),r}return()=>{const r={ref:u,class:y.value,style:T.value,role:"listitem",onClick:E,onKeyup:S};return v.value===!0?(r.tabindex=e.tabindex||"0",Object.assign(r,s.value)):h.value===!0&&(r["aria-disabled"]="true"),L(d.value,r,n())}}});export{Ce as Q,O as a,qe as b,xe as c,j as d,Se as e,Le as f,ye as g,_e as h,Ee as i,ke as j,ae as k,ue as l,Te as m,be as n,Ve as o,he as p,Be as q,ge as u};
