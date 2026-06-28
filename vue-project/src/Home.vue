<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import cherryLogoImg from '@/assets/cherry-logo.png';


// ==========================================
// 1. TODO LIST LOGIC
// ==========================================
const newTodo = ref('');
const todos = ref(JSON.parse(localStorage.getItem('my-todos')) || []);

watch(todos, (newVal) => {
  localStorage.setItem('my-todos', JSON.stringify(newVal));
}, { deep: true });

const addTodo = () => {
  if (newTodo.value.trim() !== '') {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value
    });
    newTodo.value = ''; 
  }
};

const deleteTodo = (id) => {
  todos.value = todos.value.filter(t => t.id !== id);
};

// ==========================================
// WEATHER
// ==========================================

const weather = ref({
  temperature: '--',
  description: '...', //weatherCodeMap
  location: '...'
})

const weatherCodeMap = {
  0: '晴天 ☀️',
  1: '大致晴朗 🌤️',
  2: '局部多雲 ⛅',
  3: '陰天 ☁️',
  45: '霧 🌫️',
  48: '濃霧 🌫️',
  51: '毛毛雨 🌦️',
  53: '毛毛雨 🌦️',
  55: '毛毛雨 🌦️',
  61: '小雨 🌧️',
  63: '中雨 🌧️',
  65: '大雨 🌧️',
  71: '小雪 ❄️',
  80: '陣雨 🌦️',
  95: '雷雨 ⛈️'
}

