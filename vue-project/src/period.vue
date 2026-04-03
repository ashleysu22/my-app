<template>
  <div class="period-container">
    <!-- Header with Settings Icon -->
    <div class="header">
      <h2>例假</h2>
      <button class="settings-btn" @click="showSettings = true">⚙️</button>
    </div>

    <!-- Calendar View -->
    <div class="calendar-wrapper">
      <VCalendar 
        :attributes="attributes" 
        expanded 
        borderless
        transparent
        title-position="left"
      />
    </div>


<!-- Settings Popup (Modal) -->
<div v-if="showSettings" class="modal-overlay" @click.self="showSettings = false">
  <div class="modal-content">
    <div class="modal-header">
      <h3>例假设定</h3>
      <button class="close-icon" @click="showSettings = false">✕</button>
    </div>
    
    <div class="modal-body">
      <div class="input-group">
        <label>🌸 上次月經结束時間</label>
        <input type="date" v-model="settings.lastDate">
      </div>

      <div class="input-group">
        <label>⏳ 週期持續時間（天）</label>
        <input type="number" v-model="settings.duration" min="1" max="10">
      </div>

      <div class="input-group">
        <label>🔄 週期長度（天）</label>
        <input type="number" v-model="settings.cycleLength" min="20" max="45">
      </div>
    </div>

    <div class="modal-actions">
      <button class="save-btn" @click="showSettings = false">修正</button>
    </div>
  </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showSettings = ref(false);

// 1. 初始化设定：优先从 LocalStorage 读取，没有则使用默认值
const defaultSettings = {
  lastDate: new Date().toISOString().substr(0, 10), 
  duration: 5,
  cycleLength: 28
};

const settings = ref(JSON.parse(localStorage.getItem('periodSettings')) || defaultSettings);

// 2. 监听 settings 变化并自动保存
watch(settings, (newVal) => {
  localStorage.setItem('periodSettings', JSON.stringify(newVal));
}, { deep: true });

const attributes = computed(() => {
  if (!settings.value.lastDate) return [];
  
  const periods = [];
  const [year, month, day] = settings.value.lastDate.split('-').map(Number);
  const inputEndDate = new Date(year, month - 1, day);
  
  const duration = parseInt(settings.value.duration) || 5;
  const cycle = parseInt(settings.value.cycleLength) || 28;

  // 核心基准：根据输入的结束日反推第一期的起始日
  const firstPeriodStart = new Date(inputEndDate);
  firstPeriodStart.setDate(inputEndDate.getDate() - (duration - 1));

  // --- 1. 处理历史周期 (往前推 13 个月，覆盖过去一年) ---
  for (let i = 1; i <= 13; i++) {
    const histStart = new Date(firstPeriodStart);
    histStart.setDate(firstPeriodStart.getDate() - (i * cycle));

    const histEnd = new Date(histStart);
    histEnd.setDate(histStart.getDate() + (duration - 1));

    periods.push({
      highlight: {
        color: 'gray', // 历史记录用灰色或淡粉色区别
        fillMode: 'light',
        class: 'history-period'
      },
      dates: { start: histStart, end: histEnd },
      popover: { label: `历史经期: ${formatDate(histStart)}` }
    });
  }

  // --- 2. 处理当前和未来周期 (往后推 24 个月) ---
  for (let i = 0; i < 24; i++) {
    const periodStart = new Date(firstPeriodStart);
    periodStart.setDate(firstPeriodStart.getDate() + (i * cycle));

    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodStart.getDate() + (duration - 1));

    // 判断是否为“当前”输入的那一期
    const isInputPeriod = i === 0;

    periods.push({
      highlight: {
        color: 'pink',
        fillMode: isInputPeriod ? 'solid' : 'light',
        class: isInputPeriod ? 'current-period' : 'future-period'
      },
      dates: { start: periodStart, end: periodEnd },
      popover: { 
        label: isInputPeriod ? '本次经期' : `预测经期: ${formatDate(periodStart)}` 
      }
    });
  }
  
  return periods;
});


const formatDate = (date) => {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};
</script>


<style scoped>
.period-container {
  padding: clamp(10px, 4vw, 25px); /* Fluid padding based on screen size */
  background-color: #fdf0f6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.calendar-wrapper {
  background: white;
  border-radius: 16px;
  padding: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 800px; /* Limit width for large tablets/desktops */
  margin: 0 auto;   /* Center it */
}


.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.settings-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

/* Overlay with high z-index to stay on top */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4); /* Darkens the background */
  backdrop-filter: blur(4px);    /* Optional: blurs the background calendar */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;                 /* MUST be high to cover the calendar */
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 350px;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  color: #d81b60; /* Darker pink */
  font-size: 1.2rem;
}

.close-icon {
  background: none; border: none; font-size: 1.2rem; color: #999; cursor: pointer;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 6px;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 1rem;
  box-sizing: border-box; /* Prevents overflow */
  transition: border-color 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #f48fb1;
}

.save-btn {
  width: 100%;
  padding: 14px;
  background: #f06292;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #d81b60;
}

/* 在 <style scoped> 中添加 */
:deep(.future-period) {
  opacity: 0.7; /* 让未来的预测看起来半透明一点 */
}

:deep(.current-period) {
  font-weight: bold;
  border: 2px solid #f06292;
  border-radius: 50%;
}

/* 历史周期：使用更淡的灰色，看起来不抢眼 */
:deep(.history-period) {
  opacity: 0.9;
  filter: grayscale(1);
}

/* Ensure the calendar fills the available width */
:deep(.vc-container) {
  width: 100% !important;
  border: none !important;
}

/* Adjust font size for small phones */
@media (max-width: 360px) {
  :deep(.vc-pane) {
    min-width: 280px;
  }
  :deep(.vc-header) {
    padding: 0 5px;
  }
}

/* Smooth entry animation */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

</style>
