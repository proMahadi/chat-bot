# 🚀 chat-bot

## 📖 Overview

This project is a basic chat bot application built using Vite, React, and TypeScript. It provides a foundation for building more complex chat bot interfaces. The current implementation is a single-page application with a simple text input and display area. The project is designed to be easily customizable and extended with additional features. The target audience includes frontend developers who are familiar with React and TypeScript and want to quickly build a chatbot interface.

## ✨ Features

- Simple and intuitive user interface.
- Built with React, TypeScript and Vite for a fast development experience.
- Clean and organized codebase.
- Easily customizable styling via Tailwind CSS.
- Uses components for easy extension and modification.

## 🛠️ Tech Stack

**Frontend:**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![Vite](https://img.shields.io/badge/vite-B4B4B4?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- Bun (Optional, but recommended for faster build times. Instructions are below)
- npm (or yarn/pnpm)

### Installation using Bun (Recommended)

1. **Install Bun:** Follow instructions at [https://bun.sh/](https://bun.sh/)
2. **Clone the repository:**
   ```bash
   git clone https://github.com/proMahadi/chat-bot.git
   cd chat-bot
   ```
3. **Install dependencies:**
   ```bash
   bun install
   ```
4. **Start development server:**
   ```bash
   bun dev
   ```

### Installation using npm (or yarn/pnpm)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/proMahadi/chat-bot.git
   cd chat-bot
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start development server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
chat-bot/
├── public/            # Static assets
├── src/
│   └── App.tsx        # Main application component
└── ...                # Other source code files
```

## ⚙️ Configuration

The project uses `vite.config.ts` for build configuration and `tailwind.config.ts` for Tailwind CSS customization. No environment variables are currently used.

## 🔧 Development

### Available Scripts

| Command | Description |

|-------------|-----------------------------------|

| `bun dev` | Starts the development server |

| `bun build` | Creates a production build |

| `npm run dev` | Starts the development server using npm|

| `npm run build` | Creates a production build using npm |