const loadWeather = () => {

  if (!navigator.geolocation) {
    weather.value.description = '瀏覽器不支援定位'
    weather.value.location = ''
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {

      const { latitude, longitude } = position.coords

      try {

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
        )

        const weatherData = await weatherRes.json()

        console.log(weatherData)

        weather.value.temperature =
          weatherData.current.temperature_2m

        weather.value.description =
          weatherCodeMap[weatherData.current.weather_code] || '未知天氣'

        console.log(weatherRes.status)

        if (!weatherRes.ok) {
  throw new Error('Weather API failed')
}


        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=zh`
        )

        const geoData = await geoRes.json()

        weather.value.location =
          geoData.city ||
          geoData.locality ||
          geoData.principalSubdivision ||
          geoData.countryName

          await loadRecommendations()

      } catch (err) {

        console.error(err)

        weather.value.description = '取得失敗'
        weather.value.location = '未知位置'

      }

    },
    () => {
      weather.value.description = '請允許定位'
      weather.value.location = ''
    }
  )

}

onMounted(() => {
  loadWeather()
})

// ==========================================
// 2. Recomended card
// ==========================================
const recommendations = ref([])
const loadingRecommend = ref(false)

const loadRecommendations = async () => {
  loadingRecommend.value = true

  try {
    const city = weather.value.location || "Kuching"

    if (!city || city === '...' || city === '未知位置') {
      throw new Error('City not ready yet')
    }

    const prompt = `
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
    `

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "Vue App"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        })
      }
    )

    // 
    if (!response.ok) {
      const errText = await response.text()
      throw new Error("OpenRouter Error: " + errText)
    }

    const data = await response.json()

    const content = data?.choices?.[0]?.message?.content

    if (!content) {
      throw new Error("No content returned from API")
    }

    let text = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    try {
      recommendations.value = JSON.parse(text)
    } catch (e) {
      console.error("JSON parse failed:", text)
      recommendations.value = []
    }

  } catch (err) {
    console.error("loadRecommendations failed:", err)
    recommendations.value = []
  }

  loadingRecommend.value = false
}


// ==========================================
// 3. AI ASSISTANT LOGIC WITH FLOATING TOGGLE
// ==========================================
const isChatOpen = ref(false); 
const userInput = ref('');
const isAiTyping = ref(false);
const chatHistoryRef = ref(null);


onMounted(() => {
  window.addEventListener('period-update', () => {
    console.log('经期数据更新，AI可以刷新')
  })
})

const getPeriodStatus = () => {
  const settings = JSON.parse(localStorage.getItem('periodSettings')) || {}

  if (!settings.lastDate) {
    return { inPeriod: false }
  }

  const today = new Date()
  const [y, m, d] = settings.lastDate.split('-').map(Number)
  const last = new Date(y, m - 1, d)

  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24))
  const cycle = Number(settings.cycleLength || 28)
  const duration = Number(settings.duration || 5)

  const cycleDay = ((diffDays % cycle) + cycle) % cycle
  const inPeriod = cycleDay >= 0 && cycleDay < duration

  return {
    inPeriod,
    cycleDay,
    dayInPeriod: inPeriod ? cycleDay + 1 : null,
    daysToNext: cycle - cycleDay
  }
}

const preQuestions = ref([
  { label: '🔮 明日運勢如何？' },
  { label: '🌸 經期不舒服怎麼辦？' },
  { label: '🌤️ 看看今日天氣資訊' },
  { label: '✨ 幫我想個願望點子' }
]);

const chatMessages = ref([
  { id: 1, role: 'ai', text: '你好！我是妳的生活小助手阿比 🌸 隨時可以和我聊聊妳的今日心情、願望，或點擊下方快捷鍵向我提問喔！' }
]);



const scrollToBottom = async () => {
  await nextTick();
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight;
  }
};

const getIntentLevel = (text) => {
  const high = ['痛经', '肚子痛', '很痛', '难受']
  const medium = ['经期', '月经', '什么时候来', '周期']
  const low = ['预测', '提前', '延迟']

  if (high.some(k => text.includes(k))) return 'HIGH'
  if (medium.some(k => text.includes(k))) return 'MID'
  if (low.some(k => text.includes(k))) return 'LOW'
  return 'NONE'
}

const buildSystemPrompt = (message) => {
  const period = getPeriodStatus()
  const intent = getIntentLevel(message)

  let rule = ""

  if (intent === 'HIGH') {
    rule = `
⚠️ 医疗优先级最高：
必须立即给：
- 缓解建议（热敷 / 止痛 / 休息）
- 风险提醒（如异常需就医）
- 禁止解释原理
`
  }

  if (intent === 'MID') {
    rule = `
必须输出：
- 当前经期状态
- 生活建议（至少3条）
- 简短解释（最多2行）
`
  }

  if (intent === 'LOW') {
    rule = `
输出：
- 预测信息
- 准备建议
`
  }

  return `
你是女性健康AI助手

${rule}

📍地点：${weather.value.location}
🌤️天气：${weather.value.temperature}°C ${weather.value.description}

🩸经期状态：
- 是否经期：${period.inPeriod ? "是" : "否"}
- 当前周期第：${period.cycleDay}
- 距离下次经期：${period.daysToNext}

用户问题：
${message}
`
}

const buildAIContext = (message) => {
  const period = getPeriodStatus()

  const intent = detectPeriodIntent(message)

  const baseContext = `
你是女性生活AI助手，会结合天气、地点、经期状态给建议。

📍地点：${weather.value.location}
🌤️天气：${weather.value.temperature}°C ${weather.value.description}

🩸经期状态：
- 是否经期：${period.inPeriod ? '是' : '否'}
- 当前周期第：${period.cycleDay || 0}天
- 距离下次经期：${period.daysToNext}天
${period.inPeriod ? `- 当前第 ${period.dayInPeriod} 天经期` : ''}

用户问题：
${message}
`

  // ⭐关键规则增强（经期问题强制建议模式）
  if (intent) {
    return baseContext + `

⚠️ 强制规则（必须执行）：
- 如果用户询问经期相关问题（例如：什么时候来、肚子痛、周期），
  必须优先给“健康建议 + 当前状态解释”
- 不允许只解释原理
- 必须给行动建议（喝热水 / 休息 / 热敷 / 注意事项）
- 用 3~6 行简短回答
`
  }

  return baseContext
}

const sendChatMessage = async (forcedText = '') => {
  const targetText = forcedText || userInput.value;

  if (!targetText.trim() || isAiTyping.value) return;

  chatMessages.value.push({
    id: Date.now(),
    role: 'user',
    text: targetText
  });

  if (!forcedText) userInput.value = '';

  scrollToBottom();
  isAiTyping.value = true;

  const period = getPeriodStatus()

  const context = `
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
📍地点：${weather.value.location}
🌤️天气：${weather.value.temperature}°C ${weather.value.description}

🩸经期状态：
- 是否经期：${period.inPeriod ? "是" : "否"}
- 当前周期第：${period.cycleDay} 天
- 距离下次经期：${period.daysToNext} 天
${period.inPeriod ? `- 当前：经期第 ${period.dayInPeriod} 天` : ""}

---

## 用户问题：
${targetText}
`

  try {
    const aiResponse = await callOpenRouter(targetText, context)

    chatMessages.value.push({
      id: Date.now() + 1,
      role: 'ai',
      text: aiResponse
    });

  } catch (err) {
    console.error(err);

    chatMessages.value.push({
      id: Date.now() + 1,
      role: 'ai',
      text: "AI 出错了，请稍后再试 🙏"
    });

  }

  isAiTyping.value = false;
  scrollToBottom();
};

const callOpenRouter = async (message, context) => {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost",
      "X-Title": "Vue Chat App"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: context
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  })

  const data = await res.json()
  return data?.choices?.[0]?.message?.content || "没有回复"
}
</script>

<template>
  <div class="cards-wrapper">
    <!-- 1. 天氣卡片 -->
    <div class="card weather-card">
      <div class="card-title weather-title logo wenkai"><span>🌤️</span> 天氣</div>
      <div class="card-content">
        <div class="temp">
          {{ weather.temperature }}°C - {{ weather.description }}
        </div>

        <div class="location">
          📍 {{ weather.location }}
        </div>
      </div>
    </div>

    <!-- 2. 待辦事項卡片 -->
    <div class="card main-card">
      <div class="card-title todo-title logo wenkai"><span>✅</span> 待辦事項</div>
      
      <!-- 輸入區域 -->
      <div class="input-section"> 
        <input 
          v-model="newTodo" 
          type="text" 
          placeholder="新增事項..." 
          class="todo-input"
          @keyup.enter="addTodo" 
        />
        <button class="add-btn" @click="addTodo">+</button>
      </div>

      <!-- 列表區域 -->
      <div class="list-area">
        <div v-for="item in todos" :key="item.id" class="todo-item">
          <div class="todo-text">
            <span class="dot">📌</span>
            <span class="item-text">{{ item.text }}</span>
          </div>
          <button class="del-btn" @click="deleteTodo(item.id)">✕</button>
        </div>
      </div>
      
      <!-- 空狀態提示 -->
      <p v-if="todos.length === 0" class="empty-msg">今天沒有待辦事項！ ✨</p>
    </div>

    <!-- 推薦卡片 -->
    <div class="card recommend-card">
      <div class="card-title logo wenkai">
        ⭐ 附近推薦
      </div>

      <div v-if="loadingRecommend" style="color: black;">
        正在搜尋附近好去處...
      </div>


      <div v-for="place in recommendations" :key="place.name" class="recommend-item" style="color: black;">
        <div class="row">
          <div class="left">🍜</div>
          <div class="right">
            <div class="name">{{ place.name }}</div>

            <div class="meta">
              ⭐ {{ place.rating || '4.5' }} | 📍 {{ place.distance || '未知' }}
            </div>

            <div class="tags">
              <span v-for="r in place.recommend" :key="r">
                # {{ r }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 1. Round Floating Action Button Icon -->
    <div v-if="!isChatOpen" class="ai-floating-bubble" @click="isChatOpen = true">
      <img :src="cherryLogoImg" alt="Cherry AI" class="bubble-avatar-img" />
      <span class="bubble-ping"></span>
    </div>

    <!-- 2. Overlaid Floating Chat Panel Popup Window -->
    <Transition name="slide-fade">
      <div v-if="isChatOpen" class="floating-chat-box">
        <!-- Panel Header -->
        <div class="chat-box-header">
          <div class="chat-header-title">
            <img src="@/assets/cherry-logo.png" alt="Cherry AI" class="header-avatar-img" />
            生活小助手
          </div>
          <button class="chat-close-x" @click="isChatOpen = false">✕</button>
        </div>
        
        <!-- 聊天歷史視窗 -->
        <div class="chat-display-window" ref="chatHistoryRef">
        <div v-for="msg in chatMessages" :key="msg.id" :class="['message-row', msg.role]">
          <div class="avatar-icon">
            <img v-if="msg.role === 'ai'" src="@/assets/cherry-ai.png" class="chat-avatar-img"/>
            <span v-else>🙋🏻‍♀️</span>
          </div>

          <div class="message-bubble">
            {{ msg.text }}
          </div>
        </div>
      </div>

          
          <!-- AI 輸入中的動態動效 -->
          <div v-if="isAiTyping" class="message-row ai">
            <div class="avatar-icon">
              <img src="@/assets/cherry-ai.png" alt="AI" class="chat-avatar-img" />
            </div>
            <div class="message-bubble typing-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>

        <!-- Horizontal Preset Suggestion Buttons Row -->
        <div class="preset-questions-scroll">
          <button 
            v-for="(q, idx) in preQuestions" 
            :key="idx"
            class="preset-badge"
            @click="sendChatMessage(q.label)"
            :disabled="isAiTyping"
          >
            {{ q.label }}
          </button>
        </div>

        <!-- 聊天輸入框 -->
        <div class="chat-input-section">
          <input 
            v-model="userInput"
            type="text"
            placeholder="向小助手提問..."
            class="chat-field"
            @keyup.enter="sendChatMessage('')"
          />
          <button class="chat-send-btn" @click="sendChatMessage('')" :disabled="isAiTyping">
            發送
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 容器：自適應寬度 */
.cards-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

/* 卡片基礎格式 */
.card { 
  background: white; 
  padding: 20px; 
  border-radius: 24px; 
  box-shadow: 0 10px 28px rgba(214, 51, 132, 0.04);
  box-sizing: border-box;
  width: 100%;
}

.card-title {
  font-weight: bold;
  font-size: 1.05rem;
  color: #d63384;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-content .temp {
  font-size: 1.25rem;
  font-weight: 700;
color: #2b2b2b;}

/* ==========================================================================
   WEATHER & TODO LIST STYLES
   ========================================================================== */
.card-content .location {
  font-size: 0.85rem;
  color: #8e8e8e;
  margin-top: 6px;
}

/* 待辦事項輸入與按鈕區域 */
.input-section {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  width: 100%;
  box-sizing: border-box;
}

.todo-input {
  flex: 1;
  min-width: 0;
  border: 1px solid #fdf0f6;
  border-radius: 12px;
  padding: 12px;
  background: #fffafa;
  outline: none;
  font-size: 16px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.todo-input:focus {
  border-color: #ffb6c1;
}

.add-btn {
  background: linear-gradient(135deg, #ff69b4, #d63384);
  color: white;
  border: none;
  border-radius: 14px;
  width: 52px;
  min-width: 52px;
  font-size: 1.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.todo-item {
  background: #fff;
  border: 1px solid #fff5f8;
  margin-top: 10px;
  padding: 14px 18px;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);
}

.todo-text {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #444;
  font-weight: 500;
  overflow: hidden;
  flex: 1;
}

.item-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dot {
  font-size: 0.9rem;
}

.del-btn {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
}

.del-btn:hover {
  color: #d63384;
}

.empty-msg {
  text-align: center;
  color: #b8b8b8;
  margin-top: 24px;
  font-size: 0.9rem;
}


/* ==========================================================================
   FLOATING CHAT SYSTEM
   ========================================================================== */

/* 1. Round Floating Action Button Icon */
.ai-floating-bubble {
  position: fixed;
  bottom: 95px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff69b4, #d63384);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6px 20px rgba(214, 51, 132, 0.3);
  cursor: pointer;
  z-index: 1500;
  animation: floatUpDown 3s ease-in-out infinite;
}

.bubble-avatar {
  font-size: 1.8rem;
}

.bubble-ping {
  position: absolute;
  top: 0;
  right: 0;
  width: 14px;
  height: 14px;
  background: #4cd964;
  border: 2px solid white;
  border-radius: 50%;
}

@keyframes floatUpDown {
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}

/* 2. Overlaid Floating Chat Panel Popup Window container styles */
.floating-chat-box {
  position: fixed;
  bottom: 85px;
  right: 16px;
  left: 16px;
  max-width: 448px;
  background: white;
  border-radius: 24px;
  padding: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  z-index: 1600;
  border: 1px solid #fff0f3;
}

/* Tablet / Desktop fallback boundary alignment centering */
@media (min-width: 768px) {
  .floating-chat-box {
    left: auto;
    width: 380px;
  }
}

.chat-box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #fdf0f6;
}

.chat-header-title {
  font-weight: bold;
  font-size: 1rem;
  color: #d63384;
}

.chat-close-x {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #bbb;
  cursor: pointer;
  padding: 4px;
}

.chat-close-x:hover {
  color: #d63384;
}


/* ==========================================================================
   AI ASSISTANT CHAT DISPLAY BOX
   ========================================================================== */
.chat-display-window {
  height: 260px;        /* 控制聊天窗口高度 */
  overflow-y: auto;     /* 开启滚动 */
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  border: 1px solid #fdf0f6;
  border-radius: 16px;
  background: #fffbfc;

  scroll-behavior: smooth;
}

.message-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  max-width: 85%;
}

.message-row.ai {
  align-self: flex-start;
  flex-direction: row;
}

.message-row.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

/* Fixed the broken missing className selector assignment from code slice */
.avatar-icon {
  width: 32px;          /* Change this number to adjust the overall size (e.g., 36px or 40px if you want it bigger) */
  height: 32px;         /* Keep this number identical to the width to maintain a perfect circle */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 6px rgba(214, 51, 132, 0.05);
  overflow: hidden;     /* Keeps the internal image clipped inside the circular border wrapper */
  flex-shrink: 0;       /* Prevents the circle from shrinking or warping when messages are long */
}

.chat-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;    /* Crops the image smoothly to fill the bubble without stretching distortion */
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.9rem;
  line-height: 1.4;
  word-break: break-all;
}

.ai .message-bubble {
  background: white;
  color: #444;
  border: 1px solid #fdf0f6;
  border-top-left-radius: 4px;
}

.user .message-bubble {
  background: linear-gradient(135deg, #ff7bbd, #d63384);
  color: white;
  border-top-right-radius: 4px;
}


/* ==========================================================================
   PRESET BADGES & CHAT FIELD CONTROLS
   ========================================================================== */
.preset-questions-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  width: 100%;
  margin-bottom: 12px;
  padding: 2px 0 6px 0;
  -webkit-overflow-scrolling: touch;
}

.preset-questions-scroll::-webkit-scrollbar {
  display: none;
}

.preset-badge {
  flex-shrink: 0;
  background: #fff5f7;
  border: 1px solid #ffe1e7;
  color: #d63384;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.preset-badge:active {
  transform: scale(0.95);
  background: #ffe1e7;
}

.preset-badge:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-input-section {
  display: flex;
  gap: 8px;
  width: 100%;
}

.chat-field {
  flex: 1;
  min-width: 0;
  border: 1px solid #fdf0f6;
  border-radius: 12px;
  padding: 12px;
  background: #fffafa;
  outline: none;
  font-size: 14px;
  font-family: inherit;
}

.chat-field:focus {
  border-color: #ffb6c1;
}

.chat-send-btn {
  background: #ffe6eb;
  color: #d63384;
  border: 1px solid #fbcad5;
  border-radius: 12px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.chat-send-btn:active {
  transform: scale(0.95);
}

.chat-send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


/* ==========================================================================
   ANIMATIONS & TRANSITIONS
   ========================================================================== */
.typing-dots span {
  animation: blink 1.4s infinite both;
  font-weight: bold;
  font-size: 1.2rem;
}

.typing-dots span:nth-child(2) {
  animation-delay: .2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: .4s;
}

@keyframes blink {
  0% { opacity: .2; }
  20% { opacity: 1; }
  100% { opacity: .2; }
}

.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.7, 0, 0.84, 0);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}

.avatar-icon{
  object-fit: contain;
  pointer-events: none; /* Prevents long-press drag bugs on mobile phones */
}

.header-avatar-img {
  width: 22px;
  height: 22px;
  object-fit: contain;
  vertical-align: middle;
  margin-right: 4px;
}

/* Update this existing rule to keep the items inside the title row centered */
.chat-header-title {
  font-weight: bold;
  font-size: 1rem;
  color: #d63384;
  display: flex;
  align-items: center;
  gap: 6px;
}

.bubble-avatar-img {
  width: 34px;          /* Shrink this number down (try 30px if you want it even smaller!) */
  height: 34px;         /* Keep this matching the width */
  object-fit: contain;  /* Keeps the logo clean without squishing it */
  border-radius: 50%;   /* Keeps it circular if the logo background isn't transparent */
  pointer-events: none; /* Prevents mobile phone drag issues */
}

.recommend-item{
    margin:12px 0;
    padding:12px;
    border-radius:12px;
    background:#fff7fa;
}

.recommend-name{
    font-weight:bold;
    color:#d63384;
}

.recommend-type{
    color:#888;
    font-size:.85rem;
}

.place-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 8px;
}

.chat-display-window::-webkit-scrollbar {
  width: 6px;
}

.chat-display-window::-webkit-scrollbar-thumb {
  background: #f7a1c4;
  border-radius: 10px;
}

.chat-display-window::-webkit-scrollbar-track {
  background: transparent;
}
</style>