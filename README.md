# Dikonakaya — Portfolio Website

<div align="center">
  <img src="public/banner.png" alt="Dikonakaya Banner" width="600" />
  
  **A responsive personal portfolio showcasing pixel art, photography, and creative projects.**
  
  [🌐 Live Site](https://www.dikonakaya.com/) • [📧 Contact](https://www.dikonakaya.com/contact)
</div>

---

## 👋 About Me

Hello! I'm **Dikonakaya** — a pixel artist, photographer, and software developer based in the Philippines.

### What I Do
- 🎨 **Pixel Art** — Minecraft textures, character portraits, UI design, and commissioned works
- 📸 **Photography** — Keyboard photography, self-portraits, and street photography
- 💻 **Software Development** — Web applications, tools, and creative coding projects

### Connect With Me
- [YouTube](https://www.youtube.com/@dikonakaya) • [Twitter](https://twitter.com/dikonakayach) • [Instagram](https://www.instagram.com/dikonakaya.png/)
- [Discord](https://discord.com/invite/GBrAhGK6kE) • [Twitch](https://www.twitch.tv/dikonakaya) • [GitHub](https://github.com/dikonakaya)
- [Ko-fi](https://ko-fi.com/dikonakaya) • [Planet Minecraft](https://www.planetminecraft.com/member/dikonakaya)

---

## 🚀 Project Overview

This repository contains my personal portfolio website — a modern, responsive single-page application built with React and TypeScript.

### Features
- **Justified Image Grid** — Dynamic layout algorithm that fills rows edge-to-edge with proper aspect ratios
- **Responsive Design** — Optimized layouts for mobile, tablet, and desktop
- **Image Lightbox** — Full-screen image viewing with keyboard navigation and swipe gestures
- **Smooth Animations** — Framer Motion powered transitions and reveal effects
- **Contact Form** — Discord webhook integration with reCAPTCHA spam protection
- **SEO Optimized** — Proper meta tags and semantic HTML structure

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Routing** | React Router DOM |
| **Icons** | React Icons |
| **Hosting** | Vercel |
| **Domain** | Namecheap DNS |
| **Images** | Imgur CDN |

---

## 📁 Project Structure

```
src/
├── assets/          # Static images and fonts
├── components/      # Reusable UI components
│   ├── Carousel.tsx       # Auto-playing image slideshow
│   ├── Footer.tsx         # Site footer with social links
│   ├── Navbar.tsx         # Navigation with dropdowns
│   ├── PortfolioGrid.tsx  # Justified image grid layout
│   └── ProjectGrid.tsx    # Expandable project cards
├── data/            # Portfolio and project data
├── hooks/           # Custom React hooks
│   └── useLineReveal.ts   # Intersection observer for animations
├── modals/          # Modal components
│   ├── Lightbox.tsx       # Image lightbox viewer
│   └── FullscreenImage.tsx
├── pages/           # Route page components
│   ├── Home.tsx           # Landing page
│   ├── AboutMe.tsx        # Bio and experience
│   ├── Contact.tsx        # Contact form
│   └── Projects.tsx       # Projects showcase
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── App.tsx          # Main app with routing
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dikonakaya/dikonakaya.git
cd dikonakaya

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

---

## 📄 License

This project is for personal portfolio use. Feel free to use it as inspiration for your own portfolio, but please don't directly copy the design or content.

---

## 🤝 Contact

Interested in working together or just want to say hi?

- **Website:** [dikonakaya.com/contact](https://www.dikonakaya.com/contact)
- **Email:** Available via contact form
- **Discord:** [Join my server](https://discord.com/invite/GBrAhGK6kE)

---

<div align="center">
  © 2025 Dikonakaya. All rights reserved.
</div>
