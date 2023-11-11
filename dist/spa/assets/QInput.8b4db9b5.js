import{c as ae,a as E,h as L,d as G,g as ne,r as X,w as j,f as z,I as ie,e as re,o as oe,av as ue,y as J}from"./index.61d51993.js";import{t as se,w as de,x as fe,y as ce,z as ge,A as me,B as ve,C as p,D as he}from"./hiveConnect.25ac55d6.js";var Se=ae({name:"QTd",props:{props:Object,autoWidth:Boolean,noHover:Boolean},setup(e,{slots:w}){const O=ne(),y=E(()=>"q-td"+(e.autoWidth===!0?" q-table--col-auto-width":"")+(e.noHover===!0?" q-td--no-hover":"")+" ");return()=>{if(e.props===void 0)return L("td",{class:y.value},G(w.default));const d=O.vnode.key,f=(e.props.colsMap!==void 0?e.props.colsMap[d]:null)||e.props.col;if(f===void 0)return;const{row:b}=e.props;return L("td",{class:y.value+f.__tdClass(b),style:f.__tdStyle(b)},G(w.default))}}});const ee={date:"####/##/##",datetime:"####/##/## ##:##",time:"##:##",fulltime:"##:##:##",phone:"(###) ### - ####",card:"#### #### #### ####"},U={"#":{pattern:"[\\d]",negate:"[^\\d]"},S:{pattern:"[a-zA-Z]",negate:"[^a-zA-Z]"},N:{pattern:"[0-9a-zA-Z]",negate:"[^0-9a-zA-Z]"},A:{pattern:"[a-zA-Z]",negate:"[^a-zA-Z]",transform:e=>e.toLocaleUpperCase()},a:{pattern:"[a-zA-Z]",negate:"[^a-zA-Z]",transform:e=>e.toLocaleLowerCase()},X:{pattern:"[0-9a-zA-Z]",negate:"[^0-9a-zA-Z]",transform:e=>e.toLocaleUpperCase()},x:{pattern:"[0-9a-zA-Z]",negate:"[^0-9a-zA-Z]",transform:e=>e.toLocaleLowerCase()}},le=Object.keys(U);le.forEach(e=>{U[e].regex=new RegExp(U[e].pattern)});const ke=new RegExp("\\\\([^.*+?^${}()|([\\]])|([.*+?^${}()|[\\]])|(["+le.join("")+"])|(.)","g"),te=/[.*+?^${}()|[\]\\]/g,h=String.fromCharCode(1),Me={mask:String,reverseFillMask:Boolean,fillMask:[Boolean,String],unmaskedValue:Boolean};function we(e,w,O,y){let d,f,b,A,B,M;const x=X(null),c=X(F());function Q(){return e.autogrow===!0||["textarea","text","search","url","tel","password"].includes(e.type)}j(()=>e.type+e.autogrow,_),j(()=>e.mask,l=>{if(l!==void 0)q(c.value,!0);else{const a=R(c.value);_(),e.modelValue!==a&&w("update:modelValue",a)}}),j(()=>e.fillMask+e.reverseFillMask,()=>{x.value===!0&&q(c.value,!0)}),j(()=>e.unmaskedValue,()=>{x.value===!0&&q(c.value)});function F(){if(_(),x.value===!0){const l=D(R(e.modelValue));return e.fillMask!==!1?H(l):l}return e.modelValue}function N(l){if(l<d.length)return d.slice(-l);let a="",i=d;const n=i.indexOf(h);if(n>-1){for(let o=l-i.length;o>0;o--)a+=h;i=i.slice(0,n)+a+i.slice(n)}return i}function _(){if(x.value=e.mask!==void 0&&e.mask.length!==0&&Q(),x.value===!1){A=void 0,d="",f="";return}const l=ee[e.mask]===void 0?e.mask:ee[e.mask],a=typeof e.fillMask=="string"&&e.fillMask.length!==0?e.fillMask.slice(0,1):"_",i=a.replace(te,"\\$&"),n=[],o=[],r=[];let v=e.reverseFillMask===!0,u="",s="";l.replace(ke,(k,t,m,T,V)=>{if(T!==void 0){const C=U[T];r.push(C),s=C.negate,v===!0&&(o.push("(?:"+s+"+)?("+C.pattern+"+)?(?:"+s+"+)?("+C.pattern+"+)?"),v=!1),o.push("(?:"+s+"+)?("+C.pattern+")?")}else if(m!==void 0)u="\\"+(m==="\\"?"":m),r.push(m),n.push("([^"+u+"]+)?"+u+"?");else{const C=t!==void 0?t:V;u=C==="\\"?"\\\\\\\\":C.replace(te,"\\\\$&"),r.push(C),n.push("([^"+u+"]+)?"+u+"?")}});const K=new RegExp("^"+n.join("")+"("+(u===""?".":"[^"+u+"]")+"+)?"+(u===""?"":"["+u+"]*")+"$"),P=o.length-1,g=o.map((k,t)=>t===0&&e.reverseFillMask===!0?new RegExp("^"+i+"*"+k):t===P?new RegExp("^"+k+"("+(s===""?".":s)+"+)?"+(e.reverseFillMask===!0?"$":i+"*")):new RegExp("^"+k));b=r,A=k=>{const t=K.exec(e.reverseFillMask===!0?k:k.slice(0,r.length+1));t!==null&&(k=t.slice(1).join(""));const m=[],T=g.length;for(let V=0,C=k;V<T;V++){const Z=g[V].exec(C);if(Z===null)break;C=C.slice(Z.shift().length),m.push(...Z)}return m.length!==0?m.join(""):k},d=r.map(k=>typeof k=="string"?k:h).join(""),f=d.split(h).join(a)}function q(l,a,i){const n=y.value,o=n.selectionEnd,r=n.value.length-o,v=R(l);a===!0&&_();const u=D(v),s=e.fillMask!==!1?H(u):u,K=c.value!==s;n.value!==s&&(n.value=s),K===!0&&(c.value=s),document.activeElement===n&&z(()=>{if(s===f){const g=e.reverseFillMask===!0?f.length:0;n.setSelectionRange(g,g,"forward");return}if(i==="insertFromPaste"&&e.reverseFillMask!==!0){const g=n.selectionEnd;let k=o-1;for(let t=B;t<=k&&t<g;t++)d[t]!==h&&k++;S.right(n,k);return}if(["deleteContentBackward","deleteContentForward"].indexOf(i)>-1){const g=e.reverseFillMask===!0?o===0?s.length>u.length?1:0:Math.max(0,s.length-(s===f?0:Math.min(u.length,r)+1))+1:o;n.setSelectionRange(g,g,"forward");return}if(e.reverseFillMask===!0)if(K===!0){const g=Math.max(0,s.length-(s===f?0:Math.min(u.length,r+1)));g===1&&o===1?n.setSelectionRange(g,g,"forward"):S.rightReverse(n,g)}else{const g=s.length-r;n.setSelectionRange(g,g,"backward")}else if(K===!0){const g=Math.max(0,d.indexOf(h),Math.min(u.length,o)-1);S.right(n,g)}else{const g=o-1;S.right(n,g)}});const P=e.unmaskedValue===!0?R(s):s;String(e.modelValue)!==P&&(e.modelValue!==null||P!=="")&&O(P,!0)}function W(l,a,i){const n=D(R(l.value));a=Math.max(0,d.indexOf(h),Math.min(n.length,a)),B=a,l.setSelectionRange(a,i,"forward")}const S={left(l,a){const i=d.slice(a-1).indexOf(h)===-1;let n=Math.max(0,a-1);for(;n>=0;n--)if(d[n]===h){a=n,i===!0&&a++;break}if(n<0&&d[a]!==void 0&&d[a]!==h)return S.right(l,0);a>=0&&l.setSelectionRange(a,a,"backward")},right(l,a){const i=l.value.length;let n=Math.min(i,a+1);for(;n<=i;n++)if(d[n]===h){a=n;break}else d[n-1]===h&&(a=n);if(n>i&&d[a-1]!==void 0&&d[a-1]!==h)return S.left(l,i);l.setSelectionRange(a,a,"forward")},leftReverse(l,a){const i=N(l.value.length);let n=Math.max(0,a-1);for(;n>=0;n--)if(i[n-1]===h){a=n;break}else if(i[n]===h&&(a=n,n===0))break;if(n<0&&i[a]!==void 0&&i[a]!==h)return S.rightReverse(l,0);a>=0&&l.setSelectionRange(a,a,"backward")},rightReverse(l,a){const i=l.value.length,n=N(i),o=n.slice(0,a+1).indexOf(h)===-1;let r=Math.min(i,a+1);for(;r<=i;r++)if(n[r-1]===h){a=r,a>0&&o===!0&&a--;break}if(r>i&&n[a-1]!==void 0&&n[a-1]!==h)return S.leftReverse(l,i);l.setSelectionRange(a,a,"forward")}};function Y(l){w("click",l),M=void 0}function $(l){if(w("keydown",l),ie(l)===!0||l.altKey===!0)return;const a=y.value,i=a.selectionStart,n=a.selectionEnd;if(l.shiftKey||(M=void 0),l.keyCode===37||l.keyCode===39){l.shiftKey&&M===void 0&&(M=a.selectionDirection==="forward"?i:n);const o=S[(l.keyCode===39?"right":"left")+(e.reverseFillMask===!0?"Reverse":"")];if(l.preventDefault(),o(a,M===i?n:i),l.shiftKey){const r=a.selectionStart;a.setSelectionRange(Math.min(M,r),Math.max(M,r),"forward")}}else l.keyCode===8&&e.reverseFillMask!==!0&&i===n?(S.left(a,i),a.setSelectionRange(a.selectionStart,n,"backward")):l.keyCode===46&&e.reverseFillMask===!0&&i===n&&(S.rightReverse(a,n),a.setSelectionRange(i,a.selectionEnd,"forward"))}function D(l){if(l==null||l==="")return"";if(e.reverseFillMask===!0)return I(l);const a=b;let i=0,n="";for(let o=0;o<a.length;o++){const r=l[i],v=a[o];if(typeof v=="string")n+=v,r===v&&i++;else if(r!==void 0&&v.regex.test(r))n+=v.transform!==void 0?v.transform(r):r,i++;else return n}return n}function I(l){const a=b,i=d.indexOf(h);let n=l.length-1,o="";for(let r=a.length-1;r>=0&&n>-1;r--){const v=a[r];let u=l[n];if(typeof v=="string")o=v+o,u===v&&n--;else if(u!==void 0&&v.regex.test(u))do o=(v.transform!==void 0?v.transform(u):u)+o,n--,u=l[n];while(i===r&&u!==void 0&&v.regex.test(u));else return o}return o}function R(l){return typeof l!="string"||A===void 0?typeof l=="number"?A(""+l):l:A(l)}function H(l){return f.length-l.length<=0?l:e.reverseFillMask===!0&&l.length!==0?f.slice(0,-l.length)+l:l+f.slice(l.length)}return{innerValue:c,hasMask:x,moveCursorForPaste:W,updateMaskValue:q,onMaskedKeydown:$,onMaskedClick:Y}}function ye(e,w){function O(){const y=e.modelValue;try{const d="DataTransfer"in window?new DataTransfer:"ClipboardEvent"in window?new ClipboardEvent("").clipboardData:void 0;return Object(y)===y&&("length"in y?Array.from(y):[y]).forEach(f=>{d.items.add(f)}),{files:d.files}}catch{return{files:void 0}}}return w===!0?E(()=>{if(e.type==="file")return O()}):E(O)}var be=ae({name:"QInput",inheritAttrs:!1,props:{...se,...Me,...de,modelValue:{required:!1},shadowText:String,type:{type:String,default:"text"},debounce:[String,Number],autogrow:Boolean,inputClass:[Array,String,Object],inputStyle:[Array,String,Object]},emits:[...fe,"paste","change","keydown","click","animationend"],setup(e,{emit:w,attrs:O}){const{proxy:y}=ne(),{$q:d}=y,f={};let b=NaN,A,B,M=null,x;const c=X(null),Q=ce(e),{innerValue:F,hasMask:N,moveCursorForPaste:_,updateMaskValue:q,onMaskedKeydown:W,onMaskedClick:S}=we(e,w,u,c),Y=ye(e,!0),$=E(()=>p(F.value)),D=he(r),I=ge(),R=E(()=>e.type==="textarea"||e.autogrow===!0),H=E(()=>R.value===!0||["text","search","url","tel","password"].includes(e.type)),l=E(()=>{const t={...I.splitAttrs.listeners.value,onInput:r,onPaste:o,onChange:K,onBlur:P,onFocus:J};return t.onCompositionstart=t.onCompositionupdate=t.onCompositionend=D,N.value===!0&&(t.onKeydown=W,t.onClick=S),e.autogrow===!0&&(t.onAnimationend=v),t}),a=E(()=>{const t={tabindex:0,"data-autofocus":e.autofocus===!0||void 0,rows:e.type==="textarea"?6:void 0,"aria-label":e.label,name:Q.value,...I.splitAttrs.attributes.value,id:I.targetUid.value,maxlength:e.maxlength,disabled:e.disable===!0,readonly:e.readonly===!0};return R.value===!1&&(t.type=e.type),e.autogrow===!0&&(t.rows=1),t});j(()=>e.type,()=>{c.value&&(c.value.value=e.modelValue)}),j(()=>e.modelValue,t=>{if(N.value===!0){if(B===!0&&(B=!1,String(t)===b))return;q(t)}else F.value!==t&&(F.value=t,e.type==="number"&&f.hasOwnProperty("value")===!0&&(A===!0?A=!1:delete f.value));e.autogrow===!0&&z(s)}),j(()=>e.autogrow,t=>{t===!0?z(s):c.value!==null&&O.rows>0&&(c.value.style.height="auto")}),j(()=>e.dense,()=>{e.autogrow===!0&&z(s)});function i(){ve(()=>{const t=document.activeElement;c.value!==null&&c.value!==t&&(t===null||t.id!==I.targetUid.value)&&c.value.focus({preventScroll:!0})})}function n(){c.value!==null&&c.value.select()}function o(t){if(N.value===!0&&e.reverseFillMask!==!0){const m=t.target;_(m,m.selectionStart,m.selectionEnd)}w("paste",t)}function r(t){if(!t||!t.target)return;if(e.type==="file"){w("update:modelValue",t.target.files);return}const m=t.target.value;if(t.target.qComposing===!0){f.value=m;return}if(N.value===!0)q(m,!1,t.inputType);else if(u(m),H.value===!0&&t.target===document.activeElement){const{selectionStart:T,selectionEnd:V}=t.target;T!==void 0&&V!==void 0&&z(()=>{t.target===document.activeElement&&m.indexOf(t.target.value)===0&&t.target.setSelectionRange(T,V)})}e.autogrow===!0&&s()}function v(t){w("animationend",t),s()}function u(t,m){x=()=>{M=null,e.type!=="number"&&f.hasOwnProperty("value")===!0&&delete f.value,e.modelValue!==t&&b!==t&&(b=t,m===!0&&(B=!0),w("update:modelValue",t),z(()=>{b===t&&(b=NaN)})),x=void 0},e.type==="number"&&(A=!0,f.value=t),e.debounce!==void 0?(M!==null&&clearTimeout(M),f.value=t,M=setTimeout(x,e.debounce)):x()}function s(){requestAnimationFrame(()=>{const t=c.value;if(t!==null){const m=t.parentNode.style,{scrollTop:T}=t,{overflowY:V,maxHeight:C}=d.platform.is.firefox===!0?{}:window.getComputedStyle(t),Z=V!==void 0&&V!=="scroll";Z===!0&&(t.style.overflowY="hidden"),m.marginBottom=t.scrollHeight-1+"px",t.style.height="1px",t.style.height=t.scrollHeight+"px",Z===!0&&(t.style.overflowY=parseInt(C,10)<t.scrollHeight?"auto":"hidden"),m.marginBottom="",t.scrollTop=T}})}function K(t){D(t),M!==null&&(clearTimeout(M),M=null),x!==void 0&&x(),w("change",t.target.value)}function P(t){t!==void 0&&J(t),M!==null&&(clearTimeout(M),M=null),x!==void 0&&x(),A=!1,B=!1,delete f.value,e.type!=="file"&&setTimeout(()=>{c.value!==null&&(c.value.value=F.value!==void 0?F.value:"")})}function g(){return f.hasOwnProperty("value")===!0?f.value:F.value!==void 0?F.value:""}re(()=>{P()}),oe(()=>{e.autogrow===!0&&s()}),Object.assign(I,{innerValue:F,fieldClass:E(()=>`q-${R.value===!0?"textarea":"input"}`+(e.autogrow===!0?" q-textarea--autogrow":"")),hasShadow:E(()=>e.type!=="file"&&typeof e.shadowText=="string"&&e.shadowText.length!==0),inputRef:c,emitValue:u,hasValue:$,floatingLabel:E(()=>$.value===!0&&(e.type!=="number"||isNaN(F.value)===!1)||p(e.displayValue)),getControl:()=>L(R.value===!0?"textarea":"input",{ref:c,class:["q-field__native q-placeholder",e.inputClass],style:e.inputStyle,...a.value,...l.value,...e.type!=="file"?{value:g()}:Y.value}),getShadowControl:()=>L("div",{class:"q-field__native q-field__shadow absolute-bottom no-pointer-events"+(R.value===!0?"":" text-no-wrap")},[L("span",{class:"invisible"},g()),L("span",e.shadowText)])});const k=me(I);return Object.assign(y,{focus:i,select:n,getNativeElement:()=>c.value}),ue(y,"nativeEl",()=>c.value),k}});export{be as Q,Se as a};
