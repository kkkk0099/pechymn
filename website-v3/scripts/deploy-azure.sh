#!/usr/bin/env bash
set -euo pipefail

# Azure Blob static website deploy draft for dist.
# Required env vars:
#   AZURE_STORAGE_ACCOUNT
#   AZURE_STORAGE_KEY
# Optional env vars:
#   DEPLOY_PREFIX (default: empty for root '/'). Example: new_hymn

if [[ -z "${AZURE_STORAGE_ACCOUNT:-}" || -z "${AZURE_STORAGE_KEY:-}" ]]; then
  echo "Missing AZURE_STORAGE_ACCOUNT or AZURE_STORAGE_KEY"
  exit 1
fi

DEPLOY_PREFIX="${DEPLOY_PREFIX:-}"

if [[ -n "$DEPLOY_PREFIX" ]]; then
  HTML_PATTERN="$DEPLOY_PREFIX/*.html"
  SW_PATTERN="$DEPLOY_PREFIX/sw.js"
  MANIFEST_PATTERN="$DEPLOY_PREFIX/manifest.webmanifest"
  LANG_CONVERT_PATTERN="$DEPLOY_PREFIX/langConvert.js"
  ASTRO_PATTERN="$DEPLOY_PREFIX/_astro/*"
  ASSETS_PATTERN="$DEPLOY_PREFIX/assets/*"
  ROOT_JSON_PATTERN="$DEPLOY_PREFIX/*.json"
  DATA_JSON_PATTERN="$DEPLOY_PREFIX/data/*.json"
  DEPLOY_TARGET_DISPLAY="\$web/$DEPLOY_PREFIX"
else
  HTML_PATTERN="*.html"
  SW_PATTERN="sw.js"
  MANIFEST_PATTERN="manifest.webmanifest"
  LANG_CONVERT_PATTERN="langConvert.js"
  ASTRO_PATTERN="_astro/*"
  ASSETS_PATTERN="assets/*"
  ROOT_JSON_PATTERN="*.json"
  DATA_JSON_PATTERN="data/*.json"
  DEPLOY_TARGET_DISPLAY="\$web/"
fi

if [[ ! -d "dist" ]]; then
  echo "Missing dist directory. Run npm run build first."
  exit 1
fi

echo "Uploading static site files to \$web container..."
az storage blob upload-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --destination-path "$DEPLOY_PREFIX" \
  --source dist \
  --overwrite true

echo "Re-uploading critical entry files last to reduce mixed-version windows..."
az storage blob upload-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --destination-path "$DEPLOY_PREFIX" \
  --source dist \
  --pattern "*.html" \
  --overwrite true

az storage blob upload-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --destination-path "$DEPLOY_PREFIX" \
  --source dist \
  --pattern "sw.js" \
  --overwrite true

az storage blob upload-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --destination-path "$DEPLOY_PREFIX" \
  --source dist \
  --pattern "manifest.webmanifest" \
  --overwrite true

az storage blob upload-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --destination-path "$DEPLOY_PREFIX" \
  --source dist \
  --pattern "langConvert.js" \
  --overwrite true

echo "Applying cache-control defaults..."
az storage blob update-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --pattern "$HTML_PATTERN" \
  --content-cache-control "no-store, max-age=0, must-revalidate"

az storage blob update-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --pattern "$SW_PATTERN" \
  --content-cache-control "no-cache, max-age=0, must-revalidate"

az storage blob update-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --pattern "$MANIFEST_PATTERN" \
  --content-cache-control "no-cache, max-age=0, must-revalidate"

az storage blob update-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --pattern "$LANG_CONVERT_PATTERN" \
  --content-cache-control "no-cache, max-age=0, must-revalidate"

az storage blob update-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --pattern "$ASTRO_PATTERN" \
  --content-cache-control "public,max-age=31536000,immutable"

az storage blob update-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --pattern "$ASSETS_PATTERN" \
  --content-cache-control "public,max-age=31536000,immutable"

az storage blob update-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --pattern "$ROOT_JSON_PATTERN" \
  --content-cache-control "public,max-age=300,stale-while-revalidate=86400"

az storage blob update-batch \
  --account-name "$AZURE_STORAGE_ACCOUNT" \
  --account-key "$AZURE_STORAGE_KEY" \
  --destination '\$web' \
  --pattern "$DATA_JSON_PATTERN" \
  --content-cache-control "public,max-age=300,stale-while-revalidate=86400"

echo "Deploy complete: $DEPLOY_TARGET_DISPLAY"
