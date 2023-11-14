import{Q as k}from"./QAjaxBar.6852f522.js";import{Q as j,j as B,b as C,a as L}from"./hiveConnect.a0bba373.js";import{_ as q,r as n,U as O,o as E,W as d,$ as M,a0 as l,Y as t,aj as a,Z as P,a2 as r,a3 as s,X as b,ar as x,a1 as h,ak as z}from"./index.bec3ba3f.js";import{Q as g}from"./QBanner.7cb8ff76.js";import{a as y,Q as S}from"./QCard.eccc4aee.js";import{_ as H}from"./plugin-vue_export-helper.21dcd24c.js";import"./QItem.790fd7b5.js";const G={class:"select"},W={class:"my-cards"},X={class:""},Y={class:""},Z={style:{}},F={class:""},J={class:""},K={style:{}},R={class:"grafana-main"},ee={key:0,class:"grafana"},ae=["src"],te=q({__name:"TroubleShooting",setup(se){const i=n(""),D=["Stefani_Germanotta_bw1-100.126.0.3","Mike_Stronghold_bw1-100.126.0.3","Eef_Elsie_bw1-100.126.0.4"],N=n(),p=n(!1),m=n("2d"),Q=n([]),_=n({__name__:"",device_name:"",device_role:"",instance:"",job:"",site_name:"",site_status:"",site_tenant:""}),v=n(""),f=n(""),w="https://dctech-prometheus.apolloglobal.net",A="https://dctech-grafana.apolloglobal.net",V=[{label:"Last 5 minutes",value:"5m"},{label:"Last 15 minutes",value:"15m"},{label:"Last 30 minutes",value:"30m"},{label:"Last 1 hour",value:"1h"},{label:"Last 3 hours",value:"3h"},{label:"Last 6 hours",value:"6h"},{label:"Last 12 hours",value:"12h"},{label:"Last 24 hours",value:"24h"},{label:"Last 2 days",value:"2d"},{label:"Last 90 days",value:"90d"}],o=O({accountNumber:"",clientName:"",ipAssigned:"",onuSerialNumber:"",oltIp:"",onuMacAddress:"",onuDeviceName:"",packageTypeId:"",oltSite:"",oltInterface:""}),I=O({upStream:"",downStream:""}),T=async()=>{const c=await B();Q.value=c.filter(e=>e.onuDeviceName!==null&&e.onuDeviceName.trim()!=="").map(e=>({onuDeviceName:e.onuDeviceName,id:e.id}))},$=async c=>{console.log(c),p.value=!1;const e=N.value;e==null||e.start();const u=await L.get(`${w}/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${c}"}`);_.value=u.data.data.result[0].metric,v.value=u.data.data.result[0].value[1];const U=await L.get(`${w}/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${_.value.site_name}"}`);f.value=U.data.data.result[0].value[1],e==null||e.stop(),p.value=!0};return E(()=>{T()}),(c,e)=>(d(),M(j,{padding:""},{default:l(()=>[t(k,{color:"secondary",position:"bottom"}),a("div",G,[t(C,{modelValue:i.value,"onUpdate:modelValue":[e[0]||(e[0]=u=>i.value=u),e[1]||(e[1]=u=>$(i.value))],options:D,label:"Select Subscriber",filled:"",class:"select-subscriber","map-option":""},null,8,["modelValue"]),t(C,{modelValue:m.value,"onUpdate:modelValue":e[2]||(e[2]=u=>m.value=u),options:V,label:"Select Time",filled:"",class:"select-subscriber","emit-value":"","map-options":""},null,8,["modelValue"]),t(P,{icon:"autorenew",class:"cursor-pointer q-mx-sm",onClick:T,flat:""})]),t(k,{ref_key:"bar",ref:N,color:"info",position:"bottom",size:"10px","skip-hijack":""},null,512),a("div",W,[t(S,null,{default:l(()=>[t(g,{class:"bg-primary text-white"},{default:l(()=>[r(" Client Details ")]),_:1}),t(y,null,{default:l(()=>[a("p",null,"Client Name: "+s(o.clientName),1),a("p",null,"Account Number: "+s(o.accountNumber),1),a("p",null,"Package Type: "+s(o.packageTypeId),1)]),_:1})]),_:1}),t(S,null,{default:l(()=>[t(g,{class:"bg-primary text-white"},{default:l(()=>[r(" ONU Details ")]),_:1}),t(y,null,{default:l(()=>[a("p",X,[r(" ONU Status: "),i.value!==""?(d(),b("span",{key:0,class:x(v.value==="1"?"up":"down")},s(v.value==="1"?"Online":"Offline"),3)):h("",!0)]),a("p",Y,[r(" ONU IP: "),a("span",Z,s(_.value.instance),1)]),a("p",null,"ONU Serial Number: "+s(o.onuSerialNumber),1),a("p",null,"ONU Mac Address: "+s(o.onuMacAddress),1),a("p",null," upstream: "+s(I.upStream)+" downstream: "+s(I.downStream),1)]),_:1})]),_:1}),t(S,null,{default:l(()=>[t(g,{class:"bg-primary text-white"},{default:l(()=>[r(" OLT Details ")]),_:1}),t(y,null,{default:l(()=>[a("p",F,[r(" OLT Status: "),i.value!==""?(d(),b("span",{key:0,class:x(f.value==="1"?"up":"down")},s(f.value==="1"?"Online":"Offline"),3)):h("",!0)]),a("p",J,[r(" OLT IP: "),a("span",K,s(o.oltIp),1)]),a("p",null,"OLT Site: "+s(o.oltSite),1),a("p",null,"OLT Interface: "+s(o.oltInterface),1)]),_:1})]),_:1})]),a("div",R,[p.value?h("",!0):(d(),b("div",ee,[a("div",null,[a("iframe",{src:`${z(A)}/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-traffic-rate-and-uptime?orgId=1&from=now-${m.value}&to=now&var-Subscriber=${i.value}&panelId=3`,class:"grafana-panel",frameborder:"0"},null,8,ae)])]))])]),_:1}))}});var de=H(te,[["__scopeId","data-v-cf02d792"]]);export{de as default};
