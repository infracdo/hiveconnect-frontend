import{Q as C}from"./QAjaxBar.3f75b36b.js";import{Q as U,i as j,a as L}from"./hiveConnect.260f7de8.js";import{a0 as q,f as n,r as O,o as E,Y as d,a1 as M,a2 as l,_ as t,am as a,$ as P,a4 as i,a5 as s,Z as b,at as k,a3 as h,a8 as z}from"./index.3bc69940.js";import{Q as g}from"./QBanner.49b4fd95.js";import{a as y,Q as S}from"./QCard.8e83543d.js";import{a as x}from"./axios.66c02ff4.js";import{_ as H}from"./plugin-vue_export-helper.21dcd24c.js";import"./QItem.4cbc277c.js";const G={class:"select"},Y={class:"my-cards"},Z={class:""},F={class:""},J={style:{}},K={class:""},W={class:""},X={style:{}},R={class:"grafana-main"},ee={key:0,class:"grafana"},ae=["src"],te=q({__name:"TroubleShooting",setup(se){const r=n(""),D=["Stefani_Germanotta_bw1-100.126.0.3","Mike_Stronghold_bw1-100.126.0.3","Eef_Elsie_bw1-100.126.0.4"],N=n(),m=n(!1),p=n("2d"),Q=n([]),_=n({__name__:"",device_name:"",device_role:"",instance:"",job:"",site_name:"",site_status:"",site_tenant:""}),v=n(""),f=n(""),w="https://dctech-prometheus.apolloglobal.net",A="https://dctech-grafana.apolloglobal.net",V=[{label:"Last 5 minutes",value:"5m"},{label:"Last 15 minutes",value:"15m"},{label:"Last 30 minutes",value:"30m"},{label:"Last 1 hour",value:"1h"},{label:"Last 3 hours",value:"3h"},{label:"Last 6 hours",value:"6h"},{label:"Last 12 hours",value:"12h"},{label:"Last 24 hours",value:"24h"},{label:"Last 2 days",value:"2d"},{label:"Last 90 days",value:"90d"}],o=O({accountNumber:"",clientName:"",ipAssigned:"",onuSerialNumber:"",oltIp:"",onuMacAddress:"",onuDeviceName:"",packageTypeId:"",oltSite:"",oltInterface:""}),I=O({upStream:"",downStream:""}),T=async()=>{const c=await j();Q.value=c.filter(e=>e.onuDeviceName!==null&&e.onuDeviceName.trim()!=="").map(e=>({onuDeviceName:e.onuDeviceName,id:e.id}))},$=async c=>{console.log(c),m.value=!1;const e=N.value;e==null||e.start();const u=await x.get(`${w}/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${c}"}`);_.value=u.data.data.result[0].metric,v.value=u.data.data.result[0].value[1];const B=await x.get(`${w}/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${_.value.site_name}"}`);f.value=B.data.data.result[0].value[1],e==null||e.stop(),m.value=!0};return E(()=>{T()}),(c,e)=>(d(),M(U,{padding:""},{default:l(()=>[t(C,{color:"secondary",position:"bottom"}),a("div",G,[t(L,{modelValue:r.value,"onUpdate:modelValue":[e[0]||(e[0]=u=>r.value=u),e[1]||(e[1]=u=>$(r.value))],options:D,label:"Select Subscriber",filled:"",class:"select-subscriber","map-option":""},null,8,["modelValue"]),t(L,{modelValue:p.value,"onUpdate:modelValue":e[2]||(e[2]=u=>p.value=u),options:V,label:"Select Time",filled:"",class:"select-subscriber","emit-value":"","map-options":""},null,8,["modelValue"]),t(P,{icon:"autorenew",class:"cursor-pointer q-mx-sm",onClick:T,flat:""})]),t(C,{ref_key:"bar",ref:N,color:"info",position:"bottom",size:"10px","skip-hijack":""},null,512),a("div",Y,[t(S,null,{default:l(()=>[t(g,{class:"bg-primary text-white"},{default:l(()=>[i(" Client Details ")]),_:1}),t(y,null,{default:l(()=>[a("p",null,"Client Name: "+s(o.clientName),1),a("p",null,"Account Number: "+s(o.accountNumber),1),a("p",null,"Package Type: "+s(o.packageTypeId),1)]),_:1})]),_:1}),t(S,null,{default:l(()=>[t(g,{class:"bg-primary text-white"},{default:l(()=>[i(" ONU Details ")]),_:1}),t(y,null,{default:l(()=>[a("p",Z,[i(" ONU Status: "),r.value!==""?(d(),b("span",{key:0,class:k(v.value==="1"?"up":"down")},s(v.value==="1"?"Online":"Offline"),3)):h("",!0)]),a("p",F,[i(" ONU IP: "),a("span",J,s(_.value.instance),1)]),a("p",null,"ONU Serial Number: "+s(o.onuSerialNumber),1),a("p",null,"ONU Mac Address: "+s(o.onuMacAddress),1),a("p",null," upstream: "+s(I.upStream)+" downstream: "+s(I.downStream),1)]),_:1})]),_:1}),t(S,null,{default:l(()=>[t(g,{class:"bg-primary text-white"},{default:l(()=>[i(" OLT Details ")]),_:1}),t(y,null,{default:l(()=>[a("p",K,[i(" OLT Status: "),r.value!==""?(d(),b("span",{key:0,class:k(f.value==="1"?"up":"down")},s(f.value==="1"?"Online":"Offline"),3)):h("",!0)]),a("p",W,[i(" OLT IP: "),a("span",X,s(o.oltIp),1)]),a("p",null,"OLT Site: "+s(o.oltSite),1),a("p",null,"OLT Interface: "+s(o.oltInterface),1)]),_:1})]),_:1})]),a("div",R,[m.value?h("",!0):(d(),b("div",ee,[a("div",null,[a("iframe",{src:`${z(A)}/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-traffic-rate-and-uptime?orgId=1&from=now-${p.value}&to=now&var-Subscriber=${r.value}&panelId=3`,class:"grafana-panel",frameborder:"0"},null,8,ae)])]))])]),_:1}))}});var me=H(te,[["__scopeId","data-v-cf02d792"]]);export{me as default};
