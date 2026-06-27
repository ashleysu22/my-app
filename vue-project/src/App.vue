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
  <div class="dashboard-container">

    <!-- Loading Overlay -->
    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <span class="loading-flower">🌸</span>
        <p class="loading-text">正在祈願...</p>
      </div>
    </Transition>

    <!-- Header -->
    <header class="header">
      <h1>心想事成</h1>
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
  background-color: #ffeef2 !important; /* Fixes black bar edge backgrounds */
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* =========================
   DESIGN TOKENS
========================= */
:root {
  --app-max-width: 650px;
}

/* =========================
   CONTAINER
========================= */
.dashboard-container {
  display: flex;
  flex-direction: column;
  width: 100vw;               
  min-height: 100vh;          
  margin: 0;
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
  box-sizing: border-box;
}

/* =========================
   HEADER
========================= */
.header {
  text-align: center;
  padding: calc(env(safe-area-inset-top) + 20px) 0 10px;
  margin: 0 auto;
}

.header h1 {
  color: #d63384;
  font-size: clamp(1.2rem, 5vw, 1.8rem);
  margin: 10px 0;
}

/* =========================
   CONTENT
========================= */
.content {
  flex: 1;
  margin: 0 auto;
  padding: 0 16px 120px;
  width: 100%;
}

/* =========================
   BOTTOM NAV
========================= */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  padding-bottom: calc(env(safe-area-inset-bottom) + 8px);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  z-index: 2000;
  width: 100%;
}

.nav-links {
  display: flex;
  height: 70px;
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
  transform: scale(0.9);
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

/* =========================
   SPECIAL ICON
========================= */
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

/* =========================
   RESPONSIVE
========================= */
@media (min-width: 768px) {
  .content {
    padding-top: 40px;
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

@media (max-width: 320px) {
  .nav-item {
    min-width: 0;
  }

  .label {
    display: none;
  }
}

@media (min-width: 1024px) {
  .dashboard-container {
    max-width: var(--app-max-width);
    margin: 0 auto;
    box-shadow: 0 0 30px rgba(0,0,0,0.05);
  }

  .bottom-nav {
    justify-content: center;
  }

  .nav-links {
    width: 100%;
    max-width: var(--app-max-width);
  }
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
  background: rgba(253, 240, 246, 0.9);
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

/* =========================
   ANIMATION
========================= */
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

.fade-leave-to {
  pointer-events: none;
}
</style>