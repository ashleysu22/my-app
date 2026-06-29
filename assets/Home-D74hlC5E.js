import{_ as F,r as c,w as U,o as P,a as o,c as n,b as e,d as S,t as d,e as A,v as R,f as J,F as y,g as _,h as f,u as X,i as G,j as Q,T as Z,n as q,k as Y}from"./index-DPzdhUz2.js";const V="/my-app/assets/cherry-logo-DGVt4Opb.png",j="/my-app/assets/cherry-ai-IfmZzWW0.png",ee={class:"cards-wrapper"},te={class:"card weather-card"},ae={class:"card-content"},se={class:"temp"},oe={class:"location"},ne={class:"card main-card"},le={class:"input-section"},ie={class:"list-area"},re={class:"todo-text"},ce={class:"item-text"},de=["onClick"],ue={key:0,class:"empty-msg"},pe={class:"card recommend-card"},ve={key:0,style:{color:"black"}},me={class:"row"},he={class:"right"},ge={class:"name"},ye={class:"meta"},_e={class:"tags"},fe=["src"],we={key:0,class:"floating-chat-box"},be={class:"chat-box-header"},ke={class:"avatar-icon"},xe={key:0,src:j,class:"chat-avatar-img"},Te={key:1},Ce={class:"message-bubble"},Ne={key:0,class:"message-row ai"},$e={class:"preset-questions-scroll"},Se=["onClick","disabled"],Ie={class:"chat-input-section"},De=["disabled"],Oe={__name:"Home",setup(Pe){const m=c(""),p=c(JSON.parse(localStorage.getItem("my-todos"))||[]);U(p,s=>{localStorage.setItem("my-todos",JSON.stringify(s))},{deep:!0});const I=()=>{m.value.trim()!==""&&(p.value.push({id:Date.now(),text:m.value}),m.value="")},E=s=>{p.value=p.value.filter(t=>t.id!==s)},i=c({temperature:"--",description:"...",location:"..."}),H={0:"晴天 ☀️",1:"大致晴朗 🌤️",2:"局部多雲 ⛅",3:"陰天 ☁️",45:"霧 🌫️",48:"濃霧 🌫️",51:"毛毛雨 🌦️",53:"毛毛雨 🌦️",55:"毛毛雨 🌦️",61:"小雨 🌧️",63:"中雨 🌧️",65:"大雨 🌧️",71:"小雪 ❄️",80:"陣雨 🌦️",95:"雷雨 ⛈️"},M=()=>{if(!navigator.geolocation){i.value.description="瀏覽器不支援定位",i.value.location="";return}navigator.geolocation.getCurrentPosition(async s=>{const{latitude:t,longitude:a}=s.coords;try{const l=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${t}&longitude=${a}&current=temperature_2m,weather_code`),r=await l.json();if(console.log(r),i.value.temperature=r.current.temperature_2m,i.value.description=H[r.current.weather_code]||"未知天氣",console.log(l.status),!l.ok)throw new Error("Weather API failed");const u=await(await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${t}&longitude=${a}&localityLanguage=zh`)).json();i.value.location=u.city||u.locality||u.principalSubdivision||u.countryName,await B()}catch(l){console.error(l),i.value.description="取得失敗",i.value.location="未知位置"}},()=>{i.value.description="請允許定位",i.value.location=""})};P(()=>{M()});const w=c([]),N=c(!1),B=async()=>{N.value=!0;try{const s=i.value.location||"Kuching";if(!s||s==="..."||s==="未知位置")throw new Error("City not ready yet");const a=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer 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","Content-Type":"application/json","HTTP-Referer":"http://localhost","X-Title":"Vue App"},body:JSON.stringify({model:"openai/gpt-4o-mini",messages:[{role:"user",content:`
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
    `}],temperature:.7})});if(!a.ok){const u=await a.text();throw new Error("OpenRouter Error: "+u)}const r=(await a.json())?.choices?.[0]?.message?.content;if(!r)throw new Error("No content returned from API");let h=r.replace(/```json/g,"").replace(/```/g,"").trim();try{w.value=JSON.parse(h)}catch{console.error("JSON parse failed:",h),w.value=[]}}catch(s){console.error("loadRecommendations failed:",s),w.value=[]}N.value=!1},b=c(!1),k=c(""),v=c(!1),x=c(null);P(()=>{window.addEventListener("period-update",()=>{console.log("经期数据更新，AI可以刷新")})});const z=()=>{const s=JSON.parse(localStorage.getItem("periodSettings"))||{};if(!s.lastDate)return{inPeriod:!1};const t=new Date,[a,l,r]=s.lastDate.split("-").map(Number),h=new Date(a,l-1,r),u=Math.floor((t-h)/(1e3*60*60*24)),C=Number(s.cycleLength)||28,W=Number(s.duration)||5,g=(u%C+C)%C,O=g>=0&&g<W;return{inPeriod:O,cycleDay:g,dayInPeriod:O?g+1:null,daysToNext:C-g}},K=c([{label:"🔮 明日運勢如何？"},{label:"🌸 經期不舒服怎麼辦？"},{label:"🌤️ 看看今日天氣資訊"},{label:"✨ 幫我想個願望點子"}]),T=c([{id:1,role:"ai",text:"你好！我是妳的生活小助手阿比 🌸 隨時可以和我聊聊妳的今日心情、願望，或點擊下方快捷鍵向我提問喔！"}]),D=async()=>{await q(),x.value&&(x.value.scrollTop=x.value.scrollHeight)},$=async(s="")=>{const t=s||k.value;if(!t.trim()||v.value)return;T.value.push({id:Date.now(),role:"user",text:t}),s||(k.value=""),D(),v.value=!0;const a=z(),l=`
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
`;try{const r=await L(t,l);T.value.push({id:Date.now()+1,role:"ai",text:r})}catch(r){console.error(r),T.value.push({id:Date.now()+1,role:"ai",text:"AI 出错了，请稍后再试 🙏"})}v.value=!1,D()},L=async(s,t)=>(await(await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer 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","Content-Type":"application/json","HTTP-Referer":"http://localhost","X-Title":"Vue Chat App"},body:JSON.stringify({model:"openai/gpt-4o-mini",messages:[{role:"system",content:t},{role:"user",content:s}]})})).json())?.choices?.[0]?.message?.content||"没有回复";return(s,t)=>(o(),n("div",ee,[e("div",te,[t[6]||(t[6]=e("div",{class:"card-title weather-title logo wenkai"},[e("span",null,"🌤️"),S(" 天氣")],-1)),e("div",ae,[e("div",se,d(i.value.temperature)+"°C - "+d(i.value.description),1),e("div",oe," 📍 "+d(i.value.location),1)])]),e("div",ne,[t[8]||(t[8]=e("div",{class:"card-title todo-title logo wenkai"},[e("span",null,"✅"),S(" 待辦事項")],-1)),e("div",le,[A(e("input",{"onUpdate:modelValue":t[0]||(t[0]=a=>m.value=a),type:"text",placeholder:"新增事項...",class:"todo-input",onKeyup:J(I,["enter"])},null,544),[[R,m.value]]),e("button",{class:"add-btn",onClick:I},"+")]),e("div",ie,[(o(!0),n(y,null,_(p.value,a=>(o(),n("div",{key:a.id,class:"todo-item"},[e("div",re,[t[7]||(t[7]=e("span",{class:"dot"},"📌",-1)),e("span",ce,d(a.text),1)]),e("button",{class:"del-btn",onClick:l=>E(a.id)},"✕",8,de)]))),128))]),p.value.length===0?(o(),n("p",ue,"今天沒有待辦事項！ ✨")):f("",!0)]),e("div",pe,[t[10]||(t[10]=e("div",{class:"card-title logo wenkai"}," ⭐ 附近推薦 ",-1)),N.value?(o(),n("div",ve," 正在搜尋附近好去處... ")):f("",!0),(o(!0),n(y,null,_(w.value,a=>(o(),n("div",{key:a.name,class:"recommend-item",style:{color:"black"}},[e("div",me,[t[9]||(t[9]=e("div",{class:"left"},"🍜",-1)),e("div",he,[e("div",ge,d(a.name),1),e("div",ye," ⭐ "+d(a.rating||"4.5")+" | 📍 "+d(a.distance||"未知"),1),e("div",_e,[(o(!0),n(y,null,_(a.recommend,l=>(o(),n("span",{key:l}," # "+d(l),1))),128))])])])]))),128))]),b.value?f("",!0):(o(),n("div",{key:0,class:"ai-floating-bubble",onClick:t[1]||(t[1]=a=>b.value=!0)},[e("img",{src:X(V),alt:"Cherry AI",class:"bubble-avatar-img"},null,8,fe),t[11]||(t[11]=e("span",{class:"bubble-ping"},null,-1))])),G(Z,{name:"slide-fade"},{default:Q(()=>[b.value?(o(),n("div",we,[e("div",be,[t[12]||(t[12]=e("div",{class:"chat-header-title"},[e("img",{src:V,alt:"Cherry AI",class:"header-avatar-img"}),S(" 生活小助手 ")],-1)),e("button",{class:"chat-close-x",onClick:t[2]||(t[2]=a=>b.value=!1)},"✕")]),e("div",{class:"chat-display-window",ref_key:"chatHistoryRef",ref:x},[(o(!0),n(y,null,_(T.value,a=>(o(),n("div",{key:a.id,class:Y(["message-row",a.role])},[e("div",ke,[a.role==="ai"?(o(),n("img",xe)):(o(),n("span",Te,"🙋🏻‍♀️"))]),e("div",Ce,d(a.text),1)],2))),128))],512),v.value?(o(),n("div",Ne,[...t[13]||(t[13]=[e("div",{class:"avatar-icon"},[e("img",{src:j,alt:"AI",class:"chat-avatar-img"})],-1),e("div",{class:"message-bubble typing-dots"},[e("span",null,"."),e("span",null,"."),e("span",null,".")],-1)])])):f("",!0),e("div",$e,[(o(!0),n(y,null,_(K.value,(a,l)=>(o(),n("button",{key:l,class:"preset-badge",onClick:r=>$(a.label),disabled:v.value},d(a.label),9,Se))),128))]),e("div",Ie,[A(e("input",{"onUpdate:modelValue":t[3]||(t[3]=a=>k.value=a),type:"text",placeholder:"向小助手提問...",class:"chat-field",onKeyup:t[4]||(t[4]=J(a=>$(""),["enter"]))},null,544),[[R,k.value]]),e("button",{class:"chat-send-btn",onClick:t[5]||(t[5]=a=>$("")),disabled:v.value}," 發送 ",8,De)])])):f("",!0)]),_:1})]))}},Re=F(Oe,[["__scopeId","data-v-6301e493"]]);export{Re as default};
