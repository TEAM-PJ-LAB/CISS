# CISS — Product Requirements Document (제품 요구사항 문서)

> Code Information Sharing Service
> 작성일: 2026-10-18 · 작성자: 정우진 · 상태: Draft v0.1

---

## 1. 한 줄 정의

- 공개 코드 저장소 속 알고리즘의 **원 설계자(Original Author)**와 **파생 계보(Lineage)**를 추적해 기여자에게 명예(Credit)를 부여하는 서비스
- 겉: 개발자 명예·랭킹 서비스 / 속: 초거대 알고리즘 계보 DB(Algorithm Lineage Database) 구축

## 2. 배경 및 문제 정의

- AI 코드 생성(AI Code Generation) 보편화 → 누구나 코드 생산 가능, 개별 코드의 희소성 하락
- 복사·리팩터링·재조합 과정에서 원작자 정보 소실 → 출처(Provenance) 추적 불가
- 게임·앱까지 역공학(Reverse Engineering) 후 재조합되는 환경 → "누가 처음 만들었는가"에 대한 기록 부재
- 기존 지표(GitHub Star, Fork)는 저장소 단위 인기도일 뿐, 알고리즘 단위 기여도를 반영하지 못함
- 결론: "코드는 흔해졌지만, 아이디어의 기원은 여전히 가치 있음" → 기원을 기록하는 인프라 필요

## 3. 목표 / 비목표

### 목표 (Goals)
- 알고리즘 단위로 원 설계자·최초 출처(논문, 커밋, 문서) 기록
- 알고리즘 간 파생 관계를 그래프(Graph)로 구조화
- 알고리즘별 응용(파생·구현) 횟수 집계 → 기여자 명예 지표화
- 축적된 계보 데이터를 장기적으로 API·데이터셋 자산화

### 비목표 (Non-Goals, v1 기준)
- 표절 판정·법적 분쟁 판단 (판정 서비스 아님, 기록 서비스임)
- 라이선스 위반 자동 신고
- 비공개 저장소 분석

## 4. 대상 사용자

| 사용자 | 니즈 | 제공 가치 |
|---|---|---|
| 오픈소스 개발자 | 내 기여 인정받기 | 기여자 프로필, 파생 횟수, 명예 랭킹 |
| 학생·연구자 | 알고리즘의 기원·변형 이해 | 계보 그래프 탐색, 원 논문 연결 |
| 기업·실무자 | 사용 코드의 출처·라이선스 확인 | 저장소 분석 리포트 |
| AI·데이터 연구자 (장기) | 출처가 정리된 코드 데이터 | 계보 DB API·데이터셋 |

## 5. 핵심 개념 (Domain Model)

- **Algorithm (알고리즘)**: 추상적 아이디어 단위 — 예: Quicksort, Dijkstra, Transformer Attention
- **Origin (기원)**: 알고리즘 최초 출처 — 논문 DOI, 최초 커밋, 공개 문서, 발표 일자
- **Author (설계자)**: 기원에 연결된 사람·조직
- **Implementation (구현체)**: 실제 코드 조각 — 저장소·파일·함수·커밋 해시 단위
- **Derivation (파생 관계)**: Algorithm → Algorithm 간 엣지
  - 유형: 변형(Variant), 최적화(Optimization), 일반화(Generalization), 조합(Composition), 이식(Port)
  - 근거(Evidence) 및 신뢰도(Confidence) 필수 보유
- **Credit Score (명예 점수)**: 직접 파생 수 + 간접(하위 계보) 파생 수 + 구현체 수 기반 산출

```
Author ─┬─ designs ─▶ Algorithm ──derives(type, evidence, confidence)──▶ Algorithm
        │                 │
        └─ commits ─▶ Implementation ── implements ─┘
```

## 6. 기능 요구사항

### 6.1 MVP (P0)
- **알고리즘 페이지**: 이름, 정의, 원 설계자, 최초 출처, 발표 연도, 대표 구현체
- **계보 그래프 뷰 (Lineage Graph View)**: 상위 원조·하위 파생 알고리즘 시각화
- **응용 횟수 집계**: 직접 파생 / 전체 하위 계보 / 탐지된 구현체 수
- **기여자 프로필**: 설계·파생시킨 알고리즘 목록, 명예 점수
- **검색**: 알고리즘명, 저자명, 키워드

