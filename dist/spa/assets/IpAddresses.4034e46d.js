import{d as c,a0 as p,aP as m,f as r,al as f,Y as b,a1 as A,a2 as a,_ as e,$ as n,Q as g,a8 as _}from"./index.0d3b5b64.js";import{a as Q,Q as w}from"./QInput.2e5b6478.js";import{Q as I}from"./QSpace.34b59fc0.js";import{a as v}from"./QTable.8201ad59.js";import{Q as k,I as C}from"./hiveConnect.5a039ac3.js";import"./QItem.03b102c2.js";import"./QList.0a09d8e9.js";import"./axios.66c02ff4.js";const y=c("ip-address",{state:()=>({ipAddressDetail:{},ipAddressRow:[{}],ipAddressColumn:[{name:"ipAddress",label:"Ip Address",field:"ipAddress",align:"left",sortable:!0},{name:"accountNumber",label:"Account Number",field:"accountNumber",align:"left",sortable:!0},{name:"status",label:"Status",field:"status",align:"left",sortable:!0},{name:"notes",label:"Notes",field:"notes",align:"left",sortable:!0},{name:"actions",label:"Actions",field:"actions",align:"left",sortable:!0}]})}),E=p({__name:"IpAddresses",setup(B){const d=m(),i=y().$state.ipAddressColumn,u=d.params.ipAddress,s=r([]),o=r("");return f(async()=>{s.value=await C(u)}),(S,l)=>(b(),A(k,{class:"q-pt-md",padding:""},{default:a(()=>[e(v,{filter:o.value,columns:_(i),rows:s.value,class:"text-center",loading:!(s.value&&s.value.length>0),pagination:{sortBy:"ipAddress",rowsPerPage:10}},{"body-cell-actions":a(t=>[e(Q,{props:t},{default:a(()=>[e(n,{dense:"",round:"",flat:"",icon:"mode_edit",onClick:h=>console.log(t.row.id)},null,8,["onClick"])]),_:2},1032,["props"])]),top:a(()=>[e(n,{color:"primary",label:"Back",to:"/network-address"}),e(I),e(w,{modelValue:o.value,"onUpdate:modelValue":l[0]||(l[0]=t=>o.value=t),filled:"",dense:"",debounce:"300",color:"primary",label:"Search"},{append:a(()=>[e(g,{name:"search"})]),_:1},8,["modelValue"])]),_:1},8,["filter","columns","rows","loading"])]),_:1}))}});export{E as default};
