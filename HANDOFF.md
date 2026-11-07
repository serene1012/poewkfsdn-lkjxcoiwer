# HANDOFF — Nâng cấp app "Lò Luyện IELTS" (Elaina)

> Đọc file này trước nếu là chat/session mới tiếp quản. File nằm NGAY TRONG repo
> `serene1012/poewkfsdn-lkjxcoiwer` — clone repo này về là có đủ (app + handoff + bệ thử theme).
> Updated: 2026-11-07 (sau phiên xong mục 3 + toàn bộ mục 4) · User chỉ đạo bằng tiếng Việt thân mật.

## 1. Bối cảnh + ràng buộc SẮP (đừng phá)

- App: **"Lò Luyện IELTS"** — PWA 1 file (`index.html` ~2.6k dòng, không build step), 7 phần
  (vocab/grammar/listening/reading/speaking/mock/**prog**), XP→Band 4–6.5, SRS 2-lần-đúng-mới-xóa,
  AI chấm bằng key Gemini/Claude của user lưu localStorage, SpeechRecognition, speechSynthesis.
- **Bắt buộc giữ:** mascot Elaina (`img/01-10.svg`) + 13 giọng mp3 (`voice/good|bad|wait*.mp3`,
  nút `voiceT`, mặc định TẮT, TTS tiếng Anh luôn ưu tiên) + toàn bộ logic XP/SRS/AI grading.
- **KHÔNG làm landing page** — app private, user xài một mình, sợ bản quyền nếu public.
- Bản làm việc: chính là repo này (clone về đâu làm đó). Server test:
  `python -m http.server 8432` chạy trong thư mục repo, mở http://localhost:8432.
- Repo gốc (không đụng): `serene1012/dfsoiweun-lwkashdfsoiu`.
- **Nhớ sw.js:** app có service worker, SỬA APP XONG phải tăng `V` trong `sw.js` (đang là `lo-ielts-v5`
  — đã bump sau phiên này) thì điện thoại mới tải bản mới. Bản test qua server thì chỉ cần reload
  là network-first.

## 2. Đã xong — 5 commit

1. `1097517` — Thay emoji chrome bằng **bộ 27 icon SVG phong cách Elaina** (stroke 2px, sao phép),
   map `IC` + helper `ic(name,size)`. 47 chỗ patch. Giữ cố ý emoji: 🐢 👀 ❌✅ + emoji trong dữ liệu.
2. `0acdd45` — **Theme C "Kem sáp manga" + chi tiết Elaina** (mục 3):
   - Token C vào `:root` light + dark (dark tối hơn 1 bậc giữ tông mận/kem: bg #221A26, panel #2C2330,
     accent #C77EB4 sáng hơn để đủ tương phản).
   - Chi tiết: nền sao 4 cánh mờ 5% (data-uri, re-use path `IC.spark`), viền kép hero + 2 sao vàng
     góc hero, glow hero đổi sang vàng, double rule dưới mỗi `h2` trong `.card`, **con dấu sáp
     "Đúng!"/"Sai!" xoay ±8° góc `.fb.good/.fb.bad`**, khung tem thư trong modal box, khung nét đứt
     trong cue card, giữ NGUYÊN nút dày Duolingo.
   - Sửa luôn màu hardcode theo theme: meta theme-color, backdrop modal, keyframes ring mic, confetti.
   - Đã verify light+dark qua screenshot + quiz chạy mượt, 0 màu palette cũ sót (scan hex).
3. `fdb5c71` — **(4.1/M3) Panel số liệu đo thật trong Speaking**: `sStats()` nâng cấp — số từ,
   thời lượng, WPM (mic ≥10 giây) kèm tag chậm/tự nhiên/nhanh, số câu + dài câu TB, đếm filler
   (um/uh/like/you know/kind of/basically…, ghi chú "đếm thô"), từ nối đã dùng. Panel `.met`
   viền nét đứt, nhãn "SỐ LIỆU ĐO THẬT · app tự đo từ mic + đồng hồ, không phải AI phán". Mỗi lần
   chấm (AI hoặc tự chấm) ghi vào **`P.smet`** (giữ 40 lần: t/part/words/secs/wpm/fill/band).
4. `09e8299` — **(4.2/M5) Hồ sơ điểm yếu**: card "Hồ sơ điểm yếu" ở menu Thi thử + view `weakView()`
   gom theo 5 skill (tally câu sai còn nợ từ các map wrong/gwrong/lwrong/rwrong/swrong/mwrong),
   nút **Luyện** từng skill gọi `startRev(skill)` (startRev giờ nhận filter skill — chỗ gán onclick
   PHẢI bọc `()=>startRev()` để không truyền event vào), phần Viết dẫn sang sổ lỗi viết, phần Speaking
   tính WPM TB + filler TB từ `P.smet`. Ghi chú honest: "số ở đây là phần còn nợ, không phải tổng lỗi".
5. `067a4fa` — **(4.3/M6) Tab 7 · Tiến bộ** (`progView()`): rule honest "chỉ vẽ cái đo được, thiếu
   data để trống, không zero-fill". Nội dung: skrow chuỗi/XP/từ đã thuộc; **XP mỗi ngày** —
   `gain()` giờ ghi **`P.xplog`** (key ngày local `YYYY-MM-DD`), chart cột 14 ngày, ngày trước khi
   bắt đầu ghi = trống, ngày 0 XP = cọc nhạt 3px; **band thi thử** — SVG chấm + nét đứt từ `P.mhist`
   (nhãn "ước lượng", chênh <1 band coi là ngang, không khen/chê); **WPM Speaking** — SVG chấm từ
   `P.smet` (chỉ lần mic ≥10 giây). SVG inline dùng `var(--accent)` nên ăn theme.

- Đã verify từng bước trên browser (server 8432): light+dark, quiz đúng/sai có con dấu, panel metric
  (32 từ · 0:30 · 64 t/p · filler 6), hồ sơ điểm yếu + Luyện theo skill (10 câu đúng skill), tab tiến
  bộ có data giả rồi clear localStorage. Smoke test route đủ 7 tab: 0 lỗi.
- Data test đã dọn; localStorage trên máy thật của user không bị đụng.

## 3. Theme C — CHỐT ĐÃ CÓ (đã áp ở commit `0acdd45`)

Token đã ghi vào `:root` (light + dark). Bệ thử `theme-preview.html` vẫn giữ để test theme sau này
(nút C). Moodboard: `C:\Users\ACER\.zcode\v2\visualizations\bfd07cfb…\elaina-moodboard.html`.

## 4. Port Voice Gym → Elaina: XONG (3 việc, commits `fdb5c71`/`09e8299`/`067a4fa`)

Không port code 1:1 (Voice Gym có backend, app này không), chỉ port concept M3/M5/M6 như kế hoạch.
Không port: Prisma/Next/server, recharts, audio storage (IndexedDB chỉ thêm nếu user muốn nghe lại
bản thu — nice-to-have). OPENAI_API_KEY ở Voice Gym không liên quan app này.

## 5. Ý tưởng tiếp theo (chưa ai duyệt, đừng tự làm)

- **AI drill từ câu sửa được**: `gradeWithClaude` trả `corrected` → dùng câu đó sinh bài luyện riêng
  (cần key AI; hiện hồ sơ điểm yếu mới ôn lại câu sai có sẵn).
- **Điểm ngữ pháp/lỗi trong Speaking**: AI trả band nhưng chưa ghi `err` vào wlog; có thể logWeak
  cả speaking feedback.
- **Nghe lại bản thu** (IndexedDB) — chỉ khi user muốn.
- Nếu thêm mock đề mới: chỉ thêm phần tử vào `MOCK_TESTS` (hồ sơ điểm yếu + ôn tổng tự ăn theo).

## 6. Tooling máy này

- `C:\Users\ACER\.zcode\tools\bin\gh.exe` v2.103.3 — logged in **serene1012**, đã `gh auth setup-git`
  → `git push` thường chạy OK (nhớ `set GIT_TERMINAL_PROMPT=0`).
- Server app: `python -m http.server 8432` (thư mục repo).
- Shell là cmd: không có grep/tail/printf/head; python dùng `-I -X utf8`; PowerShell lồng nhau
  hỏng Unicode → viết file bằng Write tool. `tools/anchors.py` (workspace root) để tìm dòng theo regex.
- Browser test: ZCode in-app browser (browser-use skill), viewport 420×860; khi click locator
  bằng role bị timeout thì fallback `playwright.evaluate(() => el.click())`.

## 7. Câu lệnh mở đầu cho chat mới

Clone repo này (`serene1012/poewkfsdn-lkjxcoiwer`) rồi dán:

```
Đọc HANDOFF.md trong repo. App đang có theme C + 4 tính năng mới (panel đo thật, hồ sơ điểm yếu,
tab tiến bộ). Mục 5 trong HANDOFF là ý tưởng chưa duyệt — hỏi user muốn làm gì tiếp trước khi code.
```
