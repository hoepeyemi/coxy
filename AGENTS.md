# AGENTS.md - Coxy Development Guide

## Architecture
Coxy is a domain intelligence platform with multi-component architecture:
- `frontend/` - Next.js app with ShadCN/UI, TypeScript, TailwindCSS, Solana wallet integration
- `domain-monitor/` - Node.js service for monitoring domain events using Doma API
- `domain-monitor/twitter-bot/` - Node.js bot for automated Twitter posting using twitter-api-v2
- Database: Supabase for data storage and API

## Commands
### Frontend (in frontend/)
- `npm run dev` - Start development server
- `npm run build` - Build production
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint

### Python Scraper (in scraper/)
- `python main.py` - Run market data scraper

### Node.js Components  
- No specific test commands defined (use `node index.mjs` or similar to run)

## Code Style
- Frontend: TypeScript strict mode, ESLint with Next.js rules, ShadCN components
- Path aliases: `@/*` maps to frontend root
- Python: Standard Python imports, logging configured, environment variables via dotenv
- Node.js: ES modules (.mjs), async/await patterns, dotenv for config
- All projects use environment variables for sensitive data (Supabase, API keys)
