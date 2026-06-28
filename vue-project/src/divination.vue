<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 筊杯状态: 'up' (凸面/阳), 'down' (平面/阴)
const cup1 = ref('up');
const cup2 = ref('down');
const result = ref('点击下方按钮开始');
const isThrowing = ref(false);

const throwJiaobei = () => {
  if (isThrowing.value) return;
  
  isThrowing.value = true;
  result.value = '诚心祈求中...';

  // 模拟投掷动画延迟
  setTimeout(() => {
    // 随机生成状态
    const c1 = Math.random() > 0.5 ? 'up' : 'down';
    const c2 = Math.random() > 0.5 ? 'up' : 'down';

    cup1.value = c1;
    cup2.value = c2;

    // 判断逻辑
    if (c1 !== c2) {
      result.value = '✨ 圣筊 (准奏/吉) ✨';
    } else if (c1 === 'down') {
      result.value = '❌ 阴筊 (不可/凶) ❌';
    } else {
      result.value = '😄 笑筊 (不明/再请示) 😄';
    }
    
    isThrowing.value = false;
  }, 800);
};
</script>

<template>
  <div class="blank-page">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="router.push('/')">← 返回</button>

    <div class="jiaobei-container">
      <h2 class="title logo wenkai">祈福掷筊</h2>
      
      <div class="result-display" :class="{ 'shaking': isThrowing }">
        <!-- 筊杯 1 -->
        <div class="cup" :class="[cup1, { rotating: isThrowing }]">
          <div class="inner">{{ cup1 === 'up' ? '凸' : '平' }}</div>
        </div>
        <!-- 筊杯 2 -->
        <div class="cup" :class="[cup2, { rotating: isThrowing }]">
          <div class="inner">{{ cup2 === 'up' ? '凸' : '平' }}</div>
        </div>
      </div>

      <div class="info-box">
        <p class="result-text">{{ result }}</p>
      </div>

      <button class="main-throw-btn" @click="throwJiaobei" :disabled="isThrowing">
        {{ isThrowing ? '正在掷筊...' : '开始掷筊' }}
      </button>

      <!-- 在按鈕下方的文字 -->
      <div class="divine-hint">
        閉上雙眼，聽從內心的聲音。✨
      </div>

    </div>
  </div>
</template>

<style scoped>
.blank-page {
  padding: 20px;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.back-btn {
  align-self: flex-start;
  background: none;
  border: none;
  color: #d63384;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
}

.jiaobei-container {
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(214, 51, 132, 0.1);
}

.title {
  color: #d63384;
  margin-bottom: 30px;
}

.result-display {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
  perspective: 1000px;
}

/* 筊杯形状优化 */
.cup {
  width: 70px;
  height: 110px;
  background-color: #b22222; /* 深红色 */
  border-radius: 50% 10% 50% 10%; /* 类似月牙形 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  border: 3px solid #800000;
  transition: all 0.4s ease;
  box-shadow: 5px 5px 10px rgba(0,0,0,0.2);
}

.cup.up {
  background-color: #e60000;
  transform: rotateY(0deg);
}

.cup.down {
  background-color: #ff4d4d;
  transform: rotateY(180deg); /* 翻转效果 */
}

/* 动画效果 */
.shaking {
  animation: shake 0.1s infinite;
}

@keyframes shake {
  0% { transform: translate(2px, 1px); }
  50% { transform: translate(-1px, -2px); }
  100% { transform: translate(1px, 2px); }
}

.info-box {
  background: #fff0f6;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 25px;
}

.result-text {
  font-size: 1.1rem;
  font-weight: bold;
  color: #d63384;
  margin: 0;
}

.main-throw-btn {
  width: 100%;
  padding: 15px;
  border-radius: 50px;
  border: none;
  background: linear-gradient(135deg, #ff69b4, #d63384);
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
}

.main-throw-btn:disabled {
  background: #ccc;
  box-shadow: none;
}

.divine-hint {
  letter-spacing: 1.5px; /* 增加字與字之間的距離，看起來更高級 */
  margin-top: 18px;
  color: #c08ea4; /* 使用帶點粉的灰色，跟背景更融合 */
  font-size: 0.85rem;
}

</style>
