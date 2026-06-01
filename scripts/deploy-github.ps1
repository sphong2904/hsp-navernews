# GitHub에 첫 푸시 (저장소를 먼저 GitHub에서 생성한 뒤 실행)
# Usage: .\scripts\deploy-github.ps1 -RemoteUrl "https://github.com/YOUR_USER/website_naver-news.git"

param(
  [Parameter(Mandatory = $true)]
  [string]$RemoteUrl
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (git remote get-url origin 2>$null) {
  git remote set-url origin $RemoteUrl
} else {
  git remote add origin $RemoteUrl
}

git push -u origin main
Write-Host "Done. Import this repo in Vercel and set NAVER_* / OPENROUTER_API_KEY env vars."
