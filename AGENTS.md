# Repository Guidelines

## 프로젝트 구조 및 모듈 구성
- `src/routes`에는 페이지 단위 SvelteKit 엔드포인트가 있습니다. 관련 페이지는 폴더로 묶고 서버 파일은 `+page` 모듈과 같은 위치에 두세요.
- UI 컴포넌트는 PascalCase `.svelte` 파일로 `src/lib/components`에 배치하며, 공용 헬퍼는 `src/lib/index.ts`를 통해 내보내 깔끔한 `$lib` 임포트를 유지합니다.
- 공유 데이터나 미디어는 `src/lib/assets`에 보관하고, Vite가 그대로 제공해야 하는 정적 파일은 `static/`에 넣습니다.
- 기획 문서는 `docs/`에, 비밀 키나 API 설정 초안은 Git 추적에서 제외된 `private/`에 유지합니다.

## 빌드·테스트·개발 명령어
- 최초 설정 또는 패키지 변경 시 `npm install`로 의존성을 설치하세요.
- `npm run dev`는 http://localhost:5173 에서 HMR이 적용된 Vite 개발 서버를 시작합니다.
- `npm run build`는 배포용 SvelteKit 번들을 생성하며, `npm run preview`로 결과물을 로컬에서 점검하세요.
- `npm run check`(또는 `npm run check:watch`)는 `svelte-kit sync`와 `svelte-check`를 실행해 타입 및 컴포넌트 진단을 제공합니다.

## 코딩 스타일 및 네이밍 규칙
- 스크립트는 4칸 들여쓰기, 마크업은 2칸을 사용하고 문자열에는 작은따옴표를 적용합니다. 여러 줄 리터럴에는 후행 쉼표를 유지하세요.
- 상태는 `$state` 헬퍼와 불변 업데이트를 우선하며, 관련 로직은 `Quiz.svelte`처럼 소비 지점 근처에 배치합니다.
- 새 Svelte 파일은 PascalCase, 헬퍼 모듈은 camelCase, 상수는 SCREAMING_SNAKE_CASE로 이름 짓습니다.
- 깊은 상대 경로 대신 `$lib` 배럴에서 내보낸 모듈을 임포트해 구조를 단순화하세요.

## 테스트 지침
- 푸시 전마다 `npm run check`를 실행하고 결과를 PR에 기록합니다.
- 향후 단위·통합 테스트는 기능 파일 옆에 `*.spec.ts` 접미사로 배치하고, 필요한 경우 Vitest 또는 Playwright 설정을 추가하세요.
- 하드코딩 대신 `src/lib/assets`에 픽스처를 두어 테스트와 컴포넌트가 재사용하도록 합니다.
- 자동화가 부족할 때는 수동 QA 절차(브라우저, 경로, 스크린샷)를 PR 본문에 남기세요.

## 커밋 및 PR 가이드라인
- 기존 히스토리처럼 간결하고 명령형인 제목을 사용하세요. 예: `퀴즈 로직 구현`, `Add result screen copy`.
- 기능, 서식, 의존성 변경은 각각 별도 커밋으로 분리합니다.
- PR에는 변경 요약, 검증 절차(`npm run check`, 수동 QA 등), 관련 이슈나 문서를 포함합니다.
- `src/routes`나 `src/lib/components`에 영향을 주는 UI 변경은 스크린샷/GIF를 첨부하고, 해당 도메인을 잘 아는 리뷰어에게 요청하세요.

## 보안 및 환경 설정 팁
- 환경 변수는 `.env`(gitignore 적용)나 `private/`에 보관하고, Svelte 컴포넌트에는 키를 직접 작성하지 마세요.
- 설정이 바뀌면 README 또는 PR 설명에 필요한 환경 변수를 정리해 팀이 동일한 환경을 재현할 수 있도록 합니다.
