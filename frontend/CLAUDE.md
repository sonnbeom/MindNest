# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in the `frontend/` directory.

> 세션 플로우·CBT 도메인·데이터 구조·LLM 호출 규칙은 루트 [CLAUDE.md](../CLAUDE.md)와 [Product.md](../Product.md) 참조.

---

## ⚠️ 이 Next.js는 당신이 아는 Next.js가 아닙니다

**Next.js 16 / React 19** — 훈련 데이터의 Next.js와 API·컨벤션·파일 구조가 다릅니다.
코드 작성 전 `node_modules/next/dist/docs/` 내 관련 가이드를 읽고, deprecation 경고를 무시하지 마세요.

---

## Commands

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
```

---

## 프로젝트 구조 규칙

```
frontend/
├── app/                  # Next.js App Router — 라우트 파일만
│   ├── layout.tsx        # 루트 레이아웃
│   ├── page.tsx          # 홈 페이지
│   ├── globals.css       # 전역 스타일 (Tailwind 진입점)
│   └── (세션 라우트)/    # 향후 세션 페이지
├── components/
│   ├── ui/               # 재사용 프리미티브 (Button, AnimatedGroup 등 shadcn 스타일)
│   ├── sections/         # 페이지 섹션 컴포넌트 (HeroSection, BrandsGrid 등)
│   └── session/          # 세션 플로우 전용 컴포넌트 (TherapySession 등)
├── lib/
│   └── llm.js            # LLM 호출 전용 — 이 파일에서만 API 호출
├── data/
│   └── hints.json        # 사전 정의 힌트 데이터
├── hooks/                # 커스텀 React 훅
└── types/                # TypeScript 타입 정의
```

`app/` 디렉토리에는 라우트 파일(`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`)만 둡니다.
UI 로직은 `components/`로, 유틸리티는 `lib/`로 분리합니다.

---

## Server Component vs Client Component

**기본값은 Server Component입니다.** `'use client'`는 필요할 때만 추가합니다.

`'use client'`가 필요한 경우:
- `onClick`, `onChange` 등 이벤트 핸들러 사용 시
- `useState`, `useEffect` 등 React 훅 사용 시
- 브라우저 전용 API(`window`, `localStorage`) 사용 시
- 세션 상태(`contextObj`) 를 보유하는 컴포넌트

`'use client'`가 불필요한 경우 (Server Component로 작성):
- 정적 UI 렌더링
- 서버에서 데이터를 fetch하는 로직
- 레이아웃, 래퍼 컴포넌트

---

## React 19 주요 변경사항

**`forwardRef` 불필요** — ref를 일반 prop으로 전달 가능합니다.
```tsx
// ❌ 구 방식
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => ...)

// ✅ React 19
function Input({ ref, ...props }: Props & { ref?: React.Ref<HTMLInputElement> }) { ... }
```

**Context Provider 간소화**
```tsx
// ❌ 구 방식
<SessionContext.Provider value={...}>

// ✅ React 19
<SessionContext value={...}>
```

**폼 처리** — `useFormState` → `useActionState`로 변경됨.

**`use()` 훅** — Promise와 Context를 조건부로 읽을 수 있음.

---

## Tailwind CSS 4 규칙

**설정 방식이 바뀌었습니다.** `tailwind.config.js`가 없고 CSS에서 직접 설정합니다.

```css
/* globals.css */
@import "tailwindcss";          /* ✅ v4 방식 */

/* ❌ v3 방식 — 사용 금지 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

커스텀 토큰은 `@theme` 블록에 정의합니다:
```css
@theme inline {
  --color-background: var(--background);
}
```

---

## 안티 패턴 — 하지 말 것

### 컴포넌트 설계
```tsx
// ❌ 불필요한 use client — 이벤트 핸들러 없는 컴포넌트에 추가
'use client'
export default function StaticCard() { return <div>...</div> }

// ❌ useEffect로 데이터 패칭 — Server Component 또는 Server Action 사용
useEffect(() => { fetch('/api/data').then(...) }, [])

// ❌ 파생 상태를 useState로 관리
const [fullName, setFullName] = useState(`${first} ${last}`)

// ✅ 직접 계산
const fullName = `${first} ${last}`
```

### 상태 관리
```tsx
// ❌ 세션 상태를 여러 useState로 분산
const [stage, setStage] = useState()
const [cbtTurn, setCbtTurn] = useState()
const [chatHistory, setChatHistory] = useState()

// ✅ contextObj 스키마 그대로 useReducer 하나로 관리
const [session, dispatch] = useReducer(sessionReducer, initialSession)
```

### LLM 호출
```tsx
// ❌ 컴포넌트 내부에서 직접 fetch
const res = await fetch('/api/llm', { body: ... })

// ✅ 반드시 lib/llm.js를 통해 호출
import { analyzeDistortions } from '@/lib/llm'
```

### Next.js App Router
```tsx
// ❌ Pages Router 방식 — App Router에서 동작 안 함
export async function getServerSideProps() { ... }
export async function getStaticProps() { ... }

// ❌ <a> 태그로 내부 이동
<a href="/session">시작</a>

// ✅ next/link 사용
import Link from 'next/link'
<Link href="/session">시작</Link>

// ❌ <img> 태그
<img src="/logo.png" />

// ✅ next/image 사용
import Image from 'next/image'
<Image src="/logo.png" alt="..." width={100} height={100} />
```

---

## TypeScript 규칙

`strict: true`가 활성화되어 있습니다.

- `any` 사용 금지 — 타입을 모를 경우 `unknown` 사용 후 좁히기
- `contextObj` 타입은 `types/` 에 정의하고 import해서 사용
- 컴포넌트 props는 반드시 타입 정의 (inline interface 또는 별도 type)
- non-null assertion(`!`) 남용 금지 — optional chaining(`?.`) 또는 조건 분기 사용

---

## 스타일링 규칙

- 스타일은 Tailwind 클래스로만 작성합니다. 인라인 `style={}` 최소화.
- 컴포넌트별 CSS 파일 생성 금지 — `globals.css`에 전역 토큰만, 나머지는 Tailwind.
- 다크모드는 CSS 변수(`--background`, `--foreground`)로 이미 처리되어 있습니다. `dark:` prefix 남용 지양.
