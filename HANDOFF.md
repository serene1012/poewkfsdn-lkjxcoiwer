# HANDOFF — Nâng cấp app "Lò Luyện IELTS" (Elaina)

> Đọc file này trước nếu là chat/session mới tiếp quản. File nằm NGAY TRONG repo
> `serene1012/poewkfsdn-lkjxcoiwer` — clone repo này về là có đủ (app + handoff + bệ thử theme).
> Updated: 2026-11-07 · User chỉ đạo bằng tiếng Việt thân mật.

## 1. Bối cảnh + ràng buộc SẮP (đừng phá)

- App: **"Lò Luyện IELTS"** — PWA 1 file (`index.html` ~2.5k dòng, không build step), 6 phần
  (vocab/grammar/listening/reading/speaking/mock), XP→Band 4–6.5, SRS 2-lần-đúng-mới-xóa,
  AI chấm bằng key Gemini/Claude của user lưu localStorage, SpeechRecognition, speechSynthesis.
- **Bắt buộc giữ:** mascot Elaina (`img/01-10.svg`) + 13 giọng mp3 (`voice/good|bad|wait*.mp3`,
  nút `voiceT`, mặc định TẮT, TTS tiếng Anh luôn ưu tiên) + toàn bộ logic XP/SRS/AI grading.
- **KHÔNG làm landing page** — app private, user xài một mình, sợ bản quyền nếu public.
- Bản làm việc: chính là repo này (clone về đâu làm đó). Server test:
  `python -m http.server 8432` chạy trong thư mục repo, mở http://localhost:8432.
- Repo gốc (không đụng): `serene1012/dfsoiweun-lwkashdfsoiu`.

## 2. Đã xong (commit `1097517` trên repo làm việc)

- Thay emoji chrome bằng **bộ 27 icon SVG phong cách Elaina** (stroke 2px, sao phép thuật),
  map `IC` + helper `ic(name,size)` ngay sau `const PARTS` (~dòng 301). 47 chỗ patch
  (mode cards ×5 bộ, header chips, tab lock, M_SK, mock cards, sayBtn 🔊→SVG, vUI 🔊/🔇).
- Cố ý GIỮ emoji: 🐢 đọc chậm, 👀 transcript, ❌✅ trong feedback AI, emoji trong dữ liệu câu hỏi (🍄🥬🧂…).
- Đã verify: 0 icon rỗng, 0 chuỗi template sót, quiz chạy mượt, dark/light ăn theo `currentColor`.

## 3. Việc tiếp theo — CHỐT ĐÃ CÓ: **Theme C "Kem sáp manga"** + làm thêm chi tiết

User chọn hướng C (xem moodboard `C:\Users\ACER\.zcode\v2\visualizations\bfd07cfb…\elaina-moodboard.html` — nếu máy này
không còn file đó thì bấm nút C trong `theme-preview.html` là thấy palette sống ngay trên app).
Bệ thử theme: `theme-preview.html` trong repo này (commit kèm handoff; nút bấm apply inline var
lên iframe app thật).

### 3a. Token C cần ghi vào `:root` của index.html (đã test qua bệ thử)

