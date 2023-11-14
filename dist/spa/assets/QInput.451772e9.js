import{c as ae,a as E,h as L,b as G,g as ne,r as X,w as j,e as z,H as ie,d as re,o as oe,at as ue,x as J}from"./index.d575f965.js";import{u as se,k as de,l as fe,m as ce,n as p,o as ge,q as me}from"./hiveConnect.ee8862b9.js";import{n as ve,p as he}from"./QItem.5404e004.js";var be=ae({name:"QTd",props:{props:Object,autoWidth:Boolean,noHover:Boolean},setup(e,{slots:w}){const O=ne(),x=E(()=>"q-td"+(e.autoWidth===!0?" q-table--col-auto-width":"")+(e.noHover===!0?" q-td--no-hover":"")+" ");return()=>{if(e.props===void 0)return L("td",{class:x.value},G(w.default));const d=O.vnode.key,f=(e.props.colsMap!==void 0?e.props.colsMap[d]:null)||e.props.col;if(f===void 0)return;const{row:b}=e.props;return L("td",{class:x.value+f.__tdClass(b),style:f.__tdStyle(b)},G(w.default))}}});const ee={date:"####/##/##",datetime:"####/##/## ##:##",time:"##:##",fulltime:"##:##:##",phone:"(###) ### - ####",card:"#### #### #### ####"},U={"#":{pattern:"[\\d]",negate:"[^\\d]"},S:{pattern:"[a-zA-Z]",negate:"[^a-zA-Z]"},N:{pattern:"[0-9a-zA-Z]",negate:"[^0-9a-zA-Z]"},A:{pattern:"[a-zA-Z]",negate:"[^a-zA-Z]",transform:e=>e.toLocaleUpperCase()},a:{pattern:"[a-zA-Z]",negate:"[^a-zA-Z]",transform:e=>e.toLocaleLowerCase()},X:{pattern:"[0-9a-zA-Z]",negate:"[^0-9a-zA-Z]",transform:e=>e.toLocaleUpperCase()},x:{pattern:"[0-9a-zA-Z]",negate:"[^0-9a-zA-Z]",transform:e=>e.toLocaleLowerCase()}},le=Object.keys(U);le.forEach(e=>{U[e].regex=new RegExp(U[e].pattern)});const ke=new RegExp("\\\\([^.*+?^${}()|([\\]])|([.*+?^${}()|[\\]])|(["+le.join("")+"])|(.)","g"),te=/[.*+?^${}()|[\]\\]/g,h=String.fromCharCode(1),Me={mask:String,reverseFillMask:Boolean,fillMask:[Boolean,String],unmaskedValue:Boolean};function we(e,w,O,x){let d,f,b,A,q,M;const y=X(null),c=X(F());function Q(){return e.autogrow===!0||["textarea","text","search","url","tel","password"].includes(e.type)}j(()=>e.type+e.autogrow,_),j(()=>e.mask,l=>{if(l!==void 0)B(c.value,!0);else{const a=R(c.value);_(),e.modelValue!==a&&w("update:modelValue",a)}}),j(()=>e.fillMask+e.reverseFillMask,()=>{y.value===!0&&B(c.value,!0)}),j(()=>e.unmaskedValue,()=>{y.value===!0&&B(c.value)});function F(){if(_(),y.value===!0){const l=Z(R(e.modelValue));return e.fillMask!==!1?H(l):l}return e.modelValue}function N(l){if(l<d.length)return d.slice(-l);let a="",i=d;const n=i.indexOf(h);if(n>-1){for(let o=l-i.length;o>0;o--)a+=h;i=i.slice(0,n)+a+i.slice(n)}return i}function _(){if(y.value=e.mask!==void 0&&e.mask.length!==0&&Q(),y.value===!1){A=void 0,d="",f="";return}const l=ee[e.mask]===void 0?e.mask:ee[e.mask],a=typeof e.fillMask=="string"&&e.fillMask.length!==0?e.fillMask.slice(0,1):"_",i=a.replace(te,"\\$&"),n=[],o=[],r=[];let v=e.reverseFillMask===!0,u="",s="";l.replace(ke,(k,t,m,T,V)=>{if(T!==void 0){const C=U[T];r.push(C),s=C.negate,v===!0&&(o.push("(?:"+s+"+)?("+C.pattern+"+)?(?:"+s+"+)?("+C.pattern+"+)?"),v=!1),o.push("(?:"+s+"+)?("+C.pattern+")?")}else if(m!==void 0)u="\\"+(m==="\\"?"":m),r.push(m),n.push("([^"+u+"]+)?"+u+"?");else{const C=t!==void 0?t:V;u=C==="\\"?"\\\\\\\\":C.replace(te,"\\\\$&"),r.push(C),n.push("([^"+u+"]+)?"+u+"?")}});const K=new RegExp("^"+n.join("")+"("+(u===""?".":"[^"+u+"]")+"+)?"+(u===""?"":"["+u+"]*")+"$"),I=o.length-1,g=o.map((k,t)=>t===0&&e.reverseFillMask===!0?new RegExp("^"+i+"*"+k):t===I?new RegExp("^"+k+"("+(s===""?".":s)+"+)?"+(e.reverseFillMask===!0?"$":i+"*")):new RegExp("^"+k));b=r,A=k=>{const t=K.exec(e.reverseFillMask===!0?k:k.slice(0,r.length+1));t!==null&&(k=t.slice(1).join(""));const m=[],T=g.length;for(let V=0,C=k;V<T;V++){const D=g[V].exec(C);if(D===null)break;C=C.slice(D.shift().length),m.push(...D)}return m.length!==0?m.join(""):k},d=r.map(k=>typeof k=="string"?k:h).join(""),f=d.split(h).join(a)}function B(l,a,i){const n=x.value,o=n.selectionEnd,r=n.value.length-o,v=R(l);a===!0&&_();const u=Z(v),s=e.fillMask!==!1?H(u):u,K=c.value!==s;n.value!==s&&(n.value=s),K===!0&&(c.value=s),document.activeElement===n&&z(()=>{if(s===f){const g=e.reverseFillMask===!0?f.length:0;n.setSelectionRange(g,g,"forward");return}if(i==="insertFromPaste"&&e.reverseFillMask!==!0){const g=n.selectionEnd;let k=o-1;for(let t=q;t<=k&&t<g;t++)d[t]!==h&&k++;S.right(n,k);return}if(["deleteContentBackward","deleteContentForward"].indexOf(i)>-1){const g=e.reverseFillMask===!0?o===0?s.length>u.length?1:0:Math.max(0,s.length-(s===f?0:Math.min(u.length,r)+1))+1:o;n.setSelectionRange(g,g,"forward");return}if(e.reverseFillMask===!0)if(K===!0){const g=Math.max(0,s.length-(s===f?0:Math.min(u.length,r+1)));g===1&&o===1?n.setSelectionRange(g,g,"forward"):S.rightReverse(n,g)}else{const g=s.length-r;n.setSelectionRange(g,g,"backward")}else if(K===!0){const g=Math.max(0,d.indexOf(h),Math.min(u.length,o)-1);S.right(n,g)}else{const g=o-1;S.right(n,g)}});const I=e.unmaskedValue===!0?R(s):s;String(e.modelValue)!==I&&(e.modelValue!==null||I!=="")&&O(I,!0)}function W(l,a,i){const n=Z(R(l.value));a=Math.max(0,d.indexOf(h),Math.min(n.length,a)),q=a,l.setSelectionRange(a,i,"forward")}const S={left(l,a){const i=d.slice(a-1).indexOf(h)===-1;let n=Math.max(0,a-1);for(;n>=0;n--)if(d[n]===h){a=n,i===!0&&a++;break}if(n<0&&d[a]!==void 0&&d[a]!==h)return S.right(l,0);a>=0&&l.setSelectionRange(a,a,"backward")},right(l,a){const i=l.value.length;let n=Math.min(i,a+1);for(;n<=i;n++)if(d[n]===h){a=n;break}else d[n-1]===h&&(a=n);if(n>i&&d[a-1]!==void 0&&d[a-1]!==h)return S.left(l,i);l.setSelectionRange(a,a,"forward")},leftReverse(l,a){const i=N(l.value.length);let n=Math.max(0,a-1);for(;n>=0;n--)if(i[n-1]===h){a=n;break}else if(i[n]===h&&(a=n,n===0))break;if(n<0&&i[a]!==void 0&&i[a]!==h)return S.rightReverse(l,0);a>=0&&l.setSelectionRange(a,a,"backward")},rightReverse(l,a){const i=l.value.length,n=N(i),o=n.slice(0,a+1).indexOf(h)===-1;let r=Math.min(i,a+1);for(;r<=i;r++)if(n[r-1]===h){a=r,a>0&&o===!0&&a--;break}if(r>i&&n[a-1]!==void 0&&n[a-1]!==h)return S.leftReverse(l,i);l.setSelectionRange(a,a,"forward")}};function Y(l){w("click",l),M=void 0}function $(l){if(w("keydown",l),ie(l)===!0||l.altKey===!0)return;const a=x.value,i=a.selectionStart,n=a.selectionEnd;if(l.shiftKey||(M=void 0),l.keyCode===37||l.keyCode===39){l.shiftKey&&M===void 0&&(M=a.selectionDirection==="forward"?i:n);const o=S[(l.keyCode===39?"right":"left")+(e.reverseFillMask===!0?"Reverse":"")];if(l.preventDefault(),o(a,M===i?n:i),l.shiftKey){const r=a.selectionStart;a.setSelectionRange(Math.min(M,r),Math.max(M,r),"forward")}}else l.keyCode===8&&e.reverseFillMask!==!0&&i===n?(S.left(a,i),a.setSelectionRange(a.selectionStart,n,"backward")):l.keyCode===46&&e.reverseFillMask===!0&&i===n&&(S.rightReverse(a,n),a.setSelectionRange(i,a.selectionEnd,"forward"))}function Z(l){if(l==null||l==="")return"";if(e.reverseFillMask===!0)return P(l);const a=b;let i=0,n="";for(let o=0;o<a.length;o++){const r=l[i],v=a[o];if(typeof v=="string")n+=v,r===v&&i++;else if(r!==void 0&&v.regex.test(r))n+=v.transform!==void 0?v.transform(r):r,i++;else return n}return n}function P(l){const a=b,i=d.indexOf(h);let n=l.length-1,o="";for(let r=a.length-1;r>=0&&n>-1;r--){const v=a[r];let u=l[n];if(typeof v=="string")o=v+o,u===v&&n--;else if(u!==void 0&&v.regex.test(u))do o=(v.transform!==void 0?v.transform(u):u)+o,n--,u=l[n];while(i===r&&u!==void 0&&v.regex.test(u));else return o}return o}function R(l){return typeof l!="string"||A===void 0?typeof l=="number"?A(""+l):l:A(l)}function H(l){return f.length-l.length<=0?l:e.reverseFillMask===!0&&l.length!==0?f.slice(0,-l.length)+l:l+f.slice(l.length)}return{innerValue:c,hasMask:y,moveCursorForPaste:W,updateMaskValue:B,onMaskedKeydown:$,onMaskedClick:Y}}function xe(e,w){function O(){const x=e.modelValue;try{const d="DataTransfer"in window?new DataTransfer:"ClipboardEvent"in window?new ClipboardEvent("").clipboardData:void 0;return Object(x)===x&&("length"in x?Array.from(x):[x]).forEach(f=>{d.items.add(f)}),{files:d.files}}catch{return{files:void 0}}}return w===!0?E(()=>{if(e.type==="file")return O()}):E(O)}var Fe=ae({name:"QInput",inheritAttrs:!1,props:{...se,...Me,...ve,modelValue:{required:!1},shadowText:String,type:{type:String,default:"text"},debounce:[String,Number],autogrow:Boolean,inputClass:[Array,String,Object],inputStyle:[Array,String,Object]},emits:[...de,"paste","change","keydown","click","animationend"],setup(e,{emit:w,attrs:O}){const{proxy:x}=ne(),{$q:d}=x,f={};let b=NaN,A,q,M=null,y;const c=X(null),Q=he(e),{innerValue:F,hasMask:N,moveCursorForPaste:_,updateMaskValue:B,onMaskedKeydown:W,onMaskedClick:S}=we(e,w,u,c),Y=xe(e,!0),$=E(()=>p(F.value)),Z=me(r),P=fe(),R=E(()=>e.type==="textarea"||e.autogrow===!0),H=E(()=>R.value===!0||["text","search","url","tel","password"].includes(e.type)),l=E(()=>{const t={...P.splitAttrs.listeners.value,onInput:r,onPaste:o,onChange:K,onBlur:I,onFocus:J};return t.onCompositionstart=t.onCompositionupdate=t.onCompositionend=Z,N.value===!0&&(t.onKeydown=W,t.onClick=S),e.autogrow===!0&&(t.onAnimationend=v),t}),a=E(()=>{const t={tabindex:0,"data-autofocus":e.autofocus===!0||void 0,rows:e.type==="textarea"?6:void 0,"aria-label":e.label,name:Q.value,...P.splitAttrs.attributes.value,id:P.targetUid.value,maxlength:e.maxlength,disabled:e.disable===!0,readonly:e.readonly===!0};return R.value===!1&&(t.type=e.type),e.autogrow===!0&&(t.rows=1),t});j(()=>e.type,()=>{c.value&&(c.value.value=e.modelValue)}),j(()=>e.modelValue,t=>{if(N.value===!0){if(q===!0&&(q=!1,String(t)===b))return;B(t)}else F.value!==t&&(F.value=t,e.type==="number"&&f.hasOwnProperty("value")===!0&&(A===!0?A=!1:delete f.value));e.autogrow===!0&&z(s)}),j(()=>e.autogrow,t=>{t===!0?z(s):c.value!==null&&O.rows>0&&(c.value.style.height="auto")}),j(()=>e.dense,()=>{e.autogrow===!0&&z(s)});function i(){ge(()=>{const t=document.activeElement;c.value!==null&&c.value!==t&&(t===null||t.id!==P.targetUid.value)&&c.value.focus({preventScroll:!0})})}function n(){c.value!==null&&c.value.select()}function o(t){if(N.value===!0&&e.reverseFillMask!==!0){const m=t.target;_(m,m.selectionStart,m.selectionEnd)}w("paste",t)}function r(t){if(!t||!t.target)return;if(e.type==="file"){w("update:modelValue",t.target.files);return}const m=t.target.value;if(t.target.qComposing===!0){f.value=m;return}if(N.value===!0)B(m,!1,t.inputType);else if(u(m),H.value===!0&&t.target===document.activeElement){const{selectionStart:T,selectionEnd:V}=t.target;T!==void 0&&V!==void 0&&z(()=>{t.target===document.activeElement&&m.indexOf(t.target.value)===0&&t.target.setSelectionRange(T,V)})}e.autogrow===!0&&s()}function v(t){w("animationend",t),s()}function u(t,m){y=()=>{M=null,e.type!=="number"&&f.hasOwnProperty("value")===!0&&delete f.value,e.modelValue!==t&&b!==t&&(b=t,m===!0&&(q=!0),w("update:modelValue",t),z(()=>{b===t&&(b=NaN)})),y=void 0},e.type==="number"&&(A=!0,f.value=t),e.debounce!==void 0?(M!==null&&clearTimeout(M),f.value=t,M=setTimeout(y,e.debounce)):y()}function s(){requestAnimationFrame(()=>{const t=c.value;if(t!==null){const m=t.parentNode.style,{scrollTop:T}=t,{overflowY:V,maxHeight:C}=d.platform.is.firefox===!0?{}:window.getComputedStyle(t),D=V!==void 0&&V!=="scroll";D===!0&&(t.style.overflowY="hidden"),m.marginBottom=t.scrollHeight-1+"px",t.style.height="1px",t.style.height=t.scrollHeight+"px",D===!0&&(t.style.overflowY=parseInt(C,10)<t.scrollHeight?"auto":"hidden"),m.marginBottom="",t.scrollTop=T}})}function K(t){Z(t),M!==null&&(clearTimeout(M),M=null),y!==void 0&&y(),w("change",t.target.value)}function I(t){t!==void 0&&J(t),M!==null&&(clearTimeout(M),M=null),y!==void 0&&y(),A=!1,q=!1,delete f.value,e.type!=="file"&&setTimeout(()=>{c.value!==null&&(c.value.value=F.value!==void 0?F.value:"")})}function g(){return f.hasOwnProperty("value")===!0?f.value:F.value!==void 0?F.value:""}re(()=>{I()}),oe(()=>{e.autogrow===!0&&s()}),Object.assign(P,{innerValue:F,fieldClass:E(()=>`q-${R.value===!0?"textarea":"input"}`+(e.autogrow===!0?" q-textarea--autogrow":"")),hasShadow:E(()=>e.type!=="file"&&typeof e.shadowText=="string"&&e.shadowText.length!==0),inputRef:c,emitValue:u,hasValue:$,floatingLabel:E(()=>$.value===!0&&(e.type!=="number"||isNaN(F.value)===!1)||p(e.displayValue)),getControl:()=>L(R.value===!0?"textarea":"input",{ref:c,class:["q-field__native q-placeholder",e.inputClass],style:e.inputStyle,...a.value,...l.value,...e.type!=="file"?{value:g()}:Y.value}),getShadowControl:()=>L("div",{class:"q-field__native q-field__shadow absolute-bottom no-pointer-events"+(R.value===!0?"":" text-no-wrap")},[L("span",{class:"invisible"},g()),L("span",e.shadowText)])});const k=ce(P);return Object.assign(x,{focus:i,select:n,getNativeElement:()=>c.value}),ue(x,"nativeEl",()=>c.value),k}});export{Fe as Q,be as a};
