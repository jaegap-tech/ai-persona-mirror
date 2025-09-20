# 🧭 AI 페르소나 미러 — 주니어 개발자를 위한 “초세분화” 실행 계획

아래 체크리스트는 **그대로 따라 하면 동작**하도록 명령어·파일 생성·코드 예시·검증 포인트까지 포함했습니다.
(윈도우/맥 공통. `>` 표시는 터미널/PowerShell에서 입력)

---

## 0) 사전 준비 (1시간)

* [ ] GitHub 계정, Vercel 계정, (선택) Supabase 계정 만들기
* [ ] 에디터: VS Code + 확장 추천

  * `Svelte for VS Code`, `ESLint`, `Prettier - Code formatter`
* [ ] Node.js LTS 설치 후 확인

  ```bash
  node -v
  npm -v
  ```

---

## 1주차 — **환경 설정 & 자동 배포 파이프라인**

### Day 1 — SvelteKit 기본 프로젝트 만들기

1. 프로젝트 생성

```bash
> npm create svelte@latest ai-persona-mirror
# 템플릿: Skeleton project
# TypeScript: Yes, using TypeScript
# ESLint/Prettier: 스페이스바로 선택
> cd ai-persona-mirror
> npm install
```

2. 로컬 실행

```bash
> npm run dev
```

* 브라우저에서 `http://localhost:5173` 열어 “Welcome to SvelteKit” 확인

3. 기본 Git 세팅 & 첫 커밋

```bash
> git init
> git add .
> git commit -m "chore: init sveltekit (ts + eslint + prettier)"
```

### Day 2 — Tailwind, 프로젝트 구조, .gitignore

1. Tailwind 추가

```bash
> npx svelte-add@latest tailwindcss
> npm install
> npm run dev
```

2. 폴더 구조 만들기

```
src/
  lib/
    components/
      Welcome.svelte
      Question.svelte
      Result.svelte
    questions.ts
  routes/
    +page.svelte
```

3. `.gitignore`(없다면 생성)

```gitignore
# dependencies
node_modules
# build
.build
.vercel
.svelte-kit
# env
.env
.env.*
```

4. 커밋

```bash
> git add .
> git commit -m "chore: add tailwind + base folder structure"
```

### Day 3 — GitHub 원격 저장소 & Vercel 연동

1. GitHub 저장소 생성 → 원격 연결/푸시

```bash
> git branch -M main
> git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/ai-persona-mirror.git
> git push -u origin main
```

2. Vercel에서 `New Project` → GitHub의 `ai-persona-mirror` Import → **Deploy**

* 완료 후 `https://<project>.vercel.app` 접속 확인

### Day 4 — 기본 컴포넌트/페이지 골격

1. `src/lib/components/Welcome.svelte`

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  const start = () => dispatch('start');
</script>

<section class="min-h-[60vh] flex flex-col items-center justify-center gap-6">
  <h1 class="text-3xl font-bold">AI 페르소나 미러</h1>
  <p class="text-gray-600">버튼을 눌러 시작하세요!</p>
  <button class="btn btn-primary px-6 py-3 rounded-xl shadow"
          on:click={start}>시작하기</button>
</section>
```

2. `src/lib/components/Question.svelte`

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let question: { id: number; text: string; options: { text: string; value: string }[] };
  const dispatch = createEventDispatcher();
  const select = (value: string) => dispatch('answer', { questionId: question.id, value });
</script>

<div class="max-w-xl mx-auto bg-white rounded-2xl shadow p-6">
  <h2 class="text-xl font-semibold mb-4">{question.text}</h2>
  <ul class="space-y-3">
    {#each question.options as o}
      <li>
        <button class="w-full border rounded-xl p-3 hover:bg-gray-50"
                on:click={() => select(o.value)}>{o.text}</button>
      </li>
    {/each}
  </ul>
</div>
```

3. `src/lib/components/Result.svelte` (일단 자리만)

