import{c as p,f as l,Q as u}from"./QBtn.e795bac4.js";import{a as m,Q as f}from"./QInput.e9968937.js";import{h as b,Y as A,D as g,al as _,r as n,$ as Q,E as v,F as w,G as s,H as e,R as I}from"./index.f7821c4e.js";import{Q as C}from"./QTable.0787f115.js";import{c as k}from"./QPage.6c2f9e53.js";import{d as S}from"./networkAddressAPIs.caec8974.js";import"./QItem.10579f9e.js";import"./QList.22941043.js";import"./axios.a596eead.js";const h=b("div",{class:"q-space"});var y=p({name:"QSpace",setup(){return()=>h}});const B=A("ip-address",{state:()=>({ipAddressDetail:{},ipAddressRow:[{}],ipAddressColumn:[{name:"ipAddress",label:"Ip Address",field:"ipAddress",align:"left",sortable:!0},{name:"account_No",label:"Account Number",field:"AccountNumber",align:"left",sortable:!0},{name:"status",label:"Status",field:"status",align:"left",sortable:!0},{name:"notes",label:"Notes",field:"notes",align:"left",sortable:!0},{name:"actions",label:"Actions",field:"actions",align:"left",sortable:!0}]})}),U=g({__name:"IpAddresses",setup(N){const d=_(),i=B().$state.ipAddressColumn,c=d.params.ipAddress,a=n([]),o=n("");return Q(async()=>{a.value=await S(c)}),(V,r)=>(v(),w(k,{class:"q-pt-md",padding:""},{default:s(()=>[e(C,{filter:o.value,columns:I(i),rows:a.value,class:"text-center",loading:!(a.value&&a.value.length>0),pagination:{sortBy:"ipAddress",rowsPerPage:10}},{"body-cell-actions":s(t=>[e(m,{props:t},{default:s(()=>[e(l,{dense:"",round:"",flat:"",icon:"mode_edit",onClick:P=>console.log(t.row.id)},null,8,["onClick"])]),_:2},1032,["props"])]),top:s(()=>[e(l,{color:"primary",label:"Back",to:"/network-address"}),e(y),e(f,{modelValue:o.value,"onUpdate:modelValue":r[0]||(r[0]=t=>o.value=t),filled:"",dense:"",debounce:"300",color:"primary",label:"Search"},{append:s(()=>[e(u,{name:"search"})]),_:1},8,["modelValue"])]),_:1},8,["filter","columns","rows","loading"])]),_:1}))}});export{U as default};
