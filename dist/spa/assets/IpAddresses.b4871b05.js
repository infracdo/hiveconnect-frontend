import{d as c,a1 as p,aQ as m,f as r,ah as f,Y as b,a2 as A,a3 as a,$ as e,a0 as n,Q as g,aj as Q}from"./index.00c2ca2a.js";import{a as _,Q as w}from"./QInput.f5123e24.js";import{Q as v}from"./QSpace.acf92e0c.js";import{a as I}from"./QTable.d34938b6.js";import{Q as k,K as C}from"./hiveConnect.06ec3697.js";import"./QItem.fed542d7.js";import"./QList.4aa8ec46.js";import"./axios.66c02ff4.js";const h=c("ip-address",{state:()=>({ipAddressDetail:{},ipAddressRow:[{}],ipAddressColumn:[{name:"ipAddress",label:"Ip Address",field:"ipAddress",align:"left",sortable:!0},{name:"accountNumber",label:"Account Number",field:"accountNumber",align:"left",sortable:!0},{name:"status",label:"Status",field:"status",align:"left",sortable:!0},{name:"notes",label:"Notes",field:"notes",align:"left",sortable:!0},{name:"actions",label:"Actions",field:"actions",align:"left",sortable:!0}]})}),D=p({__name:"IpAddresses",setup(y){const d=m(),i=h().$state.ipAddressColumn,u=d.params.ipAddress,s=r([]),o=r("");return f(async()=>{s.value=await C(u)}),(N,l)=>(b(),A(k,{class:"q-pt-md",padding:""},{default:a(()=>[e(I,{filter:o.value,columns:Q(i),rows:s.value,class:"text-center",loading:!(s.value&&s.value.length>0),pagination:{sortBy:"ipAddress",rowsPerPage:10}},{"body-cell-actions":a(t=>[e(_,{props:t},{default:a(()=>[e(n,{dense:"",round:"",flat:"",icon:"mode_edit",onClick:S=>console.log(t.row.id)},null,8,["onClick"])]),_:2},1032,["props"])]),top:a(()=>[e(n,{color:"primary",label:"Back",to:"/network-address"}),e(v),e(w,{modelValue:o.value,"onUpdate:modelValue":l[0]||(l[0]=t=>o.value=t),filled:"",dense:"",debounce:"300",color:"primary",label:"Search"},{append:a(()=>[e(g,{name:"search"})]),_:1},8,["modelValue"])]),_:1},8,["filter","columns","rows","loading"])]),_:1}))}});export{D as default};
