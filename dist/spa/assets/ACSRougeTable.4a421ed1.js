import{a as r}from"./QTable.597cab4a.js";import{H as l,h as c,Q as i}from"./hiveConnect.3fef9dcc.js";import{_ as u,r as t,o as m,W as d,$ as f,a0 as p,Y as v,a6 as g}from"./index.db64757c.js";import"./QItem.d085bc73.js";import"./QList.5bf14405.js";const b=u({__name:"ACSRougeTable",setup(_){const o=l(),e=t([]),n=o.$state.devicesColumn,a=t(!1);return m(async()=>{a.value=!0;try{e.value=await c()}catch{}a.value=!1}),(s,w)=>(d(),f(i,{padding:"",class:"items-center justify-evenly"},{default:p(()=>[v(r,{rows:e.value,title:`Rogue ${e.value.length<2?"Device":"Devices"}`,columns:g(n),"row-key":"id",dense:s.$q.screen.lt.md,loading:a.value},null,8,["rows","title","columns","dense","loading"])]),_:1}))}});export{b as default};