```svelte
<script lang="ts">
  export let answers: { questionId: number; value: string }[] = [];
</script>

<div class="max-w-2xl mx-auto p-6">
  <h2 class="text-2xl font-bold mb-4">결과</h2>
  <p class="text-gray-600">AI 연동 전 기본 결과 화면입니다.</p>
  <pre class="bg-gray-50 p-4 rounded-xl mt-4">{JSON.stringify(answers, null, 2)}</pre>
</div>
```

4. `src/lib/questions.ts`

```ts
export interface Question {
  id: number;
  text: string;
  options: { text: string; value: string }[];
}

export const questions: Question[] = [
  { id: 1, text: '주말에 무엇을 하나요?', options: [
    { text: '사람들을 만나 에너지 얻기', value: 'extrovert' },
    { text: '혼자 시간 보내며 충전', value: 'introvert' },
  ]},
  { id: 2, text: '새로운 문제를 보면?', options: [
    { text: '일단 손대보고 배우자', value: 'hands-on' },
    { text: '문서·사례 먼저 훑기', value: 'theory-first' },
  ]},
];
```

5. `src/routes/+page.svelte` — 상태/흐름

```svelte
<script lang="ts">
  import Welcome from '$lib/components/Welcome.svelte';
  import Question from '$lib/components/Question.svelte';
  import Result from '$lib/components/Result.svelte';
  import { questions } from '$lib/questions';

  let state: 'welcome' | 'quiz' | 'result' = 'welcome';
  let idx = 0;
  let answers: { questionId: number; value: string }[] = [];

  const startQuiz = () => { state = 'quiz'; idx = 0; answers = []; };
  const onAnswer = (e: CustomEvent<{questionId: number; value: string}>) => {
    answers = [...answers, e.detail];
    if (idx < questions.length - 1) idx++;
    else state = 'result';
  };
</script>

<main class="p-6">
  {#if state === 'welcome'}
    <Welcome on:start={startQuiz} />
  {:else if state === 'quiz'}
    <Question question={questions[idx]} on:answer={onAnswer} />
  {:else}
    <Result {answers} />
  {/if}
</main>
```

6. 커밋

```bash
> git add .
> git commit -m "feat: base components and quiz flow skeleton"
> git push
```

* Vercel 자동 배포 확인

### Day 5 — UI 다듬기 & 반응형 확인

* [ ] 모바일(375px), 태블릿, 데스크톱에서 버튼/글자 크기 확인
* [ ] `:focus-visible` 보더로 접근성 확보
* [ ] 로딩 스테이트 공통 유틸(추후 사용) 초안 작성

### Day 6 — (선택) Supabase 스키마 초안

* 결과 저장용 최소 테이블 (추후 확장)

```sql
-- profiles (익명 식별용 키)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now()
);

-- quiz_results
create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  answers jsonb not null,
  persona_markdown text,
  created_at timestamp with time zone default now()
);
```

### Day 7 — 1주차 품질 점검

* [ ] Vercel 배포 URL에서 Welcome → 질문 → 결과까지 이동
* [ ] ESLint/Prettier 실행

```bash
> npm run lint
> npm run format
```

---

## 2주차 — **핵심 기능(퀴즈 완주) 완성**

### Day 8 — 질문 데이터 확장 & 진행 표시

1. 진행바 컴포넌트 `Progress.svelte`

```svelte
<script lang="ts">
  export let current = 1;
  export let total = 1;
  $: pct = Math.round((current / total) * 100);
</script>

<div class="w-full bg-gray-200 rounded-xl h-2 overflow-hidden">
  <div class="h-2 bg-black" style={`width: ${pct}%`}></div>
</div>
<p class="mt-2 text-sm text-gray-600">{current} / {total}</p>
```

2. `+page.svelte`에 진행바 적용

```svelte
{#if state === 'quiz'}
  <div class="max-w-xl mx-auto mb-4">
    <Progress current={idx + 1} total={questions.length} />
  </div>
  <Question question={questions[idx]} on:answer={onAnswer} />
{/if}
```

3. 커밋/푸시

### Day 9 — 키보드 조작 & 접근성

* 버튼에 `aria-pressed`/`role="button"` 고려, `Enter/Space` 처리
* 포커스 이동(다음 질문으로 넘어갈 때 첫 버튼 포커스)

