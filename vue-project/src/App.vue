<script setup>
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
</script>

<template>
  <div class="dashboard-container">
    <!-- 顶部标题 -->
    <header class="header">
      <h1>心想事成</h1>
    </header>

    <!-- 主内容区 -->
    <main class="content">
      <router-view />
    </main>

    <!-- 移动端底部导航 -->
    <footer class="bottom-nav">
      <nav class="nav-links">
        <!-- 圣杯 (自定义月牙样式) -->
        <div class="nav-item" :class="{ active: route.path === '/divination' }" @click="router.push('/divination')">
          <div class="jiaobei-icon">
            <span class="moon left"></span>
            <span class="moon right"></span>
          </div>
          <span class="label">掷筊</span>
        </div>

        <!-- Home -->
        <div class="nav-item" :class="{ active: route.path === '/' }" @click="router.push('/')">
          <span class="icon">🏠</span>
          <span class="label">首頁</span>
        </div>

        <!-- Cycle -->
        <div class="nav-item" :class="{ active: route.path === '/period' }" @click="router.push('/period')">
          <span class="icon">🌸</span>
          <span class="label">例假</span>
        </div>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
/* 1. 基础容器：确保在所有设备上背景和高度正确 */
.dashboard-container {
  background-color: #fdf0f6;
  min-height: 100vh;
  /* 使用 fill-available 适配移动端浏览器地址栏切换 */
  min-height: -webkit-fill-available; 
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  overflow-x: hidden; /* 防止横向溢出 */
}

/* 2. 顶部标题：响应式字体大小 */
.header {
  text-align: center;
  padding: calc(env(safe-area-inset-top) + 10px) 20px 10px;
}

.header h1 {
  color: #d63384;
  font-size: clamp(1.2rem, 5vw, 1.8rem); /* 随屏幕宽度自动缩放字体 */
  margin: 10px 0;
}

/* 3. 主内容区：核心响应式设计 */
.content {
  flex: 1;
  width: 100%;
  /* 这里的 500px 是手机端最佳宽度，但在平板上我们可以稍稍放宽 */
  max-width: 650px; 
  margin: 0 auto;
  padding: 0 16px 120px; /* 底部留够空间给导航栏 */
  box-sizing: border-box;
}

/* 4. 底部导航栏：固定高度，适配全面屏 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px); /* iOS 适配 */
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.04);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 2000;
  border-top: 1px solid rgba(214, 51, 132, 0.1);
}

.nav-links {
  display: flex;
  height: 70px; /* 稍微增加高度，在大屏上更好点 */
  align-items: center;
  max-width: 650px;
  margin: 0 auto;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #b0b0b0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent; /* 移除移动端点击蓝框 */
}

/* 5. 交互效果：点击或激活时的状态 */
.nav-item.active {
  color: #d63384;
  transform: translateY(-2px);
}

.nav-item:active {
  transform: scale(0.9); /* 点击时的缩放反馈 */
}

.icon {
  font-size: 1.4rem;
  margin-bottom: 2px;
}

.label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 6. 特殊图标微调 */
.jiaobei-icon {
  display: flex;
  gap: 3px;
  margin-bottom: 3px;
}

.moon {
  width: 11px;
  height: 18px;
  background-color: currentColor;
  border-radius: 20px 0 0 20px;
  transform: rotate(-10deg);
}

.moon.right {
  border-radius: 0 20px 20px 0;
  transform: rotate(10deg);
}

/* 7. 平板 (Tablet) 及以上设备的特定优化 */
@media (min-width: 768px) {
  .content {
    padding-top: 40px; /* 平板上方多留白更显高级 */
  }
  
  .nav-links {
    height: 80px;
  }
  
  .label {
    font-size: 0.85rem;
  }
  
  .icon {
    font-size: 1.6rem;
  }
}

/* 8. 针对超窄屏幕手机的优化 */
@media (max-width: 320px) {
  .label {
    display: none; /* 极小屏只显示图标 */
  }
}

</style>
