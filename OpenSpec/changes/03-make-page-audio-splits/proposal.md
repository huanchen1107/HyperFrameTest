# Proposal – Make Page Audio Splits & Slide Packages

## User Requirement
The user wants to process the video source (`A2Z-original.mp4`) and its Chinese subtitle file (`A2Zsrt.srt`) to produce **per‑page assets** organized as follows:

1. **Audio files** named `audio‑N.mp3` where `N` is a 1‑based page index.
2. **Slide image** for each page captured at the beginning of the slide transition.
3. **Folder layout**: each page has its own folder `slide‑N/` that contains:
   - `audio‑N.mp3`
   - `slide‑N.png`
   - a tiny helper script (`process_page.sh`) that can re‑run the extraction for that page.
4. **Slide‑1** must start at **00:01** (1 second) into the video.
5. **Silent subtitle entries** (empty text) must be **skipped** – no audio file or folder created for them.
6. The source subtitle file is `A2Zsrt.srt` (Chinese). No additional language processing is required.
7. The slide detection should be based on video‑scene transitions (the script will use `ffmpeg` scene‑change detection) to locate the start of each new page.

## Design Overview
- **Audio splitting**: Parse `A2Zsrt.srt` to extract start/end timestamps for each subtitle block. For each non‑empty subtitle, cut the corresponding segment from `A2Z-original-audio.mp3` using `ffmpeg -c copy` (lossless).
- **Slide detection**: Use `ffmpeg` with a scene‑change filter (`gt(scene,0.4)`) to emit timestamps of slide transitions. Override the first timestamp to 1 second to satisfy the slide‑1 requirement.
- **Page packaging**: For each page, create `slide‑N/` and place the audio file, the PNG image extracted at the slide start, and a `process_page.sh` that simply re‑runs the ffmpeg commands for that page.
- **Skipping silent subtitles**: While reading the SRT, capture the subtitle text. If the trimmed text is empty, the entry is ignored and no page folder is generated.
- **Outputs**: All generated folders are placed under `user/assets/slide‑pages/` (or `slide-pages/`), keeping the project workspace tidy.

## Algorithm Steps
1. **Parse SRT** → CSV `start\tend\ttext`.
2. **Detect slides** → list of `slide_start` timestamps (seconds).
3. Force first `slide_start` to `1` (00:01).
4. `paste` slide timestamps with subtitle CSV ⇒ mapping.
5. Iterate over mapping:
   - If `text` is empty → `continue`.
   - Create `slide‑N/`.
   - `ffmpeg -ss <start> -to <end> -i A2Z-original-audio.mp3 -c copy slide‑N/audio‑N.mp3`.
   - `ffmpeg -ss <slide_start> -i A2Z-original.mp4 -frames:v 1 slide‑N/slide‑N.png`.
   - Write a minimal `process_page.sh` inside the folder.
6. Print summary.

## Verification Plan
- Run `bash split_pages.sh` and confirm the number of `audio‑N.mp3` files equals the number of non‑empty subtitle entries.
- Spot‑check a few audio files with `ffprobe` to ensure durations match subtitle timestamps.
- Verify the first image (`slide‑1.png`) is extracted roughly at 1 second.
- Manually listen to a few audio files and view the corresponding slide images to ensure alignment.

## Dependencies
- `ffmpeg` (installed on the development machine).
- `awk` (standard on macOS) for SRT parsing.

---
*This proposal captures the exact user‑specified naming, language, silent‑subtitle handling, slide‑1 offset, and per‑page folder structure.*