### 6.2 P1
- **저장소 분석 (Repo Scan)**: GitHub URL 입력 → 내부에서 사용된 알고리즘 탐지 → 원작자 목록 리포트
- **기여 주장·이의제기 (Claim & Dispute)**: 본인 기여 등록, 잘못된 귀속 정정 요청, 근거 첨부
- **명예 랭킹**: 분야별(정렬, 그래프, ML 등) 랭킹
- **배지 (Badge)**: README에 삽입 가능한 "CISS Credited" 배지

### 6.3 P2
- 공개 API (Public API)·데이터셋 덤프
- GitLab, Bitbucket, 패키지 레지스트리(PyPI, npm) 확장
- 게임·앱 코드의 알고리즘 재사용 추적

## 7. 데이터 파이프라인 (초안)

1. **수집 (Ingestion)**: GitHub API, GH Archive, Software Heritage, 학술 메타데이터(arXiv, Semantic Scholar, OpenAlex)
2. **정규화 (Normalization)**: 언어별 AST(Abstract Syntax Tree, 추상 구문 트리) 파싱, 함수 단위 분할
3. **알고리즘 식별 (Identification)**: 코드 임베딩(Code Embedding) 유사도 + LLM 분류 → 알고리즘 노드 매칭
4. **계보 추론 (Lineage Inference)**: 시간 순서, 인용 관계, 커밋 히스토리, 코드 클론 탐지(Clone Detection) 결합
5. **검증 (Verification)**: 신뢰도 낮은 엣지는 커뮤니티·관리자 검수 큐로 이동
6. **서빙 (Serving)**: 그래프 DB(Graph Database) 저장, 웹·API 제공

## 8. 핵심 리스크 및 대응

| 리스크 | 내용 | 대응 방향 |
|---|---|---|
| 오귀속 (Misattribution) | 명예 서비스에서 잘못된 원작자 표기는 신뢰 붕괴로 직결 | 모든 엣지에 근거·신뢰도 표기, 검증 전 "추정" 라벨 |
| 독립 발견 (Independent Discovery) | 같은 알고리즘을 여러 명이 별도 고안한 경우 | 복수 기원(Multiple Origins) 허용 |
| 유사도 ≠ 파생 | 코드가 닮았다고 파생이라 단정 불가 | 시간·인용·커밋 근거 없는 유사도는 "관련(Related)"으로만 표기 |
| 데이터 수집 정책 | 플랫폼 ToS·Rate Limit, 라이선스 | 공식 API·공개 아카이브 우선, 출처 명시 |
| 개인정보 | 커밋 이메일 등 개인 식별 정보 | 공개 프로필 정보만 사용, 본인 요청 시 비공개 처리 |
| 점수 조작 (Gaming) | 자기 파생 레포 대량 생성 | 이상 탐지, 저장소 신뢰도 가중치 |
| 콜드 스타트 (Cold Start) | 초기 데이터 부족 | 교과서급 알고리즘 수동 큐레이션으로 시드 DB 구축 |

## 9. 성공 지표 (Success Metrics)

- 등록 알고리즘 노드 수, 검증된 파생 엣지 수
- 검증 엣지 비율 (전체 엣지 중 근거 확인 비율)
- 이의제기 후 정정률 / 오귀속 신고율
- 월간 활성 사용자(MAU), 기여 주장 건수, 배지 삽입 저장소 수

## 10. 단계별 로드맵 (Roadmap)

- **Phase 0 — 시드 DB**: 고전 알고리즘(정렬·탐색·그래프·DP 등) 100~300개 수동 큐레이션, 계보 그래프 프로토타입
- **Phase 1 — MVP 웹**: 알고리즘 페이지·그래프 뷰·검색·기여자 프로필
- **Phase 2 — 자동 탐지**: Repo Scan, 코드 → 알고리즘 매칭 파이프라인
- **Phase 3 — 커뮤니티**: Claim & Dispute, 랭킹, 배지
- **Phase 4 — 자산화**: 공개 API, 데이터셋, B2B 출처 확인 리포트

## 11. 미결정 사항 (Open Questions)

- 알고리즘 "단위"의 경계 정의 기준 (어디까지가 같은 알고리즘이고 어디부터 파생인가)
- 명예 점수 산식 (간접 파생 가중치, 시간 감쇠 여부)
- 기술 스택 (그래프 DB 선정, 임베딩 모델, 웹 프레임워크)
- 수익 모델 (B2B 리포트, API 과금, 기업 후원 등)
- 서비스 명칭 내 "Sharing"과 실제 기능(귀속·계보) 간 메시지 정합성
