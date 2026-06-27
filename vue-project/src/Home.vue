<script setup>
import { ref, watch } from 'vue';

const newTodo = ref('');

// 1. 初始化並關聯本地存儲
const todos = ref(JSON.parse(localStorage.getItem('my-todos')) || []);

// 2. 監聽變化自動保存
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
</script>

<template>
  <div class="cards-wrapper">
    <!-- 天氣卡片 -->
    <div class="card weather-card">
      <div class="card-title weather-title"><span>🌤️</span> 天氣</div>
      <div class="card-content">
        <div class="temp">30°C - 多雲時晴</div>
        <div class="location">📍 檳城，喬治市</div>
      </div>
    </div>

    <!-- 待辦事項卡片 -->
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

/* 卡片：安全內邊距與平滑黑影 */
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

/* 輸入區域適配 */
.input-section { 
  display: flex; 
  gap: 10px; 
  margin-bottom: 15px; 
}

.todo-input { 
  flex: 1; 
  border: 1px solid #fdf0f6; 
  border-radius: 14px; 
  padding: 14px 16px; 
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

/* 列表項 */
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
</style>
