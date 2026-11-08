# CISS — Code Information Sharing Service

공개 코드 속 알고리즘의 **원 설계자(Original Author)**와 **파생 계보(Lineage)**를 근거와 함께 기록하고, 기여자에게 명예(Credit)를 돌려주는 서비스입니다. 제품 요구사항은 [PRD.md](./PRD.md)를 보세요.

## 구현 범위

| PRD | 기능 | 위치 |
|---|---|---|
| P0 | 알고리즘 페이지: 정의, 복수 기원, 서지 확인, 대표 구현체 | `/[locale]/algorithms/[slug]` |
| P0 | 계보 그래프 뷰: 상·하위 계보, 근거 등급별 선 모양 | `LineageGraph`, `/[locale]/graph` |
| P0 | 응용 횟수: 직접 파생, 전체 하위 계보, 구현체 | `src/lib/registry.ts` |
| P0 | 기여자 프로필과 명예 점수 | `/[locale]/authors/[slug]` |
| P0 | 검색: 이름, 4개 언어 현지명, 저자, 키워드, 분야 | `src/lib/search-core.ts`, `/api/search`, `SearchBox` |
| P1 | Repo Scan: GitHub, GitLab, Bitbucket | `/[locale]/scan`, `/api/scan`, `src/lib/scan` |
| P1 | Claim & Dispute: 공개 접수, 관리자 검수, 연락처 비공개 | `/[locale]/claims`, `/api/claims` |
| P1 | 분야별 명예 랭킹 | `/[locale]/rankings` |
| P1 | README 배지(SVG) | `/api/badge/{algorithm\|author}/{slug}`, 정적 배포는 `/badge/{kind}/{slug}.svg` |
| P2 | 공개 API, OpenAPI 3.1, JSON·CSV 데이터셋 덤프 | `/api/*`, `/api/openapi`, `/api/dataset` |
| P2 | npm·PyPI 패키지 → 저장소 해석 후 분석 | `src/lib/scan/sources.ts` |
| P2 | 게임·앱 코드 추적: Unity, Godot, Unreal, three.js, 셰이더, 그래픽스 알고리즘 22종 | `src/lib/scan/signatures.ts`, `graphics` 분야 |

다국어는 English, 한국어, 日本語, 简体中文을 지원합니다. URL은 `/en`, `/ko`, `/ja`, `/zh` 형식이며, 기본 언어는 영어입니다. 언어 메뉴에서 고른 언어는 쿠키로 기억하고, 고른 적이 없으면 브라우저 언어와 상관없이 영어로 엽니다. UI 문구 외에 알고리즘 정의, 근거 문장, 서지 메모까지 번역되어 있습니다.

## 시드 데이터 (Phase 0)

- 알고리즘 1,334개(12개 분야), 기여자 2,380명, 파생 관계 1,139개(검증 671, 추정 329, 관련 139), 구현체 763건
- 독립 발견은 복수 기원으로 기록합니다. 예: RSA는 Cocks(1973)와 Rivest·Shamir·Adleman(1977), BST는 Windley·Booth & Colin·Hibbard입니다.
- 모든 엣지는 유형 5종(변형, 최적화, 일반화, 조합, 이식) 중 하나와 근거, 신뢰도를 가집니다. 직접 근거가 없으면 `추정`, 파생 근거가 없으면 `관련`으로 표기하고 `관련`은 점수에 반영하지 않습니다(PRD §8).
- **출처 검증**: DOI와 arXiv ID 214개 전부를 Crossref, OpenAlex, arXiv와 대조했습니다(`src/data/source-checks.json`). 이 과정에서 잘못된 DOI 2건을 찾아 교정했습니다.
- **구현체 검증**: 구현체 85건 전부에 대해 GitHub HEAD에서 파일과 심볼이 실제로 존재하는지 확인했습니다.

## 명예 점수 v1

```
w(e)      = 1 (검증) | 0.5 × confidence (추정) | 0 (관련)
score(a)  = 10 + 5·Σ w(직접 파생) + 2·Σ best(v)·0.5^(depth−1) (간접 하위 계보) + 1·구현체 수
author(p) = Σ score(a) × 1/|기원| × 1/|해당 기원 저자|
```

이 산식은 PRD §11의 미결정 사항에 대한 작업 가설이며, `/about#score`에도 공개되어 있습니다.

## 실행

