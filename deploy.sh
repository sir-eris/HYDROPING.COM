#!/bin/bash

# --- 1. Commit and push to Git ---
git add .
git commit -m "Auto deploy $(date +'%Y-%m-%d %H:%M:%S')"
git push origin main

# --- 2. Build and export Next.js ---
npm install
npm run build

# --- 3. Sync `out/` folder to S3 ---
# aws s3 sync out/ s3://hydroping.com/ --delete --acl public-read

echo "Deployment complete! 🚀"
