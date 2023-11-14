import{Q as n,a as _}from"./QInput.1b901176.js";import{aF as Q,$ as A,ae as I,U as M,W as c,a0 as f,a1 as o,Y as l,ag as g,a2 as S,Z as N,ah as w,ar as T,_ as y,ai as x,aj as C,r as p,af as U,a3 as R,a4 as B,Q as D,aO as O}from"./index.de64cb1d.js";import{a as $}from"./QTable.8ef6e7e2.js";import{Q as k,c as q,d as E,M as P}from"./hiveConnect.4fe4577a.js";import{Q as F,a as V}from"./QCard.4880c50f.js";import{Q as v}from"./QRadio.4dc66f15.js";import{Q as L}from"./QCardActions.e409040a.js";import"./QItem.e38be670.js";import"./QList.0fcfcac7.js";const j=Q("network-address",{state:()=>({networkAddressDetail:{},networkColumn:[{name:"networkAddress",label:"Network Address",field:"networkAddress",align:"left",sortable:!0},{name:"account_No",label:"Account Number",field:"AccountNumber",align:"left",sortable:!0},{name:"notes",label:"Notes",field:"notes",align:"left",sortable:!0},{name:"site",label:"Site",field:"site",align:"left",sortable:!0},{name:"status",label:"Status",field:"status",align:"left",sortable:!0},{name:"type",label:"Type",field:"type",align:"left",sortable:!0},{name:"vlanId",label:"Vlan ID",field:"vlanId",align:"left",sortable:!0},{name:"actions",label:"Actions",field:"actions",align:"left",sortable:!0}]})});const K=d=>(x("data-v-4c7d938d"),d=d(),C(),d),W=K(()=>g("div",{class:"text-h6"},"Add New Network",-1)),Y={class:"q-gutter-md q-mt-xs"},Z=A({__name:"AddNewNetworkModal",props:{isOpen:Boolean},emits:["closeModal"],setup(d,{emit:r}){const i=d,{isOpen:s}=I(i),m=r,u=()=>{m("closeModal")},t=M({networkAddress:"",accountNumber:"",networkType:"",vlanId:"",site:"",notes:""});return(b,a)=>(c(),f(k,null,{default:o(()=>[l(E,{modelValue:w(s),"onUpdate:modelValue":a[7]||(a[7]=e=>T(s)?s.value=e:null)},{default:o(()=>[l(F,null,{default:o(()=>[l(V,null,{default:o(()=>[W]),_:1}),l(V,{class:"q-pt-none flex-network"},{default:o(()=>[l(n,{modelValue:t.networkAddress,"onUpdate:modelValue":a[0]||(a[0]=e=>t.networkAddress=e),outlined:"",label:"Network Address"},null,8,["modelValue"]),l(q,{outlined:"",label:"Network Type","stack-label":"",class:""},{control:o(()=>[g("div",Y,[l(v,{modelValue:t.networkType,"onUpdate:modelValue":a[1]||(a[1]=e=>t.networkType=e),modelModifiers:{trim:!0},dense:"",val:"Enterprise",label:"Enterprise"},null,8,["modelValue"]),l(v,{modelValue:t.networkType,"onUpdate:modelValue":a[2]||(a[2]=e=>t.networkType=e),modelModifiers:{trim:!0},dense:"",val:"Residential",label:"Residential"},null,8,["modelValue"])])]),_:1}),t.networkType==="Enterprise"?(c(),f(n,{key:0,modelValue:t.accountNumber,"onUpdate:modelValue":a[3]||(a[3]=e=>t.accountNumber=e),outlined:"",label:"Account Number"},null,8,["modelValue"])):S("",!0),l(n,{modelValue:t.vlanId,"onUpdate:modelValue":a[4]||(a[4]=e=>t.vlanId=e),outlined:"",label:"VLAN ID"},null,8,["modelValue"]),l(n,{modelValue:t.site,"onUpdate:modelValue":a[5]||(a[5]=e=>t.site=e),outlined:"",label:"Site"},null,8,["modelValue"]),l(n,{modelValue:t.notes,"onUpdate:modelValue":a[6]||(a[6]=e=>t.notes=e),outlined:"",label:"Notes"},null,8,["modelValue"])]),_:1}),l(L,{align:"right"},{default:o(()=>[l(N,{flat:"",label:"OK",color:"primary"}),l(N,{flat:"",label:"close",color:"primary",onClick:u})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}))}});var z=y(Z,[["__scopeId","data-v-4c7d938d"]]);const G=A({__name:"NetworkAddress",setup(d){const r=p(""),i=j(),s=p([]),m=i.$state.networkColumn,u=p(!1),t=()=>{u.value=!u.value};return U(async()=>{s.value=await P()}),(b,a)=>(c(),f(k,{padding:""},{default:o(()=>[l($,{title:"Network Address",rows:s.value,filter:r.value,"row-key":"name",columns:w(m),loading:!(s.value.length>0),pagination:{rowsPerPage:10},dense:b.$q.screen.lt.md},{"body-cell-networkAddress":o(e=>[l(_,{props:e,clickable:""},{default:o(()=>[l(w(O),{class:"ip-link",to:`network-address/${e.row.networkAddress}`},{default:o(()=>[R(B(e.row.networkAddress),1)]),_:2},1032,["to"])]),_:2},1032,["props"])]),"body-cell-actions":o(e=>[l(_,{props:e,clickable:"",icon:"edit"},null,8,["props"])]),"top-right":o(()=>[l(n,{modelValue:r.value,"onUpdate:modelValue":a[0]||(a[0]=e=>r.value=e),filled:"",dense:"",label:"Search",debounce:"300",color:"primary"},{append:o(()=>[l(D,{name:"search"})]),_:1},8,["modelValue"])]),_:1},8,["rows","filter","columns","loading","dense"]),l(z,{"is-open":u.value,onCloseModal:t},null,8,["is-open"]),l(k)]),_:1}))}});var se=y(G,[["__scopeId","data-v-b9178d7c"]]);export{se as default};
