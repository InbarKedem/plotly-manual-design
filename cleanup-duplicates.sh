#!/bin/bash
# cleanup-duplicates.sh
# Script to remove duplicate/redundant files after refactoring

echo "🧹 Cleaning up duplicate files after refactoring..."

# Create backup directory
echo "📁 Creating backup directory..."
mkdir -p ./backup-old-files

# Move files to backup instead of deleting (safer approach)
echo "📦 Moving duplicate files to backup..."

# Duplicate plotters
if [ -f "src/GenericPlotter.tsx" ]; then
    mv src/GenericPlotter.tsx ./backup-old-files/
    echo "✅ Moved GenericPlotter.tsx"
fi

if [ -f "src/EnhancedGenericPlotter.tsx" ]; then
    mv src/EnhancedGenericPlotter.tsx ./backup-old-files/
    echo "✅ Moved EnhancedGenericPlotter.tsx"  
fi

if [ -f "src/GenericPlotterUtils.tsx" ]; then
    mv src/GenericPlotterUtils.tsx ./backup-old-files/
    echo "✅ Moved GenericPlotterUtils.tsx"
fi

# Duplicate demos
demo_files=(
    "GenericPlotterDemo2.tsx"
    "EnhancedPlotterDemo.tsx" 
    "QuickDemo.tsx"
    "WorkingEnhancedDemo.tsx"
    "SimpleEnhancedDemo.tsx"
)

for file in "${demo_files[@]}"; do
    if [ -f "src/$file" ]; then
        mv "src/$file" ./backup-old-files/
        echo "✅ Moved $file"
    fi
done

# Duplicate examples
example_files=(
    "GenericPlotterExamples.tsx"
    "EnhancedPlotterExamples.tsx"
)

for file in "${example_files[@]}"; do
    if [ -f "src/$file" ]; then
        mv "src/$file" ./backup-old-files/
        echo "✅ Moved $file"
    fi
done

echo ""
echo "🎉 Cleanup complete!"
echo "📁 Old files backed up to: ./backup-old-files/"
echo "🚀 You can now run: npm run dev"
echo ""
echo "If everything works correctly, you can safely delete ./backup-old-files/"
echo "To restore files if needed: mv ./backup-old-files/* src/"
