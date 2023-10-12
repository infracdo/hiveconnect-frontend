import{Q as r,a as _}from"./QInput.e9968937.js";import{f as N,Q}from"./QBtn.e795bac4.js";import{Q as I}from"./QTable.0787f115.js";import{Q as S,b as T,c}from"./QPage.6c2f9e53.js";import{Y as x,_ as A,D as g,Z as C,B as M,E as f,F as w,G as a,H as e,R as k,a4 as U,a0 as y,I as R,a1 as B,a2 as D,r as p,$ as E,ak as $,J as q,K as O}from"./index.f7821c4e.js";import{c as P}from"./networkAddressAPIs.caec8974.js";import{Q as F,a as V,b as v,c as K}from"./QCard.6caf12f0.js";import"./QItem.10579f9e.js";import"./QList.22941043.js";import"./axios.a596eead.js";const L=x("network-address",{state:()=>({networkAddressDetail:{},networkColumn:[{name:"networkAddress",label:"Network Address",field:"networkAddress",align:"left",sortable:!0},{name:"account_No",label:"Account Number",field:"AccountNumber",align:"left",sortable:!0},{name:"notes",label:"Notes",field:"notes",align:"left",sortable:!0},{name:"site",label:"Site",field:"site",align:"left",sortable:!0},{name:"status",label:"Status",field:"status",align:"left",sortable:!0},{name:"type",label:"Type",field:"type",align:"left",sortable:!0},{name:"vlanId",label:"Vlan ID",field:"vlanId",align:"left",sortable:!0},{name:"actions",label:"Actions",field:"actions",align:"left",sortable:!0}]})});const G=n=>(B("data-v-cf12ca3c"),n=n(),D(),n),H=G(()=>y("div",{class:"text-h6"}," Add New Network ",-1)),J={class:"q-gutter-md q-mt-xs"},Y=g({__name:"AddNewNetworkModal",props:{isOpen:Boolean},emits:["closeModal"],setup(n,{emit:u}){const i=n,{isOpen:s}=C(i),m=()=>{u("closeModal")},l=M({networkAddress:"",accountNumber:"",networkType:"",vlanId:"",site:"",notes:""});return(b,t)=>(f(),w(c,null,{default:a(()=>[e(S,{modelValue:k(s),"onUpdate:modelValue":t[7]||(t[7]=o=>U(s)?s.value=o:null)},{default:a(()=>[e(F,null,{default:a(()=>[e(V,null,{default:a(()=>[H]),_:1}),e(V,{class:"q-pt-none flex-network"},{default:a(()=>[e(r,{modelValue:l.networkAddress,"onUpdate:modelValue":t[0]||(t[0]=o=>l.networkAddress=o),outlined:"",label:"Network Address"},null,8,["modelValue"]),e(T,{outlined:"",label:"Network Type","stack-label":"",class:""},{control:a(()=>[y("div",J,[e(v,{modelValue:l.networkType,"onUpdate:modelValue":t[1]||(t[1]=o=>l.networkType=o),modelModifiers:{trim:!0},dense:"",val:"Enterprise",label:"Enterprise"},null,8,["modelValue"]),e(v,{modelValue:l.networkType,"onUpdate:modelValue":t[2]||(t[2]=o=>l.networkType=o),modelModifiers:{trim:!0},dense:"",val:"Residential",label:"Residential"},null,8,["modelValue"])])]),_:1}),l.networkType==="Enterprise"?(f(),w(r,{key:0,modelValue:l.accountNumber,"onUpdate:modelValue":t[3]||(t[3]=o=>l.accountNumber=o),outlined:"",label:"Account Number"},null,8,["modelValue"])):R("",!0),e(r,{modelValue:l.vlanId,"onUpdate:modelValue":t[4]||(t[4]=o=>l.vlanId=o),outlined:"",label:"VLAN ID"},null,8,["modelValue"]),e(r,{modelValue:l.site,"onUpdate:modelValue":t[5]||(t[5]=o=>l.site=o),outlined:"",label:"Site"},null,8,["modelValue"]),e(r,{modelValue:l.notes,"onUpdate:modelValue":t[6]||(t[6]=o=>l.notes=o),outlined:"",label:"Notes"},null,8,["modelValue"])]),_:1}),e(K,{align:"right"},{default:a(()=>[e(N,{flat:"",label:"OK",color:"primary"}),e(N,{flat:"",label:"close",color:"primary",onClick:m})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}))}});var Z=A(Y,[["__scopeId","data-v-cf12ca3c"]]);const j=g({__name:"NetworkAddress",setup(n){const u=p(""),i=L(),s=p([]),m=i.$state.networkColumn,l=p(!1),b=()=>{l.value=!l.value};return E(async()=>{s.value=await P()}),(t,o)=>(f(),w(c,{padding:""},{default:a(()=>[e(I,{title:"Network Address",rows:s.value,filter:u.value,"row-key":"name",columns:k(m),loading:!(s.value.length>0),pagination:{rowsPerPage:10},dense:t.$q.screen.lt.md},{"body-cell-networkAddress":a(d=>[e(_,{props:d,clickable:""},{default:a(()=>[e(k($),{class:"ip-link",to:`network-address/${d.row.networkAddress}`},{default:a(()=>[q(O(d.row.networkAddress),1)]),_:2},1032,["to"])]),_:2},1032,["props"])]),"body-cell-actions":a(d=>[e(_,{props:d,clickable:"",icon:"edit"},null,8,["props"])]),"top-right":a(()=>[e(r,{modelValue:u.value,"onUpdate:modelValue":o[0]||(o[0]=d=>u.value=d),filled:"",dense:"",label:"Search",debounce:"300",color:"primary"},{append:a(()=>[e(Q,{name:"search"})]),_:1},8,["modelValue"])]),_:1},8,["rows","filter","columns","loading","dense"]),e(Z,{"is-open":l.value,onCloseModal:b},null,8,["is-open"]),e(c)]),_:1}))}});var de=A(j,[["__scopeId","data-v-16f7084c"]]);export{de as default};