Node.js 22.13 이상이 필요합니다. 데이터 저장에 내장 `node:sqlite`를 쓰기 때문입니다.

```bash
npm ci
npm run dev          # http://localhost:3000
npm test             # vitest: 데이터 무결성, 점수, 검색, i18n, 스캔, Claim, 배지
npm run build && npm start
npm run build:static # GitHub Pages용 정적 사이트 → out/
npm run verify:sources   # Crossref·arXiv·GitHub와 출처 재대조 (네트워크 필요)
```

Docker로는 `docker build -t ciss . && docker run -p 3000:3000 -v ciss-data:/data ciss`로 실행합니다.

### 배포

#### GitHub Pages (정적 배포, 기본)

`main`에 푸시하면 `.github/workflows/pages.yml`이 테스트를 돌린 뒤 `npm run build:static`으로 정적 사이트를 만들어 Pages에 올립니다. 저장소 **Settings → Pages → Source**를 **GitHub Actions**로 한 번 지정해야 합니다.

GitHub Pages는 게시 사이트를 1GB로 제한합니다. 그래서 이렇게 내보냅니다.

- 알고리즘·기여자 상세 페이지는 RSC 페이로드(`index.txt`) 없이 내보내고, 그 페이지로의 이동은 일반 페이지 로드로 처리합니다(`src/lib/nav.ts`, `src/components/AppLink.tsx`).
- 기여자 페이지는 알고리즘 2개 이상이거나 점수 상위 600명만 미리 만듭니다(`src/lib/featured.ts`). 나머지는 공용 페이지 `/authors/view/?a=<slug>`가 `data/author-pages/<slug>.json`으로 그리고, 옛 주소는 404 페이지가 그쪽으로 넘겨 줍니다.

현재 결과물은 약 430MB입니다.

정적 배포판은 서버 없이 같은 기능을 이렇게 제공합니다.

| 기능 | 서버 모드 | 정적 배포(Pages) |
|---|---|---|
| 검색 | `/api/search` | 로케일별 색인 `data/search-{locale}.json`을 브라우저에서 검색(같은 점수 규칙, 테스트로 결과 일치 확인) |
| Repo Scan | `/api/scan` (6시간 캐시) | 같은 엔진을 브라우저에서 실행. GitHub 비인증 한도(시간당 60회)를 따릅니다 |
| Claim & Dispute | SQLite + 관리자 토큰 검수 | 내용이 채워진 GitHub 이슈로 접수. 열림=검토 대기, `accepted` 라벨로 닫힘=수용, 그 밖의 닫힘=반려. 목록은 GitHub API로 읽으므로 **공개 저장소**에서만 보입니다 |
| 공개 API·배지 | `/api/*` | 빌드 시 생성한 `data/*.json`, `data/csv/*.csv`, `badge/*.svg` |

로컬 확인: `CISS_STATIC=1 BASE_PATH=/CISS npm run build:static` 후 `out/`을 `/CISS` 경로로 서빙합니다. API 라우트는 `route.server.ts`, 미들웨어는 `middleware.server.ts`로 두어 서버 모드에서만 빌드됩니다.

#### 서버 모드 (Docker)

SQLite 파일이 유지되는 **영구 디스크가 있는 컨테이너 호스팅**에 배포합니다. Vercel 같은 서버리스 환경에서는 이의제기 데이터가 유지되지 않습니다.

| 플랫폼 | 설정 파일 | 해야 할 일 |
|---|---|---|
| Railway | `railway.json` (Dockerfile 빌드, `/api/health` 헬스체크) | 서비스에 볼륨을 `/data`로 연결하고 `CISS_ADMIN_TOKEN`을 설정합니다. 공개 도메인은 `RAILWAY_PUBLIC_DOMAIN`에서 자동으로 인식합니다. |
| Render | `render.yaml` (Blueprint, 1GB 디스크 `/data`, 관리자 토큰 자동 생성) | 대시보드에서 Blueprint로 저장소를 연결합니다. 공개 URL은 `RENDER_EXTERNAL_URL`에서 자동으로 인식합니다. |
| 기타 Docker | `Dockerfile` (HEALTHCHECK 포함) | 볼륨 `/data`를 연결하고 `NEXT_PUBLIC_SITE_URL`을 빌드 인자로 넘깁니다. | 환경변수는 `.env.example`을 참고하세요. 그중 `CISS_ADMIN_TOKEN`을 설정해야 검수 기능이 켜집니다.

