import{Q as r}from"./QTable.0787f115.js";import{c as n}from"./QPage.6c2f9e53.js";import{u as c,g as s}from"./rougeDevicesApi.52d00dcd.js";import{D as i,r as l,o as m,E as u,F as p,G as d,H as f,R as v}from"./index.f7821c4e.js";import"./QBtn.e795bac4.js";import"./QItem.10579f9e.js";import"./QList.22941043.js";import"./axios.a596eead.js";const Q=i({__name:"ACSRougeTable",setup(_){const t=c(),e=l([]),o=t.$state.devicesColumn;return m(async()=>{e.value=await s(),s()}),(a,g)=>(u(),p(n,{padding:"",class:"items-center justify-evenly"},{default:d(()=>[f(r,{rows:e.value,title:`Rogue ${e.value.length<2?"Device":"Devices"}`,columns:v(o),"row-key":"id",dense:a.$q.screen.lt.md},null,8,["rows","title","columns","dense"])]),_:1}))}});export{Q as default};
