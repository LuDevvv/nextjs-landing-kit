# 🚀 Next.js Landing Kit

A modern, high-performance boilerplate for creating stunning landing pages with Next.js.

## ✨ Features

- **⚡ Next.js 14** with App Router for optimal performance
- **🎨 TailwindCSS** with custom design system
- **📱 Fully Responsive** components
- **🔍 SEO Optimized** out of the box
- **📝 TypeScript** for type safety
- **🎭 Framer Motion** for smooth animations
- **📧 Email Integration** with Resend
- **🛠️ Developer Experience** with ESLint + Prettier

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/[your-username]/nextjs-landing-kit.git
cd nextjs-landing-kit
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

4. **Start development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@yourdomain.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Your Landing Page
```

### Email Setup

1. Sign up for [Resend](https://resend.com)
2. Get your API key from the dashboard
3. Add your API key to `.env.local`
4. Configure your sender domain

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # Reusable UI components
│   ├── sections/          # Page sections
│   └── layout/            # Layout components
├── lib/
│   ├── utils.ts           # Utility functions
│   ├── validations.ts     # Zod schemas
│   └── email.ts           # Email configuration
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
└── data/                  # Static data
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Email:** Resend
- **Code Quality:** ESLint + Prettier

## 🎯 Use Cases

Perfect for:

- **Business Landing Pages** - Services, products, startups
- **Real Estate** - Property showcases, agent profiles
- **Events** - Conferences, workshops, fairs
- **E-commerce** - Product launches, promotional campaigns
- **Portfolio** - Personal brands, agencies
- **Lead Generation** - Contact forms, newsletters

---

**Happy coding! 🎉**

> Made with ❤️
