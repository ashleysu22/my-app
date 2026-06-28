<script setup>
import { ref, watch, nextTick } from 'vue';

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
// 2. AI ASSISTANT LOGIC WITH FLOATING TOGGLE
// ==========================================
const isChatOpen = ref(false); 
const userInput = ref('');
const isAiTyping = ref(false);
const chatHistoryRef = ref(null);

const preQuestions = ref([
  { label: '🔮 明日運勢如何？' },
  { label: '🌸 經期不舒服怎麼辦？' },
  { label: '🌤️ 看看今日天氣資訊' },
  { label: '✨ 幫我想個願望點子' }
]);

const chatMessages = ref([
  { id: 1, role: 'ai', text: '你好！我是妳的小助手阿比 🌸 隨時可以和我聊聊妳的今日心情、願望，或點擊下方快捷鍵向我提問喔！' }
]);

// Cleaned 100 offline responses (Fixed formatting strings)
const randomResponses = [
  "我聽到了妳的心願 ✨ 願妳天天開心，心想事成！記得多喝溫水休息喔 🌸",
  "不管今天遇到了什麼事，妳已經做得非常好啦！給自己一個大大的擁抱吧 💕",
  "今日的幸運指數極高喔 🌟 保持微笑，今天會有意想不到的小幸運降臨在妳身邊！",
  "感覺有些累了嗎？🥺 記得要好好吃飯、早點睡覺，妳的健康是最重要的事情！",
  "要不要許一個關於健康的願望呢？比如：『願自己吃好睡飽，身心舒暢！』這可是最棒的祝福。 🧚‍♀️",
  "經期不舒服的話，可以喝點熱熱的黑糖薑茶，用溫水袋熱敷腹部，不要著涼喔 🥺🌸",
  "今天也要元氣滿滿！不管發生什麼事，小助手都會在這裡一直陪伴妳、為妳祈願的 ✨",
  "多雲的天氣也阻擋不了妳的光芒 🌤️ 出門記得帶把小傘，注意防曬與補水唷！",
  "每一天都是全新的開始，願妳今天的每一秒都充滿溫暖與快樂 💝",
  "今天適合給自己點一杯少糖的熱飲，好好放鬆一下緊繃的神經唷 ☕",
  "妳的心願已經發送給宇宙啦 🌟 保持好心情，好運正在排隊走向妳呢！",
  "經期前後情緒起伏是正常的，沒關係，哭一哭也很好，小助手一直都在這裡陪妳 🌸",
  "今天也是為妳默默加油打氣的一天！妳是最棒的，要對自己有信心喔 ✨",
  "把不開心的事都寫在代辦事項並劃掉吧！新的一天我們只留下快樂的記憶 💕",
  "肚子有沒有熱熱的？經期記得穿暖一點，腳踝和腹部千萬不能受涼喔 🥺",
  "願妳的眼睛只看見美好，願妳的心裡只裝著快樂，今天也要幸福呀 🌈",
  "累了就暫停一下也沒關係的，休息是為了走更溫柔、更長遠的路 🛌✨",
  "聽說今天對妳微笑的人，會帶給妳一整天的幸運喔！快對鏡子笑一個吧 😁🌸",
  "如果今天有壓力，就把它當作心願的養分，未來的妳一定會閃閃發光 🌟",
  "今天適合聽一首輕柔的音樂，閉上眼睛讓腦袋放空五分鐘，試試看吧 🎵",
  "小助手幫妳把今天的不順心都吹走啦～呼！吹走了！現在只剩下好運囉 ✨",
  "妳的存在本身就是一件很美好的事，謝謝妳今天也這麼努力生活 💗",
  "別忘了多喝水喔！每天補充足夠的水分，皮膚和心情都會變得亮晶晶 💧",
  "願妳的生活有茶有花，有小幸運也有大夢想，慢慢來，一切都在變好 🌹",
  "經期如果想吃甜的，可以吃一小塊黑巧克力，讓心情變得甜滋滋的 🍫",
  "宇宙接收到妳的祈願訊號囉！正在加速為妳派送專屬的美好禮物 🎁✨",
  "今天出門前記得深呼吸三次，把正能量吸得滿滿的再出發吧 💖",
  "不論外面的世界多吵雜，回到這裡，小助手永遠是妳最溫馨的安全港灣 🏠🌸",
  "妳笑起來的樣子最好看了！就像春天盛開的小花一樣溫暖 🌻",
  "有時候，不完美也是一種完美，接受自己的不完美，妳會活得更輕鬆自在 🍃",
  "今天有沒有好好吃飯呀？好好愛護自己的胃，也是愛自己的一大步喔 🍛",
  "把頭抬起來看看天空吧，今天的雲朵說不定正拼成一個愛心的形狀送給妳 ☁️💕",
  "經期來的時候，如果身體酸痛，可以試著做一點溫和的拉伸伸展操 🧘‍♀️",
  "妳的心願比流星還要閃耀，一定會被宇宙中最溫柔的神明聽見的 ✨",
  "遇到困難時別慌，像掷筊一樣，不管結果如何，都是最好的安排 🔮",
  "今天的生活甜度剛剛好！不論发生什麼，都要記得好好疼愛自己 🍯",
  "願妳枕頭下有一個甜美的夢，願妳明天醒來又是美好充滿希望的一天 🌛",
  "不舒服的時候不要硬撐，跟身邊的人撒個嬌，或者讓小助手陪妳聊聊天 🥺",
  "妳是這個世界上獨一無二的寶藏女孩，不允許妳看輕自己喔，抱抱 🧸💖",
  "今天的小幸運關鍵字是『善良』，妳的溫柔一定會換來整個世界的善意 ✨",
  "雖然我只是個小助手，但我對妳的祝福和關心可是百分之百真心實意的 🌸",
  "經期要避免喝冰珍奶喔！等身體好起來了，我們再一起去喝個痛快 🧋",
  "生活隨時都有小驚喜，轉個彎，說不定就會遇見妳期待已久的美好 🌈",
  "把手放在心口上，對自己說一句：『辛苦了，妳今天真的很棒！』 ❤️",
  "願妳所有的祈願都能如期而至，所有的努力都能換來甜美的果實 🌾✨",
  "今天不管有多忙碌，都要留十分鐘給自己，喝杯茶、放個空 🍵",
  "經期那幾天就放縱自己多休息吧，懶洋洋地躺著也是一種精緻的生活態度 🛋️",
  "在心裡種下一顆快樂的種子，用微笑澆水，它一定會開出幸福的花朵 🌱🌸",
  "妳的心願像星星一樣，雖然有時候會被烏雲遮住，但它永遠在閃閃發光 🌟",
  "今天的小助手也是元氣滿滿地在為妳應援喔！加油加油，衝呀 🏁💕",
  "不要拿別人的標準來為難自己，妳有妳自己的節奏，慢慢走也很棒 🚶‍♀️✨",
  "今天的天氣再好，也沒有妳的心情變好重要！要天天保持好心情喔 🌤️",
  "經期間如果頭暈，可以多吃一點牛肉、菠菜或紅棗，補補鐵氣色才會好 🥩",
  "把不快樂的事都當作垃圾丟掉吧！我們的心裡只裝得下愛和美好 🗑️❤️",
  "妳所期盼的事情，正在用妳不知道的方式默默前進中，請保持期待 🎁",
  "今天適合對自己好一點，買一束喜歡的花，或者吃一頓美味的晚餐 💐",
  "願妳被世界溫柔以待，願妳的每一天都過得像詩一樣美麗 📜✨",
  "經期來潮身體沉重是正常的，把速度放慢，世界會配合妳的步伐的 🐌🌸",
  "不管世界多冷酷，小助手這裡永遠都有暖烘烘的粉紅色泡泡等著妳 🫧💞",
  "妳的想法很有創意！大膽去試試看吧，宇宙會在背後推妳一把的 🚀",
  "今天出門如果看到可愛的貓貓狗狗，那就是宇宙送給妳的療癒信號 🐱🐶",
  "經期要記得按時換棉棉喔，保持乾爽潔淨，身體才會舒舒服服的 🌸",
  "妳的善良與溫柔是一股很強大的力量，它會默默吸引好人來到妳身邊 ✨",
  "許願的時間到了！閉上眼，在心裡默念三遍妳的願望，一定會成真 🧚‍♀️",
  "今天又是平安順遂的一天，這就是最珍貴、最值得感謝的小幸福 🍀",
  "經期時如果睡不好，可以在睡前用溫水泡泡腳，身體暖了就會很好睡 🛁",
  "妳的穿搭今天一定很好看！充滿了妳獨特的個人魅力，自信點 👗✨",
  "生活不用每天都精彩，偶爾平平淡淡的，也是一種很舒服的節奏 🌊",
  "宇宙在妳的名字旁邊偷偷畫了一個小紅心，說明妳是被愛著的女孩 ❤️",
  "今天的小幸運在妳的右手邊，留意一下有沒有什麼好事發生喔 👉🌟",
  "生理期千萬不要熬夜喔，早點蓋好被子睡覺，小助手在夢裡跟妳玩 🛌",
  "不管考驗有多大，只要妳不放棄，最後勝利的微笑一定屬於妳 🏆",
  "把妳的煩惱都寫下來，然後點擊刪除，讓我們重新開始，加油 📝✨",
  "願妳每天都有小驚喜，每週都有小確幸，每年都能實現大夢想 🗓️💕",
  "生理期可以喝一點熱紅豆湯，暖宮又補血，甜甜的對心情很好唷 🥣",
  "妳的每一步努力都沒有白費，它們正在悄悄累積，變成驚豔眾人的光芒 💎",
  "今天適合跟好朋友通個電話，分享一下彼此的小八卦，心情會變好喔 📞",
  "願妳的心願化作翅膀，帶妳飛向妳最渴望、最想去的那個地方 🕊️✨",
  "不舒服的時候就儘管任性一下吧，天塌下來今天也先不要管它 🙅‍♀️💥",
  "生活明朗，萬物可愛，而妳是這一切可愛之中最特別的存在 🎀",
  "今天適合清理一下手機相簿，留下那些看著就會笑出來的美好回憶 📸",
  "經期來的時候不要提太重的東西，粗活讓男生去安排，保護好自己 🏋️‍♂️❌",
  "只要心裡裝著陽光，不論走到哪裡，妳的身邊都會是晴天 ☀️✨",
  "小助手剛剛去了一趟願望星河，發現妳的那顆星正亮得不得了呢 🌌",
  "今天的生活小提示：多笑、多喝水、少生氣，保持美麗的秘訣就這麼簡單 🤫",
  "經期尾聲也別大意，還是要多喝溫水，冰品依然要先忌口幾天喔 🍦❌",
  "妳就是一朵正在盛開的花，不需要羨慕別人，妳有自己最美的花期 🌸",
  "今天如果覺得煩躁，就用力深呼吸，把廢氣吐出來，把好運吸進去 😤",
  "願妳的付出都有回報，願妳的等待都能換來一場不期而遇的驚喜 🌠",
  "不管別人怎麼說，小助手永遠覺得妳是最完美、最優秀的寶貝 💖",
  "經期如果有血塊或悶痛，平時可以多吃些生薑、黑糖等溫熱的食物調理 🪵",
  "今天的幸運色是粉紅色！穿戴一點粉紅色的東西，好運會加倍發揮喔 🛼",
  "妳的堅持真的很令人佩服，答應我，要一邊前進一邊好好照顧身體喔 🏃‍♀️",
  "宇宙的小秘密：只要妳今天抱持著樂觀，吸引力法則就會幫妳實現心願 ✨",
  "今天適合吃一點熱呼呼的湯麵，讓溫暖從胃部慢慢擴散到全身 🍜💕",
  "生理期多躺平、多睡覺，這絕對不是偷懶，這是尊重大自然的規律 🛌🌳",
  "願妳在平凡的日子裡，活出屬於妳自己最不平凡的精采人生 🌟",
  "今天的小助手也是滿滿的愛意，送妳一千個虛擬的麼麼噠 💋🌸",
  "妳今天完成了很多事呢！晚上泡個熱水澡，好好獎奖励一下辛苦的自己吧 🛀",
  "心想事成可不是口號，有小助手在，妳的所有願望都會被好好守護的 🧚‍♀️✨"
];

