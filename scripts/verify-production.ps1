# 프로덕션 배포 검증
# Usage: .\scripts\verify-production.ps1 -BaseUrl "https://your-app.vercel.app"

param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl
)

$ErrorActionPreference = "Stop"
$base = $BaseUrl.TrimEnd("/")

Write-Host "GET $base/api/news?q=오늘"
$news = Invoke-RestMethod -Uri "$base/api/news?q=$([uri]::EscapeDataString('오늘'))"
if (-not $news.items -or $news.items.Count -lt 1) {
  throw "뉴스 목록이 비어 있습니다."
}
Write-Host "OK: $($news.items.Count) items"

$secretPattern = "NAVER_CLIENT|OPENROUTER_API|client_secret|sk-or-"
$newsJson = ($news | ConvertTo-Json -Depth 5)
if ($newsJson -match $secretPattern) {
  throw "뉴스 API 응답에 비밀 값 패턴이 감지되었습니다."
}
Write-Host "OK: API 키 패턴 없음 (news)"

Write-Host "POST $base/api/summarize"
$sum = Invoke-RestMethod -Uri "$base/api/summarize" -Method POST -ContentType "application/json" -Body (@{
  title = "검증"
  description = "프로덕션 API 동작 확인용 짧은 요약문입니다."
} | ConvertTo-Json)
if (-not $sum.summary) {
  throw "요약 응답이 비어 있습니다."
}
Write-Host "OK: summarize ($($sum.model))"
Write-Host "All checks passed."
