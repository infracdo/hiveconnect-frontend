import{a as n}from"./QTable.c881817c.js";import{Q as l}from"./QPage.4b2102d8.js";import{t as c,K as i}from"./networkAddressAPIs.949e875f.js";import{X as u,r as o,o as m,Y as d,Z as p,_ as f,$ as v,ak as g}from"./index.8012e273.js";import"./QItem.77f460ae.js";import"./QList.62d4dbde.js";import"./axios.66c02ff4.js";const Q=u({__name:"ACSRougeTable",setup(_){const s=c(),e=o([]),r=s.$state.devicesColumn,a=o(!1);return m(async()=>{a.value=!0;try{e.value=await i()}catch{}a.value=!1}),(t,w)=>(d(),p(l,{padding:"",class:"items-center justify-evenly"},{default:f(()=>[v(n,{rows:e.value,title:`Rogue ${e.value.length<2?"Device":"Devices"}`,columns:g(r),"row-key":"id",dense:t.$q.screen.lt.md,loading:a.value},null,8,["rows","title","columns","dense","loading"])]),_:1}))}});export{Q as default};
