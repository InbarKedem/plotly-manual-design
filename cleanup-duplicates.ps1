# cleanup-duplicates.ps1
# PowerShell script to remove duplicate/redundant files after refactoring

Write-Host "🧹 Cleaning up duplicate files after refactoring..." -ForegroundColor Green

# Create backup directory
Write-Host "📁 Creating backup directory..." -ForegroundColor Yellow
if (!(Test-Path -Path "backup-old-files")) {
    New-Item -ItemType Directory -Path "backup-old-files" | Out-Null
}

# Move files to backup instead of deleting (safer approach)
Write-Host "📦 Moving duplicate files to backup..." -ForegroundColor Yellow

# Duplicate plotters
$plotters = @(
    "src/GenericPlotter.tsx",
    "src/EnhancedGenericPlotter.tsx", 
    "src/GenericPlotterUtils.tsx"
)

foreach ($file in $plotters) {
    if (Test-Path -Path $file) {
        Move-Item -Path $file -Destination "backup-old-files/"
        Write-Host "✅ Moved $(Split-Path $file -Leaf)" -ForegroundColor Green
    }
}

# Duplicate demos
$demos = @(
    "src/GenericPlotterDemo2.tsx",
    "src/EnhancedPlotterDemo.tsx",
    "src/QuickDemo.tsx", 
    "src/WorkingEnhancedDemo.tsx",
    "src/SimpleEnhancedDemo.tsx"
)

foreach ($file in $demos) {
    if (Test-Path -Path $file) {
        Move-Item -Path $file -Destination "backup-old-files/"
        Write-Host "✅ Moved $(Split-Path $file -Leaf)" -ForegroundColor Green
    }
}

# Duplicate examples  
$examples = @(
    "src/GenericPlotterExamples.tsx",
    "src/EnhancedPlotterExamples.tsx"
)

foreach ($file in $examples) {
    if (Test-Path -Path $file) {
        Move-Item -Path $file -Destination "backup-old-files/"
        Write-Host "✅ Moved $(Split-Path $file -Leaf)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 Cleanup complete!" -ForegroundColor Green
Write-Host "📁 Old files backed up to: ./backup-old-files/" -ForegroundColor Cyan
Write-Host "🚀 You can now run: npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "If everything works correctly, you can safely delete ./backup-old-files/" -ForegroundColor Yellow
Write-Host "To restore files if needed: Move-Item ./backup-old-files/* src/" -ForegroundColor Yellow
