# Production deployment verification
# Usage: .\scripts\verify-production.ps1 -BaseUrl "https://your-app.vercel.app"

param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl
)

$ErrorActionPreference = "Stop"
$base = $BaseUrl.TrimEnd("/")

function Test-NewsEndpoint {
  param(
    [string]$Label,
    [string]$Uri
  )

  Write-Host "GET $Label"
  $news = Invoke-RestMethod -Uri $Uri
  if (-not $news.items -or $news.items.Count -lt 1) {
    throw "$Label : news list is empty."
  }
  Write-Host "OK: $($news.items.Count) items (category=$($news.category))"

  $secretPattern = "NAVER_CLIENT|OPENROUTER_API|client_secret|sk-or-"
  $newsJson = ($news | ConvertTo-Json -Depth 5)
  if ($newsJson -match $secretPattern) {
    throw "$Label : secret pattern detected in response."
  }
  return $news
}

$query = [char]0xC624 + [char]0xB298
Test-NewsEndpoint -Label "all" -Uri "$base/api/news?q=$([uri]::EscapeDataString($query))&category=all"
Test-NewsEndpoint -Label "economy" -Uri "$base/api/news?q=&category=economy"

Write-Host "GET invalid category (expect 400)"
try {
  Invoke-RestMethod -Uri "$base/api/news?category=invalid"
  throw "invalid category should return 400"
} catch {
  $status = $_.Exception.Response.StatusCode.value__
  if ($status -ne 400) {
    throw "invalid category: expected 400, got $status"
  }
  Write-Host "OK: invalid category returns 400"
}

Write-Host "POST $base/api/summarize"
$sumBody = '{"title":"verify","description":"Short description for production API check."}'
$sum = Invoke-RestMethod -Uri "$base/api/summarize" -Method POST -ContentType "application/json; charset=utf-8" -Body $sumBody
if (-not $sum.summary) {
  throw "Summarize response is empty."
}
Write-Host "OK: summarize ($($sum.model))"
Write-Host "All checks passed."
