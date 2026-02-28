# YeyClub - GitHub'a commit ve push
# Bu scripti yeyclub klasorunde iken calistirin: .\deploy-git.ps1
$ErrorActionPreference = "Stop"
if (-not (Test-Path ".git")) { Write-Error "Bu script yeyclub proje klasorunde calistirilmalidir." }
git add -A
git status
git commit -m "chore: proje temizligi, .gitignore ve README Vercel notu, auth-guard duzeltmesi"
git push origin main
Write-Host "GitHub guncellendi."
