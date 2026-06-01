# 프로덕션 배포 검증
# Usage: .\scripts\verify-production.ps1 -BaseUrl "https://your-app.vercel.app"

param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl
)

$ErrorActionPreference = "Stop"
$base = $BaseUrl.TrimEnd("/")

$query = [char]0xC624 + [char]0xB298  # 오늘
Write-Host "GET $base/api/news"
$news = Invoke-RestMethod -Uri "$base/api/news?q=$([uri]::EscapeDataString($query))"
if (-not $news.items -or $news.items.Count -lt 1) {
  throw "News list is empty."
}
Write-Host "OK: $($news.items.Count) items"

$secretPattern = "NAVER_CLIENT|OPENROUTER_API|client_secret|sk-or-"
$newsJson = ($news | ConvertTo-Json -Depth 5)
if ($newsJson -match $secretPattern) {
  throw "Secret pattern detected in news API response."
}
Write-Host "OK: no secret patterns in news response"

Write-Host "POST $base/api/summarize"
$sumBody = '{"title":"verify","description":"Short description for production API check."}'
$sum = Invoke-RestMethod -Uri "$base/api/summarize" -Method POST -ContentType "application/json; charset=utf-8" -Body $sumBody
if (-not $sum.summary) {
  throw "Summarize response is empty."
}
Write-Host "OK: summarize ($($sum.model))"
Write-Host "All checks passed."
