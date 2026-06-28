<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);

onMounted(() => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1200);
});

const navigate = async (path) => {
  if (route.path === path) return;

  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 900));

  await router.push(path);
  isLoading.value = false;
};
</script>

<template>
  <!-- 1. The desktop blocker screen (Shows on PCs and Tablets) -->
  <div class="desktop-blocker">
    <div class="blocker-content">
      <span class="blocker-icon">📱</span>
      <h2>請使用手機瀏覽</h2>
      <p>為了獲得最佳的心願與經期記錄體驗，請使用行動裝置開啟此頁面。</p>
    </div>
  </div>

  <!-- 2. Your core application layout container -->
  <div class="dashboard-container">

    <!-- Loading Overlay -->
    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <span class="loading-flower">🌸</span>
        <p class="loading-text">加载中。。。</p>
      </div>
    </Transition>

    <!-- Header -->
    <header class="header">
      <div class="logo wenkai">
        <h1>微棠花语</h1>
      </div>
    </header>

    <!-- Content -->
    <main class="content">
      <router-view />
    </main>

    <!-- Bottom Nav -->
    <footer class="bottom-nav">
      <nav class="nav-links">

        <div class="nav-item"
          :class="{ active: route.path === '/divination' }"
          @click="navigate('/divination')">
          <div class="jiaobei-icon">
            <span class="moon left"></span>
            <span class="moon right"></span>
          </div>
          <span class="label">掷筊</span>
        </div>

        <div class="nav-item"
          :class="{ active: route.path === '/' }"
          @click="navigate('/')">
          <span class="icon">🏠</span>
          <span class="label">首頁</span>
        </div>

        <div class="nav-item"
          :class="{ active: route.path === '/period' }"
          @click="navigate('/period')">
          <span class="icon">🌸</span>
          <span class="label">例假</span>
        </div>

      </nav>
    </footer>

  </div>
</template>

<style scoped>
/* =========================
   GLOBAL FIXES (Forces background and size to 100%)
========================= */
* {
  box-sizing: border-box;
}

:global(html), :global(body) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background-color: #ffeef2 !important; 
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* =========================
   CONTAINER
========================= */
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;        
  width: 100%;               
  min-height: 100vh;          
  margin: 0 auto;
  padding: 0;
  background-color: #ffeef2;  
  box-sizing: border-box;
}

/* fallback for old browsers */
@supports not (height: 100dvh) {
  .dashboard-container {
    min-height: 100vh;
  }
}

/* =========================
   HEADER / CONTENT / NAV WIDTH SYSTEM
========================= */
.header, .content, .bottom-nav {
  width: 100%;                
  max-width: 480px;           
  box-sizing: border-box;
}

/* =========================
   HEADER
========================= */
.header {
  text-align: center;
  padding: calc(env(safe-area-inset-top) + 20px) 16px 10px;
}

.header h1 {
  color: #d63384;
  font-size: clamp(1.4rem, 6vw, 1.8rem);
  margin: 10px 0 5px;
}

/* =========================
   CONTENT
========================= */
.content {
  flex: 1;
  margin: 0 auto;
  padding: 0 10px 120px; 
  width: 100%;
}

/* =========================
   BOTTOM NAV
========================= */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%); 
  display: flex;
  justify-content: center;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(15px);
  padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  z-index: 2000;
  width: 100%;
  border-top-left-radius: 24px;   
  border-top-right-radius: 24px;
  box-shadow: 0 -4px 20px rgba(214, 51, 132, 0.06);
}

.nav-links {
  display: flex;
  height: 65px;
  width: 100%;
  justify-content: space-around;
}

/* =========================
   NAV ITEMS
========================= */
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #b0b0b0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
}

.nav-item.active {
  color: #d63384;
  transform: translateY(-2px);
}

.nav-item:active {
  transform: scale(0.95);
}

.icon {
  font-size: 1.5rem;
  margin-bottom: 2px;
}

.label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* =========================
   SPECIAL ICON
========================= */
.jiaobei-icon {
  display: flex;
  gap: 3px;
  margin-bottom: 4px;
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

/* =========================
   LOADING OVERLAY
========================= */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(253, 240, 246, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-flower {
  font-size: 3rem;
  margin-bottom: 15px;
  display: inline-block;
  animation: flower-spin 2s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

.loading-text {
  color: #d63384;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 1rem;
}

@keyframes flower-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* =========================
   MOBILE ONLY ENFORCEMENT SYSTEM
========================= */
.desktop-blocker {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffeef2;
  z-index: 10000;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 24px;
  box-sizing: border-box;
}

.blocker-content {
  background: white;
  padding: 40px 30px;
  border-radius: 28px;
  box-shadow: 0 15px 35px rgba(214, 51, 132, 0.08);
  max-width: 400px;
}

.blocker-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 16px;
  animation: heartBeat 2s infinite;
}

.desktop-blocker h2 {
  color: #d63384;
  margin: 0 0 12px 0;
  font-size: 1.5rem;
}

.desktop-blocker p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.1); }
  28% { transform: scale(1); }
  42% { transform: scale(1.1); }
  70% { transform: scale(1); }
}

/* Triggers layout blocking screens when view width exceeds 768px */
@media (min-width: 768px) {
  .desktop-blocker {
    display: flex;
  }
  .dashboard-container {
    display: none !important;
  }
}
</style>
