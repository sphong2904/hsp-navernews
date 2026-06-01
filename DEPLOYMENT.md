# 배포 체크리스트 (Go / No-Go)

마지막 점검: 2026-06-01

## Go (완료)

| 항목 | 결과 |
|------|------|
| `npm run build` | 통과 |
| `npm run lint` | 통과 |
| `.env.local` Git 미포함 | 확인 |
| API 키 클라이언트 미노출 | `NEXT_PUBLIC_` 비밀키 없음 |
| 로컬 `/api/news` 100건 | 통과 |
| 로컬 `category=economy` | 통과 |
| 잘못된 category → 400 | 통과 |
| 로컬 `/api/summarize` | 통과 |
| GitHub push `main` | [078b00b](https://github.com/sphong2904/hsp-navernews) |

## Vercel (사용자 작업 필요)

CLI 로그인이 필요합니다 (`npx vercel login`).

1. [vercel.com](https://vercel.com) → Import `sphong2904/hsp-navernews`
2. Environment Variables (Production / Preview / Development 모두):
   - `NAVER_CLIENT_ID`
   - `NAVER_CLIENT_SECRET`
   - `OPENROUTER_API_KEY`
3. Deploy 후 검증:

```powershell
.\scripts\verify-production.ps1 -BaseUrl "https://YOUR_APP.vercel.app"
```

4. (선택) `NEXT_PUBLIC_SITE_URL` = 프로덕션 URL

## No-Go 조건 (하나라도 해당 시 배포 보류)

- API 키가 GitHub에 커밋됨
- 프로덕션 `/api/news` 500 (env 미설정)
- 카테고리 검색이 전부 빈 목록