### Day 10 — 에러/엣지케이스 방어

* 질문이 0개인 경우 가드
* 사용자가 새로고침해도 앱이 깨지지 않도록 기본값 방어

### Day 11 — UI 폴리싱

* 카드 애니메이션(진입 시 가벼운 페이드/슬라이드)
* 터치 영역 확대(`py-3`, `min-h-[44px]`), 탭 타겟 44px 이상

### Day 12\~13 — 리팩터 & 테스트

* [ ] 컴포넌트 prop 타입 구체화
* [ ] 간단한 유닛 테스트(선택): 질문 개수/진행 로직

### Day 14 — 2주차 점검

* [ ] 퀴즈 “완주” 가능 + 문제 없음
* [ ] 배포본 시나리오 테스트(모바일/데스크톱)

---

## 3주차 — **AI(Gemini) 연동: 페르소나 생성**

### Day 15 — 라이브러리 설치 & 환경 변수

1. 패키지

```bash
> npm install @google/generative-ai marked
```

2. Vercel 환경 변수 추가

* `Settings > Environment Variables`

  * `GEMINI_API_KEY = <발급 키>`
* 로컬 `.env`

```
GEMINI_API_KEY="<YOUR_KEY>"
```

### Day 16 — 서버 라우트 구현

`src/routes/api/generate-persona/+server.ts`

```ts
import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// 사용 모델: 최신 안정 모델로 교체 가능 (예: 'gemini-2.5-pro')
const MODEL = 'gemini-2.5-pro';

export const POST = async ({ request }) => {
  try {
    const { answers } = await request.json();

    if (!Array.isArray(answers) || answers.length === 0) {
      return json({ error: 'answers required' }, { status: 400 });
    }

    const prompt = [
      '당신은 영화와 심리 분석에 능숙한 전문 큐레이터입니다.',
      '사용자의 답변을 바탕으로 이 사람이 주인공인 영화의 한 장면을 상상하고, 그 장면의 나레이션처럼 결과를 전합니다.',
      '이 사람의 페르소나를 가장 잘 드러내는 실제 영화 속 캐릭터 한 명을 선정하고, 한국어 마크다운으로 500자 이내의 카피라이팅 스타일 답변을 작성하며 아래 지침을 정확히 따릅니다.',
      '',
      '# 🎬 당신과 닮은 영화 캐릭터: <캐릭터 이름>(<영화 제목>)',
      '',
      '본문 구성:',
      '- 첫 문단: 따뜻한 두 문장으로 요약하며 사용자 응답을 최소 1회 직접 언급',
      '- 두 번째 문단: 캐릭터를 선택한 이유를 이야기하듯 2문장으로 설명하고 추가로 응답을 1회 이상 언급',
      '- 세 번째 문단: 기억에 남는 장면이나 대사를 *이탤릭*으로 소개하고 이어서 일상에서 참고할 만한 제안을 한 문장으로 자연스럽게 연결',
      '- 마지막 문장: 재치 있는 비유로 마무리',
      '',
      '규칙: 불릿이나 번호를 본문에 사용하지 말고, 문단 사이에는 빈 줄 하나만 두며, 전체 글자 수는 500자를 넘기지 않고 존댓말과 응원하는 톤을 유지하세요.',
      '',
      `응답: ${JSON.stringify(answers)}`
    ].join('\n');

    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return json({ ok: true, persona: text });
  } catch (e: any) {
    console.error(e);
    return json({ error: 'AI generation failed' }, { status: 500 });
  }
};
```

### Day 17 — 결과 화면에서 API 호출/렌더

