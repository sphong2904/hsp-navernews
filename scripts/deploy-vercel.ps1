# Vercel CLI 배포 (최초 1회: npx vercel login)
# Usage: .\scripts\deploy-vercel.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Vercel 로그인이 필요하면: npx vercel login"
Write-Host "환경 변수는 Vercel 대시보드에서 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, OPENROUTER_API_KEY 설정"

npx vercel@latest --prod