```css
--bg:#F7EFF3; --panel:#FFFDFC; --ink:#3A2F3C; --muted:#8A7A88; --line:#EAD9E4; --head:#F3E6EE;
--accent:#A9639B; --accent-d:#8C4E80; --accent-ink:#FFFFFF; --accent-soft:#F3E2EF;
--night:#3A2F3C; --night-ink:#FBEFF7; --gold:#D9A94E; --gold-d:#B8862F; --pink:#F3DCEA; --tip:#FFF0DC;
--good:#2FA46B; --good-d:#21854F; --good-soft:#E2F3E8; --good-ink:#1B6B41;
--bad:#D95570; --bad-d:#B93A55; --bad-soft:#FBE4E9; --bad-ink:#96283F;
```
Cả block light lẫn block dark (media query) trong `:root` — dark variant có thể tối hơn 1 bậc
(bg #221A26, panel #2C2330...) giữ đúng tông mận/kem. `theme-preview.html` chứa bộ đã test.

### 3b. "Thêm chi tiết — đừng đơn điệu" (user yêu cầu). Ý tưởng theo phong cách Elaina:

- **Viền lace/mề đay** lấy từ bìa manga (Nanao Ikki): SVG border pattern mảnh quanh `.card`
  hoặc chỉ quanh hero + panel kết quả (đừng lạm dụng mọi card — restraint).
- **Sao phép thuật 4 cánh** (mô-típ Azure trong LN banner — bướm/sao vàng phát sáng): chấm sao
  nhỏ rải góc hero, vài vị trí accent-soft; tái dùng path `IC.spark`.
- **Tem thư / con dấu** cho panel kết quả đúng/sai (giống sáp niêm phong): con dấu tròn "Đúng!"
  xoay nhẹ -8deg ở góc panel .fb.good, dấu "Sai rồi" cho .fb.bad.
- Đường kẻ đôi (double rule) đầu section kiểu trang nhật ký; góc card bo lệch hoặc has-corner-cut?
  Giữ nút dày Duolingo NGUYÊN (user thích).
- Nền `--bg` thêm pattern chấm/sao cực nhạt (SVG data-uri, opacity ~4%).
- CẮT bớt nếu rối: nguyên tắc skill — boldness dồn 1 chỗ (hero + feedback panel), phần còn lại yên tĩnh.

### 3c. Xác nhận user cần: chỉ áp vào `:root` + chi tiết CSS; KHÔNG đụng logic JS trừ khi thêm icon mới.

Sau khi xong: screenshot dark+light, commit (message tiếng Việt không dấu như trước), push repo làm việc.
`theme-preview.html` quyết định commit hay không do user (nên commit luôn làm công cụ test theme sau này).

## 4. Kết quả đã dò: port từ Voice Gym (E:\project-voice) sang app Elaina — **ỔN, làm được**

Voice Gym (Next.js + Prisma + 212 tests, M1–M6 xong) là app CÓ BACKEND; Elaina app là PWA
không backend gọi AI thẳng từ browser → không port code 1:1 được, nhưng **port được logic/concept**:

1. **Metric đo thật trước khi nhờ AI (M3)** — KHÔNG cần backend: trong Speaking, từ
   SpeechRecognition transcript + thời gian nói, tính client-side: số từ, WPM, độ dài câu TB,
   đếm từ lặp (filler "um/like"), rồi HIỂN THỊ cạnh band AI với nhãn "đo thật". Hiện app chỉ
   có band AI + checklist tự chấm → thêm panel metric thật là upgrade giá trị nhất, đúng triết
   lý "honest UI" cả 2 project đang theo.
2. **Sổ điểm yếu tổng hợp (M5)** — app đã có `P.wlog` (sổ lỗi viết) + `errTally` + ôn từ hay sai:
   nâng thành "hồ sơ điểm yếu" gom theo skill (nghe/đọc/ngữ pháp/viết/speaking), tally + ví dụ
   gần nhất, và **tự sinh exercise nhắm điểm yếu** (đã có gradeWithClaude trả `corrected` → sinh
   drill từ câu sửa được).
3. **Tab tiến bộ trung thực (M6)** — từ dữ liệu SẴN CÓ trong localStorage (`P.xp`, `P.mhist`
   lịch sử thi thử, streak): SVG mini-chart vẽ tay (không cần recharts), TUÂN ĐỦNG luật M6:
   chỉ vẽ điểm đo thật, tuần thiếu data thì bỏ trống (không zero-fill), delta cần ≥2 điểm,
   band ước lượng từ mock gắn nhãn "ước lượng".
4. **KHÔNG port:** Prisma/Next/server (không có backend), recharts, audio storage (chỉ thêm nếu
   user muốn nghe lại bản thu — IndexedDB, nice-to-have).
5. Lưu ý: OPENAI_API_KEY vẫn chưa có ở Voice Gym (dev-mock có nhãn) — không ảnh hưởng Elaina app
   vì app dùng key Gemini/Claude riêng của user.

Thứ tự đề xuất: (3a) theme C + (3b) chi tiết → xong mới (4.1) metric panel → (4.2) sổ điểm yếu →
(4.3) tab tiến bộ. Mỗi bước commit riêng.

## 5. Tooling máy này (đã cấu hình)

- `C:\Users\ACER\.zcode\tools\bin\gh.exe` v2.103.3 — logged in **serene1012**, đã `gh auth setup-git`
  → `git push` thường chạy OK (nhớ `set GIT_TERMINAL_PROMPT=0` nếu muốn cứng đầu).
- winget hỏng source; jikan.moe không truy cập được; fandom chặn curl (dùng WebFetch); AniList
  GraphQL OK (`graphql.anilist.co`). Ảnh Elaina đã tải: `tools/elaina-img/` (KV anime, visual
  movie 01/2026, bìa LN Azure, bìa+banner manga Nanao Ikki, char art).
- `tools/` có: scan_emoji.py, peek.py, grep.py, patch_icons*.py, build_moodboard*.
- Server app: `python -m http.server 8432` (elaina-app), landing demo Voice Gym: 8431.
- Shell là cmd: không có grep/tail/printf; python dùng `-I -X utf8`; PowerShell lồng nhau
  hỏng Unicode → viết file bằng Write tool.

## 6. Câu lệnh mở đầu cho chat mới

Clone repo này (`serene1012/poewkfsdn-lkjxcoiwer`) rồi dán:

```
Đọc HANDOFF.md trong repo rồi tiếp tục mục 3: áp theme C + chi tiết phong cách Elaina
vào index.html, sau đó làm tiếp mục 4 theo thứ tự. Giữ nguyên ràng buộc mục 1.
```
