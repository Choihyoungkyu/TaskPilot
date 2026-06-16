# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 언어
- 코드: 영어
- 코드를 제외한 나머지: 한국어

# 명령어
- 개발 서버: npm run dev
- 빌드: npm run build

# 코딩 규칙
- 컴포넌트는 함수형 + TypeScript 타입 명시
- 상태는 React useState/useEffect 사용, 불필요한 라이브러리 추가 금지
- IMPORTANT: 비밀키·토큰은 코드에 하드코딩 금지 (.env 사용)

# 커밋 메시지는 한국어로, 한 줄 요약 + 변경 이유

## Project Overview

This is a Next.js 16.2.9 application using the App Router, TypeScript, and React 19. The project uses TypeScript strict mode and ESLint for code quality.

## Common Commands

- **Start dev server**: `npm run dev` — runs at http://localhost:3000 with hot reload
- **Build for production**: `npm run build`
- **Run production build**: `npm start`
- **Lint code**: `npm run lint` — uses ESLint with Next.js and TypeScript rules

## Architecture & Project Structure

### Directory Layout

- `src/app/` — Next.js App Router pages and layouts. Each directory is a route segment.
  - `layout.tsx` — root layout, wraps all pages
  - `page.tsx` — main page for the route
- `src/` — source code root with `@/*` path alias configured to `./src/*`
- `public/` — static assets served at root
- `.next/` — build output (generated, not tracked)

### Key Configuration Files

- `tsconfig.json` — TypeScript config with `@/*` alias for imports from `src/`
- `next.config.ts` — Next.js configuration (currently empty, ready for custom config)
- `eslint.config.mjs` — ESLint config using Next.js core-web-vitals and TypeScript rulesets

### Development Patterns

- **File-based routing**: Directories in `app/` map to URL routes. Files named `page.tsx` are the route handler.
- **Layouts**: `layout.tsx` files wrap child routes and persist across navigation.
- **Strict TypeScript**: `strict: true` in tsconfig.json — no implicit `any`, all types must be explicit.
- **Path aliases**: Import from `src/` using `@/` prefix (e.g., `import { Foo } from '@/components/Foo'`).

### Important Notes

- Next.js 16 may have breaking changes from earlier versions. Check `node_modules/next/dist/docs/` for recent API changes or deprecations before implementing features.
- React 19 introduces new features like Server Components by default in the App Router. Client interactivity requires `'use client'` directive.
- ESLint is configured with Next.js best practices (Core Web Vitals, TypeScript rules). Run `npm run lint` before committing.

## Development Guidelines

- **Hot reload**: Changes to `src/app/` files trigger instant recompilation during `npm run dev`.
- **CSS Modules**: Use `.module.css` files for component-scoped styles. Static CSS in `globals.css` applies globally.
- **TypeScript first**: All new `.tsx` and `.ts` files must have proper type annotations. Use strict null checks.

