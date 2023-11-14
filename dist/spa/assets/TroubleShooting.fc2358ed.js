import{Q as C}from"./QAjaxBar.60a9f935.js";import{Q as B,j as E,b as L,a as k}from"./hiveConnect.c29240c8.js";import{_ as P,$ as j,r as n,U as x,o as q,W as d,a0 as $,a1 as l,Y as t,ag as a,Z as M,a3 as i,a4 as s,X as b,aq as D,a2 as f}from"./index.9e8367b5.js";import{Q as h}from"./QBanner.db5d31a7.js";import{a as g,Q as y}from"./QCard.1460a29e.js";import"./QItem.f3f5e595.js";const z={class:"select"},H={class:"my-cards"},G={class:""},W={class:""},X={style:{}},Y={class:""},Z={class:""},F={style:{}},J={class:"grafana-main"},K={key:0,class:"grafana"},R=["src"],ee=j({__name:"TroubleShooting",setup(ae){const r=n(""),O=["Stefani_Germanotta_bw1-100.126.0.3","Mike_Stronghold_bw1-100.126.0.3","Eef_Elsie_bw1-100.126.0.4"],S=n(),p=n(!1),N=n("2d"),Q=n([]),m=n({__name__:"",device_name:"",device_role:"",instance:"",job:"",site_name:"",site_status:"",site_tenant:""}),_=n(""),v=n(""),w="https://dctech-prometheus.apolloglobal.net",U=[{label:"Last 5 minutes",value:"5m"},{label:"Last 15 minutes",value:"15m"},{label:"Last 30 minutes",value:"30m"},{label:"Last 1 hour",value:"1h"},{label:"Last 3 hours",value:"3h"},{label:"Last 6 hours",value:"6h"},{label:"Last 12 hours",value:"12h"},{label:"Last 24 hours",value:"24h"},{label:"Last 2 days",value:"2d"},{label:"Last 90 days",value:"90d"}],o=x({accountNumber:"",clientName:"",ipAssigned:"",onuSerialNumber:"",oltIp:"",onuMacAddress:"",onuDeviceName:"",packageTypeId:"",oltSite:"",oltInterface:""}),I=x({upStream:"",downStream:""}),T=async()=>{const c=await E();Q.value=c.filter(e=>e.onuDeviceName!==null&&e.onuDeviceName.trim()!=="").map(e=>({onuDeviceName:e.onuDeviceName,id:e.id}))},V=async c=>{console.log(c),p.value=!1;const e=S.value;e==null||e.start();const u=await k.get(`${w}/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${c}"}`);m.value=u.data.data.result[0].metric,_.value=u.data.data.result[0].value[1];const A=await k.get(`${w}/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${m.value.site_name}"}`);v.value=A.data.data.result[0].value[1],e==null||e.stop(),p.value=!0};return q(()=>{T()}),(c,e)=>(d(),$(B,{padding:""},{default:l(()=>[t(C,{color:"secondary",position:"bottom"}),a("div",z,[t(L,{modelValue:r.value,"onUpdate:modelValue":[e[0]||(e[0]=u=>r.value=u),e[1]||(e[1]=u=>V(r.value))],options:O,label:"Select Subscriber",filled:"",class:"select-subscriber","map-option":""},null,8,["modelValue"]),t(L,{modelValue:N.value,"onUpdate:modelValue":e[2]||(e[2]=u=>N.value=u),options:U,label:"Select Time",filled:"",class:"select-subscriber","emit-value":"","map-options":""},null,8,["modelValue"]),t(M,{icon:"autorenew",class:"cursor-pointer q-mx-sm",onClick:T,flat:""})]),t(C,{ref_key:"bar",ref:S,color:"info",position:"bottom",size:"10px","skip-hijack":""},null,512),a("div",H,[t(y,null,{default:l(()=>[t(h,{class:"bg-primary text-white"},{default:l(()=>[i(" Client Details ")]),_:1}),t(g,null,{default:l(()=>[a("p",null,"Client Name: "+s(o.clientName),1),a("p",null,"Account Number: "+s(o.accountNumber),1),a("p",null,"Package Type: "+s(o.packageTypeId),1)]),_:1})]),_:1}),t(y,null,{default:l(()=>[t(h,{class:"bg-primary text-white"},{default:l(()=>[i(" ONU Details ")]),_:1}),t(g,null,{default:l(()=>[a("p",G,[i(" ONU Status: "),r.value!==""?(d(),b("span",{key:0,class:D(_.value==="1"?"up":"down")},s(_.value==="1"?"UP":"Down"),3)):f("",!0)]),a("p",W,[i(" ONU IP: "),a("span",X,s(m.value.instance),1)]),a("p",null,"ONU Serial Number: "+s(o.onuSerialNumber),1),a("p",null,"ONU Mac Address: "+s(o.onuMacAddress),1),a("p",null," upstream: "+s(I.upStream)+" downstream: "+s(I.downStream),1)]),_:1})]),_:1}),t(y,null,{default:l(()=>[t(h,{class:"bg-primary text-white"},{default:l(()=>[i(" OLT Details ")]),_:1}),t(g,null,{default:l(()=>[a("p",Y,[i(" OLT Status: "),r.value!==""?(d(),b("span",{key:0,class:D(v.value==="1"?"up":"down")},s(v.value==="1"?"UP":"Down"),3)):f("",!0)]),a("p",Z,[i(" OLT IP: "),a("span",F,s(o.oltIp),1)]),a("p",null,"OLT Site: "+s(o.oltSite),1),a("p",null,"OLT Interface: "+s(o.oltInterface),1)]),_:1})]),_:1})]),a("div",J,[p.value?f("",!0):(d(),b("div",K,[a("div",null,[a("iframe",{src:"https://dctech-grafana.apolloglobal.net/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-traffic-rate-and-uptime?orgId=1&var-Subscriber=Eef_Elsie_bw1-100.126.0.4&panelId=3",width:"450",height:"200",frameborder:"0"},null,8,R)])]))])]),_:1}))}});var ie=P(ee,[["__scopeId","data-v-0c4222ac"]]);export{ie as default};
