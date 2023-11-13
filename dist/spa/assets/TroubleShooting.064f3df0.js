import{Q as L}from"./QAjaxBar.d493cdee.js";import{Q as U,i as A,a as T}from"./hiveConnect.d17e2152.js";import{_ as B,a1 as P,f as u,r as x,o as M,Y as d,a2 as $,a3 as o,$ as a,ai as e,a0 as j,Z as p,a5 as r,a6 as s,as as C,a4 as _}from"./index.644cea97.js";import{Q as f}from"./QBanner.65a58441.js";import{a as h,Q as S}from"./QCard.937f5611.js";import{a as q}from"./axios.66c02ff4.js";import"./QItem.64f0c54d.js";const z={class:"select"},E={key:0,class:"my-cards"},G={class:""},H={class:""},Y={style:{}},Z={class:""},F={class:""},J={style:{}},K={class:"grafana-main"},W={key:0,class:"grafana"},X=["src"],R=P({__name:"TroubleShooting",setup(ee){const i=u({label:"",id:0}),D=["Stefani_Germanotta_bw1-100.126.0.3","Mike_Stronghold_bw1-100.126.0.3"],y=u(),m=u(!1),v=u("2d"),O=u([]),g=u({__name__:"",device_name:"",device_role:"",instance:"",job:"",site_name:"",site_status:"",site_tenant:""}),b=u(""),N=u(""),Q=[{label:"Last 5 minutes",value:"5m"},{label:"Last 15 minutes",value:"15m"},{label:"Last 30 minutes",value:"30m"},{label:"Last 1 hour",value:"1h"},{label:"Last 3 hours",value:"3h"},{label:"Last 6 hours",value:"6h"},{label:"Last 12 hours",value:"12h"},{label:"Last 24 hours",value:"24h"},{label:"Last 2 days",value:"2d"},{label:"Last 90 days",value:"90d"}],n=x({accountNumber:"",clientName:"",ipAssigned:"",onuSerialNumber:"",oltIp:"",onuMacAddress:"",onuDeviceName:"",packageTypeId:"",oltSite:"",oltInterface:""}),w=x({upStream:"",downStream:""}),k=async()=>{const c=await A();O.value=c.filter(t=>t.onuDeviceName!==null&&t.onuDeviceName.trim()!=="").map(t=>({onuDeviceName:t.onuDeviceName,id:t.id}))},V=async(c,t)=>{console.log(c),m.value=!1;const l=y.value;l==null||l.start();const I=await q.get(`http://172.91.10.129:9090/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${c}"}`);g.value=I.data.data.result[0].metric,b.value=I.data.data.result[0].value[1],l==null||l.stop(),m.value=!0};return M(()=>{k()}),(c,t)=>(d(),$(U,{padding:""},{default:o(()=>[a(L,{color:"secondary",position:"bottom"}),e("div",z,[a(T,{modelValue:i.value,"onUpdate:modelValue":[t[0]||(t[0]=l=>i.value=l),t[1]||(t[1]=l=>V(i.value,i.value.id))],options:D,label:"Select Subscriber",filled:"",class:"select-subscriber","map-option":""},null,8,["modelValue"]),a(T,{modelValue:v.value,"onUpdate:modelValue":t[2]||(t[2]=l=>v.value=l),options:Q,label:"Select Time",filled:"",class:"select-subscriber","emit-value":"","map-options":""},null,8,["modelValue"]),a(j,{icon:"autorenew",class:"cursor-pointer q-mx-sm",onClick:k,flat:""})]),a(L,{ref_key:"bar",ref:y,color:"info",position:"bottom",size:"10px","skip-hijack":""},null,512),m.value?(d(),p("div",E,[a(S,null,{default:o(()=>[a(f,{class:"bg-primary text-white"},{default:o(()=>[r(" Client Details ")]),_:1}),a(h,null,{default:o(()=>[e("p",null,"Client Name: "+s(n.clientName),1),e("p",null,"Account Number: "+s(n.accountNumber),1),e("p",null,"Package Type: "+s(n.packageTypeId),1)]),_:1})]),_:1}),a(S,null,{default:o(()=>[a(f,{class:"bg-primary text-white"},{default:o(()=>[r(" ONU Details ")]),_:1}),a(h,null,{default:o(()=>[e("p",G,[r(" ONU Status: "),i.value.label!==""?(d(),p("span",{key:0,class:C(b.value==="1"?"up":"down")},s(b.value==="1"?"UP":"Down"),3)):_("",!0)]),e("p",H,[r(" ONU IP: "),e("span",Y,s(g.value.instance),1)]),e("p",null,"ONU Serial Number: "+s(n.onuSerialNumber),1),e("p",null,"ONU Mac Address: "+s(n.onuMacAddress),1),e("p",null," upstream: "+s(w.upStream)+" downstream: "+s(w.downStream),1)]),_:1})]),_:1}),a(S,null,{default:o(()=>[a(f,{class:"bg-primary text-white"},{default:o(()=>[r(" OLT Details ")]),_:1}),a(h,null,{default:o(()=>[e("p",Z,[r(" OLT Status: "),i.value.label!==""?(d(),p("span",{key:0,class:C(N.value==="1"?"up":"down")},s(N.value==="1"?"UP":"Down"),3)):_("",!0)]),e("p",F,[r(" OLT IP: "),e("span",J,s(n.oltIp),1)]),e("p",null,"OLT Site: "+s(n.oltSite),1),e("p",null,"OLT Interface: "+s(n.oltInterface),1)]),_:1})]),_:1})])):_("",!0),e("div",K,[m.value?_("",!0):(d(),p("div",W,[e("div",null,[e("iframe",{src:`http://172.91.10.151:3000/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-traffic-rate-and-uptime?orgId=1&from=now-${v.value}&to=now&var-Subscriber=${i.value}&panelId=3`,class:"grafana-panel",frameborder:"0"},null,8,X)])]))])]),_:1}))}});var ie=B(R,[["__scopeId","data-v-a2c5cbf0"]]);export{ie as default};
