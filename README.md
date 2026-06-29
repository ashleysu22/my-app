<div align="center">
  
<img width="193" height="359" alt="image" src="https://github.com/user-attachments/assets/9dba43da-871f-47e5-9899-ede198af0af0" />
  
### 🌸 微堂花语 Lifestyle & Wellness Assistant

<p>
A smart women's lifestyle assistant built with <b>Vue 3</b>, integrating
<b>Period Tracking</b>,
<b>AI Health Assistant</b>,
<b>Weather Information</b>,
<b>Daily Planner</b>, and
<b>Location-based Recommendations</b>
into one responsive web application.
</p>

<p>
<img src="https://img.shields.io/badge/Vue%203-42b883?style=for-the-badge&logo=vue.js" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite" />
<img src="https://img.shields.io/badge/OpenRouter-GPT--4o%20Mini-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-Educational-pink?style=for-the-badge" />
</p>

</div>

---
<div align="center">
<p align="center">

🚀 <b>Want to try 微堂花语?</b><br>
Click below to experience the live demo.

<a href="https://ashleysu22.github.io/my-app/" target="_blank">
  <img src="https://img.shields.io/badge/🌸%20Live%20Demo-Try%20Cherry-ff69b4?style=for-the-badge" alt="Live Demo">
</a>

</p>
</div>

---

# 📖 Overview

Cherry is a modern web application developed to support women's daily health and wellness.

Instead of switching between multiple apps, Cherry integrates:

- 🌸 Menstrual Cycle Tracking
- 🤖 AI Lifestyle Assistant
- 🌤 Weather Information
- ✅ Daily To-do List
- ⭐ Nearby Recommendations

into a single intelligent platform.

The AI assistant provides personalized responses by combining the user's menstrual cycle, current weather, and location.

---

# ✨ Features

<table>
<tr>
<td width="50%">

### 🌸 Period Tracker

- Record last period date
- Customize cycle length
- Customize period duration
- Predict next period
- Display cycle day
- Save data locally

</td>

<td width="50%">

### 🤖 AI Assistant

- AI-powered chatbot
- Period-aware responses
- Weather-aware suggestions
- Lifestyle advice
- Intent recognition
- GPT-4o Mini powered

</td>
</tr>

<tr>
<td>

### 🌤 Weather

- Current temperature
- Weather condition
- Auto location detection
- Real-time weather API

</td>

<td>

### ✅ To-do List

- Add tasks
- Delete tasks
- LocalStorage persistence

</td>
</tr>

<tr>
<td colspan="2">

### ⭐ Nearby Recommendations

- Restaurants
- Cafés
- Attractions
- AI-generated suggestions
- Rating & distance

</td>
</tr>
</table>

---

# 🧠 AI Workflow

```text
User Question
      │
      ▼
Intent Recognition
      │
      ▼
Read Period Data
      │
      ▼
Read Weather
      │
      ▼
Read Location
      │
      ▼
Build AI Prompt
      │
      ▼
OpenRouter GPT-4o Mini
      │
      ▼
Personalized Response
```

---

# 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Vue 3 |
| Build Tool | Vite |
| AI | OpenRouter GPT-4o Mini |
| Weather API | Open-Meteo |
| Geolocation | Browser Geolocation API |
| Reverse Geocoding | BigDataCloud |
| Storage | LocalStorage |

---

# 📂 Project Structure

```text
src/
│
├── assets/
│   ├── cherry-logo.png
│   ├── cherry-ai.png
│
├── views/
│   ├── Home.vue
│   ├── PeriodTracker.vue
│
├── App.vue
├── main.js
└── router/
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/cherry.git
```

Go into the project

```bash
cd cherry
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
VITE_OPENROUTER_API_KEY=your_api_key
```

Run the project

```bash
npm run dev
```

Build for production

```bash
npm run build
```

---

# 🔑 Environment Variable

| Variable | Description |
|----------|-------------|
| VITE_OPENROUTER_API_KEY | OpenRouter API Key |

---

# 📸 Screenshots

> Replace the image paths below with your own screenshots.

<div align="center">

<img src="docs/home.png" width="250"/>
<img src="docs/chat.png" width="250"/>
<img src="docs/period.png" width="250"/>

</div>

---

# 🎯 Future Improvements

- User authentication
- Cloud database
- Menstrual history analytics
- Mood tracking
- Symptom tracking
- Medication reminders
- Push notifications
- Calendar synchronization
- Ovulation prediction
- Dark mode
- Voice assistant
- Multi-language support

---

# 📚 Learning Outcomes

This project demonstrates:

- Vue 3 Composition API
- Component-based development
- REST API integration
- AI Prompt Engineering
- Browser Geolocation API
- Weather API integration
- LocalStorage
- Responsive UI Design
- Chatbot implementation
- Women's digital healthcare application development

---

# 👩‍💻 Author

Developed as an academic project focusing on modern web development, AI integration, and women's digital healthcare applications.

---

# 📄 License

This project is intended for non-commercial purposes.

---

<div align="center">

## ⭐ Thank you for visiting Cherry!

If you like this project, consider giving it a ⭐ on GitHub.

</div>
