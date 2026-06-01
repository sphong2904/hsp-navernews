# 네이버 뉴스레터 (Daily Brief)

네이버 검색 API로 최신 뉴스 50건을 조회하고, OpenRouter AI로 기사를 요약해 보여주는 Next.js 뉴스레터 웹앱입니다.

## 기능

- 기본 검색어 `오늘`로 최신 뉴스 50건 표시 (날짜순)
- 키워드 검색
- 기사별 AI 요약 (OpenRouter 무료 모델)
- 반응형 그리드 레이아웃 (모바일 1열 / 태블릿 2열 / 데스크톱 3열)

## 기술 스택

- Next.js 16 (App Router)
- TypeScript, Tailwind CSS v4
- 네이버 검색 API (뉴스)
- OpenRouter API (AI 요약)

## 로컬 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수

[`.env.example`](.env.example)를 참고해 프로젝트 루트에 `.env.local`을 만듭니다.

```env
NAVER_CLIENT_ID=your_client_id_here
NAVER_CLIENT_SECRET=your_client_secret_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

- **네이버**: [네이버 개발자 센터](https://developers.naver.com/)에서 애플리케이션 등록 후 검색 API 사용 설정
- **OpenRouter**: [OpenRouter](https://openrouter.ai/)에서 API 키 발급

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속 (포트가 사용 중이면 3001 등으로 안내됨)

### 4. 빌드

```bash
npm run build
npm run start
```

## Vercel 배포

### 1. GitHub에 푸시

GitHub에서 **빈 저장소**를 만든 뒤 (README/.gitignore 추가하지 않음):

```powershell
.\scripts\deploy-github.ps1 -RemoteUrl "https://github.com/YOUR_USER/website_naver-news.git"
```

또는 수동:

```bash
git remote add origin https://github.com/YOUR_USER/website_naver-news.git
git push -u origin main
```

이후 Vercel에서 해당 저장소를 Import합니다.

### 2. Vercel 환경 변수 (필수)

Vercel 프로젝트 → **Settings → Environment Variables**에 아래 변수를 Production / Preview / Development 모두 설정합니다.

| 변수명 | 설명 |
|--------|------|
| `NAVER_CLIENT_ID` | 네이버 애플리케이션 Client ID |
| `NAVER_CLIENT_SECRET` | 네이버 애플리케이션 Client Secret |
| `OPENROUTER_API_KEY` | OpenRouter API 키 |

선택:

| 변수명 | 설명 |
|--------|------|
| `NEXT_PUBLIC_SITE_URL` | 커스텀 도메인 URL (예: `https://your-domain.vercel.app`) |

Vercel은 `.env.local` 파일을 읽지 않습니다. 반드시 대시보드에서 설정하세요.

### 3. 배포 설정

- **Framework Preset**: Next.js (자동 감지)
- **Build Command**: `npm run build`
- **Install Command**: `npm install`

### 4. CLI로 배포 (선택)

```powershell
npx vercel login
.\scripts\deploy-vercel.ps1
```

### 5. 배포 후 확인

- 메인 페이지에서 뉴스 목록 로드
- 검색 및 AI 요약 동작
- 브라우저 개발자 도구 Network 탭에 API 키가 노출되지 않는지 확인 (내부 `/api/news`, `/api/summarize`만 호출)

자동 검증:

```powershell
.\scripts\verify-production.ps1 -BaseUrl "https://your-app.vercel.app"
```

## API 라우트

| 경로 | 설명 |
|------|------|
| `GET /api/news?q=` | 네이버 뉴스 검색 프록시 (기본 `q=오늘`, `display=50`) |
| `POST /api/summarize` | OpenRouter AI 요약 (`{ title, description }`) |

## 보안

- API 키는 서버 환경 변수에서만 사용합니다 (`NEXT_PUBLIC_` 접두사 사용 금지).
- `.env.local`, `OpenRouter.env`는 Git에 커밋하지 마세요 (`.gitignore`에 포함됨).

## 라이선스

Private project.
