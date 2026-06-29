import{_ as q,r as c,w as F,o as A,a as o,c as n,b as e,d as D,t as d,e as O,v as J,f as P,F as y,g as _,h as w,u as G,i as L,j as W,T as U,n as X,k as Y}from"./index-D_hIxq3m.js";const H="/my-app/assets/cherry-logo-DGVt4Opb.png",j="/my-app/assets/cherry-ai-IfmZzWW0.png",ee={class:"cards-wrapper"},te={class:"card weather-card"},ae={class:"card-content"},se={class:"temp"},oe={class:"location"},ne={class:"card main-card"},le={class:"input-section"},ie={class:"list-area"},re={class:"todo-text"},ce={class:"item-text"},de=["onClick"],ue={key:0,class:"empty-msg"},ve={class:"card recommend-card"},pe={key:0,style:{color:"black"}},me={class:"row"},ge={class:"right"},he={class:"name"},ye={class:"meta"},_e={class:"tags"},we=["src"],be={key:0,class:"floating-chat-box"},fe={class:"chat-box-header"},ke={class:"avatar-icon"},xe={key:0,src:j,class:"chat-avatar-img"},Ce={key:1},Ne={class:"message-bubble"},Se={key:0,class:"message-row ai"},$e={class:"preset-questions-scroll"},De=["onClick","disabled"],Ie={class:"chat-input-section"},Te=["disabled"],Re={__name:"Home",setup(Ae){const m=c(""),v=c(JSON.parse(localStorage.getItem("my-todos"))||[]);F(v,s=>{localStorage.setItem("my-todos",JSON.stringify(s))},{deep:!0});const I=()=>{m.value.trim()!==""&&(v.value.push({id:Date.now(),text:m.value}),m.value="")},K=s=>{v.value=v.value.filter(t=>t.id!==s)},i=c({temperature:"--",description:"...",location:"..."}),z={0:"晴天 ☀️",1:"大致晴朗 🌤️",2:"局部多雲 ⛅",3:"陰天 ☁️",45:"霧 🌫️",48:"濃霧 🌫️",51:"毛毛雨 🌦️",53:"毛毛雨 🌦️",55:"毛毛雨 🌦️",61:"小雨 🌧️",63:"中雨 🌧️",65:"大雨 🌧️",71:"小雪 ❄️",80:"陣雨 🌦️",95:"雷雨 ⛈️"},E=()=>{if(!navigator.geolocation){i.value.description="瀏覽器不支援定位",i.value.location="";return}navigator.geolocation.getCurrentPosition(async s=>{const{latitude:t,longitude:a}=s.coords;try{const l=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${t}&longitude=${a}&current=temperature_2m,weather_code`),r=await l.json();if(console.log(r),i.value.temperature=r.current.temperature_2m,i.value.description=z[r.current.weather_code]||"未知天氣",console.log(l.status),!l.ok)throw new Error("Weather API failed");const u=await(await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${t}&longitude=${a}&localityLanguage=zh`)).json();i.value.location=u.city||u.locality||u.principalSubdivision||u.countryName,await M()}catch(l){console.error(l),i.value.description="取得失敗",i.value.location="未知位置"}},()=>{i.value.description="請允許定位",i.value.location=""})};A(()=>{E()});const b=c([]),S=c(!1),M=async()=>{S.value=!0;try{const s=i.value.location||"Kuching";if(!s||s==="..."||s==="未知位置")throw new Error("City not ready yet");const a=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AQ.Ab8RN6KyFoBRzHrZb55g88Z3sJDqmKQHkqXzRr1SGw8u7u1JhQ",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:`
    你是一个严格 JSON API。

    ⚠️ 绝对禁止输出任何中文、解释、Markdown、符号。

    只能输出 JSON 数组，格式如下：

    [
      {
        "name": "餐厅名称",
        "type": "美食",
        "rating": 4.5,
        "distance": "850m",
        "recommend": ["海南吐司", "半熟蛋"]
      }
    ]

    如果不符合 JSON，视为错误。
    `}]}]})});if(!a.ok){const u=await a.text();throw new Error("OpenRouter Error: "+u)}const r=(await a.json()).candidates?.[0]?.content?.parts?.[0]?.text;if(!r)throw new Error("No content returned from API");let g=r.replace(/```json/g,"").replace(/```/g,"").trim();try{b.value=JSON.parse(g)}catch{console.error("JSON parse failed:",g),b.value=[]}}catch(s){console.error("loadRecommendations failed:",s),b.value=[]}S.value=!1},f=c(!1),k=c(""),p=c(!1),x=c(null);A(()=>{window.addEventListener("period-update",()=>{console.log("经期数据更新，AI可以刷新")})});const Q=()=>{const s=JSON.parse(localStorage.getItem("periodSettings"))||{};if(!s.lastDate)return{inPeriod:!1};const t=new Date,[a,l,r]=s.lastDate.split("-").map(Number),g=new Date(a,l-1,r),u=Math.floor((t-g)/(1e3*60*60*24)),N=Number(s.cycleLength)||28,Z=Number(s.duration)||5,h=(u%N+N)%N,R=h>=0&&h<Z;return{inPeriod:R,cycleDay:h,dayInPeriod:R?h+1:null,daysToNext:N-h}},V=c([{label:"🔮 明日運勢如何？"},{label:"🌸 經期不舒服怎麼辦？"},{label:"🌤️ 看看今日天氣資訊"},{label:"✨ 幫我想個願望點子"}]),C=c([{id:1,role:"ai",text:"你好！我是妳的生活小助手阿比 🌸 隨時可以和我聊聊妳的今日心情、願望，或點擊下方快捷鍵向我提問喔！"}]),T=async()=>{await X(),x.value&&(x.value.scrollTop=x.value.scrollHeight)},$=async(s="")=>{const t=s||k.value;if(!t.trim()||p.value)return;C.value.push({id:Date.now(),role:"user",text:t}),s||(k.value=""),T(),p.value=!0;const a=Q(),l=`
你是女性健康AI助手，必须严格按规则输出。

## 输出规则：
1. 必须先总结经期状态
2. 必须给建议
3. 必须简短

---

## ⚠️ 强制行为规则（重点，加这里👇）
如果用户询问经期相关问题（例如：什么时候来、肚子痛、周期、预测、延迟）：

👉 必须优先给“生活建议”
👉 不允许只解释原理或机制
👉 不允许只回答医学知识
👉 必须包含至少3条可执行建议
---

## 当前数据：
📍地点：${i.value.location}
🌤️天气：${i.value.temperature}°C ${i.value.description}

🩸经期状态：
- 是否经期：${a.inPeriod?"是":"否"}
- 当前周期第：${a.cycleDay} 天
- 距离下次经期：${a.daysToNext} 天
${a.inPeriod?`- 当前：经期第 ${a.dayInPeriod} 天`:""}

---

## 用户问题：
${t}
`;try{const r=await B(t,l);C.value.push({id:Date.now()+1,role:"ai",text:r})}catch(r){console.error(r),C.value.push({id:Date.now()+1,role:"ai",text:"AI 出错了，请稍后再试 🙏"})}p.value=!1,T()},B=async(s,t)=>(await(await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AQ.Ab8RN6KyFoBRzHrZb55g88Z3sJDqmKQHkqXzRr1SGw8u7u1JhQ",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:t+`

`+s}]}]})})).json()).candidates?.[0]?.content?.parts?.[0]?.text||"AI 沒有回覆";return(s,t)=>(o(),n("div",ee,[e("div",te,[t[6]||(t[6]=e("div",{class:"card-title weather-title logo wenkai"},[e("span",null,"🌤️"),D(" 天氣")],-1)),e("div",ae,[e("div",se,d(i.value.temperature)+"°C - "+d(i.value.description),1),e("div",oe," 📍 "+d(i.value.location),1)])]),e("div",ne,[t[8]||(t[8]=e("div",{class:"card-title todo-title logo wenkai"},[e("span",null,"✅"),D(" 待辦事項")],-1)),e("div",le,[O(e("input",{"onUpdate:modelValue":t[0]||(t[0]=a=>m.value=a),type:"text",placeholder:"新增事項...",class:"todo-input",onKeyup:P(I,["enter"])},null,544),[[J,m.value]]),e("button",{class:"add-btn",onClick:I},"+")]),e("div",ie,[(o(!0),n(y,null,_(v.value,a=>(o(),n("div",{key:a.id,class:"todo-item"},[e("div",re,[t[7]||(t[7]=e("span",{class:"dot"},"📌",-1)),e("span",ce,d(a.text),1)]),e("button",{class:"del-btn",onClick:l=>K(a.id)},"✕",8,de)]))),128))]),v.value.length===0?(o(),n("p",ue,"今天沒有待辦事項！ ✨")):w("",!0)]),e("div",ve,[t[10]||(t[10]=e("div",{class:"card-title logo wenkai"}," ⭐ 附近推薦 ",-1)),S.value?(o(),n("div",pe," 正在搜尋附近好去處... ")):w("",!0),(o(!0),n(y,null,_(b.value,a=>(o(),n("div",{key:a.name,class:"recommend-item",style:{color:"black"}},[e("div",me,[t[9]||(t[9]=e("div",{class:"left"},"🍜",-1)),e("div",ge,[e("div",he,d(a.name),1),e("div",ye," ⭐ "+d(a.rating||"4.5")+" | 📍 "+d(a.distance||"未知"),1),e("div",_e,[(o(!0),n(y,null,_(a.recommend,l=>(o(),n("span",{key:l}," # "+d(l),1))),128))])])])]))),128))]),f.value?w("",!0):(o(),n("div",{key:0,class:"ai-floating-bubble",onClick:t[1]||(t[1]=a=>f.value=!0)},[e("img",{src:G(H),alt:"Cherry AI",class:"bubble-avatar-img"},null,8,we),t[11]||(t[11]=e("span",{class:"bubble-ping"},null,-1))])),L(U,{name:"slide-fade"},{default:W(()=>[f.value?(o(),n("div",be,[e("div",fe,[t[12]||(t[12]=e("div",{class:"chat-header-title"},[e("img",{src:H,alt:"Cherry AI",class:"header-avatar-img"}),D(" 生活小助手 ")],-1)),e("button",{class:"chat-close-x",onClick:t[2]||(t[2]=a=>f.value=!1)},"✕")]),e("div",{class:"chat-display-window",ref_key:"chatHistoryRef",ref:x},[(o(!0),n(y,null,_(C.value,a=>(o(),n("div",{key:a.id,class:Y(["message-row",a.role])},[e("div",ke,[a.role==="ai"?(o(),n("img",xe)):(o(),n("span",Ce,"🙋🏻‍♀️"))]),e("div",Ne,d(a.text),1)],2))),128))],512),p.value?(o(),n("div",Se,[...t[13]||(t[13]=[e("div",{class:"avatar-icon"},[e("img",{src:j,alt:"AI",class:"chat-avatar-img"})],-1),e("div",{class:"message-bubble typing-dots"},[e("span",null,"."),e("span",null,"."),e("span",null,".")],-1)])])):w("",!0),e("div",$e,[(o(!0),n(y,null,_(V.value,(a,l)=>(o(),n("button",{key:l,class:"preset-badge",onClick:r=>$(a.label),disabled:p.value},d(a.label),9,De))),128))]),e("div",Ie,[O(e("input",{"onUpdate:modelValue":t[3]||(t[3]=a=>k.value=a),type:"text",placeholder:"向小助手提問...",class:"chat-field",onKeyup:t[4]||(t[4]=P(a=>$(""),["enter"]))},null,544),[[J,k.value]]),e("button",{class:"chat-send-btn",onClick:t[5]||(t[5]=a=>$("")),disabled:p.value}," 發送 ",8,Te)])])):w("",!0)]),_:1})]))}},Je=q(Re,[["__scopeId","data-v-2544a8c0"]]);export{Je as default};
