import{c as q,r as p,a as c,o as z,d as B,h as E,g as S}from"./index.aa452204.js";import{b as A}from"./rtl.bbffe470.js";const g=XMLHttpRequest,y=g.prototype.open,C=["top","right","bottom","left"];let v=[],f=0;function H({p:t,pos:r,active:l,horiz:o,reverse:i,dir:u}){let e=1,a=1;return o===!0?(i===!0&&(e=-1),r==="bottom"&&(a=-1),{transform:`translate3d(${e*(t-100)}%,${l?0:a*-200}%,0)`}):(i===!0&&(a=-1),r==="right"&&(e=-1),{transform:`translate3d(${l?0:u*e*-200}%,${a*(t-100)}%,0)`})}function L(t,r){return typeof r!="number"&&(t<25?r=Math.random()*3+3:t<65?r=Math.random()*3:t<85?r=Math.random()*2:t<99?r=.6:r=0),A(t+r,0,100)}function Q(t){f++,v.push(t),!(f>1)&&(g.prototype.open=function(r,l){const o=[],i=()=>{v.forEach(e=>{(e.hijackFilter.value===null||e.hijackFilter.value(l)===!0)&&(e.start(),o.push(e.stop))})},u=()=>{o.forEach(e=>{e()})};this.addEventListener("loadstart",i,{once:!0}),this.addEventListener("loadend",u,{once:!0}),y.apply(this,arguments)})}function _(t){v=v.filter(r=>r.start!==t),f=Math.max(0,f-1),f===0&&(g.prototype.open=y)}var O=q({name:"QAjaxBar",props:{position:{type:String,default:"top",validator:t=>C.includes(t)},size:{type:String,default:"2px"},color:String,skipHijack:Boolean,reverse:Boolean,hijackFilter:Function},emits:["start","stop"],setup(t,{emit:r}){const{proxy:l}=S(),o=p(0),i=p(!1),u=p(!0);let e=0,a=null,d;const M=c(()=>`q-loading-bar q-loading-bar--${t.position}`+(t.color!==void 0?` bg-${t.color}`:"")+(u.value===!0?"":" no-transition")),j=c(()=>t.position==="top"||t.position==="bottom"),T=c(()=>j.value===!0?"height":"width"),$=c(()=>{const n=i.value,s=H({p:o.value,pos:t.position,active:n,horiz:j.value,reverse:l.$q.lang.rtl===!0&&["top","bottom"].includes(t.position)?t.reverse===!1:t.reverse,dir:l.$q.lang.rtl===!0?-1:1});return s[T.value]=t.size,s.opacity=n?1:0,s}),F=c(()=>i.value===!0?{role:"progressbar","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":o.value}:{"aria-hidden":"true"});function h(n=300){const s=d;return d=Math.max(0,n)||0,e++,e>1?(s===0&&n>0?m():a!==null&&s>0&&n<=0&&(clearTimeout(a),a=null),e):(a!==null&&clearTimeout(a),r("start"),o.value=0,a=setTimeout(()=>{a=null,u.value=!0,n>0&&m()},i._value===!0?500:1),i._value!==!0&&(i.value=!0,u.value=!1),e)}function b(n){return e>0&&(o.value=L(o.value,n)),e}function k(){if(e=Math.max(0,e-1),e>0)return e;a!==null&&(clearTimeout(a),a=null),r("stop");const n=()=>{u.value=!0,o.value=100,a=setTimeout(()=>{a=null,i.value=!1},1e3)};return o.value===0?a=setTimeout(n,1):n(),e}function m(){o.value<100&&(a=setTimeout(()=>{a=null,b(),m()},d))}let x;return z(()=>{t.skipHijack!==!0&&(x=!0,Q({start:h,stop:k,hijackFilter:c(()=>t.hijackFilter||null)}))}),B(()=>{a!==null&&clearTimeout(a),x===!0&&_(h)}),Object.assign(l,{start:h,stop:k,increment:b}),()=>E("div",{class:M.value,style:$.value,...F.value})}});export{O as Q};
