<script setup>
import { ref, watch, nextTick } from 'vue';

// ==========================================
// 1. TODO LIST LOGIC (Your Existing Code)
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
// 2. CONNECTED OPENAI API CHAT LOGIC
// ==========================================
const userInput = ref('');
const isAiTyping = ref(false);
const chatHistoryRef = ref(null);

// WARNING: For safe live production apps, proxy your requests through a backend server.
// Storing keys in frontend code exposes them if someone inspects your web console source.
const OPENAI_API_KEY = 'AQ.Ab8RN6LNkmTbmCAKr-FqJlt_1Mf9VwGpdZ3QmLNNs-wDljeXJA'; 

const preQuestions = ref([
  { label: '🔮 明日運勢如何？' },
  { label: '🌸 經期不舒服怎麼辦？' },
  { label: '🌤️ 看看今日天氣資訊' },
  { label: '✨ 幫我想個願望點子' }
]);

const chatMessages = ref([
  { id: 1, role: 'ai', text: '你好！我是妳的心願陪護小助手 🌸 隨時可以和我聊聊妳的今日心情、願望，或點擊下方快捷鍵向我提問喔！' }
]);

const scrollToBottom = async () => {
  await nextTick();
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight;
  }
};

// Main trigger function connected to OpenAI API endpoint
const sendChatMessage = async (forcedText = '') => {
  const targetText = forcedText || userInput.value;
  
  if (!targetText.trim() || isAiTyping.value) return;

  // 1. Push user question block to the interface
  chatMessages.value.push({
    id: Date.now(),
    role: 'user',
    text: targetText
  });

  if (!forcedText) {
    userInput.value = '';
  }
  
  scrollToBottom();
  isAiTyping.value = true;

  try {
    // 2. Construct the full context memory payload matching OpenAI format specifications
    // We add a System Prompt at the top to force the AI to keep its persona sweet and short.
    const apiMessages = [
      { 
        role: "system", 
        content: "你是『心想事成』手機App裡的溫柔、貼心女性健康與祈願小助手。說話語氣必須充滿親和力、溫柔、常使用一些可愛的表情符號（如🌸、✨、🥺）。請保持回答精簡、溫馨，非常適合在手機螢幕上閱讀，不要長篇大論。" 
      }
    ];

    // Map your reactive screen messages into OpenAI API compatible roles
    chatMessages.value.forEach(msg => {
      apiMessages.push({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.text
      });
    });

    // 3. Fire the real HTTP request directly to OpenAI servers
    const response = await fetch('https://openai.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cost-effective, incredibly fast model perfect for mobile applications
        messages: apiMessages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiTextResponse = data.choices[0].message.content;

    // 4. Append real response returned from OpenAI pipeline
    chatMessages.value.push({
      id: Date.now() + 1,
      role: 'ai',
      text: aiTextResponse
    });

  } catch (error) {
    console.error('OpenAI Connection Error:', error);
    chatMessages.value.push({
      id: Date.now() + 1,
      role: 'ai',
      text: '對不起姐姐...我的網路連線似乎出了一點小狀況 🌸 請再試一次看看好嗎？'
    });
  } finally {
    isAiTyping.value = false;
    scrollToBottom();
  }
};
</script>

<template>
  <div class="cards-wrapper">
    <!-- 1. 天氣卡片 -->
    <div class="card weather-card">
      <div class="card-title weather-title"><span>🌤️</span> 天氣</div>
      <div class="card-content">
        <div class="temp">30°C - 多雲時晴</div>
        <div class="location">📍 檳城，喬治市</div>
      </div>
    </div>

    <!-- 2. 待辦事項卡片 -->
    <div class="card main-card">
      <div class="card-title todo-title"><span>✅</span> 待辦事項</div>
      
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

    <!-- 3. AI 小助手卡片 -->
    <div class="card ai-card">
      <div class="card-title ai-title"><span>🤖</span> 祈願小助手</div>
      
      <!-- 聊天歷史視窗 -->
      <div class="chat-display-window" ref="chatHistoryRef">
        <div v-for="msg in chatMessages" :key="msg.id" :class="['message-row', msg.role]">
          <div class="avatar-icon">{{ msg.role === 'ai' ? '🌸' : '🙋🏻‍♀️' }}</div>
          <div class="message-bubble">
            {{ msg.text }}
          </div>
        </div>
        
        <!-- AI 輸入中的動態動效 -->
        <div v-if="isAiTyping" class="message-row ai">
          <div class="avatar-icon">🌸</div>
          <div class="message-bubble typing-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
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
          placeholder="向小助手提問或祈願..."
          class="chat-field"
          @keyup.enter="sendChatMessage('')"
        />
        <button class="chat-send-btn" @click="sendChatMessage('')" :disabled="isAiTyping">
          發送
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 容器：自適應寬度 */
.cards-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  color: #2b2b2b;
}

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
  box-shadow: 0 2px 8px rgba(0,0,0,0.01);
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

.dot { font-size: 0.9rem; }

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

/* AI ASSISTANT CHAT DISPLAY BOX */
.chat-display-window {
  height: 180px;
  overflow-y: auto;
  border: 1px solid #fdf0f6;
  border-radius: 16px;
  padding: 12px;
  background: #fffbfc;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 10px;
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

.avatar-icon {
  font-size: 1.2rem;
  background: white;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(214, 51, 132, 0.05);
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

/* Horizontal Presets Custom Rules */
.preset-questions-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  width: 100%;
margin-bottom: 12px;padding: 2px 0 6px 0;-webkit-overflow-scrolling: touch;}.preset-questions-scroll::-webkit-scrollbar {display: none;}.preset-badge {flex-shrink: 0;background: #fff5f7;border: 1px solid #ffe1e7;color: #d63384;padding: 8px 12px;border-radius: 20px;font-size: 0.8rem;font-weight: 500;cursor: pointer;transition: all 0.2s ease;font-family: inherit;}.preset-badge:active {transform: scale(0.95);background: #ffe1e7;}.preset-badge:disabled {opacity: 0.5;cursor: not-allowed;}/* Chat Field Input controls layout setup */.chat-input-section {display: flex;gap: 8px;width: 100%;}.chat-field {flex: 1;min-width: 0;border: 1px solid #fdf0f6;border-radius: 12px;padding: 12px;background: #fffafa;outline: none;font-size: 14px;font-family: inherit;}.chat-field:focus {border-color: #ffb6c1;}.chat-send-btn {background: #ffe6eb;color: #d63384;border: 1px solid #fbcad5;border-radius: 12px;padding: 0 16px;font-weight: 600;font-size: 0.9rem;cursor: pointer;transition: all 0.2s;}.chat-send-btn:active {transform: scale(0.95);}.chat-send-btn:disabled {opacity: 0.6;cursor: not-allowed;}/* Loading animations */.typing-dots span {animation: blink 1.4s infinite both;font-weight: bold;font-size: 1.2rem;}.typing-dots span:nth-child(2) { animation-delay: .2s; }.typing-dots span:nth-child(3) { animation-delay: .4s; }@keyframes blink {0% { opacity: .2; }20% { opacity: 1; }100% { opacity: .2; }}
</style>