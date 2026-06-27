<template>
  <div class="period-container">
    <!-- Header with Settings Icon (Cleaned up layout positioning) -->
    <div class="calendar-header-actions">
      <button class="settings-btn" @click="showSettings = true">⚙️ 設定</button>
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

    <!-- Reminder Box Context -->
    <div class="reminder-text">
      🌸 記得記錄下妳的經期喔，愛護自己從了解身體開始！
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
import { ref, computed, watch } from 'vue';

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
        color: 'gray', 
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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}

/* Align settings gear neatly below the main application global title */
.calendar-header-actions {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 0 4px;
}

.settings-btn {
  background: white;
  border: 1px solid #fdf0f6;
  font-size: 0.9rem;
  font-weight: 600;
  color: #d63384;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(214, 51, 132, 0.03);
  transition: transform 0.2s ease;
}

.settings-btn:active {
  transform: scale(0.95);
}

.calendar-wrapper {
  background: white;
  border-radius: 24px;
  padding: 16px 12px;
  box-shadow: 0 10px 28px rgba(214, 51, 132, 0.04);
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;   
}

/* Settings Overlay Modals */
.modal-overlay {
  position: fixed;
  top: 0; 
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4); 
  backdrop-filter: blur(4px);    
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Increased to sit perfectly above all components */
}

.modal-content {
  background: white;
  width: 88%;
  max-width: 340px;
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
  color: #d63384; 
  font-size: 1.2rem;
}

.close-icon {
  background: none; 
  border: none; 
  font-size: 1.2rem; 
  color: #999; 
  cursor: pointer;
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
  border: 2px solid #fdf0f6;
  border-radius: 12px;
  font-size: 1rem;
  box-sizing: border-box; 
  transition: border-color 0.2s;
  background: #fffafa;
}

.input-group input:focus {
  outline: none;
  border-color: #ffb6c1;
}

.save-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #ff69b4, #d63384);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(214, 51, 132, 0.2);
}

.save-btn:active {
  transform: scale(0.98);
}

:deep(.future-period) {
  opacity: 0.7; 
}

:deep(.current-period) {
  font-weight: bold;
  border: 2px solid #d63384;
  border-radius: 50%;
}

:deep(.history-period) {
  opacity: 0.6;
  filter: grayscale(1);
}

:deep(.vc-container) {
  width: 100% !important;
  border: none !important;
}

@media (max-width: 360px) {
  :deep(.vc-pane) {
    min-width: 100%;
  }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.reminder-text {
  margin-top: 8px;
  text-align: center;
  color: #d63384; 
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.6); 
  padding: 14px;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(214, 51, 132, 0.02);
  box-sizing: border-box;
  width: 100%;
}
</style>