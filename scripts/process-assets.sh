#!/usr/bin/env bash
set -euo pipefail

source_dir="${1:-../upload}"
brand_dir="public/assets/brand"
portfolio_dir="public/assets/portfolio"
web_dir="$portfolio_dir/web"
edited_dir="$portfolio_dir/edited"

mkdir -p "$brand_dir" "$web_dir" "$edited_dir" "design-review"

# The brand mark is preserved as supplied: no redraw, tracing, or generative edit.
convert "$source_dir/file_0000000050f481f48aa6b39cdfe40634.png" \
  -auto-orient -colorspace sRGB -strip \
  -contrast-stretch 0.08%x0.08% -unsharp 0x0.55+0.55+0.006 \
  "$brand_dir/jamila-zahedian-logo.png"

convert "$brand_dir/jamila-zahedian-logo.png" \
  -resize '760x760>' -quality 90 "$brand_dir/jamila-zahedian-logo.webp"

process_photo() {
  local input="$1"
  local slug="$2"
  local crop="${3:-}"
  local crop_args=()

  if [[ -n "$crop" ]]; then
    crop_args=(-crop "$crop" +repage)
  fi

  convert "$source_dir/$input" \
    -auto-orient "${crop_args[@]}" -colorspace sRGB -strip \
    -contrast-stretch 0.12%x0.12% -modulate 100,97,100 \
    -unsharp 0x0.65+0.60+0.008 \
    -sampling-factor 4:4:4 -interlace Plane -quality 94 \
    "$edited_dir/$slug.jpg"

  convert "$edited_dir/$slug.jpg" \
    -resize '1440x1920>' -sampling-factor 4:2:0 -interlace Plane -quality 86 \
    "$web_dir/$slug.webp"

  identify "$edited_dir/$slug.jpg" "$web_dir/$slug.webp" >/dev/null
}

process_photo "file_00000000d60481f48dab0f1c46337ad7.png" "keratin-specialist"
process_photo "file_00000000323c8243804a2a7154cfcf42.png" "jamila-color-specialist"
process_photo "IMG_6666.PNG" "blonde-bob-duo"
process_photo "IMG_6664.PNG" "long-ash-blonde"
process_photo "IMG_6692.PNG" "pearl-blonde-waves"
process_photo "IMG_6752.JPEG" "silver-face-frame" "944x1682+0+183"
process_photo "IMG_6667.PNG" "rooted-blonde-bob"
process_photo "IMG_6684.PNG" "platinum-sleek"
process_photo "IMG_6730.PNG" "jamila-with-client"
process_photo "IMG_6734.JPEG" "jamila-client-faceframe" "740x1352+0+119"

# Two clean portfolio crops are taken from the supplied two-frame collage.
convert "$source_dir/IMG_6666.PNG" -auto-orient -crop 1088x722+0+0 +repage \
  -colorspace sRGB -strip -contrast-stretch 0.12%x0.12% -modulate 100,97,100 \
  -unsharp 0x0.65+0.60+0.008 -sampling-factor 4:4:4 -interlace Plane -quality 94 \
  "$edited_dir/blonde-bob-close.jpg"

convert "$source_dir/IMG_6666.PNG" -auto-orient -crop 1088x723+0+722 +repage \
  -colorspace sRGB -strip -contrast-stretch 0.12%x0.12% -modulate 100,97,100 \
  -unsharp 0x0.65+0.60+0.008 -sampling-factor 4:4:4 -interlace Plane -quality 94 \
  "$edited_dir/blonde-bob-soft.jpg"

for crop in blonde-bob-close blonde-bob-soft; do
  convert "$edited_dir/$crop.jpg" -resize '1440x1920>' \
    -sampling-factor 4:2:0 -interlace Plane -quality 86 "$web_dir/$crop.webp"
done

find "$brand_dir" "$edited_dir" "$web_dir" -type f -size 0 -print -quit | grep -q . && {
  echo "Asset processing failed: an empty output file was created." >&2
  exit 1
}

montage \
  "$brand_dir/jamila-zahedian-logo.png" \
  "$edited_dir/keratin-specialist.jpg" \
  "$edited_dir/jamila-color-specialist.jpg" \
  "$edited_dir/blonde-bob-close.jpg" \
  "$edited_dir/blonde-bob-soft.jpg" \
  "$edited_dir/long-ash-blonde.jpg" \
  "$edited_dir/pearl-blonde-waves.jpg" \
  "$edited_dir/silver-face-frame.jpg" \
  "$edited_dir/rooted-blonde-bob.jpg" \
  "$edited_dir/platinum-sleek.jpg" \
  "$edited_dir/jamila-with-client.jpg" \
  "$edited_dir/jamila-client-faceframe.jpg" \
  -thumbnail '300x380>' -background '#17130f' -fill '#f4e6c8' -stroke none \
  -pointsize 17 -label '%t' -tile 4x -geometry '+18+32' \
  "design-review/edited-contact-sheet.jpg"