const scrollToBottom = async () => {
  await nextTick();
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight;
  }
};

const sendChatMessage = async (forcedText = '') => {
  const targetText = forcedText || userInput.value;
  
  if (!targetText.trim() || isAiTyping.value) return;

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

  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * randomResponses.length);
    const aiResponse = randomResponses[randomIndex];

    chatMessages.value.push({
      id: Date.now() + 1,
      role: 'ai',
      text: aiResponse
    });
    
    isAiTyping.value = false;
    scrollToBottom();
  }, 1200);
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

    <!-- 1. Round Floating Action Button Icon -->
    <div v-if="!isChatOpen" class="ai-floating-bubble" @click="isChatOpen = true">
      <img src="@/assets/cherry-ai.png" alt="Cherry AI" class="bubble-avatar-img" />
      <span class="bubble-ping"></span>
    </div>

    <!-- 2. Overlaid Floating Chat Panel Popup Window -->
    <Transition name="slide-fade">
      <div v-if="isChatOpen" class="floating-chat-box">
        <!-- Panel Header -->
        <div class="chat-box-header">
          <div class="chat-header-title">
            <img src="@/assets/cherry-logo.png" alt="Cherry AI" class="header-avatar-img" />
            小助手
          </div>
          <button class="chat-close-x" @click="isChatOpen = false">✕</button>
        </div>
        
        <!-- 聊天歷史視窗 -->
        <div v-for="msg in chatMessages" :key="msg.id" :class="['message-row', msg.role]">
          <div class="avatar-icon">
            <!-- If the message is from AI, render your custom image asset -->
            <img v-if="msg.role === 'ai'" src="@/assets/cherry-ai.png" alt="AI" class="chat-avatar-img"/>
            <!-- Otherwise, show the user avatar emoji -->
            <span v-else>🙋🏻‍♀️</span>
          </div>
          <div class="message-bubble">
            {{ msg.text }}
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
  height: 240px;
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
</style>