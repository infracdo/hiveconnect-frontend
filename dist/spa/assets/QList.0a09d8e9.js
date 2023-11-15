import{d as q,a as C,n as F,o as R}from"./QItem.03b102c2.js";import{f as S,a as l,h as v,ah as Q,L as K,e as I,ai as N,k as y,aj as i,D as V,c as M}from"./index.0d3b5b64.js";function G(a,c){const e=S(null),s=l(()=>a.disable===!0?null:v("span",{ref:e,class:"no-outline",tabindex:-1}));function d(o){const r=c.value;o!==void 0&&o.type.indexOf("key")===0?r!==null&&document.activeElement!==r&&r.contains(document.activeElement)===!0&&r.focus():e.value!==null&&(o===void 0||r!==null&&r.contains(o.target)===!0)&&e.value.focus()}return{refocusTargetEl:s,refocusTarget:d}}var H={xs:30,sm:35,md:40,lg:50,xl:60};const W={...C,...N,...F,modelValue:{required:!0,default:null},val:{},trueValue:{default:!0},falseValue:{default:!1},indeterminateValue:{default:null},checkedIcon:String,uncheckedIcon:String,indeterminateIcon:String,toggleOrder:{type:String,validator:a=>a==="tf"||a==="ft"},toggleIndeterminate:Boolean,label:String,leftLabel:Boolean,color:String,keepColor:Boolean,dense:Boolean,disable:Boolean,tabindex:[String,Number]},X=["update:modelValue"];function Y(a,c){const{props:e,slots:s,emit:d,proxy:o}=y(),{$q:r}=o,$=q(e,r),k=S(null),{refocusTargetEl:p,refocusTarget:B}=G(e,k),_=Q(e,H),f=l(()=>e.val!==void 0&&Array.isArray(e.modelValue)),m=l(()=>{const t=i(e.val);return f.value===!0?e.modelValue.findIndex(u=>i(u)===t):-1}),n=l(()=>f.value===!0?m.value>-1:i(e.modelValue)===i(e.trueValue)),g=l(()=>f.value===!0?m.value===-1:i(e.modelValue)===i(e.falseValue)),h=l(()=>n.value===!1&&g.value===!1),O=l(()=>e.disable===!0?-1:e.tabindex||0),T=l(()=>`q-${a} cursor-pointer no-outline row inline no-wrap items-center`+(e.disable===!0?" disabled":"")+($.value===!0?` q-${a}--dark`:"")+(e.dense===!0?` q-${a}--dense`:"")+(e.leftLabel===!0?" reverse":"")),j=l(()=>{const t=n.value===!0?"truthy":g.value===!0?"falsy":"indet",u=e.color!==void 0&&(e.keepColor===!0||(a==="toggle"?n.value===!0:g.value!==!0))?` text-${e.color}`:"";return`q-${a}__inner relative-position non-selectable q-${a}__inner--${t}${u}`}),w=l(()=>{const t={type:"checkbox"};return e.name!==void 0&&Object.assign(t,{".checked":n.value,"^checked":n.value===!0?"checked":void 0,name:e.name,value:f.value===!0?e.val:e.trueValue}),t}),A=R(w),D=l(()=>{const t={tabindex:O.value,role:a==="toggle"?"switch":"checkbox","aria-label":e.label,"aria-checked":h.value===!0?"mixed":n.value===!0?"true":"false"};return e.disable===!0&&(t["aria-disabled"]="true"),t});function b(t){t!==void 0&&(V(t),B(t)),e.disable!==!0&&d("update:modelValue",E(),t)}function E(){if(f.value===!0){if(n.value===!0){const t=e.modelValue.slice();return t.splice(m.value,1),t}return e.modelValue.concat([e.val])}if(n.value===!0){if(e.toggleOrder!=="ft"||e.toggleIndeterminate===!1)return e.falseValue}else if(g.value===!0){if(e.toggleOrder==="ft"||e.toggleIndeterminate===!1)return e.trueValue}else return e.toggleOrder!=="ft"?e.trueValue:e.falseValue;return e.indeterminateValue}function L(t){(t.keyCode===13||t.keyCode===32)&&V(t)}function P(t){(t.keyCode===13||t.keyCode===32)&&b(t)}const z=c(n,h);return Object.assign(o,{toggle:b}),()=>{const t=z();e.disable!==!0&&A(t,"unshift",` q-${a}__native absolute q-ma-none q-pa-none`);const u=[v("div",{class:j.value,style:_.value,"aria-hidden":"true"},t)];p.value!==null&&u.push(p.value);const x=e.label!==void 0?K(s.default,[e.label]):I(s.default);return x!==void 0&&u.push(v("div",{class:`q-${a}__label q-anchor--skip`},x)),v("div",{ref:k,class:T.value,...D.value,onClick:b,onKeydown:L,onKeyup:P},u)}}var Z=M({name:"QList",props:{...C,bordered:Boolean,dense:Boolean,separator:Boolean,padding:Boolean,tag:{type:String,default:"div"}},setup(a,{slots:c}){const e=y(),s=q(a,e.proxy.$q),d=l(()=>"q-list"+(a.bordered===!0?" q-list--bordered":"")+(a.dense===!0?" q-list--dense":"")+(a.separator===!0?" q-list--separator":"")+(s.value===!0?" q-list--dark":"")+(a.padding===!0?" q-list--padding":""));return()=>v(a.tag,{class:d.value},I(c.default))}});export{Z as Q,X as a,Y as b,G as c,H as o,W as u};
