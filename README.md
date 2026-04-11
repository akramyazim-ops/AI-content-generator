# AI Content Studio ⚡

A high-fidelity, cyberpunk-aesthetic social media content generator tailored for Malaysian SMEs. Built with Next.js, Framer Motion, and Google Gemini.

![AI Content Studio Mockup](https://raw.githubusercontent.com/akramyazim-ops/AI-content-generator/main/public/preview.png) *(Note: Add a real preview image to public/ folder if available)*

## ✨ Key Features

- **Cyberpunk UI**: Ultra-modern, responsive split-panel interface with glassmorphism and smooth animations.
- **Localized Content**: Specifically designed for the Malaysian market with support for casual (santai) and technical tones.
- **Multimodal AI**: Powered by Google Gemini for text and image-to-text generation.
- **Engagement Focused**: Generate TikTok scripts, Instagram captions, and Facebook posts that convert.
- **Usage Tracking**: Integrated with Supabase to track content generation and user tokens.

## 🚀 Tech Stack

- **Core**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4, Framer Motion (for high-fidelity animations)
- **AI**: Gemini 1.5 Flash (vision and text)
- **Backend**: Supabase (Auth, Database, Storage)
- **Icons**: Lucide React

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- Supabase Account
- Google AI (Gemini) API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akramyazim-ops/AI-content-generator.git
   cd AI-content-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   GOOGLE_AI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📦 Database Schema

The studio requires the following Supabase setup (available in `supabase_setup.sql`):
- `usage_tracking` table for monitoring AI generations.
- Row Level Security (RLS) for data privacy.

## 📄 License

Private - (c) 2026 AI Content Studio Team