## 구조

```
src/
  data/            시드 DB (algorithms/*.ts, authors, derivations, implementations, source-checks.json)
  i18n/            locales, UI 사전(messages/*.json), 콘텐츠 번역(content/*.json)
  lib/             registry(그래프·점수), search, claims(SQLite), scan(엔진), badge, rate-limit
  app/[locale]/    페이지 (SSG 약 15,000개)
  app/api/         공개 API
scripts/           verify-sources, export-catalog(번역 카탈로그), export-static(Pages용 데이터·배지)
tests/             vitest
```

## 알고리즘 등록·인증과 위키 편집

로그인과 신원은 모두 GitHub 계정으로 처리합니다. 서버에 계정 정보를 따로 두지 않습니다.

- **등록 신청**: 사이트의 `/register`에서 내용을 적으면 미리 채워진 GitHub 이슈 폼(`.github/ISSUE_TEMPLATE/register-algorithm.yml`)이 열립니다. 이슈를 연 계정이 등록자이고, 이슈를 연 시각이 등록 시각입니다.
- **자동 검사**: `registry-bot` 워크플로(`scripts/registry-bot.mts`)가 아래를 검사하고 결과를 댓글로 남깁니다. 결과에 따라 `ciss:checks-passed` 또는 `ciss:checks-failed` 라벨을 붙입니다.
  - 폼 형식
  - DOI·arXiv의 실재 여부 (Crossref·DataCite·arXiv)
  - 기준 코드를 커밋에 고정하고 파일의 SHA-256을 기록
  - 등록자가 저장소의 소유자, 기여자 또는 조직 공개 멤버인지
  - 파생 원천이 CISS에 있는 알고리즘인지
- **승인**: 관리자가 `ciss:approved` 라벨을 붙이면 봇이 다시 검사합니다. 통과하면 `CISS-연도-번호`를 매겨 `src/data/registrations.json`에 커밋하고, 인증서 댓글을 단 뒤 이슈를 닫고, Pages 배포를 실행합니다.
- **인증서**: `/registry`에 공개되고, 배지 `badge/registration/<id>.svg`가 발급됩니다. 인증서는 등록 사실과 시각, 제출된 코드·문서를 기록할 뿐 독창성이나 특허성을 판정하지 않습니다.
- **위키 편집**: 알고리즘·기여자 페이지의 "GitHub에서 편집"은 데이터 파일을 GitHub 편집기로 엽니다. 저장하면 풀 리퀘스트가 되고, CI(데이터 무결성 테스트)를 통과한 뒤 병합되면 반영됩니다. "편집 기록"은 그 파일의 커밋 이력입니다.

## 데이터 추가 방법

1. `src/data/algorithms/<field>.ts`에 `a(slug, name, summary, [o(authors, year, title, venue, id)])` 형식으로 추가합니다.
2. 파생 관계는 `src/data/derivations.ts`에 `d('from>to', type, status, confidence, evidenceKind, text, ref)` 형식으로 추가합니다.
3. 출처는 `ciss-bot/` 브랜치에 푸시하면 Actions(`Verify sources`)가 Crossref·arXiv와 대조해 `source-checks.json`을 갱신합니다. 로컬에서는 `npm run verify:sources`로 같은 검사를 할 수 있습니다.
4. `npm test`를 실행합니다. 시간 역행, 사이클, 고아 저자, 근거 누락, 미번역 키가 있으면 테스트가 실패합니다.
5. `npm run catalog`로 번역 카탈로그를 뽑고 `src/i18n/content/{en,ja,zh}.json`을 갱신합니다.

## 라이선스

- **코드**: [GNU AGPL v3.0](LICENSE) (`AGPL-3.0-only`). 수정한 코드로 서비스를 운영하면, 그 서비스 사용자에게 수정한 소스 코드를 제공해야 합니다.
- **데이터**: [CC BY 4.0](LICENSE-DATA). `src/data/`의 기록과 `src/i18n/content/`의 번역, 사이트가 내보내는 `/data/*`·`/badge/*`가 해당합니다. 자유롭게 써도 되지만 출처를 밝혀야 합니다. 예: `Data: CISS (Team PJ), https://team-pj-lab.github.io/CISS/, CC BY 4.0`

Copyright (c) 2026 Team PJ
