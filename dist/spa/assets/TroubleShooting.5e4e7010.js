import{Q as D,a as y}from"./QBanner.a12b0268.js";import{b as X,a as O}from"./QPage.82fa872d.js";import{g as Y}from"./QBtn.3ba6f25b.js";import{a as N,Q as g}from"./QCard.ce0ae417.js";import{f as Z,g as R,c as ee,a as ae,b as te}from"./networkAddressAPIs.0b423979.js";import{a as x}from"./axios.a596eead.js";import{_ as se,J as le,r as u,H as A,o as oe,K as d,L as ne,M as n,N as s,a4 as a,S as _,P as r,Q as l,ao as P,O as v}from"./index.40ce7caf.js";import"./QItem.be07e990.js";const ue={class:"select"},ie={key:0,class:"my-cards"},re={class:""},ce={class:""},de={style:{}},pe={class:""},me={class:""},_e={style:{}},ve={class:"grafana-main"},be={key:0,class:"grafana"},fe=["src"],he=le({__name:"TroubleShooting",setup(Se){const i=u({label:"",id:0}),w=u(),b=u(!1),p=u(""),I=u([]),f=u({__name__:"",device_name:"",device_role:"",instance:"",job:"",site_name:"",site_status:"",site_tenant:""}),h=u(""),S=u(""),B=[{label:"Last 5 minutes",value:"5m"},{label:"Last 15 minutes",value:"15m"},{label:"Last 30 minutes",value:"30m"},{label:"Last 1 hour",value:"1h"},{label:"Last 3 hours",value:"3h"},{label:"Last 6 hours",value:"6h"},{label:"Last 12 hours",value:"12h"},{label:"Last 24 hours",value:"24h"},{label:"Last 2 days",value:"2d"},{label:"Last 90 days",value:"90d"}],e=A({accountNumber:"",clientName:"",ipAssigned:"",onuSerialNumber:"",oltIp:"",onuMacAddress:"",onuDeviceName:"",packageTypeId:"",oltSite:"",oltInterface:""}),m=A({upStream:"",downStream:""}),k=async()=>{const c=await Z();I.value=c.map(o=>({onuDeviceName:o.onuDeviceName,id:o.id}))},Q=async(c,o)=>{const t=w.value;t==null||t.start();const T=await x.get(`http://172.91.10.129:9090/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${c}"}`);f.value=T.data.data.result[0].metric,h.value=T.data.data.result[0].value[1];const V=await x.get(`http://172.91.10.129:9090/api/v1/query?query=lo_status{job=%22ip_address%22,site_tenant=%22DCTECH%22,device_name="${f.value.site_name}"}`);S.value=V.data.data.result[0].value[1];const U=await R(o),{accountNumber:M,clientName:j,ipAssigned:q,oltIp:C,onuDeviceName:$,onuMacAddress:E,onuSerialNumber:H,packageTypeId:L}=U;e.accountNumber=M,e.clientName=j,e.ipAssigned=q,e.oltIp=C,e.onuDeviceName=$,e.onuMacAddress=E,e.onuSerialNumber=H,e.packageTypeId=L;const z=await ee(C),{olt_site:J}=z;e.oltSite=J;const K=await ae(L),{upstream:F,downstream:G}=K;m.upStream=F,m.downStream=G;const W=await te(c);e.oltInterface=W,t==null||t.stop(),b.value=!0};return oe(()=>{k()}),(c,o)=>(d(),ne(X,{padding:""},{default:n(()=>[s(D,{color:"secondary",position:"bottom"}),a("div",ue,[s(O,{modelValue:i.value,"onUpdate:modelValue":[o[0]||(o[0]=t=>i.value=t),o[1]||(o[1]=t=>Q(i.value.label,i.value.id))],options:I.value.map(t=>({label:t.onuDeviceName,id:t.id})),label:"Select Subscriber",filled:"",class:"select-subscriber","map-option":""},null,8,["modelValue","options"]),s(O,{modelValue:p.value,"onUpdate:modelValue":o[2]||(o[2]=t=>p.value=t),options:B,label:"Select Time",filled:"",class:"select-subscriber","emit-value":"","map-options":""},null,8,["modelValue"]),s(Y,{icon:"autorenew",class:"cursor-pointer q-mx-sm",onClick:k,flat:""})]),s(D,{ref_key:"bar",ref:w,color:"info",position:"bottom",size:"10px","skip-hijack":""},null,512),b.value?(d(),_("div",ie,[s(g,null,{default:n(()=>[s(y,{class:"bg-primary text-white"},{default:n(()=>[r(" Client Details ")]),_:1}),s(N,null,{default:n(()=>[a("p",null,"Client Name: "+l(e.clientName),1),a("p",null,"Account Number: "+l(e.accountNumber),1),a("p",null,"Package Type: "+l(e.packageTypeId),1)]),_:1})]),_:1}),s(g,null,{default:n(()=>[s(y,{class:"bg-primary text-white"},{default:n(()=>[r(" ONU Details ")]),_:1}),s(N,null,{default:n(()=>[a("p",re,[r(" ONU Status: "),i.value.label!==""?(d(),_("span",{key:0,class:P(h.value==="1"?"up":"down")},l(h.value==="1"?"UP":"Down"),3)):v("",!0)]),a("p",ce,[r(" ONU IP: "),a("span",de,l(f.value.instance),1)]),a("p",null,"ONU Serial Number: "+l(e.onuSerialNumber),1),a("p",null,"ONU Mac Address: "+l(e.onuMacAddress),1),a("p",null," upstream: "+l(m.upStream)+" downstream: "+l(m.downStream),1)]),_:1})]),_:1}),s(g,null,{default:n(()=>[s(y,{class:"bg-primary text-white"},{default:n(()=>[r(" OLT Details ")]),_:1}),s(N,null,{default:n(()=>[a("p",pe,[r(" OLT Status: "),i.value.label!==""?(d(),_("span",{key:0,class:P(S.value==="1"?"up":"down")},l(S.value==="1"?"UP":"Down"),3)):v("",!0)]),a("p",me,[r(" OLT IP: "),a("span",_e,l(e.oltIp),1)]),a("p",null,"OLT Site: "+l(e.oltSite),1),a("p",null,"OLT Interface: "+l(e.oltInterface),1)]),_:1})]),_:1})])):v("",!0),a("div",ve,[b.value&&p.value!==""?(d(),_("div",be,[a("div",null,[a("iframe",{src:`http://172.91.10.151:3000/d-solo/d94d1e0e-a6e4-45c4-847f-6603e1c31ccb/subscribers-traffic-rate-and-uptime?orgId=1&from=now-${p.value}&to=now&var-Subscriber=${i.value.label}&panelId=3`,class:"grafana-panel",frameborder:"0"},null,8,fe)])])):v("",!0)])]),_:1}))}});var Le=se(he,[["__scopeId","data-v-fe0bb30a"]]);export{Le as default};
