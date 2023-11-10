import{Q as n,a as _}from"./QInput.c0288775.js";import{aD as Q,X as A,ah as I,V as S,Y as c,Z as f,_ as o,$ as l,ai as g,a0 as T,a5 as V,ak as w,al as x,a3 as y,am as C,an as M,r as p,ao as U,aP as D,a1 as R,a2 as B,Q as $}from"./index.8012e273.js";import{a as q}from"./QTable.c881817c.js";import{Q as k}from"./QPage.4b2102d8.js";import{m as E,h as O,L as P}from"./networkAddressAPIs.949e875f.js";import{Q as L,a as N}from"./QCard.12ec36a0.js";import{a as v,Q as F}from"./QRadio.85da196f.js";import"./QItem.77f460ae.js";import"./QList.62d4dbde.js";import"./axios.66c02ff4.js";const K=Q("network-address",{state:()=>({networkAddressDetail:{},networkColumn:[{name:"networkAddress",label:"Network Address",field:"networkAddress",align:"left",sortable:!0},{name:"account_No",label:"Account Number",field:"AccountNumber",align:"left",sortable:!0},{name:"notes",label:"Notes",field:"notes",align:"left",sortable:!0},{name:"site",label:"Site",field:"site",align:"left",sortable:!0},{name:"status",label:"Status",field:"status",align:"left",sortable:!0},{name:"type",label:"Type",field:"type",align:"left",sortable:!0},{name:"vlanId",label:"Vlan ID",field:"vlanId",align:"left",sortable:!0},{name:"actions",label:"Actions",field:"actions",align:"left",sortable:!0}]})});const X=d=>(C("data-v-4c7d938d"),d=d(),M(),d),Y=X(()=>g("div",{class:"text-h6"},"Add New Network",-1)),Z={class:"q-gutter-md q-mt-xs"},j=A({__name:"AddNewNetworkModal",props:{isOpen:Boolean},emits:["closeModal"],setup(d,{emit:r}){const i=d,{isOpen:s}=I(i),m=r,u=()=>{m("closeModal")},t=S({networkAddress:"",accountNumber:"",networkType:"",vlanId:"",site:"",notes:""});return(b,a)=>(c(),f(k,null,{default:o(()=>[l(O,{modelValue:w(s),"onUpdate:modelValue":a[7]||(a[7]=e=>x(s)?s.value=e:null)},{default:o(()=>[l(L,null,{default:o(()=>[l(N,null,{default:o(()=>[Y]),_:1}),l(N,{class:"q-pt-none flex-network"},{default:o(()=>[l(n,{modelValue:t.networkAddress,"onUpdate:modelValue":a[0]||(a[0]=e=>t.networkAddress=e),outlined:"",label:"Network Address"},null,8,["modelValue"]),l(E,{outlined:"",label:"Network Type","stack-label":"",class:""},{control:o(()=>[g("div",Z,[l(v,{modelValue:t.networkType,"onUpdate:modelValue":a[1]||(a[1]=e=>t.networkType=e),modelModifiers:{trim:!0},dense:"",val:"Enterprise",label:"Enterprise"},null,8,["modelValue"]),l(v,{modelValue:t.networkType,"onUpdate:modelValue":a[2]||(a[2]=e=>t.networkType=e),modelModifiers:{trim:!0},dense:"",val:"Residential",label:"Residential"},null,8,["modelValue"])])]),_:1}),t.networkType==="Enterprise"?(c(),f(n,{key:0,modelValue:t.accountNumber,"onUpdate:modelValue":a[3]||(a[3]=e=>t.accountNumber=e),outlined:"",label:"Account Number"},null,8,["modelValue"])):T("",!0),l(n,{modelValue:t.vlanId,"onUpdate:modelValue":a[4]||(a[4]=e=>t.vlanId=e),outlined:"",label:"VLAN ID"},null,8,["modelValue"]),l(n,{modelValue:t.site,"onUpdate:modelValue":a[5]||(a[5]=e=>t.site=e),outlined:"",label:"Site"},null,8,["modelValue"]),l(n,{modelValue:t.notes,"onUpdate:modelValue":a[6]||(a[6]=e=>t.notes=e),outlined:"",label:"Notes"},null,8,["modelValue"])]),_:1}),l(F,{align:"right"},{default:o(()=>[l(V,{flat:"",label:"OK",color:"primary"}),l(V,{flat:"",label:"close",color:"primary",onClick:u})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}))}});var z=y(j,[["__scopeId","data-v-4c7d938d"]]);const G=A({__name:"NetworkAddress",setup(d){const r=p(""),i=K(),s=p([]),m=i.$state.networkColumn,u=p(!1),t=()=>{u.value=!u.value};return U(async()=>{s.value=await P()}),(b,a)=>(c(),f(k,{padding:""},{default:o(()=>[l(q,{title:"Network Address",rows:s.value,filter:r.value,"row-key":"name",columns:w(m),loading:!(s.value.length>0),pagination:{rowsPerPage:10},dense:b.$q.screen.lt.md},{"body-cell-networkAddress":o(e=>[l(_,{props:e,clickable:""},{default:o(()=>[l(w(D),{class:"ip-link",to:`network-address/${e.row.networkAddress}`},{default:o(()=>[R(B(e.row.networkAddress),1)]),_:2},1032,["to"])]),_:2},1032,["props"])]),"body-cell-actions":o(e=>[l(_,{props:e,clickable:"",icon:"edit"},null,8,["props"])]),"top-right":o(()=>[l(n,{modelValue:r.value,"onUpdate:modelValue":a[0]||(a[0]=e=>r.value=e),filled:"",dense:"",label:"Search",debounce:"300",color:"primary"},{append:o(()=>[l($,{name:"search"})]),_:1},8,["modelValue"])]),_:1},8,["rows","filter","columns","loading","dense"]),l(z,{"is-open":u.value,onCloseModal:t},null,8,["is-open"]),l(k)]),_:1}))}});var de=y(G,[["__scopeId","data-v-16f7084c"]]);export{de as default};