`src/lib/components/Result.svelte`

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  export let answers: { questionId: number; value: string }[] = [];

  let loading = true;
  let error = '';
  let personaMd = '';

  onMount(async () => {
    try {
      const res = await fetch('/api/generate-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'unknown error');
      personaMd = data.persona;
    } catch (e: any) {
      error = e.message ?? '요청 중 오류가 발생했어요.';
    } finally {
      loading = false;
    }
  });
</script>

<div class="max-w-2xl mx-auto p-6">
  {#if loading}
    <div class="animate-pulse space-y-3">
      <div class="h-6 bg-gray-200 rounded"></div>
      <div class="h-6 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-100 rounded"></div>
      <div class="h-4 bg-gray-100 rounded w-1/2"></div>
    </div>
  {:else if error}
    <p class="text-red-600">⚠️ {error}</p>
  {:else}
    <article class="prose max-w-none">{@html marked(personaMd)}</article>
  {/if}
</div>
```

### Day 18 — 간단한 레이트 리밋 & 재시도(선택)

`src/lib/utils/retry.ts`

```ts
export async function retry<T>(fn: () => Promise<T>, times = 2, backoffMs = 500) {
  let lastErr;
  for (let i = 0; i <= times; i++) {
    try { return await fn(); }
    catch (e) { lastErr = e; await new Promise(r => setTimeout(r, backoffMs * (i + 1))); }
  }
  throw lastErr;
}
```

* API 내부에서 `await retry(() => model.generateContent(prompt))`처럼 감싸 사용 가능

### Day 19 — (선택) Supabase 저장

* 서버 라우트에서 결과를 저장하는 POSTGRES 삽입 로직 추가 (SDK 또는 REST)

### Day 20 — E2E(End-to-End) 시나리오

* [ ] Welcome → 질문 → 결과(로딩) → AI 결과 마크다운 표시까지 **실제 배포 URL**에서 확인
* [ ] 느린 네트워크/모바일에서도 UX 괜찮은지 확인

### Day 21 — 3주차 점검

* [ ] 500/400 에러 시 사용자 메시지 자연스러움
* [ ] 콘솔에 민감정보(키/응답 전문) 노출 없는지

---

## 4주차 — **출시 준비 & 수익화 & 마케팅**

### Day 22 — 정책/법적 페이지

* `src/routes/privacy/+page.svelte`

```svelte
<script>
  // 필요 시 날짜/이메일 등 상수
</script>

<section class="prose max-w-3xl mx-auto p-6">
  <h1>개인정보처리방침</h1>
  <p>본 서비스는 최소한의 정보를 처리하며 ...</p>
  <h2>수집 항목</h2>
  <ul>
    <li>퀴즈 응답 (익명화)</li>
  </ul>
  <h2>문의</h2>
  <p>이메일: your@email.com</p>
</section>
```

* `src/routes/about/+page.svelte` — 서비스 소개/制作者

### Day 23 — SEO & 기본 메타

`src/routes/+layout.svelte`

```svelte
<svelte:head>
  <title>영화 캐릭터 미러 | 나와 닮은 페르소나 분석</title>
  <meta name="description" content="취향과 성향을 닮은 영화 캐릭터를 찾아주는 AI 페르소나 미러" />
  <meta property="og:title" content="영화 캐릭터 미러" />
  <meta property="og:description" content="AI가 당신과 어울리는 영화 속 친구를 소개해드려요!" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://YOUR_DOMAIN" />
  <meta property="og:image" content="https://YOUR_DOMAIN/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<slot />
```

`static/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://YOUR_DOMAIN/sitemap.xml
```

`static/sitemap.xml`(간단 정적)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://YOUR_DOMAIN/</loc></url>
  <url><loc>https://YOUR_DOMAIN/about</loc></url>
  <url><loc>https://YOUR_DOMAIN/privacy</loc></url>
</urlset>
```

### Day 24 — 소셜 공유 버튼

`src/lib/components/Share.svelte`

```svelte
<script lang="ts">
  export let url = 'https://YOUR_DOMAIN';
  export let text = 'AI가 분석한 내 페르소나 결과 보기!';
  const tw = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
</script>

<div class="flex gap-3 mt-6">
  <a class="px-4 py-2 border rounded-xl" href={tw} target="_blank" rel="noreferrer">트위터 공유</a>
  <a class="px-4 py-2 border rounded-xl" href={fb} target="_blank" rel="noreferrer">페이스북 공유</a>
</div>
```

`Result.svelte` 하단에 `<Share />` 추가

### Day 25 — Buy Me a Coffee & (승인 후) AdSense

* **BMC**: 위젯 스크립트 제공 코드(사이트에서 발급) → `+layout.svelte`의 `<svelte:head>` 아래 삽입 또는 `Result.svelte` 하단 버튼
* **AdSense**(승인 후, 발급 코드): `src/app.html` `<head>`에 삽입
  *승인 전에는 불필요 스크립트 삽입 금지*

### Day 26 — 커스텀 도메인 연결

* Vercel `Settings > Domains`에서 구매한 도메인 추가 → DNS 안내대로 CNAME/A 레코드 설정
* HTTPS 자동 적용 확인

### Day 27 — 최종 QA 목록

기능

* [ ] 퀴즈 완주/재시작 동작
* [ ] 느린 네트워크에서 로딩 스켈레톤 표시
* [ ] API 실패 시 에러 메시지/재시도 버튼

보안/운영

* [ ] `GEMINI_API_KEY`가 **서버 전용**으로만 사용(클라이언트 노출 X)
* [ ] 로그에 개인정보/키 노출 없음
* [ ] (선택) CORS 기본(동일 출처) 유지

접근성

* [ ] 키보드로 모든 버튼 선택 가능
* [ ] 대비/폰트 크기 확인

성능

* [ ] 첫 페인트 시간 점검(불필요 이미지/폰트 지양)
* [ ] 이미지 `width/height` 지정

### Day 28 — 발표/홍보 글 배포

* 디스콰이엇/Velog: “만들면서 배운 점 + 데모 링크 + 깃허브 링크”
* Reddit r/SideProject: 영어 요약 + 스크린샷
* 일반 커뮤니티: 재미 포인트 강조 + 10초 내 플레이 가능 강조

---

## 출시 후 — **운영 루프**

* [ ] Vercel Analytics: 페이지/유입 채널 확인(주 1\~2회)
* [ ] AdSense 대시보드: 수익/페이지 RPM 확인(승인 후)
* [ ] 피드백 반영

  * 질문 개선: 중복/모호 질문 교체
  * 결과 품질: 프롬프트에 “근거 불릿 추가” 등 점진 강화
* [ ] 백로그 운영(예: 다국어, 공유용 썸네일, 결과 저장/링크)

---

## 부록 A — 자주 나는 오류 & 해결

* **Vercel에서 500 에러**: 대개 환경변수 누락

  * 대시보드의 `Environment Variables`에 `GEMINI_API_KEY` 추가 후 **재배포**
* **클라이언트에서 키가 보임**: 서버 라우트 내에서만 사용하고, 클라이언트 코드에서 `import.meta.env`로 접근하지 않기
* **CORS 문제**: 동일 도메인에서 `/api/...` 호출 시 기본적으로 문제 없음. 다른 도메인 호출 시 서버 라우트에서 헤더 설정 필요
* **빌드 실패(타입)**: TypeScript `any` 남용 지양, `questions` 타입/데이터 일치 확인

---

## 부록 B — 추천 npm 스크립트

`package.json`(추가)

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.svelte",
    "format": "prettier --write .",
    "check": "svelte-check --tsconfig ./tsconfig.json"
  }
}
```

---

## 부록 C — 커밋 템플릿(초기 추천)

* `chore: init sveltekit (ts + eslint + prettier)`
* `feat: add base quiz flow (welcome/question/result)`
* `feat: progress bar + a11y improvements`
* `feat: integrate gemini API route and result rendering`
* `style: polish UI spacing/typography`
* `fix: handle empty answers and api errors`
* `docs: add privacy/about pages`
* `feat: add share buttons and SEO tags`

---

### ✅ 최종 목표 체크리스트

* [ ] 배포 URL에서 **미러 → AI 결과**가 문제없이 표시된다.
* [ ] 최소 1개 커뮤니티에 프로젝트를 소개했다.
* [ ] (승인 후) 광고/후원 버튼이 실제로 보이고 클릭된다.
* [ ] 첫 사용자 피드백을 3건 이상 수집했다.

필요하면 위 계획을 **“명령어만 모은 버전”** 또는 \*\*“깃허브 이슈 템플릿(체크박스)”\*\*으로도 뽑아드릴게요.
